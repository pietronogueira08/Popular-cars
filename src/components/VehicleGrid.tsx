"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { VehicleCard, VehicleCardSkeleton } from "@/components/VehicleCard";
import { useVehicles } from "@/context/VehicleContext";
import type { VehicleCategory } from "@/types/vehicle";

type FilterType = "todos" | VehicleCategory;

interface CategoryFilter {
  value: FilterType;
  label: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  bg: string;
}

const SuvIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l2-4h14l2 4" />
    <rect x="2" y="9" width="20" height="8" rx="2" />
    <circle cx="7" cy="19" r="2" />
    <circle cx="17" cy="19" r="2" />
    <path d="M5 17H3v-3" />
    <path d="M19 17h2v-3" />
  </svg>
);

const HatchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11l3-5h10l3 5" />
    <rect x="2" y="11" width="20" height="7" rx="1.5" />
    <circle cx="7" cy="20" r="1.8" />
    <circle cx="17" cy="20" r="1.8" />
    <path d="M7 6V4" />
    <path d="M17 6V4" />
  </svg>
);

const SedanIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l2.5-5h9L19 12" />
    <rect x="2" y="12" width="20" height="6" rx="1.5" />
    <circle cx="7" cy="20" r="1.8" />
    <circle cx="17" cy="20" r="1.8" />
    <path d="M2 15h2M20 15h2" />
  </svg>
);

const MotoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M8.5 17.5H15" />
    <path d="M15 17.5l-2-6h-3l-2 3" />
    <path d="M13 11.5l3-3h2l1 3" />
    <path d="M6 10l2 1.5" />
  </svg>
);

const PicapeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10l2-4h8l2 4" />
    <rect x="2" y="10" width="13" height="7" rx="1.5" />
    <rect x="15" y="13" width="7" height="4" rx="1" />
    <circle cx="7" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="M15 14V10" />
  </svg>
);

const UtilitarioIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="22" height="12" rx="2" />
    <circle cx="7" cy="20" r="2" />
    <circle cx="17" cy="20" r="2" />
    <path d="M9 6V3h6v3" />
    <path d="M1 12h22" />
  </svg>
);

const TuningIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const TodosIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v9l5 3" />
  </svg>
);

const categoryFilters: CategoryFilter[] = [
  {
    value: "todos",
    label: "Todos",
    icon: <TodosIcon />,
    color: "text-[#FFD700]",
    glow: "shadow-[0_0_20px_rgba(255,215,0,0.35)]",
    bg: "bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 border-[#FFD700]/50",
  },
  {
    value: "suv",
    label: "SUV",
    icon: <SuvIcon />,
    color: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.35)]",
    bg: "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/50",
  },
  {
    value: "hatch",
    label: "Hatch",
    icon: <HatchIcon />,
    color: "text-sky-400",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.35)]",
    bg: "bg-gradient-to-br from-sky-500/20 to-sky-500/5 border-sky-500/50",
  },
  {
    value: "sedan",
    label: "Sedan",
    icon: <SedanIcon />,
    color: "text-violet-400",
    glow: "shadow-[0_0_20px_rgba(167,139,250,0.35)]",
    bg: "bg-gradient-to-br from-violet-500/20 to-violet-500/5 border-violet-500/50",
  },
  {
    value: "moto",
    label: "Motos",
    icon: <MotoIcon />,
    color: "text-orange-400",
    glow: "shadow-[0_0_20px_rgba(251,146,60,0.35)]",
    bg: "bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/50",
  },
  {
    value: "picape",
    label: "Picapes",
    icon: <PicapeIcon />,
    color: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(248,113,113,0.35)]",
    bg: "bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/50",
  },
  {
    value: "utilitario",
    label: "Utilitários",
    icon: <UtilitarioIcon />,
    color: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.35)]",
    bg: "bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500/50",
  },
  {
    value: "tuning",
    label: "Tuning",
    icon: <TuningIcon />,
    color: "text-pink-400",
    glow: "shadow-[0_0_20px_rgba(244,114,182,0.35)]",
    bg: "bg-gradient-to-br from-pink-500/20 to-pink-500/5 border-pink-500/50",
  },
];

const priceRanges = [
  { label: "Todos os preços", min: 0, max: Infinity },
  { label: "Até R$ 50.000", min: 0, max: 50000 },
  { label: "R$ 50k – R$ 100k", min: 50000, max: 100000 },
  { label: "R$ 100k – R$ 200k", min: 100000, max: 200000 },
  { label: "Acima de R$ 200k", min: 200000, max: Infinity },
];

export function VehicleGrid() {
  const { vehicles, isLoaded } = useVehicles();
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [priceRange, setPriceRange] = useState(0);
  const [filterLoading, setFilterLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const isLoading = !isLoaded || filterLoading;

  const selectedPrice = priceRanges[priceRange];
  const filtered = vehicles
    .filter((v) => activeFilter === "todos" || v.category === activeFilter)
    .filter((v) => v.price >= selectedPrice.min && v.price <= selectedPrice.max);

  const activeCategory = categoryFilters.find((f) => f.value === activeFilter)!;

  const handleFilterChange = (f: FilterType) => {
    if (f === activeFilter) return;
    setFilterLoading(true);
    setActiveFilter(f);
    setTimeout(() => setFilterLoading(false), 350);
  };

  // Count per category
  const countFor = (val: FilterType) =>
    val === "todos"
      ? vehicles.length
      : vehicles.filter((v) => v.category === val).length;

  return (
    <section
      id="estoque"
      className="py-24 bg-[#0A0A0A] relative overflow-hidden"
      aria-labelledby="inventory-heading"
    >
      {/* Background subtle glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFD700]/3 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#FFD700] text-sm font-semibold tracking-widest uppercase font-body">
              Estoque Exclusivo
            </span>
            <h2
              id="inventory-heading"
              className="text-4xl md:text-5xl font-heading font-black text-white mt-2 section-title"
            >
              Nossos Veículos
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <motion.span
              key={filtered.length}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#6B6B6B] text-sm font-body"
            >
              {filtered.length} veículo{filtered.length !== 1 ? "s" : ""}{" "}
              encontrado{filtered.length !== 1 ? "s" : ""}
            </motion.span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 border border-[#2A2A2A] text-[#E0E0E0] px-4 py-2 min-h-[44px] rounded-lg text-sm font-body hover:border-[#FFD700]/40 transition-colors"
            >
              {showFilters ? (
                <X className="w-4 h-4" />
              ) : (
                <SlidersHorizontal className="w-4 h-4" />
              )}
              Filtros
            </button>
          </div>
        </div>

        {/* Price Filter */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-[#141414] rounded-2xl p-6 border border-[#2A2A2A]">
                <p className="text-[#6B6B6B] text-xs uppercase tracking-widest font-body mb-3">
                  Faixa de Preço
                </p>
                <div className="flex flex-nowrap overflow-x-auto snap-x scroll-smooth pb-4 hide-scrollbar gap-2">
                  {priceRanges.map((range, i) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange(i)}
                      className={`text-sm font-body px-4 py-2 min-h-[44px] whitespace-nowrap snap-start rounded-full border transition-all ${
                        priceRange === i
                          ? "filter-btn-active border-[#FFD700]"
                          : "border-[#2A2A2A] text-[#E0E0E0] hover:border-[#FFD700]/40"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Category Cards ─── */}
        <div className="mb-10">
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categoryFilters.map((cat, i) => {
              const isActive = activeFilter === cat.value;
              const count = countFor(cat.value);
              return (
                <motion.button
                  key={cat.value}
                  id={`filter-${cat.value}`}
                  onClick={() => handleFilterChange(cat.value)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden min-h-[90px] ${
                    isActive
                      ? `${cat.bg} ${cat.color} ${cat.glow}`
                      : "border-[#2A2A2A] bg-[#141414] text-[#6B6B6B] hover:border-[#3A3A3A] hover:text-[#E0E0E0]"
                  }`}
                >
                  {/* Animated background blob when active */}
                  {isActive && (
                    <motion.div
                      layoutId="category-bg"
                      className="absolute inset-0 rounded-2xl opacity-20"
                      style={{
                        background: "radial-gradient(circle at 50% 60%, currentColor 0%, transparent 70%)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <span className={`relative z-10 transition-all duration-300 ${isActive ? cat.color : ""}`}>
                    {cat.icon}
                  </span>

                  <span className="relative z-10 text-[11px] font-heading font-bold text-center leading-tight">
                    {cat.label}
                  </span>

                  {/* Count badge */}
                  <span
                    className={`relative z-10 text-[9px] font-body font-semibold px-1.5 py-0.5 rounded-full transition-all ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#2A2A2A] text-[#6B6B6B]"
                    }`}
                  >
                    {count}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="category-dot"
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Active category label strip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className={`mt-4 flex items-center gap-2 ${activeCategory.color}`}
            >
              <span className="w-4 h-4">{activeCategory.icon}</span>
              <span className="text-sm font-heading font-semibold">
                {activeCategory.label === "Todos"
                  ? "Todos os veículos"
                  : `Categoria: ${activeCategory.label}`}
              </span>
              <span className="text-[#6B6B6B] text-sm font-body">
                — {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-white font-heading font-bold text-xl mb-2">
              Nenhum veículo encontrado
            </p>
            <p className="text-[#6B6B6B] font-body">
              Tente outra categoria ou entre em contato conosco
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter + priceRange}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </motion.div>
        )}

        {/* CTA bottom */}
        <div className="text-center mt-16">
          <p className="text-[#6B6B6B] font-body mb-4">
            Não encontrou o veículo ideal? Fale conosco!
          </p>
          <a
            href={`https://wa.me/5522999822842?text=${encodeURIComponent("Olá! Não encontrei o veículo que procuro no site. Podem me ajudar?")}`}
            target="_blank"
            rel="noopener noreferrer"
            id="cta-not-found"
            className="inline-flex items-center gap-2 border border-[#FFD700]/40 text-[#FFD700] font-heading font-semibold px-8 py-3 rounded-full hover:bg-[#FFD700]/10 transition-all"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
