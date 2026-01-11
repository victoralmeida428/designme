"use server"

import pool from "@/lib/db"
import { revalidatePath, unstable_cache } from "next/cache"
import { redirect } from "next/navigation"
import { ConviteFormValues, conviteSchema } from "../../../schemas/convite-schema"
import { storageService } from "@/lib/storage"
import ConviteDTO from "@/dto/convite-dto"
import { PaginateMetaDTO, PaginateInputDTO } from "@/dto/paginate-dto"
import { pageToOffset } from "@/utils/pagination"

export async function createConviteAction(data: ConviteFormValues) {
    const parsed = conviteSchema.safeParse(data)

    if (!parsed.success) {
        return { success: false, message: "Dados inválidos." }
    }

    const { nome, descricao, preco_base, id_categoria, image, ativo } = parsed.data;

    let imageUrl = "";

    try {
        if (image instanceof File) {
            imageUrl = await storageService.uploadFile(image, "convites")
        }

        const client = await pool.connect()

        await client.query(
            `INSERT INTO convite 
      (nome, descricao, preco_base, id_categoria, image_preview_url, ativo)
      VALUES ($1, $2, $3, $4, $5, $6)`,
            [nome, descricao, preco_base, id_categoria, imageUrl, ativo]
        )

        client.release()

        revalidatePath("/admin")

    } catch (error) {
        console.error("Erro ao criar convite:", error)
        if (imageUrl) await storageService.deleteFile(imageUrl)
        return { success: false, message: "Erro ao salvar no banco." }
    }

    redirect("/admin")
}

export async function getAllConvitesAction(): Promise<ConviteDTO[]> {
    try {
        const query = `
      SELECT 
        c.id_convite as id, 
        c.nome, 
        c.preco_base as precoBase, 
        c.ativo, 
        c.image_preview_url as imagePreviewUrl, 
        c.id_categoria as idCategoria,
        cat.nome as categoriaNome
      FROM convite c
      LEFT JOIN categoria_convite cat ON c.id_categoria = cat.id_categoria
      ORDER BY c.id_convite DESC
      LIMIT 10
    `;

        const { rows } = await pool.query(query);

        // O Next.js lida bem com arrays vazios, dispensando o check de rowCount == 0
        return rows.map(row => ({
            id: row.id,
            nome: row.nome,
            precoBase: Number(row.precobase),
            ativo: Boolean(row.ativo),
            imagePreviewUrl: row.imagepreviewurl,
            idCategoria: row.idcategoria,
            categoriaNome: row.categorianome
        }));

    } catch (error) {
        console.error("Erro ao buscar convites:", error);
        // Em produção, você pode querer lançar um erro personalizado
        throw new Error("Falha ao carregar o catálogo de convites.");
    }
}

export const getCachedConvites = unstable_cache(
    async () => getAllConvitesAction(),
    ['convites-list'],
    { revalidate: 3600, tags: ['convites'] }
);

export async function getConvitePaginate({ pagination, status }: { pagination: PaginateInputDTO, status: number }): Promise<
    {
        data?: ConviteDTO[],
        meta: PaginateMetaDTO
    }> {
    const { page, pageSize, filter } = pagination;

    try {
        // Calculamos o offset de forma segura
        const offset = pageToOffset(page, pageSize);
        const searchTerm = `%${filter || ''}%`;

        // 1. Query para buscar os dados
        const dataQuery = `
      SELECT 
        c.id_convite as id, 
        c.nome, 
        c.preco_base as precoBase, 
        c.ativo, 
        c.image_preview_url as imagePreviewUrl, 
        c.id_categoria as idCategoria,
        cat.nome as categoriaNome
      FROM convite c
      LEFT JOIN categoria_convite cat ON c.id_categoria = cat.id_categoria
      WHERE true
      and (c.nome ILIKE $1 
        or cat.nome ILIKE $1)
      and (c.ativo::integer = $2 or $2=-1)
      ORDER BY c.nome ASC
      LIMIT $3 OFFSET $4
    `;

        const countQuery = `
      SELECT COUNT(*) as total 
      FROM convite c
      LEFT JOIN categoria_convite cat ON c.id_categoria = cat.id_categoria
      WHERE true
      and (c.nome ILIKE $1 
        or cat.nome ILIKE $1)
      and (c.ativo::integer = $2 or $2=-1)
    `;
        console.log(status);
        // Executamos ambas em paralelo para melhor performance
        const [dataResult, countResult] = await Promise.all([
            pool.query(dataQuery, [searchTerm, status, pageSize, offset]),
            pool.query(countQuery, [searchTerm, status])
        ]);

        return {
            data: dataResult.rows.map(row => ({
                id: row.id,
                nome: row.nome,
                precoBase: Number(row.precobase),
                ativo: Boolean(row.ativo),
                imagePreviewUrl: row.imagepreviewurl,
                idCategoria: row.idcategoria,
                categoriaNome: row.categorianome
            })),
            meta: {
                total: parseInt(countResult.rows[0].total),
                page,
                pageSize,
                totalPages: Math.ceil(countResult.rows[0].total / pageSize)
            }
        };

    } catch (error) {
        console.error("Database Error [getCategoryPaginate]:", error);
        throw new Error("Erro ao carregar categorias paginadas.");
    }
}

export async function deleteConviteAction(id: number): Promise<{ success: boolean, message: string }> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await client.query(`DELETE FROM convite WHERE id_convite = $1 RETURNING image_preview_url`, [id]);
        if (result.rowCount && result.rowCount === 0) {
            return { success: false, message: "Convite não encontrado" }
        }
        const imagePreviewUrl = result.rows[0].image_preview_url;

        console.log(imagePreviewUrl);

        await storageService.deleteFile(imagePreviewUrl);


        await client.query("commit");

        return { success: true, message: "Convite excluído com sucesso." };;
    } catch (error) {
        await client.query("rollback");
        if (process.env.NODE_ENV === "development") {
            console.error("Erro ao deletar convite: ", error);
        }
        return { success: true, message: "Não foi possível excluir o convite pois ele pode estar vinculado a outros dados." };;
    } finally {
        client.release();
    }
}