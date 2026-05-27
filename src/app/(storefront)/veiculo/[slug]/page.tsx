"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft, Gauge, Calendar, MapPin, Zap, ChevronLeft,
  ChevronRight, Share2, MessageCircle, Check,
} from "lucide-react";
import { useVehicles } from "@/context/VehicleContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice, formatMileage } from "@/lib/vehicles";

const statusLabel: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

const categoryLabel: Record<string, string> = {
  suv: "SUV",
  hatch: "Hatch",
  sedan: "Sedan",
  moto: "Moto",
  utilitario: "Utilitário",
  picape: "Picape",
  tuning: "Tuning / Preparado",
};

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { vehicles, isLoaded } = useVehicles();
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0] ?? "";
  const vehicle = vehicles.find((v) => v.slug === slug);

  // All images: prefer `images` array, fallback to `image`
  const allImages: string[] =
    vehicle?.images?.filter(Boolean).length
      ? vehicle.images!.filter(Boolean)
      : vehicle?.image
      ? [vehicle.image]
      : [];

  // Reset image index when vehicle changes
  useEffect(() => { setActiveImg(0); }, [slug]);

  const prev = () => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length);
  const next = () => setActiveImg((i) => (i + 1) % allImages.length);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-6xl">🔍</p>
        <h1 className="text-white font-heading font-black text-2xl">Veículo não encontrado</h1>
        <p className="text-[#6B6B6B] font-body">Este veículo pode ter sido removido do estoque.</p>
        <button
          onClick={() => router.push("/#estoque")}
          className="mt-4 flex items-center gap-2 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold px-6 py-3 rounded-xl hover:bg-[#E6C200] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver Estoque
        </button>
      </div>
    );
  }

  const waUrl = buildWhatsAppUrl(vehicle);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#FFD700] font-body text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar ao estoque
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ─── Gallery ─── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#141414] border border-[#2A2A2A]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  {allImages[activeImg] ? (
                    <Image
                      src={allImages[activeImg]}
                      alt={`${vehicle.brand} ${vehicle.model} — foto ${activeImg + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized={allImages[activeImg].startsWith("data:")}
                      priority={activeImg === 0}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#2A2A2A]">
                      <span className="text-6xl">🚗</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Gradient overlay bottom */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-body px-2.5 py-1 rounded-full border border-white/10">
                  {activeImg + 1} / {allImages.length}
                </div>
              )}

              {/* Status badge */}
              <div className="absolute top-3 left-3">
                <span className={`text-xs font-body font-semibold px-3 py-1.5 rounded-full status-${vehicle.status}`}>
                  {statusLabel[vehicle.status]}
                </span>
              </div>

              {/* Stage badge */}
              {vehicle.stage && (
                <div className="absolute top-3 right-3">
                  <span className="stage-badge">{vehicle.stage}</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? "border-[#FFD700] scale-105"
                        : "border-[#2A2A2A] opacity-60 hover:opacity-100 hover:border-[#FFD700]/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Miniatura ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized={img.startsWith("data:")}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Details ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Brand / Model / Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#6B6B6B] text-xs font-body uppercase tracking-widest">{vehicle.brand}</span>
                <span className="text-[#2A2A2A]">•</span>
                <span className="text-[#FFD700] text-xs font-body uppercase tracking-widest">
                  {categoryLabel[vehicle.category] ?? vehicle.category}
                </span>
              </div>
              <h1 className="font-heading font-black text-white text-3xl md:text-4xl leading-tight">
                {vehicle.model}
              </h1>
              <p className="text-[#FFD700] font-heading font-black text-3xl md:text-4xl mt-2">
                {formatPrice(vehicle.price)}
              </p>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Calendar, label: "Ano", value: vehicle.year.toString() },
                { icon: Gauge, label: "Quilometragem", value: formatMileage(vehicle.mileage) },
                ...(vehicle.fuel ? [{ icon: Zap, label: "Combustível", value: vehicle.fuel }] : []),
                ...(vehicle.color ? [{ icon: MapPin, label: "Cor", value: vehicle.color }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[#141414] rounded-xl p-4 border border-[#2A2A2A]">
                  <p className="text-[#6B6B6B] text-xs font-body mb-1 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </p>
                  <p className="text-white font-heading font-bold text-sm">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-[#141414] rounded-xl p-5 border border-[#2A2A2A]">
                <p className="text-[#6B6B6B] text-xs font-body uppercase tracking-wider mb-2">Descrição</p>
                <p className="text-[#E0E0E0] font-body text-sm leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* Features */}
            {vehicle.features.length > 0 && (
              <div>
                <p className="text-[#6B6B6B] text-xs font-body uppercase tracking-wider mb-3">Opcionais & Equipamentos</p>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 text-xs text-[#E0E0E0] border border-[#2A2A2A] bg-[#141414] rounded-lg px-3 py-1.5 font-body">
                      <Check className="w-3 h-3 text-[#FFD700]" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#FFD700] text-[#0A0A0A] font-heading font-black text-base px-6 py-4 rounded-xl hover:bg-[#E6C200] transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(255,215,0,0.35)] active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                Tenho Interesse
              </a>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 border border-[#2A2A2A] text-[#E0E0E0] hover:border-[#FFD700]/40 hover:text-[#FFD700] font-body text-sm px-5 py-4 rounded-xl transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                {copied ? "Link copiado!" : "Compartilhar"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
