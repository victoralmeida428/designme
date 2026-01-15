import { cadastrarUserAction } from "@/app/actions/user/cadastro";
import { CadastroUserValues } from "@/schemas/cadastro-user-schema";
import { useState, useTransition } from "react"

export default function useCadastroUser() {
    const [isLoading, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const cadastrar = async function (data: CadastroUserValues) {
        setIsSuccess(false);
        setMessage(null);
        startTransition(async () => {
            try {
                const result = await cadastrarUserAction(data);
                
                if (result.success) {
                    setIsSuccess(true);
                } else {
                    setMessage(result.message);
                }
            } catch (error) {
                setMessage("Erro crítico ao cadastrar usuário.");
            }
        });

    }
    return { isLoading, isSuccess, message, cadastrar }
}