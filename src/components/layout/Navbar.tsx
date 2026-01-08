import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
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
          <Button className="cursor-pointer" variant="ghost" size="sm">Entrar</Button>
          <Button className="cursor-pointer" size="sm">Criar Conta</Button>
        </div>
      </div>
    </header>
  );
}