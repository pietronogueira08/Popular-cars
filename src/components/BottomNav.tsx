"use client";

import { Home, Car, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function BottomNav() {
  const [activeTab, setActiveTab] = useState("home");
  const pathname = usePathname();
  const router = useRouter();

  // A minimal way to detect current view / scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 500 && scrollY < 1500) {
        setActiveTab("estoque");
      } else if (scrollY > 1500) {
        setActiveTab("contato");
      } else {
        setActiveTab("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string, tab: string) => {
    setActiveTab(tab);
    if (pathname !== "/") {
      if (id === "top") {
        router.push("/#hero");
      } else {
        router.push(`/#${id}`);
      }
    } else {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/90 backdrop-blur-xl border-t border-[#2A2A2A] flex md:hidden pb-safe">
      <div className="flex w-full justify-around items-center px-2 py-2">
        <button
          onClick={() => scrollTo("top", "home")}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[64px] transition-colors ${
            activeTab === "home" ? "text-[#FFD700]" : "text-[#6B6B6B]"
          }`}
          aria-label="Início"
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-body">Início</span>
        </button>

        <button
          onClick={() => scrollTo("estoque", "estoque")}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[64px] transition-colors ${
            activeTab === "estoque" ? "text-[#FFD700]" : "text-[#6B6B6B]"
          }`}
          aria-label="Estoque"
        >
          <Car className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-body">Estoque</span>
        </button>

        <a
          href="https://wa.me/5522999822842"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[64px] text-[#6B6B6B] hover:text-[#FFD700] transition-colors"
          aria-label="Contato"
        >
          <Phone className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-body">Contato</span>
        </a>
      </div>
    </nav>
  );
}
