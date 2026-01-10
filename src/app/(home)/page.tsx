"use client"
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CatalogPreview, PreviewItem } from "./_components/CatalogPreview";
import { HeroSection } from "./_components/HeroSection";

// Dados mockados (simulando o banco de dados)
// Em um cenário real, isso viria de um 'await getFeaturedConvites()' do Server Action
const FEATURED_ITEMS: PreviewItem[] = [
  {
    id: "1",
    title: "Casamento Clássico Floral",
    price: "R$ 5,90",
    imageUrl: "/placeholder-1.jpg"
  },
  {
    id: "2",
    title: "Minimalista Moderno",
    price: "R$ 4,50",
    imageUrl: "/placeholder-2.jpg"
  },
  {
    id: "3",
    title: "Rústico Chic",
    price: "R$ 6,20",
    imageUrl: "/placeholder-3.jpg"
  }
];

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 ">
        <HeroSection 
          title="Convites que contam a sua história"
          subtitle="Crie, personalize e encante seus convidados com a plataforma mais completa de design de convites."
          onCtaClick={async () => {
            console.log("Navegar para catálogo");
          }}
        />
        
        <div className="bg-slate-50 dark:bg-slate-950/50">
           <CatalogPreview items={FEATURED_ITEMS} />
        </div>
      </main>

      <Footer />
    </div>
  );
}