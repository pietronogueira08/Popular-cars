"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, LayoutDashboard, Car, Menu, X, MessageSquareQuote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="p-6 border-b border-[#2A2A2A]">
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
          <Image
            src="/logo-pv.png"
            alt="PV Logo"
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-heading font-black text-white text-sm">Popular Veículos</p>
          <p className="text-[#6B6B6B] text-xs font-body">Painel Administrativo</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 p-4 space-y-1">
      <Link
        href="/admin/dashboard"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
      >
        <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
        Inventário
      </Link>
      <Link
        href="/admin/dashboard"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
      >
        <Car className="w-5 h-5 flex-shrink-0" />
        Estoque
      </Link>
      <Link
        href="/admin/dashboard/depoimentos"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
      >
        <MessageSquareQuote className="w-5 h-5 flex-shrink-0" />
        Depoimentos
      </Link>
      <Link
        href="/"
        target="_blank"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
      >
        <Home className="w-5 h-5 flex-shrink-0" />
        Ver Site
      </Link>
    </nav>
  </div>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="w-64 bg-[#141414] border-r border-[#2A2A2A] fixed top-0 left-0 h-full z-40 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* ─── Mobile Sidebar Drawer ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 z-50 bg-[#141414] border-r border-[#2A2A2A] flex flex-col md:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-4 px-4 py-4 bg-[#141414] border-b border-[#2A2A2A] sticky top-0 z-30">
          <button
            id="admin-mobile-menu"
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#E0E0E0] hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#FFD700]/30 shadow-[0_0_10px_rgba(255,215,0,0.15)]">
              <Image
                src="/logo-pv.png"
                alt="PV Logo"
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
            <span className="font-heading font-black text-white text-sm">
              Popular <span className="text-[#FFD700]">Veículos</span>
            </span>
          </div>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
