import { LoginFormValues } from "@/schemas/login-schema"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    async function login(data: LoginFormValues) {
        try {
            setIsLoading(true)
            setMessage(null)
            setIsSuccess(false)

            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })
            if (result?.error) {
                // Se a senha estiver errada ou usuário não existir
                setMessage("Email ou senha inválidos.")
            } else {
                setIsSuccess(true)
            }
        
        } catch (error) {
            setMessage("Erro ao fazer login")
        } finally {
            setIsLoading(false)
        }

    }
    return {
        isLoading,
        isSuccess,
        message,
        login,
    }
}