// src/test/factories/categoria-factory.ts
import { Categoria } from "@/entity/categoria-entity";

export const createMockCategoria = (overrides?: Partial<Categoria>): Categoria => ({
    id_categoria: Math.floor(Math.random() * 1000),
    nome: "Papelaria Premium",
    descricao: "Papéis de alta gramatura",
    ativo: true,
    ...overrides
});