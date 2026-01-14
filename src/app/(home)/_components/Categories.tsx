import artprint from "../../../../public/images/art-print.jpg";
import invitation from "../../../../public/images/invitation-suite.jpg";
import giftwrap from "../../../../public/images/gift-wrap.jpg";

import Link from "next/link";

const Categories = () => {
    const items = [
        { title: "Convites", image: invitation, alt: "Convites personalizados com acabamento premium" },
        { title: "Arte & Prints", image: artprint, alt: "Arte impressa minimalista em papel premium" },
        { title: "Presentes", image: giftwrap, alt: "Presentes e embrulhos elegantes" },
    ];

    return (
        <section id="categorias" className="container mx-auto py-16">
            <header className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold">Categorias em Destaque</h2>
                <p className="text-muted-foreground">Explore por tipo de produto</p>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <Link key={item.title} href="/loja" className="block group">
                        <article className="glass-card rounded-xl overflow-hidden hover-scale">
                            <img
                                src={item.image.src}
                                alt={`${item.title} — ${item.alt}`}
                                className="w-full h-56 object-cover"
                                loading="lazy"
                            />
                            <div className="p-6">
                                <h3 className="text-lg font-medium group-hover:underline">{item.title}</h3>
                                <p className="text-muted-foreground">Ver coleção</p>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Categories;
