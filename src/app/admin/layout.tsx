import "@/app/globals.css"
import { AdminSidebar } from "./_components/sidebar"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full  overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Lado Esquerdo: Sidebar Fixa */}
      <aside className="hidden md:flex h-full flex-col">
        <AdminSidebar />
      </aside>

      {/* Lado Direito: Conteúdo da Página (Scrollável) */}
      <main className="flex-1 overflow-y-auto">
        {/* Aqui será renderizado o page.tsx do dashboard, convites, etc */}
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  )
}