import { z } from "zod"

export const conviteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional(),
  preco_base: z.coerce.number().min(0.01, "O preço deve ser maior que zero"),
  id_categoria: z.coerce.number().min(1, "Selecione uma categoria"),
  image: z
  .instanceof(File, { message: "O arquivo de imagem é obrigatório" })
  .refine((file) => file.size < 5000000, "O arquivo deve ter menos de 5MB."),
  ativo: z.boolean().default(true),
})

export type ConviteFormValues = z.infer<typeof conviteSchema>