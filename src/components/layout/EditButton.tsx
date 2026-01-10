import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";


type btnProps = {
    onClick?: () => void;
}
export default function ConfigButton({onClick}: btnProps) {
    return (
        <Button className="cursor-pointer" variant="ghost" size="icon" asChild onClick={onClick}>
            <Pencil className="h-6 w-6 text-muted-foreground" />
        </Button>
    )
}