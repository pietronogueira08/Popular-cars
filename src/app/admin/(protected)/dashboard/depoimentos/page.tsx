"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Pencil, Trash2, X, Check, MessageSquareQuote,
  Upload, ImageIcon, AlertTriangle, Eye, EyeOff, Star, ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useTestimonials } from "@/context/TestimonialContext";
import { Testimonial, EditableTestimonial } from "@/types/testimonial";

// ─── Constants ──────────────────────────────────────────────────────────────
const MAX_FILE_SIZE_MB = 2;

const emptyForm: EditableTestimonial = {
  client_name: "",
  location: "",
  vehicle_info: "",
  rating: 5,
  text_content: "",
  avatar_url: null,
  is_approved: true,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Avatar Upload Component ─────────────────────────────────────────────────
interface AvatarUploadProps {
  value: string | null;
  onChange: (url: string | null, file?: File) => void;
  name: string;
}

function AvatarUpload({ value, onChange, name }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setSizeError(false);
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setSizeError(true);
        return;
      }
      if (!file.type.startsWith("image/")) return;
      setProcessing(true);
      try {
        const dataUrl = await readFileAsDataURL(file);
        onChange(dataUrl, file);
      } finally {
        setProcessing(false);
      }
    },
    [onChange]
  );

  return (
    <div className="flex items-start gap-4">
      {/* Preview circle */}
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-20 h-20 rounded-full flex-shrink-0 cursor-pointer group ring-2 ring-[#2A2A2A] hover:ring-[#FFD700]/50 transition-all"
      >
        {value ? (
          <Image
            src={value}
            alt={name}
            fill
            className="object-cover rounded-full"
            sizes="80px"
            unoptimized={value.startsWith("data:")}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-lg">
            {name ? getInitials(name) : <ImageIcon className="w-6 h-6 text-[#0A0A0A]" />}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        {processing && (
          <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 space-y-2">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            dragging
              ? "border-[#FFD700] bg-[#FFD700]/5"
              : "border-[#2A2A2A] hover:border-[#FFD700]/40"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <p className="text-xs text-[#6B6B6B] font-body">
            Arraste ou <span className="text-[#FFD700]">selecione</span> uma foto
          </p>
          <p className="text-[10px] text-[#4A4A4A] font-body mt-1">
            PNG, JPG, WEBP — máx. {MAX_FILE_SIZE_MB}MB
          </p>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex items-center gap-1.5 text-xs font-body text-[#6B6B6B] hover:text-[#EF4444] transition-colors"
          >
            <X className="w-3 h-3" /> Remover foto
          </button>
        )}
        {sizeError && (
          <p className="flex items-center gap-1.5 text-xs text-[#EF4444] font-body">
            <AlertTriangle className="w-3.5 h-3.5" />
            Arquivo muito grande. Máx. {MAX_FILE_SIZE_MB}MB.
          </p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Star Selector ────────────────────────────────────────────────────────────
function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-125"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              i < (hovered || value)
                ? "fill-[#FFD700] text-[#FFD700]"
                : "fill-[#2A2A2A] text-[#2A2A2A]"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-body text-[#6B6B6B] self-center">
        {value} {value === 1 ? "estrela" : "estrelas"}
      </span>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        value ? "bg-[#22C55E]" : "bg-[#2A2A2A]"
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DepoimentosAdminPage() {
  const {
    allTestimonials,
    loadingAdmin,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleApproval,
    refreshAdmin,
  } = useTestimonials();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditableTestimonial>(emptyForm);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    refreshAdmin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = allTestimonials.filter(
    (t) =>
      t.client_name.toLowerCase().includes(search.toLowerCase()) ||
      t.vehicle_info.toLowerCase().includes(search.toLowerCase())
  );

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    total: allTestimonials.length,
    approved: allTestimonials.filter((t) => t.is_approved).length,
    pending: allTestimonials.filter((t) => !t.is_approved).length,
  };

  // ── Modal open ────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setAvatarFile(undefined);
    setModalOpen(true);
    setSaved(false);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({
      client_name: t.client_name,
      location: t.location ?? "",
      vehicle_info: t.vehicle_info,
      rating: t.rating,
      text_content: t.text_content,
      avatar_url: t.avatar_url,
      is_approved: t.is_approved,
    });
    setAvatarFile(undefined);
    setModalOpen(true);
    setSaved(false);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formData.client_name.trim() || !formData.vehicle_info.trim() || !formData.text_content.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData, avatarFile);
      } else {
        await addTestimonial(formData, avatarFile);
      }
      setSaved(true);
      setTimeout(() => {
        setModalOpen(false);
        setSaved(false);
      }, 800);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const executeDelete = async () => {
    if (!deleteId) return;
    await deleteTestimonial(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-black text-white text-2xl md:text-3xl flex items-center gap-3">
            <MessageSquareQuote className="w-7 h-7 text-[#FFD700]" />
            Depoimentos
          </h1>
          <p className="text-[#6B6B6B] font-body text-sm mt-1">
            Gerencie avaliações — aprovadas aparecem no site automaticamente
          </p>
        </div>
        <motion.button
          id="admin-add-testimonial"
          onClick={openCreate}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold px-5 py-3 rounded-xl shadow-[0_4px_15px_rgba(255,215,0,0.3)] hover:bg-[#E6C200] transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Novo Depoimento
        </motion.button>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-[#FFD700]" },
          { label: "Aprovados", value: stats.approved, color: "text-[#22C55E]" },
          { label: "Pendentes", value: stats.pending, color: "text-[#F59E0B]" },
        ].map((s) => (
          <div key={s.label} className="bg-[#141414] rounded-xl p-4 md:p-5 border border-[#2A2A2A]">
            <p className="text-[#6B6B6B] font-body text-xs uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p className={`font-heading font-black text-2xl md:text-3xl ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ─── Search ─── */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
        <input
          id="admin-testimonial-search"
          type="text"
          placeholder="Buscar por cliente ou veículo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#E0E0E0] font-body text-sm placeholder:text-[#4A4A4A] focus:outline-none focus:border-[#FFD700]/40"
        />
      </div>

      {/* ─── Loading ─── */}
      {loadingAdmin && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
        </div>
      )}

      {/* ─── Desktop Table ─── */}
      {!loadingAdmin && (
        <div className="bg-[#141414] rounded-2xl border border-[#2A2A2A] overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Cliente", "Veículo", "Nota", "Status", "Ações"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-[#6B6B6B] font-body text-xs uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((t) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-[#2A2A2A] last:border-0 hover:bg-[#1A1A1A] transition-colors"
                    >
                      {/* Cliente */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-[#FFD700]/30 overflow-hidden relative">
                            {t.avatar_url ? (
                              <Image
                                src={t.avatar_url}
                                alt={t.client_name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-xs">
                                {getInitials(t.client_name)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-heading font-bold text-white text-sm">{t.client_name}</p>
                            <p className="text-[#6B6B6B] text-xs font-body">{t.location}</p>
                          </div>
                        </div>
                      </td>
                      {/* Veículo */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-heading font-semibold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-2.5 py-1 rounded-full">
                          {t.vehicle_info}
                        </span>
                      </td>
                      {/* Nota */}
                      <td className="px-6 py-4">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < t.rating ? "fill-[#FFD700] text-[#FFD700]" : "fill-[#2A2A2A] text-[#2A2A2A]"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-6 py-4">
                        <button
                          id={`toggle-${t.id}`}
                          onClick={() => toggleApproval(t.id, t.is_approved)}
                          className={`flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full border transition-all ${
                            t.is_approved
                              ? "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30 hover:bg-[#22C55E]/20"
                              : "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30 hover:bg-[#F59E0B]/20"
                          }`}
                        >
                          {t.is_approved ? (
                            <><ShieldCheck className="w-3 h-3" /> Aprovado</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Pendente</>
                          )}
                        </button>
                      </td>
                      {/* Ações */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            id={`edit-testimonial-${t.id}`}
                            onClick={() => openEdit(t)}
                            className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-testimonial-${t.id}`}
                            onClick={() => setDeleteId(t.id)}
                            className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-[#6B6B6B] font-body">
                      Nenhum depoimento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Mobile Cards ─── */}
      {!loadingAdmin && (
        <div className="md:hidden space-y-3">
          <AnimatePresence>
            {filtered.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-[#141414] rounded-xl border border-[#2A2A2A] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full flex-shrink-0 overflow-hidden relative ring-2 ring-[#FFD700]/30">
                    {t.avatar_url ? (
                      <Image src={t.avatar_url} alt={t.client_name} fill className="object-cover" sizes="44px" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center font-heading font-black text-[#0A0A0A] text-xs">
                        {getInitials(t.client_name)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-white text-sm">{t.client_name}</p>
                    <p className="text-[#6B6B6B] text-xs font-body">{t.location}</p>
                    <span className="text-[10px] font-heading font-semibold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {t.vehicle_info}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => toggleApproval(t.id, t.is_approved)}>
                      {t.is_approved
                        ? <Eye className="w-4 h-4 text-[#22C55E]" />
                        : <EyeOff className="w-4 h-4 text-[#F59E0B]" />}
                    </button>
                    <button onClick={() => openEdit(t)}>
                      <Pencil className="w-4 h-4 text-[#6B6B6B]" />
                    </button>
                    <button onClick={() => setDeleteId(t.id)}>
                      <Trash2 className="w-4 h-4 text-[#6B6B6B]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#6B6B6B] font-body">
              Nenhum depoimento encontrado.
            </div>
          )}
        </div>
      )}

      {/* ─── Create / Edit Modal ─── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 md:items-center bg-black/70 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#141414] rounded-2xl p-5 md:p-8 w-full max-w-2xl border border-[#2A2A2A] my-auto"
            >
              {/* Modal header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading font-black text-white text-lg md:text-xl">
                  {editingId ? "Editar Depoimento" : "Novo Depoimento"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                {/* ── Avatar Upload ── */}
                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-3 block uppercase tracking-wider">
                    Foto do Cliente
                  </label>
                  <AvatarUpload
                    value={formData.avatar_url}
                    name={formData.client_name}
                    onChange={(url, file) => {
                      setFormData({ ...formData, avatar_url: url });
                      if (file) setAvatarFile(file);
                    }}
                  />
                </div>

                {/* ── Name / Location ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                      Nome do Cliente *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Marcos Silva"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#E0E0E0] font-body text-sm placeholder:text-[#4A4A4A] focus:outline-none focus:border-[#FFD700]/40"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                      Localização (Cidade/UF)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo/SP"
                      value={formData.location ?? ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#E0E0E0] font-body text-sm placeholder:text-[#4A4A4A] focus:outline-none focus:border-[#FFD700]/40"
                    />
                  </div>
                </div>

                {/* ── Vehicle info ── */}
                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                    Veículo Comprado/Trocado *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Comprou uma Honda CB 1000R 2024"
                    value={formData.vehicle_info}
                    onChange={(e) => setFormData({ ...formData, vehicle_info: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#E0E0E0] font-body text-sm placeholder:text-[#4A4A4A] focus:outline-none focus:border-[#FFD700]/40"
                  />
                </div>

                {/* ── Star rating ── */}
                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-3 block uppercase tracking-wider">
                    Avaliação
                  </label>
                  <StarSelector
                    value={formData.rating}
                    onChange={(v) => setFormData({ ...formData, rating: v })}
                  />
                </div>

                {/* ── Text ── */}
                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                    Texto do Depoimento *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Escreva o relato do cliente..."
                    value={formData.text_content}
                    onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                    style={{ resize: "vertical" }}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#E0E0E0] font-body text-sm placeholder:text-[#4A4A4A] focus:outline-none focus:border-[#FFD700]/40"
                  />
                </div>

                {/* ── Approval toggle ── */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <Toggle
                    value={formData.is_approved}
                    onChange={(v) => setFormData({ ...formData, is_approved: v })}
                  />
                  <span className="text-sm font-body text-[#E0E0E0]">
                    Aprovado para exibição no site
                  </span>
                </label>

                {/* ── Actions ── */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-[#2A2A2A] text-[#E0E0E0] font-heading font-semibold hover:bg-[#1A1A1A] transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    id="admin-save-testimonial"
                    onClick={handleSave}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={saving}
                    className={`flex-1 py-3 rounded-xl font-heading font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
                      saved
                        ? "bg-[#22C55E] text-white"
                        : "bg-[#FFD700] text-[#0A0A0A] hover:bg-[#E6C200] shadow-[0_4px_15px_rgba(255,215,0,0.3)]"
                    }`}
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                    ) : saved ? (
                      <><Check className="w-4 h-4" /> Salvo!</>
                    ) : (
                      editingId ? "Salvar Alterações" : "Criar Depoimento"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#141414] rounded-2xl p-6 md:p-8 w-full max-w-sm border border-[#2A2A2A]"
            >
              <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mb-4">
                <Trash2 className="w-5 h-5 text-[#EF4444]" />
              </div>
              <h3 className="font-heading font-black text-white text-lg mb-2">
                Deletar Depoimento?
              </h3>
              <p className="text-[#6B6B6B] font-body text-sm mb-6">
                Essa ação é irreversível. O depoimento será removido permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-xl border border-[#2A2A2A] text-[#E0E0E0] font-heading font-semibold hover:bg-[#1A1A1A] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  id="confirm-delete-testimonial"
                  onClick={executeDelete}
                  className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white font-heading font-bold hover:bg-[#DC2626] transition-colors"
                >
                  Deletar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
