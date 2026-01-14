import { Button } from "@/components/ui/button";
import Link from "next/link";

const Occasions = () => {
    const occasions = [
        "Casamento",
        "Nascimento",
        "Aniversário",
        "Natal",
        "Empresa",
        "Outras Ocasiões",
    ];

    return (
        <section id="ocasioes" className="container mx-auto py-16">
            <header className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold">Compre por Ocasião</h2>
                <p className="text-muted-foreground">Encontre o design perfeito para cada momento</p>
            </header>
            <div className="flex flex-wrap gap-3">
                {occasions.map((o) => (
                    <Button asChild key={o} variant="secondary" size="sm">
                        <Link href="/loja">{o}</Link>
                    </Button>
                ))}
            </div>
        </section>
    );
};

export default Occasions;
