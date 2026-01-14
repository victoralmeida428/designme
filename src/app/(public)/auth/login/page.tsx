"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "../../../../components/login/LoginForm";
import CadastroForm from "./_components/CadastroForm";

export default function LoginPage() {
    return (
        <div className="container mx-auto py-14 flex items-center justify-center min-h-[calc(100vh-80px)]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Bem-vindo</CardTitle>
                    <CardDescription>
                        Faça login ou cadastre-se para continuar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger className="cursor-pointer" value="signin">Login</TabsTrigger>
                            <TabsTrigger className="cursor-pointer" value="signup">Cadastro</TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin" className="space-y-4">
                            <LoginForm redirect="/"/>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4">
                            <CadastroForm/>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}