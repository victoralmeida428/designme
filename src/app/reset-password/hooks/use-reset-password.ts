import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
// Certifique-se de importar a action correta
import { resetPasswordAction } from "@/app/actions/auth-reset" 

interface UseResetPasswordReturn {
  resetPassword: (newPassword: string) => Promise<void>
  isLoading: boolean
  error: string | null
  hasToken: boolean
}

export function useResetPassword(): UseResetPasswordReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Captura o token da URL (ex: meuecommerce.com/admin/reset-password?token=XYZ)
  const token = searchParams.get("token")

  async function resetPassword(newPassword: string) {
    if (!token) {
      setError("Token de recuperação não encontrado ou inválido.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Chama a Server Action passando o token e a nova senha
      const result = await resetPasswordAction(token, newPassword)
      
      if (result.success) {
        // Sucesso: Redireciona para o login com uma query param para mostrar um aviso
        router.push("/admin/login?reset=success")
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error(err)
      setError("Ocorreu um erro ao tentar alterar a senha. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    resetPassword,
    isLoading,
    error,
    hasToken: !!token // Retorna true se tiver token, false se não tiver
  }
}