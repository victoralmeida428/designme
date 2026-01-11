'use client'

import { Settings2, MoreHorizontal, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface MenuAcoesProps {
  label?: string;
  triggerIcon?: "dots" | "gear" | "settings";
  children: React.ReactNode; // Aqui entra a customização livre
}

export function MenuAcoes({ 
  label, 
  triggerIcon = "settings", 
  children 
}: MenuAcoesProps) {
  const icon = {
    "gear": <Settings2 className="h-4 w-4 text-muted-foreground" />,
    "dots": <MoreHorizontal className="h-4 w-4 text-muted-foreground" />,
    "settings": <Settings className="h-4 w-4 text-muted-foreground" />,
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer hover:bg-muted">
          <span className="sr-only">Abrir menu</span>
          {icon[triggerIcon]}
        </Button>
      </DropdownMenuTrigger>
      
      {/* O uso de position="popper" resolve o erro de flutuar no meio da tela */}
      <DropdownMenuContent 
        align="end" 
        className="min-w-0 w-auto p-1"
        sideOffset={8}
      >
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* Renderiza os itens customizados passados pelo desenvolvedor */}
        <div className="flex flex-col gap-1">
          {children}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}