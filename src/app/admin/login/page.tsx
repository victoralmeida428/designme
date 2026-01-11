"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react" // <--- Importante: Função de login do NextAuth v4
import { useRouter } from "next/navigation" // Para redirecionar após sucesso
import { LockKeyhole, AlertCircle } from "lucide-react"
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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

// Seus schemas (mantém igual)
import { LoginFormValues, loginSchema } from "../../../schemas/login-schema"

export default function LoginAdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setAuthError(null)

    // Chama o endpoint do NextAuth que verifica o banco e o bcrypt
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // Importante: tratamos o redirecionamento aqui no código
    })

    setIsLoading(false)

    if (result?.error) {
      // Se a senha estiver errada ou usuário não existir
      setAuthError("Email ou senha inválidos.")
    } else {
      router.push("/admin")
      router.refresh() 
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <LockKeyhole className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Área Administrativa</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais de acesso
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-4">
              
              {/* Campo Email */}
              <Field>
                <FieldLabel htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                    Email
                </FieldLabel>
                <Input 
                  id="email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  aria-invalid={!!errors.email}
                  className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
                  {...register("email")} 
                />
                {errors.email && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              {/* Campo Senha */}
              <Field>
                <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password" className={errors.password ? "text-destructive" : ""}>
                        Senha
                    </FieldLabel>
                    <Link 
                      href="/forgot-password" 
                      className="text-xs text-muted-foreground hover:underline"
                    >
                        Esqueceu?
                    </Link>
                </div>
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

              {/* Mensagem de Erro de Login (Credenciais Inválidas) */}
              {authError && (
                <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {authError}
                </div>
              )}

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Autenticando..." : "Entrar"}
              </Button>

            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center mt-4">
          <p className="text-xs text-muted-foreground">Painel de controle v1.0</p>
        </CardFooter>
      </Card>
    </div>
  )
}