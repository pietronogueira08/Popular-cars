"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, LayoutDashboard, LogOut, Car } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check demo auth
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("pv-admin-auth");
      if (!auth) {
        router.push("/admin/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("pv-admin-auth");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] border-r border-[#2A2A2A] flex flex-col fixed top-0 left-0 h-full z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFD700] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-sm">
              PV
            </div>
            <div>
              <p className="font-heading font-black text-white text-sm">
                Popular Veículos
              </p>
              <p className="text-[#6B6B6B] text-xs font-body">Painel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
          >
            <LayoutDashboard className="w-5 h-5" />
            Inventário
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
            target="_blank"
          >
            <Home className="w-5 h-5" />
            Ver Site
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0E0E0] hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-all font-body text-sm"
          >
            <Car className="w-5 h-5" />
            Estoque
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#2A2A2A]">
          <button
            id="admin-logout"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#6B6B6B] hover:bg-[#1A1A1A] hover:text-[#EF4444] transition-all font-body text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
