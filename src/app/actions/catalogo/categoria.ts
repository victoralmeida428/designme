"use server"

import pool from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { CategoryFormValues, categorySchema } from "../../admin/schemas/categoria-schema"
import { Categoria } from "@/entity/categoria-entity"

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
    const results = await pool.query("select * from categoria_convite");
    return results.rows as Categoria[]
  } catch(error) {
    console.error("Erro ao buscar categorias: ", error);
    return [];
  }
}