'use client'

import { getConvitePaginate } from "@/app/actions/catalogo/convite";
import ConviteDTO from "@/dto/convite-dto";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner"; // [cite: 5]

export function useGetConvites() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [data, setData] = useState<ConviteDTO[] | null>();
    
    const [filter, setFilter] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [status, setStatus] = useState<number>(-1);
    const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

    // UseRef para evitar loops infinitos com o debouncer
    const isInitialMount = useRef(true);

    const fetchConvites = useCallback(async (targetPage?: number) => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getConvitePaginate({ 
                pagination: { 
                    filter, 
                    page: targetPage ?? page, 
                    pageSize: 10 
                },
                status: status
            });

            setData(result.data);
            setMeta(result.meta);
        } catch (error) {
            setIsError(true);
            toast.error("Erro ao carregar catálogo");
        } finally {
            setIsLoading(false);
        }
    }, [filter, page, status]);

    // 1. Efeito para Mudança de Página (Sem Debounce)
    useEffect(() => {
        if (isInitialMount.current) return;
        fetchConvites();
    }, [page]); // Executa na hora que o número da página muda

    // 2. Efeito para Filtro e Status (Com Debounce)
    useEffect(() => {
        if (isInitialMount.current) {
            fetchConvites();
            isInitialMount.current = false;
            return;
        }

        const handler = setTimeout(() => {
            // Se o usuário digitou, resetamos para a página 1
            if (page !== 1) {
                setPage(1);
            } else {
                fetchConvites();
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [filter, status]); // REMOVIDO page e fetchConvites daqui

    return {
        isLoading, isError, convites: data, meta,
        page, setPage, filter, setFilter, status, setStatus,
        refresh: fetchConvites
    }
}