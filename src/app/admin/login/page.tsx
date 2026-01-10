"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LockKeyhole } from "lucide-react"

// Utilitário do shadcn para classes condicionais
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
import { useAdminLogin } from "./hooks/use-admin-login"
import { LoginFormValues, loginSchema } from "./schemas/schema"

export default function LoginAdminPage() {
  const { login, isLoading } = useAdminLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

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
          <form onSubmit={handleSubmit(login)}>
            <FieldGroup className="space-y-4">
              
              {/* Campo Email */}
              <Field>
                <FieldLabel htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                    Email
                </FieldLabel>
                <Input 
                  id="email"
                  placeholder="admin@exemplo.com"
                  // Acessibilidade: indica para leitores de tela que há erro
                  aria-invalid={!!errors.email}
                  // Estilo: Aplica borda vermelha se houver erro
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
                    <a href="/forgot-password" className="text-xs text-muted-foreground hover:underline">
                        Esqueceu?
                    </a>
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