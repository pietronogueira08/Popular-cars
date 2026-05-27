"use client";

import { motion } from "framer-motion";
import { Info, Phone, MapPin, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-black text-white text-2xl md:text-3xl flex items-center gap-3">
          <Info className="w-8 h-8 text-[#FFD700]" />
          Informações da Loja
        </h1>
        <p className="text-[#6B6B6B] font-body text-sm mt-1">
          Dados de contato e configurações gerais da Popular Veículos.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Contato */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#141414] rounded-2xl border border-[#2A2A2A] p-6"
        >
          <h2 className="font-heading font-bold text-white text-lg mb-4">Contato</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-[#E0E0E0] font-body text-sm">
              <Phone className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
              <span>(22) 99982-2842</span>
            </li>
            <li className="flex items-center gap-3 text-[#E0E0E0] font-body text-sm">
              <Mail className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
              <span>contato@popularveiculos.com.br</span>
            </li>
            <li className="flex items-center gap-3 text-[#E0E0E0] font-body text-sm">
              <MapPin className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
              <span>Av. dos Veículos, 1234 — São Paulo, SP</span>
            </li>
          </ul>
        </motion.div>

        {/* Links Rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#141414] rounded-2xl border border-[#2A2A2A] p-6"
        >
          <h2 className="font-heading font-bold text-white text-lg mb-4">Links Rápidos</h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 text-[#E0E0E0] hover:text-[#FFD700] font-body text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#FFD700]" />
              Ver Site Principal
            </Link>
            <a
              href="https://www.instagram.com/popular_veiculos_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#E0E0E0] hover:text-[#FFD700] font-body text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#FFD700]" />
              Instagram @popular_veiculos_
            </a>
            <a
              href="https://wa.me/5522999822842"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#E0E0E0] hover:text-[#FFD700] font-body text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#FFD700]" />
              WhatsApp (22) 99982-2842
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
