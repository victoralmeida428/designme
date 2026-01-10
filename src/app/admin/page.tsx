import Link from "next/link"
import { Plus, Pencil, Package, Tags, Dot } from "lucide-react" // <--- Adicionei 'Tags'
import pool from "@/lib/db"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NovaCategoriaButton from "./_components/nova-categoria-btn"
import NovoConviteBtn from "./_components/novo-convite-btn"
import ConfigButton from "@/components/layout/EditButton"
import DeleteButton from "@/components/layout/DeleteButton"

export default async function DashboardPage() {
  // Busca convites recentes
  const result = await pool.query(`
    SELECT 
      c.id_convite, 
      c.nome, 
      c.preco_base, 
      c.ativo, 
      c.image_preview_url, 
      cat.nome as categoria_nome
    FROM convite c
    LEFT JOIN categoria_convite cat ON c.id_categoria = cat.id_categoria
    ORDER BY c.id_convite DESC
    LIMIT 10 -- Mostra apenas os 10 últimos no dashboard
  `)

  const convites = result.rows

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">

      {/* Cabeçalho com Botões de Ação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="flex w-full items-center space-x-2 gap-4 py-2 justify-end">
          {/* Botão de Gestão de Categorias */}
          <NovaCategoriaButton />

          {/* Botão Principal de Novo Produto */}
          <NovoConviteBtn />

        </div>
      </div>

      {/* Tabela de Produtos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Convites Recentes</CardTitle>
          <CardDescription>
            Últimos modelos adicionados ao catálogo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Imagem</TableHead>
                <TableHead className="text-center">Nome</TableHead>
                <TableHead className="text-center">Categoria</TableHead>
                <TableHead className="text-center">Preço</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Editar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {convites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum convite encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                convites.map((item) => (
                  <TableRow key={item.id_convite}>
                    <TableCell className="text-center">
                      {item.image_preview_url ? (
                        <img
                          src={item.image_preview_url}
                          alt={item.nome}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-center">{item.nome}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-normal">
                        {item.categoria_nome || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {Number(item.preco_base).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" asChild >
                        <Dot
                          className={`${item.ativo ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}`}
                          size={250}
                        />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-4">
                        <ConfigButton />
                        <DeleteButton />
                      </div>
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