"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
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
import { forgotPasswordSchema, ForgotPasswordValues } from "../../schemas/auth-reset-schema"
import { useForgotPassword } from "../../hooks/use-forgot-password"
import CadastroForm from "../(public)/auth/login/_components/CadastroForm"

export default function ForgotPasswordPage() {
  const { requestReset, isLoading, message, isSuccess } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  return (
    <div className={`flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900 ${isLoading && 'cursor-progress'}`}>
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${isSuccess ? "bg-green-100" : "bg-primary/10"}`}>
              {isSuccess ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Mail className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {isSuccess ? "Email Enviado!" : "Recuperar Senha"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess
              ? "Verifique sua caixa de entrada e siga as instruções."
              : "Informe seu email para receber o link de redefinição."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSuccess ? (
            <CadastroForm/>
          ) : (
            <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">{message}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link 
            href="/auth/login" 
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}