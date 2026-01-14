"use client"

import { LockKeyhole } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LoginForm from "@/components/login/LoginForm"


export default function LoginAdminPage() {
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
          <LoginForm redirect="/admin" />
        </CardContent>

        <CardFooter className="flex justify-center mt-4">
          <p className="text-xs text-muted-foreground">Painel de controle v1.0</p>
        </CardFooter>
      </Card>
    </div>
  )
}