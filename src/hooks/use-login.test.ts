// src/hooks/use-login.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useLogin from './use-login'
import { signIn } from "next-auth/react"
import { createMockLoginValues } from '@/test/factories/auth-factory'

// Mock do NextAuth
vi.mock("next-auth/react", () => ({
    signIn: vi.fn()
}))

describe('useLogin Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve realizar login com sucesso', async () => {
        // Simulando resposta positiva do NextAuth
        vi.mocked(signIn).mockResolvedValue({ error: null, status: 200, ok: true, url: '' })

        const { result } = renderHook(() => useLogin())
        const loginData = createMockLoginValues()

        await act(async () => {
            await result.current.login(loginData)
        })

        expect(result.current.isLoading).toBe(false)
        expect(result.current.isSuccess).toBe(true)
        expect(result.current.message).toBeNull()
    })

    it('deve retornar erro quando as credenciais forem inválidas', async () => {
        // Simulando erro de credenciais (Email ou senha errados)
        vi.mocked(signIn).mockResolvedValue({ error: "CredentialsSignin", status: 401, ok: false, url: null })

        const { result } = renderHook(() => useLogin())

        await act(async () => {
            await result.current.login(createMockLoginValues())
        })

        expect(result.current.isSuccess).toBe(false)
        expect(result.current.message).toBe("Email ou senha inválidos.")
    })

    it('deve lidar com exceções inesperadas', async () => {
        // Simulando erro de rede ou explosão no servidor
        vi.mocked(signIn).mockRejectedValue(new Error("Network Error"))

        const { result } = renderHook(() => useLogin())

        await act(async () => {
            await result.current.login(createMockLoginValues())
        })

        expect(result.current.message).toBe("Erro ao fazer login")
        expect(result.current.isLoading).toBe(false)
    })
})