"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
    const loading = false;
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
                            <form onSubmit={console.log} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">Nome Completo</Label>
                                    <Input
                                        id="signup-name"
                                        name="fullName"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        name="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Senha</Label>
                                    <Input
                                        id="signup-password"
                                        name="password"
                                        type="password"
                                        placeholder="Crie uma senha forte"
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}