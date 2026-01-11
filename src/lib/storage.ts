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
    // Se a URL já for apenas a chave (ex: convites/foto.jpg), retorna ela mesma
    if (!url.startsWith("http")) return url

    // Tenta remover o endpoint do MinIO
    if (process.env.AWS_ENDPOINT && url.startsWith(process.env.AWS_ENDPOINT)) {
      // Ex: http://localhost:9000/meu-bucket/pasta/foto.jpg
      // Remove o endpoint + barra
      let path = url.replace(process.env.AWS_ENDPOINT + "/", "")
      // Remove o nome do bucket + barra
      path = path.replace(this.bucket + "/", "")
      return path
    }

    // Lógica para AWS S3 padrão (ex: https://bucket.s3.../pasta/foto.jpg)
    try {
      const urlObj = new URL(url)
      // O pathname vem como /pasta/foto.jpg (S3) ou /bucket/pasta/foto.jpg (MinIO dependendo da config)
      // Esta é uma simplificação, ajuste se sua URL for complexa
      return urlObj.pathname.substring(1) 
    } catch (e) {
      return url
    }
  }
}

// Criação do Singleton
// O 'globalThis' é usado para evitar recriação em ambiente de desenvolvimento (Hot Reload) do Next.js
const globalForStorage = globalThis as unknown as { storageService: StorageService }

export const storageService = globalForStorage.storageService || new StorageService()

if (process.env.NODE_ENV !== "production") globalForStorage.storageService = storageService