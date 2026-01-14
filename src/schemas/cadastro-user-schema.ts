import * as z from "zod"

export const cadastroUserSchema = z.object({
  email: z.email({
    message: "Insira um email válido.",
  }),
  nome: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  senha: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  confirmarSenha: z.string().min(6, {
    message: "A confirmação de senha deve ter pelo menos 6 caracteres.",
  }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmarSenha"],
})

export type CadastroUserValues = z.infer<typeof cadastroUserSchema>