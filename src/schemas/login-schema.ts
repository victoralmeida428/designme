import * as z from "zod"


export const loginSchema = z.object({
  email: z.email({
    message: "Por favor, insira um endereço de e-mail válido" // Alterado 'error' para 'message'
  }),
  password: z.string().min(4, {
    message: "A senha deve ter pelo menos 4 caracteres"
  })
})

export type LoginFormValues = z.infer<typeof loginSchema>