"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import heroImg from "../../../../../public/images/hero-stationery.jpg";

const Hero = () => {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--x", `${x}px`);
    ref.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      className="bg-hero-gradient border-b relative overflow-hidden"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-10 py-20 items-center">
        {/* Conteúdo de Texto */}
        <div className="animate-enter z-10">
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            Papelaria premium para momentos inesquecíveis
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-[52ch]">
            Convites, cartões e presentes personalizados com acabamento editorial.
            Design minimalista, detalhes elegantes e qualidade impecável.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="hero" size="lg">
              <Link href="/loja">Explorar Loja</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#produtos">Ver Produtos</Link>
            </Button>
          </div>
        </div>

        {/* Imagem Otimizada */}
        <div className="relative z-10">
          <Image
            src={heroImg}
            alt="Convites e papelaria premium em flat lay minimalista, com toques de menta"
            className="w-full rounded-xl shadow-xl glass-card animate-scale-in object-cover"
            priority={true} // Importante para LCP (Largest Contentful Paint)
            placeholder="blur" // Efeito visual agradável enquanto carrega
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;