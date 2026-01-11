import pool from "@/lib/db"
import { ConviteForm } from "../_components/convite-form"

export default async function NovoConvitePage() {
  // TODO Colocar num hook
  const result = await pool.query(
    "SELECT id_categoria, nome FROM categoria_convite WHERE ativo = true ORDER BY nome ASC"
  )
  const categorias = result.rows

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 w-full justify-center align-middle items-center">
      <div className="flex items-center justify-center">
        <h2 className="text-3xl font-bold tracking-tight">Novo Modelo de Convite</h2>
      </div>
      
      <div className="max-w-2xl  mx-auto">
        <ConviteForm categorias={categorias} />
      </div>
    </div>
  )
}