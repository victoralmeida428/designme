import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function NovoConviteBtn() {
    return (
        <Button asChild>
            <Link href="/admin/convites/novo">
                <Plus className="mr-2 h-4 w-4" />Convite
            </Link>
        </Button>
    );
}