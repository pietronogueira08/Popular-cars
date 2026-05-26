"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, LayoutDashboard, LogOut, Car, Menu, X, Shield } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthContext } from "@/context/AuthContext";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Inventário" },
  { href: "/", icon: Home, label: "Ver Site", external: true },
  { href: "/admin/dashboard", icon: Car, label: "Estoque" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoaded, signOut } = useAuthContext();

  // Protect admin routes
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/admin/login");
    }
  }, [isLoaded, user, router]);

  const handleLogout = async () => {
    await signOut();
  };

  // Prevent flash of content before checking auth
  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FFD700] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-sm flex-shrink-0">
            PV
          </div>
          <div>
            <p className="font-heading font-black text-white text-sm">Popular Veículos</p>
            <p className="text-[#6B6B6B] text-xs font-body truncate max-w-[150px]" title={user?.email || "Painel Admin"}>
              {user?.email || "Painel Admin"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/admin/dashboard"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          Inventário
        </Link>
        <Link
          href="/"
          target="_blank"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          Ver Site
        </Link>
        <Link
          href="/admin/dashboard"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
        >
          <Car className="w-5 h-5 flex-shrink-0" />
          Estoque
        </Link>
        <Link
          href="/admin/settings"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
        >
          <Shield className="w-5 h-5 flex-shrink-0" />
          Segurança
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#2A2A2A]">
        <button
          id="admin-logout"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#6B6B6B] hover:bg-[#1A1A1A] hover:text-[#EF4444] transition-all font-body text-sm"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Sair
        </button>
      </div>
    </div>
  );

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
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 z-50 bg-[#141414] border-r border-[#2A2A2A] flex flex-col md:hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
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
            <div className="w-7 h-7 rounded-full bg-[#FFD700] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-xs">
              PV
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
