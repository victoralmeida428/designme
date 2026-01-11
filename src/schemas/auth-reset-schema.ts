import * as z from "zod"

// Schema para o "Esqueci a Senha"
export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Insira um email válido.",
  }),
})
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>