import artprint from "../../../../public/images/art-print.jpg";
import invitation from "../../../../public/images/invitation-suite.jpg";
import cards from "../../../../public/images/greeting-cards.jpg";
import Link from "next/link";

const Journal = () => {
    const posts = [
        { title: "Tendências de convite 2025", image: invitation },
        { title: "Como escolher o papel perfeito", image: artprint },
        { title: "Cores que encantam", image: cards },
    ];

    return (
        <section id="journal" className="container mx-auto py-16">
            <header className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold">Journal & Inspiração</h2>
                <p className="text-muted-foreground">Dicas de design, papel e acabamentos</p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
                {posts.map((p) => (
                    <article key={p.title} className="glass-card rounded-xl overflow-hidden hover-scale">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image.src} alt={`${p.title} — inspiração de papelaria premium`} className="w-full h-44 object-cover" loading="lazy" />
                        <div className="p-6">
                            <h3 className="font-medium">{p.title}</h3>
                            <Link href="/loja" className="story-link text-primary text-sm">Ler mais</Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Journal;
