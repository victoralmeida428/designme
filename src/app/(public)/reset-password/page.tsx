"use client"

import { Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { resetPasswordSchema, ResetPasswordValues } from "../../schemas/reset-password-schema"
import { useResetPassword } from "../../hooks/use-reset-password"

// Componente interno com a lógica do formulário
function ResetPasswordForm() {
  const { resetPassword, isLoading, error, hasToken } = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  // Se não houver token na URL, bloqueia o acesso
  if (!hasToken) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            Link inválido ou token ausente.
        </div>
        <Button asChild variant="outline">
            <Link href="/admin/login">Voltar ao Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit((data) => resetPassword(data.password))}>
      <FieldGroup className="space-y-4">
        
        {/* Nova Senha */}
        <Field>
          <FieldLabel htmlFor="password" className={errors.password ? "text-destructive" : ""}>
            Nova Senha
          </FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="******"
            aria-invalid={!!errors.password}
            className={cn(errors.password && "border-destructive focus-visible:ring-destructive")}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </Field>

        {/* Confirmar Senha */}
        <Field>
          <FieldLabel htmlFor="confirmPassword" className={errors.confirmPassword ? "text-destructive" : ""}>
            Confirmar Senha
          </FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="******"
            aria-invalid={!!errors.confirmPassword}
            className={cn(errors.confirmPassword && "border-destructive focus-visible:ring-destructive")}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>

        {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
            </div>
        )}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Redefinir Senha"}
        </Button>
      </FieldGroup>
    </form>
  )
}

// Componente Principal (Página)
export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Criar Nova Senha</CardTitle>
          <CardDescription className="text-center">
            Digite sua nova senha abaixo
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Suspense é obrigatório ao usar useSearchParams */}
          <Suspense fallback={<div className="text-center p-4">Carregando...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link 
            href="/admin/login" 
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}