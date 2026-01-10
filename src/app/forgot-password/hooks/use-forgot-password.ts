import { useState } from "react"
import { requestPasswordResetAction } from "@/app/actions/auth-reset" 

interface UseForgotPasswordReturn {
  requestReset: (email: string) => Promise<void>
  isLoading: boolean
  message: string | null
  isSuccess: boolean
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  async function requestReset(email: string) {
    setIsLoading(true)
    setMessage(null)
    setIsSuccess(false)

    try {
      // Chama a Server Action (que roda no Node.js)
      const result = await requestPasswordResetAction(email)
      
      setMessage(result.message)
      setIsSuccess(result.success)
      
    } catch (error) {
      console.error(error)
      setMessage("Ocorreu um erro inesperado. Tente novamente.")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    requestReset,
    isLoading,
    message,
    isSuccess
  }
}