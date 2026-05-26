"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ShieldCheck, Quote } from "lucide-react";
import Image from "next/image";
import { useTestimonials } from "@/context/TestimonialContext";
import { Testimonial } from "@/types/testimonial";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "fill-[#FFD700] text-[#FFD700]"
              : "fill-[#2A2A2A] text-[#2A2A2A]"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Single Card ──────────────────────────────────────────────────────────────
function TestimonialCard({
  t,
  index,
}: {
  t: Testimonial;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="relative rounded-2xl border border-[#2A2A2A] bg-[#141414]/80 backdrop-blur-sm p-6 flex flex-col gap-4 hover:border-[#FFD700]/30 transition-colors duration-300 group"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFD700]/0 to-[#FFD700]/0 group-hover:from-[#FFD700]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

      {/* Quote icon */}
      <div className="absolute top-5 right-5 text-[#FFD700]/10 group-hover:text-[#FFD700]/20 transition-colors duration-300">
        <Quote className="w-10 h-10" />
      </div>

      {/* Top row: stars + badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <StarRating rating={t.rating} />
        <span className="flex items-center gap-1.5 text-[10px] font-body font-semibold tracking-wide text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3 h-3" />
          Cliente Verificado
        </span>
      </div>

      {/* Vehicle tag */}
      <div>
        <span className="inline-flex items-center text-[11px] font-heading font-bold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-3 py-1.5 rounded-full tracking-wide">
          {t.vehicle_info}
        </span>
      </div>

      {/* Testimonial text */}
      <p className="text-[#C0C0C0] font-body text-sm leading-relaxed flex-1">
        &ldquo;{t.text_content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#2A2A2A]">
        {/* Avatar */}
        <div className="relative w-11 h-11 rounded-full flex-shrink-0 ring-2 ring-[#FFD700]/40 ring-offset-2 ring-offset-[#141414]">
          {t.avatar_url ? (
            <Image
              src={t.avatar_url}
              alt={t.client_name}
              fill
              className="object-cover rounded-full"
              sizes="44px"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-xs">
              {getInitials(t.client_name)}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="font-heading font-bold text-white text-sm truncate">
            {t.client_name}
          </p>
          {t.location && (
            <p className="text-[#6B6B6B] text-xs font-body truncate">
              {t.location}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414]/80 p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-4 h-4 bg-[#2A2A2A] rounded" />
        ))}
      </div>
      <div className="h-6 w-48 bg-[#2A2A2A] rounded-full" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-[#2A2A2A] rounded w-full" />
        <div className="h-3 bg-[#2A2A2A] rounded w-5/6" />
        <div className="h-3 bg-[#2A2A2A] rounded w-4/6" />
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-[#2A2A2A]">
        <div className="w-11 h-11 rounded-full bg-[#2A2A2A]" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-[#2A2A2A] rounded" />
          <div className="h-2.5 w-20 bg-[#2A2A2A] rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function TestimonialSection() {
  const { publicTestimonials, loadingPublic } = useTestimonials();

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="depoimentos"
      className="py-24 bg-[#0A0A0A] relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.04)_0%,_transparent_65%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="text-[#FFD700] text-xs font-semibold tracking-[0.3em] uppercase font-body">
            Depoimentos Reais
          </span>
          <h2
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-heading font-black text-white mt-3"
          >
            O Que Nossos Clientes{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">
              Dizem
            </span>
          </h2>
          <p className="text-[#6B6B6B] font-body mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Mais de 500 clientes satisfeitos. Confira relatos reais de quem já
            passou pela nossa loja e transformou sua vida com um veículo dos
            sonhos.
          </p>

          {/* Stats bar */}
          <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
            {[
              { label: "Avaliações", value: "500+" },
              { label: "Nota Média", value: "4.9★" },
              { label: "Clientes Indicam", value: "98%" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-heading font-black text-[#FFD700]">
                  {s.value}
                </p>
                <p className="text-xs text-[#6B6B6B] font-body uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Masonry Grid */}
        {loadingPublic ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-5">
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : publicTestimonials.length === 0 ? (
          <div className="text-center py-16 text-[#6B6B6B] font-body">
            Nenhum depoimento disponível no momento.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {publicTestimonials.map((t, i) => (
              <div key={t.id} className="break-inside-avoid mb-5">
                <TestimonialCard t={t} index={i} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-14"
        >
          <p className="text-[#6B6B6B] font-body text-sm">
            Quer compartilhar sua experiência?{" "}
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFD700] hover:underline font-semibold"
            >
              Fale com a gente no WhatsApp
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
