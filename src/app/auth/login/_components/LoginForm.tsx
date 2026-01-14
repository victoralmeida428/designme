import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useLogin from "@/hooks/use-login";
import { cn } from "@/lib/utils";
import { LoginFormValues, loginSchema } from "@/schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type LoginFormProps = {
    redirect: string;
};
export default function LoginForm({ redirect = "" }: LoginFormProps) {
    const { isSuccess, message, isLoading, login } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    function onSubmit(data: LoginFormValues) {
        login(data)
    }

    useEffect(() => {
        if (isSuccess) {
            window.location.href = redirect;
        }
        console.log(isSuccess)
    }, [isLoading, message, isSuccess])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
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
                <Label htmlFor="signin-password">Senha</Label>
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
            </div>
            {message && (
                <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {message}
                </div>
              )}
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
        </form>
    )
}