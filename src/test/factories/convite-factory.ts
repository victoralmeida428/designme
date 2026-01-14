// src/test/factories/catalogo-factory.ts
import ConviteDTO from "@/dto/convite-dto";
import { PaginateMetaDTO } from "@/dto/paginate-dto";

/**
 * Cria um objeto ConviteDTO com valores padrão saudáveis.
 * Permite sobrescrever apenas o que for necessário para o teste.
 */
export const createMockConvite = (overrides?: Partial<ConviteDTO>): ConviteDTO => ({
    id: Math.floor(Math.random() * 1000),
    nome: "Convite de Casamento Elegante",
    precoBase: 59.90,
    ativo: true,
    imagePreviewUrl: "https://designme.com/exemplo.png",
    idCategoria: 1,
    categoriaNome: "Casamento",
    ...overrides
});

/**
 * Cria o objeto de meta-informação da paginação.
 */
export const createMockPaginateMeta = (overrides?: Partial<PaginateMetaDTO>): PaginateMetaDTO => ({
    total: 1,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    ...overrides
});