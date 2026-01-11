"use client"

import { changeStatusAction } from "@/app/actions/catalogo/convite";
import { useState } from "react";
import { toast } from "sonner";

interface UseChangeStatusProps {
    onSuccess?: () => void;
}

export default function useChangeStatus({onSuccess}: UseChangeStatusProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const changeStatus = async (id: number, status: boolean) => {
        setIsLoading(true);
        setIsError(false);
        try {
            const result = await changeStatusAction(id, status);

            if (!result.success) {
                toast.error(result.message)
                setIsError(true)
                return
            }
            if (onSuccess) onSuccess();
            toast.success(result.message)
        } catch (error) {
            setIsError(true)
            toast.error("Erro ao comunicar com o servidor")
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        isError,
        changeStatus
    }
}