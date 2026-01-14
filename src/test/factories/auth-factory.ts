// src/test/factories/auth-factory.ts
import { LoginFormValues } from "@/schemas/login-schema";

export const createMockLoginValues = (overrides?: Partial<LoginFormValues>): LoginFormValues => ({
    email: "teste@designme.com.br",
    password: "senha-segura-123",
    ...overrides
});