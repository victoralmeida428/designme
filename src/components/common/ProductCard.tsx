'use client'

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface Props {
    id?: string;
    image: string;
    title: string;
    price: string;
    onBuy?: () => void;
    href?: string;
}

interface ProductCardProps {
    items: Props[];
}

export function ProductCard({ items }: ProductCardProps) {
    return (
        <>
            {items.map((item) => (
                <article
                    key={item.id}
                    className={cn("glass-card rounded-xl p-6 flex flex-col gap-4 hover-scale")}
                >
                    <div className="relative">
                        <Link href={`/convites/${item.id}`} aria-label={`Ver detalhes de ${item.title}`} className="block">
                            <img
                                src={item.image}
                                alt={`${item.title} — papelaria premium e design editorial`}
                                className="w-full rounded-lg aspect-[4/3] object-cover"
                                loading="lazy"
                            />
                        </Link>
                    </div>

                    <div className="flex-1">
                        <Link href={`/convites/${item.id}`} aria-label={`Ver detalhes de ${item.title}`} className="block">
                            <h3 className="text-lg font-medium">{item.title}</h3>
                        </Link>
                        <p className="text-muted-foreground">{item.price}</p>
                    </div>

                    <div className="flex justify-between items-center">
                        <Button onClick={() => {}} size="sm">Adicionar ao Carrinho</Button>
                    </div>
                </article>
            ))}
        </>
    );
}
