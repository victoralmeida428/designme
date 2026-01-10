"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function Navbar() {
  // 2. Obtém os dados da sessão
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-5 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight">
            Design Me
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Catálogo</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Sobre Nós</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contato</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* 3. Lógica de Renderização Condicional */}
          
          {status === "loading" ? (
            // Estado de carregando (evita 'piscada' de conteúdo errado)
            <Button variant="ghost" size="sm" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : session ? (
            // --- USUÁRIO LOGADO ---
            <>
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs font-medium">{session.user?.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{session.user?.role}</span>
              </div>
              
              <Link href="/admin">
                <Button className="cursor-pointer" size="sm" variant="outline">Dashboard</Button>
              </Link>
              
              <Button 
                onClick={() => signOut({ callbackUrl: "/admin/login" })} 
                variant="ghost" 
                size="sm"
                className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                Sair
              </Button>
            </>
          ) : (
            // --- USUÁRIO DESLOGADO ---
            <>
              <Link href="/admin/login">
                <Button className="cursor-pointer" variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Criar Conta</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}