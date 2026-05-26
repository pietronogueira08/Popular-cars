"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Início", href: "#hero" },
  { label: "Sobre a Loja", href: "#sobre" },
  { label: "Estoque", href: "#estoque" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

const WA_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["hero", "sobre", "estoque", "depoimentos", "contato"];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/75 backdrop-blur-2xl border-b border-[#FFD700]/10 shadow-[0_4px_40px_rgba(0,0,0,0.7)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">

            {/* ── Logo ── */}
            <button
              onClick={() => scrollToSection("#hero")}
              aria-label="Popular Veículos — Início"
              className="flex items-center gap-3 group flex-shrink-0"
            >
              <div
                className="relative transition-all duration-300 group-hover:scale-105"
                style={{
                  width: "clamp(48px, 8vw, 72px)",
                  height: "clamp(48px, 8vw, 72px)",
                  filter: "drop-shadow(0 0 12px rgba(255,215,0,0.15))",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Popular Veículos"
                  fill
                  sizes="72px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-heading font-black text-white text-lg md:text-xl tracking-wide">
                  POPULAR
                </span>
                <span className="font-heading font-black text-[#FFD700] text-base md:text-lg tracking-widest">
                  VEÍCULOS
                </span>
              </div>
            </button>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className={`relative px-4 py-2 text-sm font-body font-medium rounded-lg transition-all duration-200 ${
                      isActive ? "text-[#FFD700]" : "text-[#E0E0E0] hover:text-[#FFD700]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FFD700] rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* ── Desktop CTA ── */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                id="nav-whatsapp-cta"
                className="inline-flex items-center gap-2 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:bg-[#E6C200] hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.25)] min-h-[44px]"
              >
                {WA_ICON}
                Fale Conosco
              </a>
              <Link
                href="/admin/login"
                className="text-xs text-[#6B6B6B] hover:text-[#FFD700] transition-colors font-body px-2 py-1"
              >
                Admin
              </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl border border-[#2A2A2A] text-[#E0E0E0] hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0D0D0D] border-l border-[#2A2A2A] flex flex-col md:hidden"
              aria-label="Menu mobile"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10" style={{ filter: "drop-shadow(0 0 8px rgba(255,215,0,0.2))" }}>
                    <Image src="/logo.png" alt="Popular Veículos" fill sizes="40px" className="object-contain" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-heading font-black text-white text-sm tracking-wide">POPULAR</span>
                    <span className="font-heading font-black text-[#FFD700] text-xs tracking-widest">VEÍCULOS</span>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2A2A2A] text-[#6B6B6B] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {navLinks.map((link, i) => {
                  const id = link.href.replace("#", "");
                  const isActive = activeSection === id;
                  return (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => scrollToSection(link.href)}
                      className={`flex items-center w-full px-4 py-3.5 rounded-xl text-left text-sm font-body font-medium transition-all ${
                        isActive
                          ? "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20"
                          : "text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700]"
                      }`}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] mr-3 flex-shrink-0" />}
                      {link.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Drawer footer */}
              <div className="px-4 pb-8 pt-4 border-t border-[#2A2A2A] space-y-3">
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold text-sm px-5 py-3.5 rounded-full w-full transition-all hover:bg-[#E6C200] active:scale-95"
                  onClick={() => setMobileOpen(false)}
                >
                  {WA_ICON}
                  Fale pelo WhatsApp
                </a>
                <Link
                  href="/admin/login"
                  className="flex items-center justify-center text-xs text-[#6B6B6B] hover:text-[#FFD700] transition-colors font-body py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Acesso Admin
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
