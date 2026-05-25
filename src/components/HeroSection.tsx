"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Parallax on hero bg
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Split text reveal stagger
    const words1 = line1Ref.current?.querySelectorAll(".word");
    const words2 = line2Ref.current?.querySelectorAll(".word");

    const tl = gsap.timeline({ delay: 0.3 });
    if (words1 && words1.length > 0) {
      tl.fromTo(
        words1,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, stagger: 0.05, duration: 0.8, ease: "power3.out" }
      );
    }
    if (words2 && words2.length > 0) {
      tl.fromTo(
        words2,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, stagger: 0.04, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const splitWords = (text: string) =>
    text.split(" ").map((word, i) => (
      <span
        key={i}
        className="word inline-block overflow-hidden mr-[0.25em] last:mr-0"
        style={{ display: "inline-block" }}
      >
        <span className="word inline-block">{word}</span>
      </span>
    ));

  const scrollToInventory = () => {
    document.getElementById("estoque")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero — Popular Veículos"
    >
      {/* Background Image with Parallax */}
      <div ref={bgRef} className="absolute inset-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=85"
          alt="Carro esportivo em fundo escuro"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
      </div>

      {/* Gold accent line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD700]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        style={{ transformOrigin: "top" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="w-8 h-px bg-[#FFD700]" />
            <div className="relative h-12 w-48">
              <Image 
                src="/logo.png" 
                alt="Popular Veículos" 
                fill 
                className="object-contain object-left drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              />
            </div>
          </motion.div>

          {/* Headline */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white leading-[0.9] tracking-tight mb-6"
          >
            <span ref={line1Ref} className="block overflow-hidden">
              {splitWords("Sua Próxima")}
            </span>
            <span className="block overflow-hidden">
              <span className="gradient-text">
                {splitWords("Conquista")}
              </span>
            </span>
            <span ref={line2Ref} className="block overflow-hidden">
              {splitWords("Está Aqui.")}
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="text-[#E0E0E0] text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-body"
          >
            Especialistas em venda, revenda e avaliação justa na troca do seu
            veículo. Procedência garantida, transparência em cada negociação.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              id="hero-cta-estoque"
              onClick={scrollToInventory}
              className="group relative inline-flex items-center justify-center gap-3 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold text-base px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:bg-[#E6C200] hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            >
              <span className="relative z-10">Ver Estoque Exclusivo</span>
              <ChevronDown className="relative z-10 w-5 h-5 group-hover:animate-bounce" />
            </button>
            <button
              id="hero-cta-tradein"
              onClick={() =>
                document
                  .getElementById("avaliacao")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center justify-center gap-2 border border-[#FFD700]/40 text-[#FFD700] font-heading font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 hover:bg-[#FFD700]/10 hover:border-[#FFD700]"
            >
              Avaliar Meu Veículo
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex gap-8 mt-16 pt-8 border-t border-white/10"
          >
            {[
              { value: "847+", label: "Veículos Vendidos" },
              { value: "12 anos", label: "No Mercado" },
              { value: "100%", label: "Satisfação" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[#FFD700] font-heading font-black text-2xl">
                  {stat.value}
                </p>
                <p className="text-[#6B6B6B] text-xs font-body mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToInventory}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6B6B6B] hover:text-[#FFD700] transition-colors"
      >
        <span className="text-xs tracking-widest uppercase font-body">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
