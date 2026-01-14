const Designers = () => {
    const designers = [
        { name: "Ana M.", role: "Tipografia & Floral" },
        { name: "Bruno S.", role: "Minimal & Grid" },
        { name: "Carla R.", role: "Ilustração" },
    ];

    return (
        <section id="designers" className="container mx-auto py-16">
            <header className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold">Designers Independentes</h2>
                <p className="text-muted-foreground">Criações autorais com curadoria editorial</p>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {designers.map((d) => (
                    <article key={d.name} className="glass-card rounded-xl p-6 flex items-center gap-4">
                        <div className="size-12 rounded-full bg-muted flex items-center justify-center font-medium">
                            {d.name.split(" ")[0][0]}
                        </div>
                        <div>
                            <h3 className="font-medium">{d.name}</h3>
                            <p className="text-muted-foreground text-sm">{d.role}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Designers;
