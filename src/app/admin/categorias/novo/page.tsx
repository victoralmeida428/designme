import { CategoryForm } from "../_components/categoria-form";



export default function NovaCategoriaPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Nova Categoria</h2>
      </div>
      <div className="max-w-xl">
        <CategoryForm />
      </div>
    </div>
  )
}