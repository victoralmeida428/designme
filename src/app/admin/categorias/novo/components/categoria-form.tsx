"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { CategoryFormValues, categorySchema } from "../../../schemas/categoria-schema"
import { createCategoryAction } from "@/app/actions/catalogo/categoria"


export function CategoryForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nome: "",
      descricao: "",
      ativo: true,
    },
  })

  async function onSubmit(data: CategoryFormValues) {
    setIsLoading(true)
    const result = await createCategoryAction(data)
    
    if (result?.success === false) {
        form.setError("root", { message: result.message })
        setIsLoading(false)
    }
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
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Casamento, Aniversário..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Para que serve essa categoria..." {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <FormDescription>Disponível para novos produtos.</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
                <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
            <Button asChild variant="outline">
                <Link href="/admin/categorias">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
                </Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" /> Salvar Categoria
            </Button>
        </div>
      </form>
    </Form>
  )
}