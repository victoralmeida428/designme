"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // Lógica de Auth
import { Menu, User, LogOut, Loader2 } from "lucide-react";

// Componentes de UI
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Componentes do seu projeto
import MegaMenu from "@/components/layout/MegaMenu";
import CartIcon from "@/components/cart/CartIcon";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // 1. Hook do NextAuth para gerenciar a sessão
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // Função auxiliar para classes de link ativo
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    } transition-colors font-playfair`;
  };
  

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-0">
        
        {/* LOGO */}
        <Link href="/" className="font-semibold tracking-tight text-xl">
          Design Me
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link href="/loja" className={getLinkClass("/loja")}>
            Loja
          </Link>
          <Link href="/convites" className={getLinkClass("/convites")}>
            Convites
          </Link>
          <MegaMenu />
        </div>

        {/* ACTIONS (Cart & Auth) */}
        <div className="flex items-center space-x-2">
          <CartIcon />

          {/* Lógica de Renderização da Auth (Desktop) */}
          {isLoading ? (
            <Button variant="ghost" size="sm" disabled className="hidden md:flex">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : session ? (
            // USUÁRIO LOGADO
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex relative cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  <span className="max-w-[100px] truncate">
                    {session.user?.name || "Minha Conta"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">Meu Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pedidos" className="cursor-pointer">Meus Pedidos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // USUÁRIO DESLOGADO
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <Link href="/auth/login">
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          )}

          {/* MOBILE MENU (Sheet) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col space-y-4 mt-6">
                <Link href="/" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Início
                </Link>
                <Link href="/loja" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Loja
                </Link>
                <Link href="/convites" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Convites
                </Link>

                <hr className="my-4 border-muted" />

                {/* Lógica de Renderização da Auth (Mobile) */}
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
                  </div>
                ) : session ? (
                  <>
                    <div className="text-sm text-muted-foreground mb-2">
                      Olá, <span className="font-medium text-foreground">{session.user?.name}</span>
                    </div>
                    <Link href="/perfil" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                      Meu Perfil
                    </Link>
                    <Link href="/pedidos" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                      Meus Pedidos
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsOpen(false);
                      }} 
                      className="justify-start mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button asChild className="justify-start w-full">
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Login / Cadastro
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;