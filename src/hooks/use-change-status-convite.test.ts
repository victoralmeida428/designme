// src/hooks/use-change-status.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { changeStatusAction } from "@/app/actions/catalogo/convite"
import { toast } from "sonner"
import useChangeStatus from './use-change-status-convite'

// 1. Mocks das dependências externas
vi.mock("@/app/actions/catalogo/convite", () => ({
    changeStatusAction: vi.fn()
}))

vi.mock("sonner", () => ({
    toast: { 
        success: vi.fn(),
        error: vi.fn() 
    }
}))

describe('useChangeStatus Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve alterar o status com sucesso e disparar o callback', async () => {
        // Simula sucesso no servidor
        vi.mocked(changeStatusAction).mockResolvedValue({ 
            success: true, 
            message: "Status atualizado com sucesso" 
        })
        
        const onSuccessSpy = vi.fn()
        const { result } = renderHook(() => useChangeStatus({ onSuccess: onSuccessSpy }))

        await act(async () => {
            await result.current.changeStatus(1, true)
        })

        // Asserções
        expect(changeStatusAction).toHaveBeenCalledWith(1, true)
        expect(onSuccessSpy).toHaveBeenCalled()
        expect(toast.success).toHaveBeenCalledWith("Status atualizado com sucesso")
        expect(result.current.isError).toBe(false)
    })

    it('deve lidar com erro retornado pela action', async () => {
        // Simula erro de validação ou lógica no servidor
        vi.mocked(changeStatusAction).mockResolvedValue({ 
            success: false, 
            message: "Falha ao mudar status" 
        })
        
        const { result } = renderHook(() => useChangeStatus({}))

        await act(async () => {
            await result.current.changeStatus(1, false)
        })

        expect(result.current.isError).toBe(true)
        expect(toast.error).toHaveBeenCalledWith("Falha ao mudar status")
    })

    it('deve capturar erros críticos de comunicação', async () => {
        // Simula queda de conexão ou erro de execução
        vi.mocked(changeStatusAction).mockRejectedValue(new Error("Database offline"))
        
        const { result } = renderHook(() => useChangeStatus({}))

        await act(async () => {
            await result.current.changeStatus(1, true)
        })

        expect(result.current.isError).toBe(true)
        expect(toast.error).toHaveBeenCalledWith("Erro ao comunicar com o servidor")
        expect(result.current.isLoading).toBe(false)
    })
})