import { Palette, PenTool, Truck } from "lucide-react";

const HowItWorks = () => {
    const steps = [
        { icon: Palette, title: "Escolha o design", desc: "Selecione entre coleções exclusivas criadas por designers." },
        { icon: PenTool, title: "Personalize", desc: "Adapte textos, cores e acabamentos para o seu evento." },
        { icon: Truck, title: "Produção & Entrega", desc: "Papel premium, impressão impecável e envio confiável." },
    ];

    return (
        <section id="como-funciona" className="container mx-auto py-16">
            <header className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold">Como Funciona</h2>
                <p className="text-muted-foreground">Três passos simples para um resultado premium</p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
                {steps.map((s) => (
                    <article key={s.title} className="glass-card rounded-xl p-6">
                        <s.icon className="size-6" aria-hidden />
                        <h3 className="mt-4 font-medium">{s.title}</h3>
                        <p className="text-muted-foreground text-sm">{s.desc}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
