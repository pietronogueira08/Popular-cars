"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { VehicleCard, VehicleCardSkeleton } from "@/components/VehicleCard";
import { vehicles, getVehiclesByCategory } from "@/lib/vehicles";
import type { VehicleCategory } from "@/types/vehicle";

type FilterType = "todos" | VehicleCategory;

const filters: { value: FilterType; label: string; emoji: string }[] = [
  { value: "todos", label: "Todos", emoji: "🔥" },
  { value: "carro", label: "Carros", emoji: "🚗" },
  { value: "moto", label: "Motos", emoji: "🏍️" },
  { value: "tuning", label: "Tuning / Preparados", emoji: "⚡" },
];

const priceRanges = [
  { label: "Todos os preços", min: 0, max: Infinity },
  { label: "Até R$ 50.000", min: 0, max: 50000 },
  { label: "R$ 50k – R$ 100k", min: 50000, max: 100000 },
  { label: "R$ 100k – R$ 200k", min: 100000, max: 200000 },
  { label: "Acima de R$ 200k", min: 200000, max: Infinity },
];

export function VehicleGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [priceRange, setPriceRange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const selectedPrice = priceRanges[priceRange];
  const filtered = getVehiclesByCategory(activeFilter).filter(
    (v) => v.price >= selectedPrice.min && v.price <= selectedPrice.max
  );

  const handleFilterChange = (f: FilterType) => {
    setIsLoading(true);
    setActiveFilter(f);
    setTimeout(() => setIsLoading(false), 400);
  };

  return (
    <section
      id="estoque"
      className="py-24 bg-[#0A0A0A] relative"
      aria-labelledby="inventory-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
            <span className="text-[#6B6B6B] text-sm font-body">
              {filtered.length} veículo{filtered.length !== 1 ? "s" : ""}{" "}
              encontrado{filtered.length !== 1 ? "s" : ""}
            </span>
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

        {/* Filters */}
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

        {/* Category tabs */}
        <div className="flex flex-nowrap overflow-x-auto snap-x scroll-smooth pb-4 mb-6 hide-scrollbar gap-3">
          {filters.map((f) => (
            <button
              key={f.value}
              id={`filter-${f.value}`}
              onClick={() => handleFilterChange(f.value)}
              className={`flex items-center justify-center gap-2 text-sm font-heading font-semibold px-5 py-2.5 min-h-[44px] whitespace-nowrap snap-start rounded-full border transition-all duration-200 ${
                activeFilter === f.value
                  ? "filter-btn-active border-[#FFD700]"
                  : "border-[#2A2A2A] text-[#E0E0E0] hover:border-[#FFD700]/40 hover:text-[#FFD700]"
              }`}
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </button>
          ))}
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
            <p className="text-6xl mb-4">🚗</p>
            <p className="text-white font-heading font-bold text-xl mb-2">
              Nenhum veículo encontrado
            </p>
            <p className="text-[#6B6B6B] font-body">
              Tente ajustar os filtros ou entre em contato conosco
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter + priceRange}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
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
            href={`https://wa.me/5511999999999?text=${encodeURIComponent("Olá! Não encontrei o veículo que procuro no site. Podem me ajudar?")}`}
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
