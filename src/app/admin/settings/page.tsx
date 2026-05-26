"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Check, Shield, Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

export default function AdminSettingsPage() {
  const { credentials, isLoaded, updateCredentials } = useAuthContext();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setUsername(credentials.username);
      setPassword(credentials.passwordHash);
      setRecoveryEmail(credentials.recoveryEmail);
    }
  }, [isLoaded, credentials]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !recoveryEmail.trim()) return;

    updateCredentials(username, password, recoveryEmail);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
              
              {/* E-mail de Recuperação */}
              <div>
                <label className="text-[#E0E0E0] text-sm font-heading font-bold mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FFD700]" />
                  E-mail de Recuperação
                </label>
                <p className="text-[#6B6B6B] text-xs font-body mb-3">
                  Usado para recuperar o acesso caso você esqueça a senha (será integrado no futuro).
                </p>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Ex: contato@loja.com.br"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>

              <hr className="border-[#2A2A2A]" />

              {/* Usuário */}
              <div>
                <label className="text-[#E0E0E0] text-sm font-heading font-bold mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FFD700]" />
                  Nome de Usuário
                </label>
                <p className="text-[#6B6B6B] text-xs font-body mb-3">
                  O usuário utilizado para fazer login no painel.
                </p>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: admin"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="text-[#E0E0E0] text-sm font-heading font-bold mb-1.5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FFD700]" />
                  Senha de Acesso
                </label>
                <p className="text-[#6B6B6B] text-xs font-body mb-3">
                  Mantenha sua senha segura e não a compartilhe.
                </p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha secreta"
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

              {/* Salvar */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-heading font-bold transition-all ${
                    saved
                      ? "bg-[#22C55E] text-white"
                      : "bg-[#FFD700] text-[#0A0A0A] hover:bg-[#E6C200] shadow-[0_4px_15px_rgba(255,215,0,0.3)]"
                  }`}
                >
                  {saved ? (
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
