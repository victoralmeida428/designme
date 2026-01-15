"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCadastroUser from "@/hooks/use-cadastro-user";
import useLogin from "@/hooks/use-login";
import { cn } from "@/lib/utils";
import { cadastroUserSchema, CadastroUserValues } from "@/schemas/cadastro-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CadastroForm() {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<CadastroUserValues>({
        resolver: zodResolver(cadastroUserSchema),
    })

    const router = useRouter();

    const { isLoading, cadastrar, message, isSuccess } = useCadastroUser();
    const { login, isLoading: loginLoad, isSuccess: loginSuccess } = useLogin();

    useEffect(() => {
        if (isSuccess) {
            const values = getValues();
            // Tenta logar automaticamente com os dados recém-cadastrados
            login({ 
                email: values.email, 
                password: values.senha 
            });
        }
        if (loginSuccess) {
            router.push("/");
        }
    }, [isSuccess, login, getValues]);


    const processando = isLoading || loginLoad;


    return (
        <form onSubmit={handleSubmit(cadastrar)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="signup-name">Nome Completo</Label>
                <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome completo"
                    required
                    className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
                    {...register("nome")}
                />
                {errors.nome && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.nome.message}
                  </p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
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
            </div>
            <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <Input
                    id="signup-password"
                    className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
                    type="password"
                    placeholder="Crie uma senha forte"
                    minLength={6}
                    required
                    {...register("senha")}
                />
            </div>
            {errors.senha && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.senha.message}
                  </p>
                )}
            <div className="space-y-2">
                <Label htmlFor="signup-password">Confirmar senha</Label>
                <Input
                    id="signup-password"
                    className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
                    type="password"
                    placeholder="Crie uma senha forte"
                    minLength={6}
                    required
                    {...register("confirmarSenha")}
                />
                {errors.confirmarSenha && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.confirmarSenha.message}
                  </p>
                )}
            </div>
            {message && !isSuccess && (
                <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {message}
                </div>
            )}
            <Button type="submit" className="w-full cursor-pointer" disabled={processando}>
                {processando ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
        </form>
    )
}