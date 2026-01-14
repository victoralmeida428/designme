// src/hooks/use-delete-convite.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useDeleteConvite from './use-delete-convite'
import { deleteConviteAction } from "@/app/actions/catalogo/convite"
import { toast } from "sonner"

// 1. Mock das dependências
vi.mock("@/app/actions/catalogo/convite", () => ({
    deleteConviteAction: vi.fn()
}))

vi.mock("sonner", () => ({
    toast: { 
        success: vi.fn(),
        error: vi.fn() 
    }
}))

describe('useDeleteConvite Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve excluir um convite e disparar sucesso', async () => {
        // Simula resposta de sucesso da Action
        vi.mocked(deleteConviteAction).mockResolvedValue({ 
            success: true, 
            message: "Excluído com sucesso" 
        })
        
        const onSuccessSpy = vi.fn()
        const { result } = renderHook(() => useDeleteConvite({ onSuccess: onSuccessSpy }))

        await act(async () => {
            await result.current.executeDelete(123)
        })

        // Validações
        expect(deleteConviteAction).toHaveBeenCalledWith(123) // Verifica se o ID foi passado corretamente
        expect(toast.success).toHaveBeenCalledWith("Excluído com sucesso") // Feedback visual
        expect(onSuccessSpy).toHaveBeenCalled() // Garante que a lista será atualizada
        expect(result.current.isLoading).toBe(false)
    })

    it('deve exibir erro quando a exclusão falhar no servidor', async () => {
        // Simula erro lógico (ex: convite vinculado a pedido)
        vi.mocked(deleteConviteAction).mockResolvedValue({ 
            success: false, 
            message: "Não é possível excluir" 
        })
        
        const { result } = renderHook(() => useDeleteConvite())

        await act(async () => {
            await result.current.executeDelete(123)
        })

        expect(toast.error).toHaveBeenCalledWith("Não é possível excluir") //
        expect(result.current.isLoading).toBe(false)
    })

    it('deve lidar com exceções inesperadas', async () => {
        // Simula erro de rede ou timeout
        vi.mocked(deleteConviteAction).mockRejectedValue(new Error("Timeout"))
        
        const { result } = renderHook(() => useDeleteConvite())

        await act(async () => {
            await result.current.executeDelete(123)
        })

        expect(toast.error).toHaveBeenCalledWith("Ocorreu um erro inesperado ao excluir.") //
    })
})