'use client'

import { Package, Dot, Edit, Archive, Trash, Ban, Check, Delete, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TableRow, TableCell } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

import NovoConviteBtn from "./_components/novo-convite-btn"
import { useGetConvites } from "@/hooks/use-get-convites"
import { TabelaConteudo, TabelaFiltro, TabelaFooterPaginacao, TabelaPaginada, TabelaTitle } from "@/app/admin/_components/tabela-paginada"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MenuAcoes } from "@/components/layout/MenuAcoes"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ConfirmAction, ConfirmCancel, ConfirmContent, ConfirmModal, ConfirmTrigger } from "@/components/layout/ConfirmModal"
import useDeleteConvite from "@/hooks/use-delete-convite"
import useChangeStatus from "@/hooks/use-change-status"

export default function DashboardPage() {
    const {
        convites,
        isLoading,
        isError,
        filter,
        setFilter,
        page,
        setStatus,
        setPage,
        refresh,
        meta
    } = useGetConvites();

    const { isLoading: loadDelete, executeDelete } = useDeleteConvite({
        onSuccess: refresh
    })

    const {isLoading: changeLoading, changeStatus} = useChangeStatus({onSuccess: refresh})
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <TabelaTitle>Dashboard</TabelaTitle>
                <NovoConviteBtn />
            </div>

            <Card>
                <CardHeader className="flex justify-between">
                    <div>
                        <CardTitle>Convites Recentes</CardTitle>
                        <CardDescription>Gerencie o catálogo de modelos disponíveis.</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <TabelaFiltro
                            placeholder="Buscar convites..."
                            value={filter}
                            onChange={(v: string) => { setFilter(v); setPage(1); }}
                        />
                        <Select
                            onValueChange={function (value: string) {
                                console.log("Status trocado: " + parseInt(value));
                                setStatus(parseInt(value));
                                setPage(1);
                            }}>
                            <SelectTrigger className="w-52 cursor-pointer">
                                <SelectValue className="cursor-pointer" placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    <SelectItem className="cursor-pointer hover:bg-gray-400" value="-1">Todos</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg-gray-400" value="1">Ativo</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg-gray-400" value="0">Inativo</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <TabelaPaginada>
                        <TabelaConteudo
                            headers={["Imagem", "Nome", "Categoria", "Preço", "Status", "Ações"]}
                            loading={isLoading || loadDelete || changeLoading}
                            error={isError}
                            data={convites}
                            renderRow={(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="text-center">
                                        {item.imagePreviewUrl ? (
                                            <div className="relative h-10 w-10 mx-auto rounded-md overflow-hidden">
                                                <Image
                                                    src={item.imagePreviewUrl}
                                                    alt={item.nome}
                                                    fill
                                                    className="object-cover"
                                                    sizes="40px"
                                                    unoptimized={process.env.NODE_ENV === "development"}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 mx-auto rounded-md bg-muted flex items-center justify-center">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell className="font-medium text-center">{item.nome}</TableCell>

                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{item.categoriaNome || "—"}</Badge>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {Number(item.precoBase).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge variant={item.ativo ? "active" : "inactive"}>
                                            {item.ativo ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-center text-sm">
                                        <MenuAcoes>
                                            <DropdownMenuItem className="cursor-pointer flex justify-start align-middle items-center px-2 text-sm" onClick={() => console.log(item.id)}>
                                                <Edit className="mr-2 h-4 w-4" /> Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                            className="cursor-pointer flex justify-start align-middle items-center px-2 text-sm" 
                                            onClick={() => changeStatus(item.id, !item.ativo)}>
                                                {
                                                    item.ativo ? <> <Ban className="mr-2 h-4 w-4" /> Inativar</> : <> <Check className="mr-2 h-4 w-4" /> Ativar</>
                                                }
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer flex justify-start align-middle items-center px-2 text-sm"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <ConfirmModal>
                                                    <ConfirmTrigger>
                                                        {/* O Trigger pode ser o DropdownMenuItem que criamos antes */}
                                                        <DropdownMenuItem
                                                            onSelect={(e) => e.preventDefault()}
                                                            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 flex justify-start align-middle items-start px-2 text-sm"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Excluir
                                                        </DropdownMenuItem>
                                                    </ConfirmTrigger>

                                                    <ConfirmContent
                                                        title="Excluir Convite?"
                                                        description="Esta ação não pode ser desfeita. O convite será removido permanentemente do catálogo."
                                                    >
                                                        <ConfirmCancel />
                                                        <ConfirmAction onClick={function (e) {
                                                            executeDelete(item.id)
                                                        }}>
                                                            Sim
                                                        </ConfirmAction>
                                                    </ConfirmContent>
                                                </ConfirmModal>

                                            </DropdownMenuItem>

                                        </MenuAcoes>
                                    </TableCell>
                                </TableRow>
                            )}
                        />

                        <TabelaFooterPaginacao
                            page={page}
                            totalPages={meta.totalPages}
                            totalItems={meta.total}
                            onPageChange={setPage}
                        />
                    </TabelaPaginada>
                </CardContent>
            </Card>
        </div>
    )
}