"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import {
  Search,
  Shield,
  Clock,
  ArrowLeftRight,
} from "lucide-react";

// ─── Carbon-fibre texture (SVG data-URI, dark weave pattern) ────────────────
const CARBON_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23111111'/%3E%3Crect x='4' width='4' height='4' fill='%230D0D0D'/%3E%3Crect y='4' width='4' height='4' fill='%230D0D0D'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23111111'/%3E%3C/svg%3E")`;

// ─── Card data ───────────────────────────────────────────────────────────────
const trustItems = [
  {
    id: "vistoria",
    Icon: Search,
    title: "Veículos Vistoriados",
    description:
      "Inspeção técnica completa com laudo de 50 pontos. Nenhum veículo entra no estoque sem sair de nossa bancada de diagnóstico.",
    tag: "Inspeção Técnica",
    large: true, // spans 2 rows on desktop
  },
  {
    id: "garantia",
    Icon: Shield,
    title: "Garantia Motor & Câmbio",
    description:
      "Cobertura real nos principais componentes mecânicos. Sua tranquilidade começa na assinatura do contrato.",
    tag: "Cobertura Inclusa",
    large: false,
  },
  {
    id: "historia",
    Icon: Clock,
    title: "12 Anos de Mercado",
    description:
      "Uma década de tradição, milhares de clientes satisfeitos e reputação construída sem atalhos.",
    tag: "Tradição & Confiança",
    large: false,
  },
  {
    id: "troca",
    Icon: ArrowLeftRight,
    title: "Troca Justa & Transparente",
    description:
      "Avaliação honesta baseada em tabela FIPE e estado real do veículo. Zero lero-lero, preço justo na hora.",
    tag: "Negociação Limpa",
    large: true, // spans 2 rows on desktop
  },
];

// ─── Framer-Motion variants ──────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -32, y: 24 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } },
};

// ─── Verification tags ───────────────────────────────────────────────────────
const verifiedTags = [
  "Documentação Regularizada",
  "IPVA em Dia",
  "Sem Multas",
  "Histórico Verificado",
];

// ─── Individual Card ─────────────────────────────────────────────────────────
function TrustCard({
  item,
}: {
  item: (typeof trustItems)[number];
}) {
  const { Icon, title, description, tag, large, id } = item;

  return (
    <motion.div
      id={`trust-card-${id}`}
      variants={cardVariants}
      whileHover="hover"
      className={`relative rounded-2xl overflow-hidden cursor-default select-none
        ${large ? "lg:row-span-2" : ""}`}
      style={{
        // Carbon-fibre base + glass layer
        background: `linear-gradient(135deg, rgba(18,18,18,0.97) 0%, rgba(10,10,10,0.99) 100%), ${CARBON_BG}`,
        backgroundBlendMode: "overlay",
        border: "1px solid rgba(255,215,0,0.18)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* ── Gold top-edge accent line ── */}
      <motion.div
        className="absolute top-0 left-6 right-6 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, #FFD700, transparent)" }}
        variants={{
          hover: { scaleX: 1.15, opacity: 1 },
        }}
        initial={{ opacity: 0.45 }}
        transition={{ duration: 0.35 }}
      />

      {/* ── Border glow on hover ── */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        variants={{
          hover: {
            boxShadow: "0 0 0 1px rgba(255,215,0,0.65), 0 0 40px rgba(255,215,0,0.12)",
          },
        }}
        initial={{ boxShadow: "0 0 0 1px rgba(255,215,0,0.18)" }}
        transition={{ duration: 0.35 }}
      />

      {/* ── Subtle radial spotlight ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(255,215,0,0.05) 0%, transparent 65%)",
        }}
      />

      {/* ── Content ── */}
      <div className={`relative z-10 flex flex-col gap-5 ${large ? "p-8 h-full" : "p-7"}`}>
        {/* Icon container */}
        <motion.div
          className="relative w-14 h-14 flex items-center justify-center rounded-xl"
          style={{
            background: "rgba(255,215,0,0.07)",
            border: "1px solid rgba(255,215,0,0.22)",
          }}
          variants={{
            hover: { scale: 1.1, rotate: 6 },
          }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <Icon
            strokeWidth={1.25}
            className="w-6 h-6 text-[#FFD700]"
          />
          {/* Glow behind icon */}
          <div className="absolute inset-0 rounded-xl"
            style={{ boxShadow: "0 0 18px rgba(255,215,0,0.15)" }}
          />
        </motion.div>

        {/* Tag pill */}
        <span
          className="self-start text-[10px] font-body font-bold tracking-[0.22em] uppercase"
          style={{
            color: "rgba(255,215,0,0.62)",
            letterSpacing: "0.22em",
          }}
        >
          ◆ {tag}
        </span>

        {/* Title */}
        <h3
          className="font-heading font-black text-xl leading-tight"
          style={{ color: "#FFD700", textShadow: "0 0 24px rgba(255,215,0,0.18)" }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="font-body text-sm leading-relaxed"
          style={{ color: "#E0E0E0" }}
        >
          {description}
        </p>

        {/* Bottom divider for large cards */}
        {large && (
          <div className="mt-auto pt-5 border-t border-white/[0.06]">
            <span
              className="text-[10px] font-body tracking-widest uppercase"
              style={{ color: "rgba(255,215,0,0.35)" }}
            >
              Popular Veículos · Padrão de Excelência
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#000000" }}
      aria-labelledby="trust-heading"
    >
      {/* ── Deep radial ambient glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(255,215,0,0.045) 0%, transparent 70%)",
        }}
      />

      {/* ── Subtle scanline overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.6) 2px, rgba(255,255,255,0.6) 3px)",
        }}
      />

      {/* ── Vertical gold accent line — left ── */}
      <motion.div
        className="absolute left-0 top-1/4 bottom-1/4 w-[2px]"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(255,215,0,0.5), transparent)",
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={headerInView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <motion.div
          ref={headerRef}
          className="text-center mb-20"
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
        >
          {/* Lead-in tag */}
          <motion.span
            className="inline-block font-body font-bold text-[10px] mb-5"
            style={{
              color: "#FFD700",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0, y: -12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            ◆ &nbsp; Por que nos escolher &nbsp; ◆
          </motion.span>

          {/* Headline */}
          <motion.h2
            id="trust-heading"
            className="font-heading font-black leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2 }}
          >
            <span style={{ color: "#FFFFFF" }}>Procedência &amp;&nbsp;</span>
            <span
              style={{
                color: "#FFD700",
                textShadow: "0 0 60px rgba(255,215,0,0.3)",
              }}
            >
              Garantia
            </span>
          </motion.h2>

          {/* Gold rule */}
          <motion.div
            className="mx-auto mt-6 mb-7 h-[1px] w-24"
            style={{
              background: "linear-gradient(90deg, transparent, #FFD700, transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={headerInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
          />

          {/* Subtitle */}
          <motion.p
            className="font-body text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#F3F4F6" }}
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            A Popular Veículos nasceu da paixão. Cada veículo em nosso estoque
            passa por uma vistoria rigorosa para garantir{" "}
            <em style={{ color: "#FFD700", fontStyle: "normal", fontWeight: 600 }}>
              transparência e honestidade
            </em>
            .
          </motion.p>
        </motion.div>

        {/* ══ ASYMMETRIC GRID ═════════════════════════════════════════════════ */}
        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
        >
          {/*
            Desktop layout:
              col 1 rows 1-2 → "Vistoriados"   (large, span 2 rows, col 1)
              col 2 row 1    → "Garantia"       (normal)
              col 2 row 2    → "12 Anos"        (normal)
              col 3 rows 1-2 → "Troca"          (large, span 2 rows, col 3)
          */}

          {/* Card 1 – large – col1 row1-2 */}
          <div className="lg:row-span-2 lg:col-start-1 lg:row-start-1">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="relative rounded-2xl overflow-hidden cursor-default select-none h-full"
              style={{
                background: `linear-gradient(135deg, rgba(18,18,18,0.97) 0%, rgba(10,10,10,0.99) 100%), ${CARBON_BG}`,
                backgroundBlendMode: "overlay",
                border: "1px solid rgba(255,215,0,0.18)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                minHeight: "380px",
              }}
            >
              <CardGlowElements />
              <div className="relative z-10 p-8 flex flex-col gap-5 h-full">
                <IconBox Icon={Search} />
                <PillTag>Inspeção Técnica</PillTag>
                <CardTitle>Veículos Vistoriados</CardTitle>
                <CardBody>
                  Inspeção técnica completa com laudo de 50 pontos. Nenhum
                  veículo entra no estoque sem sair de nossa bancada de
                  diagnóstico.
                </CardBody>
                <div className="mt-auto pt-6 border-t border-white/[0.06]">
                  <FooterTag />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Card 2 – normal – col2 row1 */}
          <div className="lg:col-start-2 lg:row-start-1">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="relative rounded-2xl overflow-hidden cursor-default select-none"
              style={{
                background: `linear-gradient(135deg, rgba(18,18,18,0.97) 0%, rgba(10,10,10,0.99) 100%), ${CARBON_BG}`,
                backgroundBlendMode: "overlay",
                border: "1px solid rgba(255,215,0,0.18)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <CardGlowElements />
              <div className="relative z-10 p-7 flex flex-col gap-5">
                <IconBox Icon={Shield} />
                <PillTag>Cobertura Inclusa</PillTag>
                <CardTitle>Garantia Motor &amp; Câmbio</CardTitle>
                <CardBody>
                  Cobertura real nos principais componentes mecânicos. Sua
                  tranquilidade começa na assinatura do contrato.
                </CardBody>
              </div>
            </motion.div>
          </div>

          {/* Card 3 – normal – col2 row2 */}
          <div className="lg:col-start-2 lg:row-start-2">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="relative rounded-2xl overflow-hidden cursor-default select-none"
              style={{
                background: `linear-gradient(135deg, rgba(18,18,18,0.97) 0%, rgba(10,10,10,0.99) 100%), ${CARBON_BG}`,
                backgroundBlendMode: "overlay",
                border: "1px solid rgba(255,215,0,0.18)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <CardGlowElements />
              <div className="relative z-10 p-7 flex flex-col gap-5">
                <IconBox Icon={Clock} />
                <PillTag>Tradição &amp; Confiança</PillTag>
                <CardTitle>12 Anos de Mercado</CardTitle>
                <CardBody>
                  Uma década de tradição, milhares de clientes satisfeitos e
                  reputação construída sem atalhos.
                </CardBody>
              </div>
            </motion.div>
          </div>

          {/* Card 4 – large – col3 row1-2 */}
          <div className="lg:row-span-2 lg:col-start-3 lg:row-start-1">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="relative rounded-2xl overflow-hidden cursor-default select-none h-full"
              style={{
                background: `linear-gradient(135deg, rgba(18,18,18,0.97) 0%, rgba(10,10,10,0.99) 100%), ${CARBON_BG}`,
                backgroundBlendMode: "overlay",
                border: "1px solid rgba(255,215,0,0.18)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                minHeight: "380px",
              }}
            >
              <CardGlowElements />
              <div className="relative z-10 p-8 flex flex-col gap-5 h-full">
                <IconBox Icon={ArrowLeftRight} />
                <PillTag>Negociação Limpa</PillTag>
                <CardTitle>Troca Justa &amp; Transparente</CardTitle>
                <CardBody>
                  Avaliação honesta baseada em tabela FIPE e estado real do
                  veículo. Zero lero-lero, preço justo na hora.
                </CardBody>
                <div className="mt-auto pt-6 border-t border-white/[0.06]">
                  <FooterTag />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ══ BOTTOM TRUST BAR ════════════════════════════════════════════════ */}
        <motion.div
          className="mt-16 pt-10 border-t flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderColor: "rgba(255,215,0,0.12)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {/* Brand badge */}
          <div className="flex items-center gap-4">
            <div
              className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border border-[#FFD700]/30"
              style={{
                boxShadow: "0 0 24px rgba(255,215,0,0.2)",
              }}
            >
              <Image
                src="/logo-pv.png"
                alt="Popular Veículos"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-heading font-bold text-white text-sm">
                Popular Veículos
              </p>
              <p
                className="font-body text-xs tracking-wider uppercase"
                style={{ color: "rgba(255,215,0,0.55)" }}
              >
                Referência em revenda na região
              </p>
            </div>
          </div>

          {/* Verified tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {verifiedTags.map((tag) => (
              <span
                key={tag}
                className="font-body text-xs font-medium rounded-full px-4 py-1.5 transition-all duration-200"
                style={{
                  color: "#FFD700",
                  border: "1px solid rgba(255,215,0,0.28)",
                  background: "rgba(255,215,0,0.04)",
                }}
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

function CardGlowElements() {
  return (
    <>
      {/* Top gold shimmer edge */}
      <div
        className="absolute top-0 left-6 right-6 h-[1px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.45), transparent)",
        }}
      />
      {/* Subtle radial spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 15%, rgba(255,215,0,0.06) 0%, transparent 60%)",
        }}
      />
    </>
  );
}

function IconBox({ Icon }: { Icon: React.ElementType }) {
  return (
    <motion.div
      className="relative w-14 h-14 flex items-center justify-center rounded-xl"
      style={{
        background: "rgba(255,215,0,0.07)",
        border: "1px solid rgba(255,215,0,0.22)",
        boxShadow: "0 0 18px rgba(255,215,0,0.1)",
      }}
      variants={{
        hover: { scale: 1.12, rotate: 7 },
      }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
    >
      <Icon strokeWidth={1.25} className="w-6 h-6 text-[#FFD700]" />
    </motion.div>
  );
}

function PillTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="self-start font-body font-bold text-[10px] tracking-[0.22em] uppercase"
      style={{ color: "rgba(255,215,0,0.55)" }}
    >
      ◆ {children}
    </span>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-heading font-black text-xl leading-tight"
      style={{ color: "#FFD700", textShadow: "0 0 24px rgba(255,215,0,0.18)" }}
    >
      {children}
    </h3>
  );
}

function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-sm leading-relaxed" style={{ color: "#E0E0E0" }}>
      {children}
    </p>
  );
}

function FooterTag() {
  return (
    <span
      className="font-body text-[10px] tracking-widest uppercase"
      style={{ color: "rgba(255,215,0,0.3)" }}
    >
      Popular Veículos · Padrão de Excelência
    </span>
  );
}
