"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { ConviteFormValues, conviteSchema } from "@/schemas/convite-schema"
import { createConviteAction } from "@/app/actions/catalogo/convite"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { toast } from "sonner"


// Interface para as categorias que vieram do banco
interface CategoriaOption {
    id_categoria: number
    nome: string
}

export function ConviteForm({ categorias }: { categorias: CategoriaOption[] }) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(conviteSchema),
        defaultValues: {
            nome: "",
            descricao: "",
            preco_base: 0,
            ativo: true,
        },
    })

    //TODO MIGRAR PARA UM USECASE
    async function onSubmit(data: ConviteFormValues) {
        setIsLoading(true)
        const result = await createConviteAction(data)
        if (result?.success === false) {
            form.setError("root", { message: result.message })
            setIsLoading(false)
        }
        toast.success("Convite criado com sucesso!")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardContent className="pt-6 space-y-4">

                        {/* Nome */}
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Modelo</FormLabel>
                                    <FormControl><Input placeholder="Ex: Casamento Floral" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Categoria */}
                        <FormField
                            control={form.control}
                            name="id_categoria"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <FormControl>
                                        <NativeSelect
                                            {...field} // 1. Repassa ref e onBlur
                                            value={field.value as string ?? ""} // 2. Controla o valor (evita erro de controlled/uncontrolled)
                                            onChange={(e) => {
                                                // 3. Converte a String do select para Number antes de salvar no form
                                                const val = Number(e.target.value);
                                                field.onChange(val);
                                            }}
                                        >
                                            {/* Opção placeholder padrão */}
                                            <NativeSelectOption value="" disabled>
                                                Selecione uma categoria
                                            </NativeSelectOption>

                                            {categorias.length === 0 ? (
                                                <NativeSelectOption value="0" disabled>Nenhuma categoria cadastrada</NativeSelectOption>
                                            ) : (
                                                categorias.map((cat) => (
                                                    <NativeSelectOption
                                                        key={cat.id_categoria}
                                                        value={cat.id_categoria.toString()} // O value no DOM tem que ser string
                                                    >
                                                        {cat.nome}
                                                    </NativeSelectOption>
                                                ))
                                            )}
                                        </NativeSelect>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Preço Base */}
                            <FormField
                                control={form.control}
                                name="preco_base"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preço Base (R$)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                {...field}
                                                value={field.value as string ?? ''}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Descrição */}
                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Detalhes do convite..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Imagem URL */}
                        <FormField
                            control={form.control}
                            name="image" // Sugiro mudar o nome se for enviar o arquivo, não a URL
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Imagem de Capa</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="cursor-pointer"

                                            {...fieldProps}
                                            placeholder="Selecione uma imagem"
                                            type="file"
                                            accept="image/*" // Aceita apenas imagens (png, jpg, webp, etc)
                                            onChange={(event) => {
                                                const file = event.target.files && event.target.files[0];
                                                if (file) {
                                                    onChange(file); // Atualiza o formulário com o objeto File
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {value && (
                                        <div className="mt-4 rounded-md border p-2 w-fit">
                                            <img
                                                src={value instanceof File ? URL.createObjectURL(value) : value}
                                                alt="Preview"
                                                className="h-40 w-auto object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />

                        {/* Ativo */}
                        <FormField
                            control={form.control}
                            name="ativo"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Ativo</FormLabel>
                                        <FormDescription>Visível no catálogo.</FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-10 flex items-center gap-4 justify-end">
                    <Button asChild variant="outline" className="cursor-pointer">
                        <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Cancelar</Link>
                    </Button>
                    <Button className="cursor-pointer" type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar
                    </Button>
                </div>
            </form>
        </Form>
    )
}