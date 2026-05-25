"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buildTradeInUrl } from "@/lib/whatsapp";

export function TradeInValuation() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    condition: "bom",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const desc = `${formData.brand} ${formData.model} ${formData.year}, ${formData.mileage}km, condição: ${formData.condition}`;
    const url = buildTradeInUrl(desc);
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      id="avaliacao"
      className="py-24 bg-[#141414] relative overflow-hidden"
      aria-labelledby="tradein-heading"
    >
      {/* Background accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_right,_rgba(255,215,0,0.06)_0%,_transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#FFD700] text-sm font-semibold tracking-widest uppercase font-body">
              Avaliação Gratuita
            </span>
            <h2
              id="tradein-heading"
              className="text-4xl md:text-5xl font-heading font-black text-white mt-3 mb-6 section-title"
            >
              Quer Trocar<br />seu Veículo?
            </h2>
            <p className="text-[#6B6B6B] font-body text-lg leading-relaxed mb-8">
              Preencha o formulário ao lado e receba uma avaliação justa e
              transparente do seu veículo. Nosso time entra em contato via
              WhatsApp em minutos.
            </p>
            <ul className="space-y-3">
              {[
                "Avaliação 100% gratuita e sem compromisso",
                "Melhor preço de troca da região",
                "Processo rápido e sem burocracia",
                "Documentação facilitada",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 font-body text-[#E0E0E0]">
                  <span className="w-5 h-5 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] text-xs flex-shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-[#0A0A0A] rounded-2xl p-8 border border-[#2A2A2A]">
              <h3 className="font-heading font-bold text-white text-xl mb-6">
                Avaliar Meu Veículo
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <p className="font-heading font-bold text-white text-lg">
                    Redirecionando para o WhatsApp!
                  </p>
                  <p className="text-[#6B6B6B] font-body mt-2 text-sm">
                    Aguarde o contato do nosso time.
                  </p>
                </motion.div>
              ) : (
                <form
                  id="tradein-form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                        Marca *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Honda"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                        Modelo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Civic"
                        value={formData.model}
                        onChange={(e) =>
                          setFormData({ ...formData, model: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                        Ano *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="2020"
                        min={1980}
                        max={2026}
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                        Km Rodados *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="50000"
                        min={0}
                        value={formData.mileage}
                        onChange={(e) =>
                          setFormData({ ...formData, mileage: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                      Condição do Veículo
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData({ ...formData, condition: e.target.value })
                      }
                    >
                      <option value="otimo">Ótimo — Sem nenhum defeito</option>
                      <option value="bom">Bom — Pequenos detalhes</option>
                      <option value="regular">Regular — Alguns defeitos</option>
                      <option value="ruim">Ruim — Precisa de reparos</option>
                    </select>
                  </div>

                  <motion.button
                    id="tradein-submit"
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold py-4 rounded-xl mt-2 hover:bg-[#E6C200] transition-colors shadow-[0_4px_20px_rgba(255,215,0,0.3)]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Quero Avaliar Meu Veículo
                  </motion.button>

                  <p className="text-[#6B6B6B] text-xs font-body text-center">
                    Você será redirecionado para o WhatsApp.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
