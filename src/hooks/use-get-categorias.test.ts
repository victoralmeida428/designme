// src/hooks/use-get-categorias.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGetCategorias } from './use-get-categorias'
import { getCachedCategorias } from "@/app/actions/catalogo/categoria"
import { toast } from "sonner"
import { createMockCategoria } from '@/test/factories/categoria-factory'

// 1. Mock da Server Action (Cached) e Toast
vi.mock("@/app/actions/catalogo/categoria", () => ({
    getCachedCategorias: vi.fn()
}))

vi.mock("sonner", () => ({
    toast: { error: vi.fn() }
}))

describe('useGetCategorias Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve carregar categorias automaticamente ao montar o componente', async () => {
        const mockData = [createMockCategoria({ nome: "Infantil" }), createMockCategoria({ nome: "Casamento" })]
        vi.mocked(getCachedCategorias).mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetCategorias())

        expect(result.current.isLoading).toBe(true)

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
            expect(result.current.categories).toHaveLength(2)
        })

        expect(getCachedCategorias).toHaveBeenCalledTimes(1)
    })

    it('deve permitir atualizar as categorias manualmente via refetch', async () => {
        vi.mocked(getCachedCategorias).mockResolvedValue([createMockCategoria()])
        
        const { result } = renderHook(() => useGetCategorias())

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        // Dispara o refetch manual
        await act(async () => {
            await result.current.refetch()
        })

        expect(getCachedCategorias).toHaveBeenCalledTimes(2) // 1 automático + 1 manual
    })

    it('deve exibir erro e mudar estado se a busca falhar', async () => {
        vi.mocked(getCachedCategorias).mockRejectedValue(new Error("Falha no Cache"))

        const { result } = renderHook(() => useGetCategorias())

        await waitFor(() => {
            expect(result.current.isError).toBe(true)
            // Nota: O código atual usa a mensagem "Erro ao buscar convites"
            expect(toast.error).toHaveBeenCalledWith("Erro ao buscar convites", expect.anything())
        })
    })
})