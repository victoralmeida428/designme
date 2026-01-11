import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function NovaCategoriaButton() {
    return (
        <Button asChild>
          <Link href="/admin/categorias/novo">
            <Plus className="mr-2 h-4 w-4" />Categoria
          </Link>
        </Button>
    );
}