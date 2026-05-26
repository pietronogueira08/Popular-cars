import { HeroSection } from "@/components/HeroSection";
import { TrustSection } from "@/components/TrustSection";
import { StatsCounter } from "@/components/StatsCounter";
import { VehicleGrid } from "@/components/VehicleGrid";
import { TestimonialSection } from "@/components/TestimonialSection";
import { TradeInValuation } from "@/components/TradeInValuation";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Popular Veículos — Sua Próxima Conquista Está Aqui",
  description:
    "Especialistas em venda, revenda e avaliação justa na troca do seu veículo. Confira nosso estoque exclusivo de carros e motos.",
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustSection />
      <StatsCounter />
      <VehicleGrid />
      <TradeInValuation />
      <TestimonialSection />
      <Footer />
    </main>
  );
}
