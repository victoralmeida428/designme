'use client'

import React from "react"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 1. Root Component
interface ConfirmModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ConfirmModal({ children, open, onOpenChange }: ConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children}
    </AlertDialog>
  )
}

// 2. Trigger (Onde o usuário clica para abrir)
export function ConfirmTrigger({ children }: { children: React.ReactNode }) {
  return <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
}

// 3. Content Wrapper
export function ConfirmContent({ 
  title, 
  description, 
  children 
}: { 
  title: string, 
  description?: string, 
  children: React.ReactNode 
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-4">
        {children}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

// 4. Action Buttons (Botão que executa)
export function ConfirmAction({ 
  onClick, 
  children, 
  variant = "destructive" 
}: { 
  onClick: (e:any) => void, 
  children: React.ReactNode, 
  variant?: "destructive" | "default" 
}) {
  return (
    <AlertDialogAction 
      onClick={onClick} 
      className={`cursor-pointer  ${cn(buttonVariants({ variant }))}`}
    >
      {children}
    </AlertDialogAction>
  )
}

export function ConfirmCancel({ children = "Cancelar" }: { children?: React.ReactNode }) {
  return <AlertDialogCancel className="cursor-pointer hover:bg-gray-200">{children}</AlertDialogCancel>
}