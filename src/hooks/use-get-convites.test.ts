import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGetConvites } from './use-get-convites'
import { getConvitePaginate } from "@/app/actions/catalogo/convite"
import { toast } from "sonner"
import { createMockConvite, createMockPaginateMeta } from '@/test/factories/convite-factory'

vi.mock("@/app/actions/catalogo/convite", () => ({
    getConvitePaginate: vi.fn()
}))

vi.mock("sonner", () => ({
    toast: { error: vi.fn() }
}))

describe('useGetConvites Hook', () => {
    const createSuccessResponse = (count = 2) => ({
        data: Array.from({ length: count }, (_, i) => createMockConvite({ id: i + 1 })),
        meta: createMockPaginateMeta({ total: count })
    });

    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers({ shouldAdvanceTime: true }) 
    })

    it('deve carregar os convites iniciais com sucesso', async () => {
        const mockResponse = createSuccessResponse(2);
        vi.mocked(getConvitePaginate).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGetConvites());

        // Para resolver promessas com fake timers, usamos advanceTimersByTimeAsync
        await act(async () => {
            await vi.advanceTimersByTimeAsync(0); 
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.convites).toHaveLength(2);
    })

    it('deve aplicar debounce ao alterar o filtro de busca', async () => {
        vi.mocked(getConvitePaginate).mockResolvedValue(createSuccessResponse(1));
        const { result } = renderHook(() => useGetConvites());

        // Espera o mount inicial
        await act(async () => { await vi.advanceTimersByTimeAsync(0); });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Altera o filtro
        act(() => {
            result.current.setFilter('casamento')
        });

        // O debounce é de 500ms. Vamos avançar 501ms de forma assíncrona
        await act(async () => {
            await vi.advanceTimersByTimeAsync(501);
        });

        await waitFor(() => {
            expect(getConvitePaginate).toHaveBeenCalledTimes(2);
            expect(result.current.page).toBe(1);
        });
    })

    it('deve trocar de página corretamente (sem debounce)', async () => {
        vi.mocked(getConvitePaginate).mockResolvedValue(createSuccessResponse(5));
        const { result } = renderHook(() => useGetConvites());

        await act(async () => { await vi.advanceTimersByTimeAsync(0); });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.setPage(2);
        });

        // Como não tem debounce, avançamos apenas o microtask (0ms)
        await act(async () => {
            await vi.advanceTimersByTimeAsync(0);
        });

        expect(getConvitePaginate).toHaveBeenLastCalledWith(
            expect.objectContaining({
                pagination: expect.objectContaining({ page: 2 })
            })
        );
    })

    it('deve exibir toast de erro e atualizar estado em caso de falha na Action', async () => {
        vi.mocked(getConvitePaginate).mockRejectedValue(new Error("Database error"));

        const { result } = renderHook(() => useGetConvites());

        await act(async () => {
            await vi.advanceTimersByTimeAsync(0);
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
            expect(toast.error).toHaveBeenCalledWith("Erro ao carregar catálogo");
        });
    })
})