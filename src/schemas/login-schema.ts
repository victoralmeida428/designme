import * as z from "zod"

export const loginSchema = z.object({
  email: z.email({
    error: "Por favor, insira um endereço de e-mail válido"
  }),
  password: z.string().min(4, {
    message: "A senha deve ter pelo menos 4 caracteres"
  })
})

export type LoginFormValues = z.infer<typeof loginSchema>