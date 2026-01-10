import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";


type btnProps = {
    onClick?: () => void;
}
export default function DeleteButton({onClick}: btnProps) {
    return (
        <Button className="cursor-pointer" variant="ghost" size="icon" asChild onClick={onClick}>
            <Delete className="h-6 w-6 text-red-600" />
        </Button>
    )
}