import { useState } from "react";
import { LoginFormValues } from "../schemas/schema";
import { useRouter } from "next/navigation";

interface UseAdminLoginReturn {
    login: (data: LoginFormValues) => Promise<void>;
    isLoading: boolean;
}

export function useAdminLogin(): UseAdminLoginReturn {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    async function login(data: LoginFormValues) {
        setIsLoading(true)

        try {
            await new Promise((resolve)=>setTimeout(resolve, 2000))
            console.log("Login realizado com sucesso", data)
            router.push("/admin")
        } catch (error) {
            console.error("Erro no login", error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        login,
        isLoading
    }

}