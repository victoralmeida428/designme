'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ChevronLeft, ChevronRight } from "lucide-react"

// --- Interfaces das Props ---

interface TabelaPaginadaProps {
    children: React.ReactNode
}

interface TabelaFiltroProps {
    placeholder: string
    value: string
    onChange: (value: string) => void
}

interface TabelaConteudoProps<T> {
    headers: string[]
    data: T[] | undefined | null
    loading: boolean
    error: boolean
    renderRow: (item: T) => React.ReactNode
}

interface TabelaFooterProps {
    page: number
    totalPages: number
    totalItems: number
    onPageChange: (newPage: number) => void
}

// --- Componentes ---

export function TabelaPaginada({ children }: TabelaPaginadaProps) {
    return <div className="space-y-4">{children}</div>
}

export function TabelaTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-2xl font-bold tracking-tight">{children}</h2>
}

export function TabelaFiltro({ placeholder, value, onChange }: TabelaFiltroProps) {
    // Estado local para refletir a digitação instantânea do usuário
    const [inputValue, setInputValue] = useState(value)

    useEffect(() => {
        // Sincroniza o estado interno se o valor externo mudar (ex: reset de filtro)
        setInputValue(value)
    }, [value])

    useEffect(() => {
        // Só dispara o onChange após 500ms de inatividade
        const timer = setTimeout(() => {
            onChange(inputValue)
        }, 500)

        return () => clearTimeout(timer)
    }, [inputValue, onChange])

    return (
        <Input
            className="max-w-sm"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
        />
    )
}

export function TabelaConteudo<T>({
    headers,
    data,
    loading,
    error,
    renderRow
}: TabelaConteudoProps<T>) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((h) => (
                            <TableHead key={h} className="text-center">{h}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={headers.length} className="h-[400px]">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Spinner className="h-10 w-10" />
                                    <p className="text-sm text-muted-foreground animate-pulse">Carregando dados...</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell colSpan={headers.length} className="h-24 text-center text-destructive">
                                Erro ao carregar informações.
                            </TableCell>
                        </TableRow>
                    ) : !data || data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={headers.length} className="h-24 text-center">
                                Nenhum registro encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => renderRow(item))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export function TabelaFooterPaginacao({
    page,
    totalPages,
    totalItems,
    onPageChange
}: TabelaFooterProps) {
    if (totalItems === 0) return null

    return (
        <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong> ({totalItems} itens)
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    Próximo <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    )
}