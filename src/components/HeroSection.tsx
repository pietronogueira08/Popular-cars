"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowRight } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

import type { Variants } from "framer-motion";

// Stagger container and item variants for Framer Motion
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax on hero bg — Desktop only
    if (bgRef.current && window.innerWidth >= 768) {
      gsap.to(bgRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scrollToInventory = () => {
    document.getElementById("estoque")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTradeIn = () => {
    document.getElementById("avaliacao")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero — Popular Veículos"
    >
      {/* ── Cinematic Background ── */}
      <div ref={bgRef} className="absolute inset-0 scale-110">
        <Image
          src="/hero-car.jpg"
          alt="Veículo premium Popular Veículos"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Multi-layer dark overlays for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        {/* Radial vignette for focus */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)" }}
        />
      </div>

      {/* ── Gold Accent Lines ── */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[#FFD700] to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
        style={{ transformOrigin: "top" }}
      />

      {/* ── Hero Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-12 w-full">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Badge */}
          <motion.div variants={badgeVariants} className="inline-flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-[#FFD700]" />
            <span className="text-[#FFD700] font-body text-xs tracking-[0.25em] uppercase font-semibold">
              Especialistas em Veículos Premium
            </span>
          </motion.div>

          {/* ── Headline (stagger per line) ── */}
          <motion.h1
            className="font-heading font-black leading-[0.92] tracking-tight mb-7"
            variants={itemVariants}
          >
            <span className="block text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Encontre
            </span>
            <span className="block text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Sua Próxima
            </span>
            <span
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              style={{
                color: "#FFD700",
                textShadow: "0 0 60px rgba(255,215,0,0.3)",
                fontWeight: 800,
              }}
            >
              Conquista.
            </span>
          </motion.h1>

          {/* ── Subheadline ── */}
          <motion.p
            variants={itemVariants}
            className="text-[#F3F4F6] text-base sm:text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-body"
          >
            Especialistas em venda, revenda e avaliação justa na troca do seu
            veículo. Procedência garantida, transparência em cada negociação.
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Primary CTA */}
            <motion.button
              id="hero-cta-estoque"
              onClick={scrollToInventory}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,215,0,0.45)" }}
              whileTap={{ scale: 0.96 }}
              className="group relative inline-flex items-center justify-center gap-3 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold text-base px-8 py-4 min-h-[52px] rounded-full overflow-hidden transition-colors duration-200 hover:bg-[#FFE44D] shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 font-black">Ver Estoque</span>
              <ChevronDown className="relative z-10 w-5 h-5 transition-transform group-hover:translate-y-1" />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              id="hero-cta-tradein"
              onClick={scrollToTradeIn}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,215,0,0.08)" }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 border border-[#FFD700]/50 text-[#FFD700] font-heading font-semibold text-base px-8 py-4 min-h-[52px] rounded-full transition-all duration-200 hover:border-[#FFD700]"
            >
              Avaliar Meu Usado
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* ── Stats row ── */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10"
          >
            {[
              { value: "847+", label: "Veículos Vendidos" },
              { value: "12 anos", label: "No Mercado" },
              { value: "100%", label: "Satisfação Garantida" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[#FFD700] font-heading font-black text-2xl md:text-3xl"
                  style={{ textShadow: "0 0 20px rgba(255,215,0,0.2)" }}>
                  {stat.value}
                </p>
                <p className="text-[#6B6B6B] text-xs font-body mt-1 tracking-wider uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.button
        onClick={scrollToInventory}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6B6B6B] hover:text-[#FFD700] transition-colors group"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-body">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
