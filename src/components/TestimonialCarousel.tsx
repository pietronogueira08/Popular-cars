"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Carlos Eduardo",
    location: "São Paulo, SP",
    avatar: "CE",
    rating: 5,
    text: "Comprei meu Hyundai ix35 na Popular Veículos e fiquei impressionado com a transparência. Veículo exatamente como descrito, documentação em dia. Recomendo demais!",
    vehicle: "Hyundai ix35 2020",
    date: "Março 2025",
  },
  {
    id: 2,
    name: "Fernanda Oliveira",
    location: "Campinas, SP",
    avatar: "FO",
    rating: 5,
    text: "Fiz a troca da minha moto na Popular e recebi um valor justo. O processo foi rápido, sem burocracia. Saí com a Africa Twin na mesma semana! Atendimento impecável.",
    vehicle: "Honda Africa Twin 2023",
    date: "Janeiro 2025",
  },
  {
    id: 3,
    name: "Ricardo Mendes",
    location: "Santo André, SP",
    avatar: "RM",
    rating: 5,
    text: "Sempre fui desconfiado de revendas, mas a Popular Veículos mudou minha visão. Tudo dentro da lei, vistoria apresentada antes de comprar. É de confiar!",
    vehicle: "Toyota Hilux 2021",
    date: "Fevereiro 2025",
  },
  {
    id: 4,
    name: "Amanda Santos",
    location: "Osasco, SP",
    avatar: "AS",
    rating: 5,
    text: "Encontrei meu Polo GTS no site e fui pessoalmente. O carro era ainda melhor do que nas fotos. O time de vendas é super atencioso e honesto. Nota 10!",
    vehicle: "VW Polo GTS 2022",
    date: "Abril 2025",
  },
  {
    id: 5,
    name: "Paulo Henrique",
    location: "Guarulhos, SP",
    avatar: "PH",
    rating: 5,
    text: "Aproveito para elogiar o time todo. Comprei meu Gol preparado Stage 2 e ficou melhor do que esperava. Garantia honrada, suporte pós-venda presente. Top demais!",
    vehicle: "Gol AP 1.8 Forjado Stage 2",
    date: "Maio 2025",
  },
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prev = () => {
    stopAutoplay();
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
    startAutoplay();
  };

  const next = () => {
    stopAutoplay();
    setCurrent((c) => (c + 1) % testimonials.length);
    startAutoplay();
  };

  const t = testimonials[current];

  return (
    <section
      id="depoimentos"
      className="py-24 bg-[#0A0A0A] relative"
      aria-labelledby="testimonials-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.03)_0%,_transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#FFD700] text-sm font-semibold tracking-widest uppercase font-body">
            Clientes
          </span>
          <h2
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-heading font-black text-white mt-3"
          >
            O Que Dizem Sobre Nós
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000) {
                  next();
                } else if (swipe > 10000) {
                  prev();
                }
              }}
              className="bg-[#141414] rounded-2xl p-8 border border-[#2A2A2A] relative touch-pan-y"
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-8 text-[#FFD700]/10 font-heading font-black text-8xl leading-none select-none">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#FFD700] text-[#FFD700]"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-[#E0E0E0] font-body text-lg leading-relaxed mb-8 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white">
                      {t.name}
                    </p>
                    <p className="text-[#6B6B6B] text-xs font-body">
                      {t.location} · {t.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#6B6B6B] text-xs font-body">Comprou</p>
                  <p className="text-[#FFD700] text-xs font-heading font-semibold">
                    {t.vehicle}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 h-2 bg-[#FFD700]"
                      : "w-2 h-2 bg-[#2A2A2A] hover:bg-[#6B6B6B]"
                  }`}
                  aria-label={`Depoimento ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                id="testimonial-prev"
                className="w-10 h-10 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#E0E0E0] hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                id="testimonial-next"
                className="w-10 h-10 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#E0E0E0] hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
