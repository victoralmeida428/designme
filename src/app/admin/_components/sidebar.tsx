"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  Tags, 
  Package,
  LogOut,
  UserCog,
} from "lucide-react"

import { cn } from "@/lib/utils" // Utilitário padrão do shadcn/ui
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Convites (Produtos)",
    href: "/admin",
    icon: Package, 
  },
  {
    title: "Categorias",
    href: "/admin/categorias",
    icon: Tags,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full border-r bg-white dark:bg-slate-950 w-64">
      {/* Cabeçalho da Sidebar */}
      <div className="h-28 flex items-center px-6 border-b justify-center">
        <UserCog size={80}/>
      </div>

      {/* Links de Navegação */}
      <div className="flex-1 py-6 flex flex-col gap-2 px-3">
        {sidebarItems.map((item) => {
          const isActive = pathname.endsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </div>

      {/* Rodapé da Sidebar (Logout) */}
      <div className="p-4 border-t space-y-2">          
        <Button 
          variant="ghost" 
          className="cursor-pointer w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  )
}