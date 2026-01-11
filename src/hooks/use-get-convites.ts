'use client'

import { getConvitePaginate } from "@/app/actions/catalogo/convite";
import ConviteDTO from "@/dto/convite-dto";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner"; // [cite: 5]

export function useGetConvites() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [data, setData] = useState<ConviteDTO[]|null>();
    
    // Estados de Paginação e Filtro
    const [filter, setFilter] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [status, setStatus] = useState<number>(-1);
    const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

    const fetchConvites = useCallback(async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            // Chama a nova função paginada que criamos
            console.log("log do useGetConvites ",status)
            const result = await getConvitePaginate({ 
                pagination: {filter, 
                page, 
                pageSize: 10 },
                status: status
            });

            setData(result.data);
            setMeta(result.meta);
            
        } catch (error) {
            setIsError(true);
            toast.error("Erro ao carregar catálogo", {
                position: 'top-center'
            });
        } finally {
            setIsLoading(false);
        }
    }, [filter, page, status]);

    // Efeito para busca com Debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchConvites();
        }, 400); 

        return () => clearTimeout(handler);
    }, [filter, status, page, fetchConvites]);

    return {
        isLoading,
        isError,
        convites: data,
        meta,
        page,
        setPage,
        filter,
        setFilter,
        status,
        setStatus,
        refresh: fetchConvites
    }
}