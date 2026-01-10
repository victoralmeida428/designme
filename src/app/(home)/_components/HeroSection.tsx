'use client'

import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  onCtaClick: () => void;
}

export function HeroSection({ title, subtitle, onCtaClick }: HeroSectionProps) {
  return (
    <section className="py-24 md:py-32 flex flex-col items-center text-center gap-6">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
        {title}
      </h1>
      <p className="text-xl text-muted-foreground">
        {subtitle}
      </p>
      <div className="flex gap-4 mt-4">
        <Button className="cursor-pointer" size="lg" onClick={onCtaClick}>
          Ver Modelos
        </Button>
        <Button className="cursor-pointer" size="lg" variant="outline">
          Como Funciona
        </Button>
      </div>
    </section>
  );
}