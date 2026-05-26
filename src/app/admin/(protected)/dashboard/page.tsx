"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Pencil, Trash2, X, Check, Car, BarChart3,
  Upload, ImageIcon, AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { formatPrice, formatMileage } from "@/lib/vehicles";
import { useVehicles } from "@/context/VehicleContext";
import { Vehicle, VehicleStatus, VehicleCategory } from "@/types/vehicle";
import { createClient } from "@/utils/supabase/client";

// ─────────────────────────────────────────────
// Types & helpers
// ─────────────────────────────────────────────
type EditableVehicle = Omit<Vehicle, "id" | "slug">;

const emptyVehicle: EditableVehicle = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  category: "carro",
  status: "disponivel",
  description: "",
  image: "",
  features: [],
  color: "",
  fuel: "Gasolina",
};

const statusLabels: Record<VehicleStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

const categoryLabels: Record<VehicleCategory, string> = {
  carro: "Carro",
  moto: "Moto",
  tuning: "Tuning",
};

const MAX_FILE_SIZE_MB = 5;

// Convert File → base64 data URL
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────
// Image Upload sub-component
// ─────────────────────────────────────────────
interface ImageUploadProps {
  value: string;
  onChange: (url: string, file?: File) => void;
}

function ImageUpload({ value, onChange }: ImageUploadProps) {
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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const isDataUrl = value?.startsWith("data:");
  const isExternalUrl = value && !isDataUrl;

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
          ${dragging
            ? "border-[#FFD700] bg-[#FFD700]/5"
            : "border-[#2A2A2A] hover:border-[#FFD700]/50 bg-[#0A0A0A]"
          }`}
      >
        {/* Preview */}
        {value ? (
          <div className="relative w-full h-44">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="600px"
              unoptimized={isDataUrl}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-white">
                <Upload className="w-6 h-6" />
                <span className="text-xs font-body">Trocar imagem</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-[#6B6B6B]">
            {processing ? (
              <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-10 h-10 opacity-40" />
                <div className="text-center">
                  <p className="text-sm font-body font-medium text-[#E0E0E0]">
                    Arraste uma foto ou clique para selecionar
                  </p>
                  <p className="text-xs mt-1">PNG, JPG, WEBP — máx. {MAX_FILE_SIZE_MB}MB</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />

      {/* Buttons row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 text-xs font-body font-medium px-3 py-2 rounded-lg border border-[#2A2A2A] text-[#E0E0E0] hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          {value ? "Trocar arquivo" : "Selecionar arquivo"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex items-center gap-2 text-xs font-body px-3 py-2 rounded-lg border border-[#2A2A2A] text-[#6B6B6B] hover:border-[#EF4444]/40 hover:text-[#EF4444] transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Remover
          </button>
        )}
      </div>

      {/* Errors */}
      {sizeError && (
        <p className="flex items-center gap-1.5 text-xs text-[#EF4444] font-body">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          Arquivo muito grande. Máximo permitido: {MAX_FILE_SIZE_MB}MB.
        </p>
      )}
      {isExternalUrl && (
        <p className="text-[10px] text-[#6B6B6B] font-body">
          Usando URL externa. Você pode substituir por um arquivo local acima.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { vehicles: vehicleList, addVehicle, updateVehicle, deleteVehicle } = useVehicles();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<EditableVehicle>(emptyVehicle);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [featuresInput, setFeaturesInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filter
  const filtered = vehicleList.filter(
    (v) =>
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase())
  );

  // Open modals
  const openCreate = () => {
    setEditingVehicle(null);
    setFormData(emptyVehicle);
    setImageFile(null);
    setFeaturesInput("");
    setModalOpen(true);
    setSaved(false);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormData({
      brand: v.brand,
      model: v.model,
      year: v.year,
      price: v.price,
      mileage: v.mileage,
      category: v.category,
      status: v.status,
      description: v.description,
      image: v.image,
      features: v.features,
      color: v.color ?? "",
      fuel: v.fuel ?? "",
      stage: v.stage,
      highlighted: v.highlighted,
    });
    setFeaturesInput(v.features.join(", "));
    setImageFile(null);
    setModalOpen(true);
    setSaved(false);
  };

  // Save — writes to the shared context (which also updates the storefront)
  const saveVehicle = async () => {
    setSaving(true);
    const features = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const slug = `${formData.brand}-${formData.model}-${formData.year}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    let imageUrl = formData.image;

    // Upload new image if selected
    if (imageFile) {
      const supabase = createClient();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, imageFile);

      if (!uploadError) {
        const { data } = supabase.storage
          .from('vehicle-images')
          .getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      } else {
        console.error("Erro no upload da imagem:", uploadError);
      }
    }

    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, { ...formData, features, slug, image: imageUrl });
    } else {
      const newVehicle = {
        slug,
        ...formData,
        features,
        image: imageUrl,
      };
      await addVehicle(newVehicle);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setModalOpen(false);
      setSaved(false);
    }, 800);
  };

  // Delete
  const confirmDelete = (id: string) => setDeleteId(id);
  const executeDelete = () => {
    if (deleteId) {
      deleteVehicle(deleteId);
      setDeleteId(null);
    }
  };

  // Stats
  const stats = {
    total: vehicleList.length,
    disponivel: vehicleList.filter((v) => v.status === "disponivel").length,
    reservado: vehicleList.filter((v) => v.status === "reservado").length,
    vendido: vehicleList.filter((v) => v.status === "vendido").length,
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-black text-white text-2xl md:text-3xl">
            Inventário
          </h1>
          <p className="text-[#6B6B6B] font-body text-sm mt-1">
            Gerencie o estoque — alterações aparecem no site automaticamente
          </p>
        </div>
        <motion.button
          id="admin-add-vehicle"
          onClick={openCreate}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold px-5 py-3 rounded-xl shadow-[0_4px_15px_rgba(255,215,0,0.3)] hover:bg-[#E6C200] transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Adicionar Veículo
        </motion.button>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: Car, color: "text-[#FFD700]" },
          { label: "Disponíveis", value: stats.disponivel, icon: Check, color: "text-[#22C55E]" },
          { label: "Reservados", value: stats.reservado, icon: BarChart3, color: "text-[#F59E0B]" },
          { label: "Vendidos", value: stats.vendido, icon: X, color: "text-[#EF4444]" },
        ].map((s) => (
          <div key={s.label} className="bg-[#141414] rounded-xl p-4 md:p-5 border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#6B6B6B] font-body text-xs uppercase tracking-wider">
                {s.label}
              </p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
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
          id="admin-search"
          type="text"
          placeholder="Buscar por marca ou modelo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* ─── Table (desktop) / Cards (mobile) ─── */}

      {/* Desktop table */}
      <div className="bg-[#141414] rounded-2xl border border-[#2A2A2A] overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Veículo", "Categoria", "Ano / Km", "Preço", "Status", "Ações"].map((h) => (
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
                {filtered.map((v) => (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[#2A2A2A] last:border-0 hover:bg-[#1A1A1A] transition-colors"
                  >
                    {/* Vehicle */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-[#1A1A1A]">
                          {v.image ? (
                            <Image
                              src={v.image}
                              alt={v.model}
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized={v.image.startsWith("data:")}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-5 h-5 text-[#2A2A2A]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#6B6B6B] text-xs font-body">{v.brand}</p>
                          <p className="font-heading font-bold text-white text-sm">{v.model}</p>
                          {v.stage && (
                            <span className="stage-badge mt-1 inline-block">{v.stage}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#E0E0E0] font-body text-sm">
                        {categoryLabels[v.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-body text-sm">{v.year}</p>
                      <p className="text-[#6B6B6B] font-body text-xs">{formatMileage(v.mileage)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#FFD700] font-heading font-bold text-sm">
                        {formatPrice(v.price)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-body font-medium px-3 py-1 rounded-full status-${v.status}`}>
                        {statusLabels[v.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          id={`edit-${v.id}`}
                          onClick={() => openEdit(v)}
                          className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-${v.id}`}
                          onClick={() => confirmDelete(v.id)}
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
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-[#6B6B6B] font-body">Nenhum veículo encontrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        <AnimatePresence>
          {filtered.map((v) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#141414] rounded-xl border border-[#2A2A2A] overflow-hidden"
            >
              <div className="flex gap-3 p-3">
                {/* Thumb */}
                <div className="w-20 h-16 rounded-lg overflow-hidden relative flex-shrink-0 bg-[#1A1A1A]">
                  {v.image ? (
                    <Image
                      src={v.image}
                      alt={v.model}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized={v.image.startsWith("data:")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-[#2A2A2A]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[#6B6B6B] text-[10px] font-body">{v.brand}</p>
                  <p className="font-heading font-bold text-white text-sm truncate">{v.model}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-body font-medium px-2 py-0.5 rounded-full status-${v.status}`}>
                      {statusLabels[v.status]}
                    </span>
                    <span className="text-[#FFD700] font-heading font-bold text-xs">
                      {formatPrice(v.price)}
                    </span>
                  </div>
                  <p className="text-[#6B6B6B] text-[10px] font-body mt-0.5">
                    {v.year} · {formatMileage(v.mileage)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(v)}
                    className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => confirmDelete(v.id)}
                    className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#6B6B6B] font-body">Nenhum veículo encontrado.</p>
          </div>
        )}
      </div>

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
                  {editingVehicle ? "Editar Veículo" : "Novo Veículo"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* ── Image Upload ── */}
                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-2 block uppercase tracking-wider">
                    Foto do Veículo
                  </label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url, file) => {
                      setFormData({ ...formData, image: url });
                      if (file) setImageFile(file);
                    }}
                  />
                </div>

                {/* ── Brand / Model ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Marca *</label>
                    <input
                      type="text"
                      placeholder="Ex: Honda"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Modelo *</label>
                    <input
                      type="text"
                      placeholder="Ex: Civic Sport"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>
                </div>

                {/* ── Year / Price / KM ── */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Ano</label>
                    <input
                      type="number"
                      min={1980}
                      max={2027}
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Preço (R$)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Km</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* ── Category / Status ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Categoria</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as VehicleCategory })}
                    >
                      <option value="carro">Carro</option>
                      <option value="moto">Moto</option>
                      <option value="tuning">Tuning / Preparado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
                    >
                      <option value="disponivel">Disponível</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                    </select>
                  </div>
                </div>

                {/* ── Color / Fuel / Stage ── */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Cor</label>
                    <input
                      type="text"
                      placeholder="Ex: Prata"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Combustível</label>
                    <input
                      type="text"
                      placeholder="Ex: Flex"
                      value={formData.fuel}
                      onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Stage</label>
                    <input
                      type="text"
                      placeholder="Stage 1, 2..."
                      value={formData.stage ?? ""}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value || undefined })}
                    />
                  </div>
                </div>

                {/* ── Features ── */}
                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                    Opcionais <span className="text-[#6B6B6B] font-normal">(separados por vírgula)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Teto Solar, Bancos de Couro, Multimídia..."
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                  />
                </div>

                {/* ── Description ── */}
                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Descrição</label>
                  <textarea
                    rows={3}
                    placeholder="Descreva o veículo..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* ── Highlight ── */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setFormData({ ...formData, highlighted: !formData.highlighted })}
                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
                      formData.highlighted ? "bg-[#FFD700]" : "bg-[#2A2A2A]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        formData.highlighted ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-body text-[#E0E0E0]">Destacar no estoque</span>
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
                    id="admin-save-vehicle"
                    onClick={saveVehicle}
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
                      <>
                        <Check className="w-4 h-4" />
                        Salvo!
                      </>
                    ) : (
                      editingVehicle ? "Salvar Alterações" : "Criar Veículo"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirm Modal ─── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#141414] rounded-2xl p-8 w-full max-w-sm border border-[#2A2A2A] text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-[#EF4444]" />
              </div>
              <h3 className="font-heading font-black text-white text-xl mb-2">
                Remover Veículo?
              </h3>
              <p className="text-[#6B6B6B] font-body text-sm mb-8">
                O veículo será removido do estoque e não aparecerá mais no site.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-xl border border-[#2A2A2A] text-[#E0E0E0] font-heading font-semibold hover:bg-[#1A1A1A] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  id="admin-confirm-delete"
                  onClick={executeDelete}
                  className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white font-heading font-bold hover:bg-[#DC2626] transition-colors"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
