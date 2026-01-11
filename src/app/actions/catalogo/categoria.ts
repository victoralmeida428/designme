"use server"

import pool from "@/lib/db"
import { revalidatePath, unstable_cache } from "next/cache"
import { redirect } from "next/navigation"
import { CategoryFormValues, categorySchema } from "../../../schemas/categoria-schema"
import { Categoria } from "@/entity/categoria-entity"
import {PaginateInputDTO, PaginateMetaDTO} from "@/dto/paginate-dto"
import { pageToOffset } from "@/utils/pagination"

export async function createCategoryAction(data: CategoryFormValues) {
  const parsed = categorySchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: "Dados inválidos." }
  }

  const { nome, descricao, ativo } = parsed.data

  try {
    const client = await pool.connect()

    await client.query(
      `INSERT INTO categoria_convite (nome, descricao, ativo)
       VALUES ($1, $2, $3)`,
      [nome, descricao, ativo]
    )

    client.release()

    revalidatePath("/admin/categorias")
    revalidatePath("/admin/convites/novo") // Atualiza o select do form de convites

  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return { success: false, message: "Erro ao salvar no banco." }
  }

  redirect("/admin/categorias")
}

export async function getAllCategoryAction(): Promise<Categoria[]> {
  try {
    // 1. Selecione campos explícitos e use Aliases para bater com sua Entity/DTO
    const query = `
      SELECT 
        id_categoria AS id, 
        nome,
        descricao,
        ativo 
      FROM categoria_convite
      ORDER BY nome ASC
    `;

    const { rows } = await pool.query(query);

    // 2. Mapeamento explícito (Garante o tipo real dos dados)
    return rows.map(row => ({
      id_categoria: row.id,
      nome: row.nome,
      descricao: row.descricao,
      ativo: Boolean(row.ativo)
    }));

  } catch (error) {
    // 3. Log detalhado para o servidor, mas erro tratado para a UI
    console.error("Database Error [getAllCategoryAction]:", error);
    throw new Error("Não foi possível carregar as categorias.");
  }
}

export const getCachedCategorias = unstable_cache(
  async () => getAllCategoryAction(),
  ['categorias-list'],
  { revalidate: 3600, tags: ['categorias'] }
);

export async function getCategoryPaginate({ filter, page = 1, pageSize = 10 }: PaginateInputDTO):Promise<{data:Categoria[], meta:PaginateMetaDTO}> {
  try {
    // Calculamos o offset de forma segura
    const offset = pageToOffset(page, pageSize);
    const searchTerm = `%${filter || ''}%`;

    // 1. Query para buscar os dados
    const dataQuery = `
      SELECT 
        id_categoria, 
        nome,
        descricao,
        ativo 
      FROM categoria_convite
      WHERE (nome ILIKE $1 OR descricao ILIKE $1)
      ORDER BY nome ASC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM categoria_convite 
      WHERE (nome ILIKE $1 OR descricao ILIKE $1)
    `;

    // Executamos ambas em paralelo para melhor performance
    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, [searchTerm, pageSize, offset]),
      pool.query(countQuery, [searchTerm])
    ]);

    return {
      data: dataResult.rows.map(row => ({
        id_categoria: row.id_categoria,
        nome: row.nome,
        descricao: row.descricao,
        ativo: Boolean(row.ativo)
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