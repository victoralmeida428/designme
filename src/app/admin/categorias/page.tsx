'use client'
import Link from "next/link"
import { Pencil, Plus, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategories } from "./hooks/use-categorias"
import NovaCategoriaButton from "../_components/nova-categoria-btn"
import ConfigButton from "@/components/layout/EditButton"
import DeleteButton from "@/components/layout/DeleteButton"

export default function CategoriasPage() {
    const { categories, isLoading: isLoadingCats } = useCategories()

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
                    <p className="text-muted-foreground">Gerencie os tipos de convites.</p>
                </div>
                <NovaCategoriaButton />
            </div>

            <Card>
                <CardHeader><CardTitle>Lista de Categorias</CardTitle></CardHeader>
                <CardContent>
                    <Table className="table">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">ID</TableHead>
                                <TableHead className="text-left">Nome</TableHead>
                                <TableHead className="text-left">Descrição</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">Nenhuma categoria encontrada.</TableCell>
                                </TableRow>
                            ) : (
                                categories.map((cat) => (
                                    <TableRow className="h-10" key={cat.id_categoria}>
                                        <TableCell className="font-medium text-center">{cat.id_categoria}</TableCell>
                                        <TableCell className="font-medium text-left"> {cat.nome}
                                        </TableCell>
                                        <TableCell className="text-left">{cat.descricao}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={cat.ativo ? "active" : "inactive"}>
                                                {cat.ativo ? "Ativa" : "Inativa"}
                                            </Badge>
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