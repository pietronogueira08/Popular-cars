"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Check, Shield, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";

export default function AdminSettingsPage() {
  const { user, isLoaded } = useAuthContext();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setEmail(user.email || "");
    }
  }, [isLoaded, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const updates: { email?: string; password?: string } = {};
    if (email && email !== user?.email) updates.email = email;
    if (password) updates.password = password;

    if (Object.keys(updates).length === 0) {
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser(updates);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSaved(true);
    setPassword(""); // Clear password field after success
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isLoaded) {
    return (
      <div className="p-4 md:p-8 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* ─── Header ─── */}
      <div className="mb-8">
        <h1 className="font-heading font-black text-white text-2xl md:text-3xl flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#FFD700]" />
          Segurança e Configurações
        </h1>
        <p className="text-[#6B6B6B] font-body text-sm mt-1">
          Gerencie as credenciais de acesso ao painel administrativo.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-[#141414] rounded-2xl border border-[#2A2A2A] overflow-hidden">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* E-mail de Acesso */}
              <div>
                <label className="text-[#E0E0E0] text-sm font-heading font-bold mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FFD700]" />
                  E-mail de Acesso
                </label>
                <p className="text-[#6B6B6B] text-xs font-body mb-3">
                  O e-mail utilizado para fazer login no painel e recuperar a senha.
                  (Se alterar, será necessário confirmar no e-mail antigo e no novo).
                </p>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: admin@loja.com.br"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>

              <hr className="border-[#2A2A2A]" />

              {/* Senha */}
              <div>
                <label className="text-[#E0E0E0] text-sm font-heading font-bold mb-1.5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FFD700]" />
                  Nova Senha (Opcional)
                </label>
                <p className="text-[#6B6B6B] text-xs font-body mb-3">
                  Preencha apenas se desejar alterar a senha atual.
                </p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua nova senha secreta"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#FFD700] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

              {/* Salvar */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-heading font-bold transition-all disabled:opacity-60 ${
                    saved
                      ? "bg-[#22C55E] text-white"
                      : "bg-[#FFD700] text-[#0A0A0A] hover:bg-[#E6C200] shadow-[0_4px_15px_rgba(255,215,0,0.3)]"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                  ) : saved ? (
                    <>
                      <Check className="w-5 h-5" />
                      Configurações Salvas!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar Alterações
                    </>
                  )}
                </motion.button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
