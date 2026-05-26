"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Wrench, Award, Handshake } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Veículos Vistoriados",
    description:
      "Todos os veículos passam por inspeção técnica completa antes de entrar no estoque.",
  },
  {
    icon: Wrench,
    title: "Garantia Motor e Câmbio",
    description:
      "Oferecemos garantia nos principais componentes mecânicos para sua tranquilidade.",
  },
  {
    icon: Award,
    title: "12 Anos de Mercado",
    description:
      "Uma década de história com milhares de clientes satisfeitos em toda a região.",
  },
  {
    icon: Handshake,
    title: "Troca Justa e Transparente",
    description:
      "Avaliação honesta do seu veículo com o melhor preço de troca do mercado.",
  },
];

export function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const badges = badgesRef.current?.querySelectorAll(".trust-item");
    if (badges && badges.length > 0) {
      gsap.fromTo(
        badges,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: badgesRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="py-24 bg-[#0A0A0A] relative overflow-hidden"
      aria-labelledby="trust-heading"
    >
      {/* Decorative bg element */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.04)_0%,_transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#FFD700] text-sm font-semibold tracking-widest uppercase font-body">
            Por que nos escolher
          </span>
          <h2
            id="trust-heading"
            className="text-4xl md:text-5xl font-heading font-black text-white mt-3 section-title mx-auto"
            style={{ display: "inline-block" }}
          >
            Procedência &amp; Garantia
          </h2>
          <p className="text-[#6B6B6B] mt-6 max-w-2xl mx-auto font-body text-lg">
            A Popular Veículos nasceu da paixão por carros e do compromisso com
            a honestidade. Cada veículo em nosso estoque tem história verificada
            e passa por rigorosa inspeção.
          </p>
        </div>

        {/* Trust badges */}
        <div
          ref={badgesRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="trust-item trust-badge rounded-2xl p-6 flex flex-col gap-4 cursor-default group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
                <item.icon className="w-6 h-6 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-[#6B6B6B] text-sm font-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-[#2A2A2A] pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-xl">
              PV
            </div>
            <div>
              <p className="font-heading font-bold text-white">
                Popular Veículos
              </p>
              <p className="text-[#6B6B6B] text-sm font-body">
                Referência em revenda na região
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Documentação Regularizada",
              "IPVA em Dia",
              "Sem Multas",
              "Histórico Verificado",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs font-body font-medium text-[#FFD700] border border-[#FFD700]/30 rounded-full px-4 py-1"
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
