// src/hooks/use-forgot-password.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useForgotPassword } from './use-forgot-password'
import { requestPasswordResetAction } from "@/app/actions/auth/auth-reset"

// Mock da Server Action
vi.mock("@/app/actions/auth/auth-reset", () => ({
    requestPasswordResetAction: vi.fn()
}))

describe('useForgotPassword Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve solicitar recuperação com sucesso', async () => {
        vi.mocked(requestPasswordResetAction).mockResolvedValue({ 
            success: true, 
            message: "Link de recuperação enviado" 
        })

        const { result } = renderHook(() => useForgotPassword())

        await act(async () => {
            await result.current.requestReset("cliente@email.com")
        })

        expect(result.current.isSuccess).toBe(true)
        expect(result.current.message).toBe("Link de recuperação enviado")
        expect(result.current.isLoading).toBe(false)
    })

    it('deve lidar com e-mail não encontrado', async () => {
        vi.mocked(requestPasswordResetAction).mockResolvedValue({ 
            success: false, 
            message: "E-mail não encontrado" 
        })

        const { result } = renderHook(() => useForgotPassword())

        await act(async () => {
            await result.current.requestReset("invalido@email.com")
        })

        expect(result.current.isSuccess).toBe(false)
        expect(result.current.message).toBe("E-mail não encontrado")
    })
})