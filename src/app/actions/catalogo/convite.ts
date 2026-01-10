"use server"

import pool from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ConviteFormValues, conviteSchema } from "../../admin/schemas/convite-schema"

export async function createConviteAction(data: ConviteFormValues) {
  const parsed = conviteSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: "Dados inválidos." }
  }

  const { nome, descricao, preco_base, id_categoria, image_preview_url, ativo } = parsed.data

  try {
    const client = await pool.connect()
    
    await client.query(
      `INSERT INTO convite 
      (nome, descricao, preco_base, id_categoria, image_preview_url, ativo)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [nome, descricao, preco_base, id_categoria, image_preview_url, ativo]
    )
    
    client.release()

    revalidatePath("/admin/convites")
    
  } catch (error) {
    console.error("Erro ao criar convite:", error)
    return { success: false, message: "Erro ao salvar no banco." }
  }

  redirect("/admin/convites")
}