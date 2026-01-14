const Testimonials = () => {
    const quotes = [
        {
            text: "Qualidade incrível — papel espesso e impressão perfeita. Nossos convidados elogiaram muito!",
            author: "Marina & Felipe",
        },
        {
            text: "Processo super simples e resultado sofisticado. Recomendo!",
            author: "João P.",
        },
    ];

    return (
        <section id="depoimentos" className="container mx-auto py-16">
            <header className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold">Depoimentos</h2>
                <p className="text-muted-foreground">Clientes reais, celebrações inesquecíveis</p>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
                {quotes.map((q, i) => (
                    <blockquote key={i} className="glass-card rounded-xl p-6">
                        <p className="text-lg">“{q.text}”</p>
                        <footer className="mt-4 text-sm text-muted-foreground">— {q.author}</footer>
                    </blockquote>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
