"use client"
import { Footer } from "@/components/layout/Footer";
import { ProductCard, Props } from "@/components/common/ProductCard";
import Hero from "./_components/HeroSection";
import Link from "next/link";
import Designers from "./_components/Designers";
import HowItWorks from "./_components/HowItWorks";
import Testimonials from "./_components/Testimonials";
import Categories from "./_components/Categories";
import Occasions from "./_components/Occasions";
import Collections from "./_components/Collections";
import Journal from "./_components/Journal";

// FIXME: Dados mockados (simulando o banco de dados)
// Em um cenário real, isso viria de um 'await getFeaturedConvites()' do Server Action
const FEATURED_ITEMS: Props[] = [
  {
    id: "1",
    title: "Convite Clássico Monograma",
    price: "R$ 1,00",
    image: "/images/invitation-suite.jpg",
  },
  {
    id: "2",
    title: "Convite Minimal Serif",
    price: "R$ 1,00",
    image: "/images/art-print.jpg"
  },
  {
    id: "3",
    title: "Convite Floral Aquarela",
    price: "R$ 1,00",
    image: "/images/greeting-cards.jpg"
  }
];

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 ">
        <Hero/>

      <section id="produtos" className="container mx-auto py-16">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">Destaques</h2>
          <p className="text-muted-foreground">Seleção especial com acabamento premium</p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCard items={FEATURED_ITEMS} />
          {/*  {loading ? (*/}
        {/*      // Loading skeleton*/}
        {/*      Array.from({ length: 3 }).map((_, i) => (*/}
        {/*          <div key={i} className="glass-card rounded-xl p-6 animate-pulse">*/}
        {/*            <div className="bg-muted rounded-lg aspect-square mb-4"></div>*/}
        {/*            <div className="bg-muted h-4 w-3/4 mb-2 rounded"></div>*/}
        {/*            <div className="bg-muted h-4 w-1/2 rounded"></div>*/}
        {/*          </div>*/}
        {/*      ))*/}
        {/*  ) : (*/}
        {/*      featuredProducts.map((product) => (*/}
        {/*          <ProductCard*/}
        {/*              key={product.id}*/}
        {/*              id={product.id}*/}
        {/*              image={product.image}*/}
        {/*              title={product.title}*/}
        {/*              price={formatPrice(product.price)}*/}
        {/*              href={`/convites/${product.slug}`}*/}
        {/*          />*/}
        {/*      ))*/}
        {/*  )}*/}
        </div>
        <div className="mt-10">
          <Link href="/loja" className="story-link text-primary">
            Ver tudo na Loja
          </Link>
        </div>
      </section>

        <Categories />
        <Occasions />
        <Collections />
        <Designers />
        <HowItWorks />
        <Testimonials />
        <Journal />
      <Footer />
      </main>
    </div>
  );
}