import Link from "next/link"
import { Plus, Tag } from "lucide-react"
import pool from "@/lib/db"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CategoriasPage() {
  const result = await pool.query("SELECT * FROM categoria_convite ORDER BY id_categoria DESC")
  const categorias = result.rows

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
            <p className="text-muted-foreground">Gerencie os tipos de convites.</p>
        </div>
        <Button asChild>
          <Link href="/admin/categorias/nova">
            <Plus className="mr-2 h-4 w-4" /> Nova Categoria
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Categorias</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">Nenhuma categoria encontrada.</TableCell>
                </TableRow>
              ) : (
                categorias.map((cat) => (
                  <TableRow key={cat.id_categoria}>
                    <TableCell className="font-medium">{cat.id_categoria}</TableCell>
                    <TableCell className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" /> {cat.nome}
                    </TableCell>
                    <TableCell>{cat.descricao}</TableCell>
                    <TableCell>
                      <Badge variant={cat.ativo ? "active" : "inactive"}>
                        {cat.ativo ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}