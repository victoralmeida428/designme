import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  S3ClientConfig
} from "@aws-sdk/client-s3"
import { randomUUID } from "crypto"

class StorageService {
  private client: S3Client
  private bucket: string

  constructor() {
    this.bucket = process.env.AWS_BUCKET_NAME!
    console.log("Tentando conectar em:", process.env.AWS_ENDPOINT || "AWS Padrão")
    console.log("Key usada:", process.env.AWS_ACCESS_KEY_ID)

    const config: S3ClientConfig = {
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    }

    // Configurações específicas para MinIO ou LocalStack
    if (process.env.AWS_ENDPOINT) {
      config.endpoint = process.env.AWS_ENDPOINT
      config.forcePathStyle = true
    }

    this.client = new S3Client(config);
  }

  /**
   * Faz upload de um arquivo (File ou Buffer) e retorna a URL completa.
   */
  async uploadFile(file: File, folder: string = "uploads"): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const fileExtension = file.name.split(".").pop()
      const fileName = `${randomUUID()}.${fileExtension}`
      const key = `${folder}/${fileName}`

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })

      await this.client.send(command)

      // Retorna a URL completa
      return this.getUrl(key)
    } catch (error) {
      console.error("Erro no upload S3:", error)
      throw new Error("Falha ao fazer upload da imagem.")
    }
  }

  /**
   * Remove um arquivo baseado na URL completa ou na Key.
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = this.getKeyFromUrl(fileUrl)

      console.log({
        Bucket: this.bucket,
        Key: key,
      })
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      await this.client.send(command)
    } catch (error) {
      console.error("Erro ao deletar arquivo S3:", error)
      // Não lançamos erro aqui para não quebrar o fluxo principal se a imagem já não existir
    }
  }

  /**
   * Helper para montar a URL final (Compatível com S3 e MinIO)
   */
  private getUrl(key: string): string {
    if (process.env.AWS_ENDPOINT) {
      // Formato MinIO: endpoint/bucket/key
      return `http://localhost:9000/${this.bucket}/${key}`
    }
    // Formato AWS S3 Padrão: https://bucket.s3.region.amazonaws.com/key
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  }

  /**
   * Helper para extrair a Key (caminho relativo) de uma URL completa
   */
  private getKeyFromUrl(url: string): string {
    // 1. Se não for uma URL, já é a própria Key
    if (!url || !url.startsWith("http")) {
      return url;
    }

    try {
      const urlObj = new URL(url);
      // urlObj.pathname retorna algo como "/meu-bucket/pasta/foto.jpg"
      let path = urlObj.pathname;

      // 2. Remove a barra inicial se existir
      if (path.startsWith("/")) {
        path = path.substring(1);
      }

      // 3. Se o bucket estiver no path (comum no MinIO/Path-Style), removemos ele
      // Ex: "meu-bucket/pasta/foto.jpg" -> "pasta/foto.jpg"
      if (path.startsWith(this.bucket + "/")) {
        path = path.replace(this.bucket + "/", "");
      }
      return path;
    } catch (e) {
      console.error("Erro ao processar URL para extrair Key:", e);
      return url;
    }
  }
}

// Criação do Singleton
// O 'globalThis' é usado para evitar recriação em ambiente de desenvolvimento (Hot Reload) do Next.js
const globalForStorage = globalThis as unknown as { storageService: StorageService }

export const storageService = globalForStorage.storageService || new StorageService()

if (process.env.NODE_ENV !== "production") globalForStorage.storageService = storageService