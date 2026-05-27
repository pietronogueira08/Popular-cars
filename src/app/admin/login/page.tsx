"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useAuthContext();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [envWarning, setEnvWarning] = useState("");

  // Check if Supabase keys are configured
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log("=== DIAGNÓSTICO SUPABASE ===");
    console.log("URL Configurada:", url || "NÃO ENCONTRADA");
    console.log("Chave configurada?", key ? `SIM (Começa com: ${key.substring(0, 15)}...)` : "NÃO");
    console.log("============================");

    if (!url || !key || url.includes("placeholder") || key.includes("placeholder")) {
      setEnvWarning(
        "Variáveis de ambiente do Supabase não configuradas no Vercel. Certifique-se de adicionar NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) nas configurações do seu projeto Vercel."
      );
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoaded && user) {
      router.push("/admin/dashboard");
    }
  }, [isLoaded, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;

    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message === "Invalid login credentials" 
          ? "E-mail ou senha incorretos." 
          : signInError.message);
        setIsLoading(false);
      } else {
        // The auth listener in AuthContext will detect the session change
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("Erro na autenticação:", err);
      setError(
        err?.message || 
        "Erro ao conectar com o servidor de autenticação. Verifique se as credenciais do Supabase no Vercel estão corretas."
      );
      setIsLoading(false);
    }
  };

  if (!isLoaded || user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

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
            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 border border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.25)]">
              <Image
                src="/logo-pv.png"
                alt="PV Logo"
                fill
                sizes="64px"
                className="object-cover"
              />
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
            {envWarning && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#FFD700] text-xs font-body bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg p-3 leading-relaxed"
              >
                ⚠️ <strong>Atenção:</strong> {envWarning}
              </motion.div>
            )}

            <div>
              <label className="text-[#6B6B6B] text-xs font-body mb-2 block uppercase tracking-wider">
                E-mail de Acesso
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: admin@loja.com"
              />
            </div>

            <div>
              <label className="text-[#6B6B6B] text-xs font-body mb-2 block uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
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
              disabled={isLoading || !isLoaded}
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
        </div>
      </motion.div>
    </div>
  );
}
