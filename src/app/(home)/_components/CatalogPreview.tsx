'use client'

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface PreviewItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
}

interface CatalogPreviewProps {
  items: PreviewItem[];
}

export function CatalogPreview({ items }: CatalogPreviewProps) {
  return (
    <section className="container py-12 px-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Destaques</h2>
        <Button className="cursor-pointer" variant="link">Ver todos &rarr;</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-muted">
              {/* Usando uma div cinza como placeholder se não tiver imagem real */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-slate-100">
                 Image: {item.title}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
              <span className="font-semibold">{item.price}</span>
              <Button variant="secondary" size="sm">Personalizar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}