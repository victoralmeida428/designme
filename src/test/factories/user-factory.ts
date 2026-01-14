// src/test/factories/user-factory.ts
import { CadastroUserValues } from "@/schemas/cadastro-user-schema";

export const createMockCadastroValues = (overrides?: Partial<CadastroUserValues>): CadastroUserValues => ({
    nome: "Victor Gomes",
    email: "victor@designme.com.br",
    senha: "password123",
    confirmarSenha: "password123",
    ...overrides
});