"use client"
import { useState } from "react";
import { deleteConviteAction } from "@/app/actions/catalogo/convite"
import { toast } from "sonner";

interface UseDeleteConviteProps {
    onSuccess?: () => void;
}

export default function useDeleteConvite({ onSuccess }: UseDeleteConviteProps = {}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const executeDelete = async (id: number) => {
        setIsLoading(true);
        try {
            const result = await deleteConviteAction(id);
            

            if (result.success) {
                toast.success(result.message);
                if (onSuccess) onSuccess(); 
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Ocorreu um erro inesperado ao excluir.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        executeDelete,
        isLoading,
    };
}