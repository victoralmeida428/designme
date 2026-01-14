import artprint from "../../../../public/images/art-print.jpg";
import invitation from "../../../../public/images/invitation-suite.jpg";
import cards from "../../../../public/images/greeting-cards.jpg";

import Link from "next/link";

const Collections = () => {
    const collections = [
        { name: "Minimal", image: artprint },
        { name: "Floral", image: invitation },
        { name: "Clássico", image: cards },
        { name: "Fotográfico", image: invitation },
    ];

    return (
        <section id="colecoes" className="container mx-auto py-16">
            <header className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold">Coleções Populares</h2>
                <p className="text-muted-foreground">Curadorias com a cara da sua celebração</p>
            </header>
            <div className="overflow-x-auto">
                <ul className="flex gap-4 min-w-full pr-4">
                    {collections.map((c) => (
                        <li key={c.name} className="shrink-0 w-64">
                            <Link href="/loja" className="block group">
                                <article className="glass-card rounded-xl overflow-hidden hover-scale">
                                    <img
                                        src={c.image.src}
                                        alt={`${c.name} — coleção de papelaria premium`}
                                        className="w-full h-40 object-cover"
                                        loading="lazy"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-medium group-hover:underline">{c.name}</h3>
                                        <p className="text-sm text-muted-foreground">Explorar</p>
                                    </div>
                                </article>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Collections;
