// src/hooks/use-cadastro-user.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useCadastroUser from './use-cadastro-user'
import { cadastrarUserAction } from "@/app/actions/user/cadastro"
import { createMockCadastroValues } from '@/test/factories/user-factory'

// Mock da Server Action de cadastro
vi.mock("@/app/actions/user/cadastro", () => ({
    cadastrarUserAction: vi.fn()
}))

describe('useCadastroUser Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve cadastrar um novo usuário com sucesso', async () => {
        // Simulando retorno de sucesso da Action
        vi.mocked(cadastrarUserAction).mockResolvedValue({ 
            success: true, 
            message: "Usuário cadastrado com sucesso" 
        })
        
        const { result } = renderHook(() => useCadastroUser())
        const userData = createMockCadastroValues()

        await act(async () => {
            await result.current.cadastrar(userData)
        })

        expect(result.current.isSuccess).toBe(true)
        expect(result.current.message).toBeNull()
        expect(result.current.isLoading).toBe(false)
    })

    it('deve exibir erro quando o e-mail já estiver cadastrado', async () => {
        // Simulando o erro de conflito (Unique Constraint)
        vi.mocked(cadastrarUserAction).mockResolvedValue({ 
            success: false, 
            message: "Este e-mail já está em uso." 
        })
        
        const { result } = renderHook(() => useCadastroUser())

        await act(async () => {
            await result.current.cadastrar(createMockCadastroValues())
        })

        expect(result.current.isSuccess).toBe(false)
        expect(result.current.message).toBe("Este e-mail já está em uso.")
    })

    it('deve lidar com falhas críticas no servidor', async () => {
        // Simulando uma exceção no banco de dados
        vi.mocked(cadastrarUserAction).mockRejectedValue(new Error("Conexão perdida"))
        
        const { result } = renderHook(() => useCadastroUser())

        await act(async () => {
            await result.current.cadastrar(createMockCadastroValues())
        })

        expect(result.current.message).toBe("Erro crítico ao cadastrar usuário.")
        expect(result.current.isSuccess).toBe(false)
        expect(result.current.isLoading).toBe(false)
    })
})