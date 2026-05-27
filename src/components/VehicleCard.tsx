"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Gauge, Calendar, MapPin, Zap, ChevronRight, Images } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import { formatPrice, formatMileage } from "@/lib/vehicles";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

const statusLabel = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

export function VehicleCard({ vehicle, index = 0 }: VehicleCardProps) {
  const router = useRouter();
  const whatsappUrl = buildWhatsAppUrl(vehicle);

  // Use first of images[] or fallback to image
  const mainImage = vehicle.images?.find(Boolean) ?? vehicle.image;
  const totalImages = vehicle.images?.filter(Boolean).length ?? (vehicle.image ? 1 : 0);

  const handleInterest = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    router.push(`/veiculo/${vehicle.slug}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={handleCardClick}
      className={`relative bg-[#141414] rounded-2xl overflow-hidden border border-[#2A2A2A] card-glow transition-all duration-300 flex flex-col cursor-pointer ${
        vehicle.highlighted ? "card-highlighted" : ""
      }`}
      style={{ transformOrigin: "center" }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={mainImage || "/placeholder.png"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay gradient on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

        {/* Multiple photos indicator */}
        {totalImages > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-body px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
            <Images className="w-3 h-3" />
            {totalImages}
          </div>
        )}

        {/* Badges row */}
        <div className="absolute top-3 left-3 flex gap-2">
          {vehicle.stage && (
            <span className="stage-badge">{vehicle.stage}</span>
          )}
          {vehicle.highlighted && !vehicle.stage && (
            <span className="bg-[#FFD700] text-[#0A0A0A] text-[10px] font-heading font-black px-2 py-0.5 rounded uppercase tracking-wide">
              Destaque
            </span>
          )}
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-body font-semibold px-2 py-1 rounded-full status-${vehicle.status}`}
          >
            {statusLabel[vehicle.status]}
          </span>
        </div>

        {/* Category chip */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/60 backdrop-blur-sm text-[#E0E0E0] text-[10px] font-body px-2 py-0.5 rounded-full uppercase tracking-wide">
            {vehicle.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Brand + Model */}
        <div>
          <p className="text-[#6B6B6B] text-xs font-body uppercase tracking-wider mb-1">
            {vehicle.brand}
          </p>
          <h3 className="font-heading font-bold text-white text-lg leading-tight">
            {vehicle.model}
          </h3>
        </div>

        {/* Specs row */}
        <div className="flex flex-wrap gap-3 text-[#6B6B6B] text-xs font-body">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {vehicle.year}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3" /> {formatMileage(vehicle.mileage)}
          </span>
          {vehicle.fuel && (
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> {vehicle.fuel}
            </span>
          )}
          {vehicle.color && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {vehicle.color}
            </span>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5">
          {vehicle.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[10px] text-[#6B6B6B] border border-[#2A2A2A] rounded px-2 py-0.5 font-body"
            >
              {f}
            </span>
          ))}
          {vehicle.features.length > 3 && (
            <span className="text-[10px] text-[#FFD700] font-body">
              +{vehicle.features.length - 3} mais
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-[#2A2A2A]">
          <div>
            <p className="text-[#6B6B6B] text-[10px] font-body mb-0.5">
              Preço
            </p>
            <p className="text-[#FFD700] font-heading font-black text-2xl">
              {formatPrice(vehicle.price)}
            </p>
          </div>

          <motion.button
            id={`whatsapp-${vehicle.id}`}
            onClick={handleInterest}
            disabled={vehicle.status === "vendido"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold text-sm px-4 py-2.5 min-h-[44px] min-w-[44px] rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E6C200] shadow-[0_4px_15px_rgba(255,215,0,0.3)]"
          >
            Tenho Interesse
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

// Skeleton loader
export function VehicleCardSkeleton() {
  return (
    <div className="bg-[#141414] rounded-2xl overflow-hidden border border-[#2A2A2A]">
      <div className="aspect-[16/10] skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-3 skeleton rounded w-1/3" />
        <div className="h-5 skeleton rounded w-2/3" />
        <div className="flex gap-3">
          <div className="h-3 skeleton rounded w-16" />
          <div className="h-3 skeleton rounded w-20" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 skeleton rounded w-16" />
          <div className="h-5 skeleton rounded w-20" />
        </div>
        <div className="flex justify-between items-end pt-3 border-t border-[#2A2A2A]">
          <div className="h-8 skeleton rounded w-28" />
          <div className="h-10 skeleton rounded w-36" />
        </div>
      </div>
    </div>
  );
}
