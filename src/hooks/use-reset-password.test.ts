// src/hooks/use-reset-password.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useResetPassword } from './use-reset-password'
import { resetPasswordAction } from "@/app/actions/auth/auth-reset"
import { useRouter, useSearchParams } from 'next/navigation'

// Mock das Server Actions e Navegação
vi.mock("@/app/actions/auth/auth-reset", () => ({
    resetPasswordAction: vi.fn()
}))

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    useSearchParams: vi.fn()
}))

describe('useResetPassword Hook', () => {
    const mockPush = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)
    })

    it('deve exibir erro se o token não estiver presente na URL', async () => {
        // Simula URL sem ?token=...
        vi.mocked(useSearchParams).mockReturnValue({ get: () => null } as any)

        const { result } = renderHook(() => useResetPassword())

        await act(async () => {
            await result.current.resetPassword("novaSenha123")
        })

        expect(result.current.error).toBe("Token de recuperação não encontrado ou inválido.")
        expect(result.current.hasToken).toBe(false)
    })

    it('deve redefinir a senha e redirecionar para o login com sucesso', async () => {
        // Simula URL com ?token=token-valido-123
        vi.mocked(useSearchParams).mockReturnValue({ get: () => "token-valido-123" } as any)
        vi.mocked(resetPasswordAction).mockResolvedValue({ success: true, message: "Sucesso" })

        const { result } = renderHook(() => useResetPassword())

        await act(async () => {
            await result.current.resetPassword("novaSenha123")
        })

        expect(result.current.error).toBeNull()
        // Verifica se redirecionou para a página correta após o sucesso
        expect(mockPush).toHaveBeenCalledWith("/auth/login?reset=success")
    })
})