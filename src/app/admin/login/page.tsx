"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Demo: aceita qualquer senha não vazia
    await new Promise((r) => setTimeout(r, 800));

    if (!password.trim()) {
      setError("Por favor, insira uma senha.");
      setIsLoading(false);
      return;
    }

    // Salva sessão demo no sessionStorage
    sessionStorage.setItem("pv-admin-auth", "true");
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.05)_0%,_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-[#141414] rounded-2xl p-8 border border-[#2A2A2A] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-2xl mb-4 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
              PV
            </div>
            <h1 className="font-heading font-black text-white text-2xl">
              Painel Admin
            </h1>
            <p className="text-[#6B6B6B] font-body text-sm mt-1">
              Popular Veículos — Acesso Restrito
            </p>
          </div>

          {/* Form */}
          <form id="admin-login-form" onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[#6B6B6B] text-xs font-body mb-2 block uppercase tracking-wider">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite qualquer senha (demo)"
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#FFD700] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#EF4444] text-sm font-body bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg px-4 py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              id="admin-login-submit"
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold py-3.5 rounded-xl transition-all hover:bg-[#E6C200] disabled:opacity-60 shadow-[0_4px_20px_rgba(255,215,0,0.3)]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Acessar Painel
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 p-3 bg-[#0A0A0A] rounded-lg border border-[#2A2A2A]">
            <p className="text-[#6B6B6B] text-xs font-body text-center">
              🔒 Modo Demo — Qualquer senha é aceita
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
