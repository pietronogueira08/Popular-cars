"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Pencil, Trash2, X, Check, Car, BarChart3,
  Upload, ImageIcon, AlertTriangle, Images,
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

const MAX_IMAGES = 8;

const emptyVehicle: EditableVehicle = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  category: "hatch",
  status: "disponivel",
  description: "",
  image: "",
  images: [],
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
  suv: "SUV",
  hatch: "Hatch",
  sedan: "Sedan",
  moto: "Moto",
  utilitario: "Utilitário",
  picape: "Picape",
  tuning: "Tuning / Preparado",
};

const MAX_FILE_SIZE_MB = 5;

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────
// Multi-image Upload Component (up to 8)
// ─────────────────────────────────────────────
interface MultiImageUploadProps {
  images: string[];
  imageFiles: (File | null)[];
  onChange: (images: string[], files: (File | null)[]) => void;
}

function MultiImageUpload({ images, imageFiles, onChange }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList, startIdx: number) => {
      setProcessing(true);
      const newImages = [...images];
      const newFiles = [...imageFiles];
      const newErrors: Record<number, string> = { ...errors };

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const idx = startIdx + i;
        if (idx >= MAX_IMAGES) break;

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          newErrors[idx] = `Arquivo muito grande (máx ${MAX_FILE_SIZE_MB}MB)`;
          continue;
        }
        if (!file.type.startsWith("image/")) continue;

        delete newErrors[idx];
        const dataUrl = await readFileAsDataURL(file);
        newImages[idx] = dataUrl;
        newFiles[idx] = file;
      }

      setErrors(newErrors);
      onChange(newImages, newFiles);
      setProcessing(false);
    },
    [images, imageFiles, errors, onChange]
  );

  const removeImage = (idx: number) => {
    const newImages = [...images];
    const newFiles = [...imageFiles];
    newImages.splice(idx, 1);
    newFiles.splice(idx, 1);
    onChange(newImages, newFiles);
  };

  const slots = Array.from({ length: MAX_IMAGES });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[#6B6B6B] text-xs font-body uppercase tracking-wider flex items-center gap-2">
          <Images className="w-3.5 h-3.5" />
          Fotos do Veículo
          <span className="text-[#FFD700] font-bold">{images.filter(Boolean).length}/{MAX_IMAGES}</span>
        </label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={images.filter(Boolean).length >= MAX_IMAGES || processing}
          className="flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#E0E0E0] hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Upload className="w-3.5 h-3.5" />
          Adicionar fotos
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {slots.map((_, idx) => {
          const img = images[idx];
          const isFirst = idx === 0;

          return (
            <div
              key={idx}
              onDragOver={(e) => { e.preventDefault(); setDraggingIdx(idx); }}
              onDragLeave={() => setDraggingIdx(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDraggingIdx(null);
                handleFiles(e.dataTransfer.files, idx);
              }}
              className={`relative aspect-square rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden cursor-pointer group
                ${draggingIdx === idx ? "border-[#FFD700] bg-[#FFD700]/5" : img ? "border-[#2A2A2A]" : "border-[#2A2A2A] hover:border-[#FFD700]/50 bg-[#0A0A0A]"}`}
              onClick={() => !img && inputRef.current?.click()}
            >
              {img ? (
                <>
                  <Image
                    src={img}
                    alt={`Foto ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                    unoptimized={img.startsWith("data:")}
                  />
                  {/* Overlay with remove + primary badge */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="w-8 h-8 rounded-full bg-red-500/90 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {isFirst && (
                    <span className="absolute top-1 left-1 text-[9px] font-heading font-black bg-[#FFD700] text-[#0A0A0A] px-1.5 py-0.5 rounded">
                      CAPA
                    </span>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[#6B6B6B]">
                  {processing ? (
                    <div className="w-5 h-5 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 opacity-40" />
                      <span className="text-[9px] font-body opacity-60">
                        {isFirst ? "Capa" : `Foto ${idx + 1}`}
                      </span>
                    </>
                  )}
                </div>
              )}
              {errors[idx] && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 px-1 py-0.5">
                  <p className="text-white text-[8px] font-body text-center truncate">{errors[idx]}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            const startIdx = images.filter(Boolean).length;
            handleFiles(e.target.files, startIdx);
          }
          e.target.value = "";
        }}
      />

      <p className="text-[10px] text-[#6B6B6B] font-body">
        PNG, JPG, WEBP — máx. {MAX_FILE_SIZE_MB}MB por foto. A primeira foto é usada como capa.
      </p>
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
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [featuresInput, setFeaturesInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = vehicleList.filter(
    (v) =>
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingVehicle(null);
    setFormData(emptyVehicle);
    setImageFiles([]);
    setFeaturesInput("");
    setModalOpen(true);
    setSaved(false);
    setError(null);
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
      images: v.images ?? (v.image ? [v.image] : []),
      features: v.features,
      color: v.color ?? "",
      fuel: v.fuel ?? "",
      stage: v.stage,
      highlighted: v.highlighted,
    });
    setFeaturesInput(v.features.join(", "));
    setImageFiles([]);
    setModalOpen(true);
    setSaved(false);
    setError(null);
  };

  const saveVehicle = async () => {
    setError(null);
    if (!formData.brand.trim() || !formData.model.trim()) {
      setError("Por favor, preencha a Marca e o Modelo do veículo.");
      return;
    }

    setSaving(true);
    try {
      const features = featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const slug = `${formData.brand}-${formData.model}-${formData.year}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const supabase = createClient();
      const currentImages = formData.images ?? [];
      const uploadedImages: string[] = [];

      // Upload each image that is a File
      for (let i = 0; i < currentImages.length; i++) {
        const img = currentImages[i];
        const file = imageFiles[i];

        if (file && img?.startsWith("data:")) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from("vehicle-images")
            .upload(fileName, file);

          if (!uploadError) {
            const { data } = supabase.storage
              .from("vehicle-images")
              .getPublicUrl(fileName);
            uploadedImages.push(data.publicUrl);
          } else {
            console.error("Storage upload error:", uploadError);
            throw new Error(`Falha ao subir a foto ${i + 1}: ${uploadError.message}`);
          }
        } else {
          uploadedImages.push(img);
        }
      }

      const finalImages = uploadedImages.filter(Boolean);
      const mainImage = finalImages[0] ?? formData.image ?? "";

      const vehiclePayload = {
        ...formData,
        features,
        slug,
        image: mainImage,
        images: finalImages,
      };

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehiclePayload);
      } else {
        await addVehicle(vehiclePayload);
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setModalOpen(false);
        setSaved(false);
      }, 800);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ocorreu um erro ao salvar o veículo. Verifique se preencheu todos os dados corretamente.");
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => setDeleteId(id);
  const executeDelete = () => {
    if (deleteId) {
      deleteVehicle(deleteId);
      setDeleteId(null);
    }
  };

  const stats = {
    total: vehicleList.length,
    disponivel: vehicleList.filter((v) => v.status === "disponivel").length,
    reservado: vehicleList.filter((v) => v.status === "reservado").length,
    vendido: vehicleList.filter((v) => v.status === "vendido").length,
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-black text-white text-2xl md:text-3xl">Inventário</h1>
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: Car, color: "text-[#FFD700]" },
          { label: "Disponíveis", value: stats.disponivel, icon: Check, color: "text-[#22C55E]" },
          { label: "Reservados", value: stats.reservado, icon: BarChart3, color: "text-[#F59E0B]" },
          { label: "Vendidos", value: stats.vendido, icon: X, color: "text-[#EF4444]" },
        ].map((s) => (
          <div key={s.label} className="bg-[#141414] rounded-xl p-4 md:p-5 border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#6B6B6B] font-body text-xs uppercase tracking-wider">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`font-heading font-black text-2xl md:text-3xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
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

      {/* Desktop Table */}
      <div className="bg-[#141414] rounded-2xl border border-[#2A2A2A] overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Veículo", "Categoria", "Fotos", "Ano / Km", "Preço", "Status", "Ações"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[#6B6B6B] font-body text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((v) => {
                  const allImages = v.images?.length ? v.images : v.image ? [v.image] : [];
                  return (
                    <motion.tr
                      key={v.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-[#2A2A2A] last:border-0 hover:bg-[#1A1A1A] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-[#1A1A1A]">
                            {allImages[0] ? (
                              <Image src={allImages[0]} alt={v.model} fill className="object-cover" sizes="64px" unoptimized={allImages[0].startsWith("data:")} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-5 h-5 text-[#2A2A2A]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[#6B6B6B] text-xs font-body">{v.brand}</p>
                            <p className="font-heading font-bold text-white text-sm">{v.model}</p>
                            {v.stage && <span className="stage-badge mt-1 inline-block">{v.stage}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#E0E0E0] font-body text-sm">{categoryLabels[v.category]}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-[#6B6B6B] font-body text-sm">
                          <Images className="w-3.5 h-3.5" />
                          {allImages.length}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-body text-sm">{v.year}</p>
                        <p className="text-[#6B6B6B] font-body text-xs">{formatMileage(v.mileage)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#FFD700] font-heading font-bold text-sm">{formatPrice(v.price)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-body font-medium px-3 py-1 rounded-full status-${v.status}`}>
                          {statusLabels[v.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button id={`edit-${v.id}`} onClick={() => openEdit(v)} className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button id={`delete-${v.id}`} onClick={() => confirmDelete(v.id)} className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <p className="text-[#6B6B6B] font-body">Nenhum veículo encontrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        <AnimatePresence>
          {filtered.map((v) => {
            const allImages = v.images?.length ? v.images : v.image ? [v.image] : [];
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-[#141414] rounded-xl border border-[#2A2A2A] overflow-hidden">
                <div className="flex gap-3 p-3">
                  <div className="w-20 h-16 rounded-lg overflow-hidden relative flex-shrink-0 bg-[#1A1A1A]">
                    {allImages[0] ? (
                      <Image src={allImages[0]} alt={v.model} fill className="object-cover" sizes="80px" unoptimized={allImages[0].startsWith("data:")} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Car className="w-5 h-5 text-[#2A2A2A]" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#6B6B6B] text-[10px] font-body">{v.brand}</p>
                    <p className="font-heading font-bold text-white text-sm truncate">{v.model}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-body font-medium px-2 py-0.5 rounded-full status-${v.status}`}>{statusLabels[v.status]}</span>
                      <span className="text-[#FFD700] font-heading font-bold text-xs">{formatPrice(v.price)}</span>
                    </div>
                    <p className="text-[#6B6B6B] text-[10px] font-body mt-0.5">{v.year} · {formatMileage(v.mileage)} · {allImages.length} foto{allImages.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(v)} className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => confirmDelete(v.id)} className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-16"><p className="text-[#6B6B6B] font-body">Nenhum veículo encontrado.</p></div>
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
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                {/* ── Multi-Image Upload ── */}
                <MultiImageUpload
                  images={formData.images ?? []}
                  imageFiles={imageFiles}
                  onChange={(imgs, files) => {
                    setFormData({ ...formData, images: imgs, image: imgs[0] ?? "" });
                    setImageFiles(files);
                  }}
                />

                {/* ── Brand / Model ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Marca *</label>
                    <input type="text" placeholder="Ex: Honda" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Modelo *</label>
                    <input type="text" placeholder="Ex: Civic Sport" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
                  </div>
                </div>

                {/* ── Year / Price / KM ── */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Ano</label>
                    <input type="number" min={1980} max={2027} value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Preço (R$)</label>
                    <input type="number" min={0} value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Km</label>
                    <input type="number" min={0} value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })} />
                  </div>
                </div>

                {/* ── Category / Status ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Categoria</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as VehicleCategory })}>
                      <option value="suv">SUV</option>
                      <option value="hatch">Hatch</option>
                      <option value="sedan">Sedan</option>
                      <option value="moto">Moto</option>
                      <option value="picape">Picape</option>
                      <option value="utilitario">Utilitário</option>
                      <option value="tuning">Tuning / Preparado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}>
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
                    <input type="text" placeholder="Ex: Prata" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Combustível</label>
                    <input type="text" placeholder="Ex: Flex" value={formData.fuel} onChange={(e) => setFormData({ ...formData, fuel: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Stage</label>
                    <input type="text" placeholder="Stage 1, 2..." value={formData.stage ?? ""} onChange={(e) => setFormData({ ...formData, stage: e.target.value || undefined })} />
                  </div>
                </div>

                {/* ── Features ── */}
                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                    Opcionais <span className="font-normal">(separados por vírgula)</span>
                  </label>
                  <input type="text" placeholder="Teto Solar, Bancos de Couro, Multimídia..." value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} />
                </div>

                {/* ── Description ── */}
                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Descrição</label>
                  <textarea rows={3} placeholder="Descreva o veículo..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ resize: "vertical" }} />
                </div>

                {/* ── Highlight ── */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setFormData({ ...formData, highlighted: !formData.highlighted })}
                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${formData.highlighted ? "bg-[#FFD700]" : "bg-[#2A2A2A]"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.highlighted ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                  <span className="text-sm font-body text-[#E0E0E0]">Destacar no estoque</span>
                </label>

                {error && (
                  <div className="text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-xs font-body leading-relaxed text-center">
                    ⚠️ {error}
                  </div>
                )}

                {/* ── Actions ── */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-[#2A2A2A] text-[#E0E0E0] font-heading font-semibold hover:bg-[#1A1A1A] transition-colors">
                    Cancelar
                  </button>
                  <motion.button
                    id="admin-save-vehicle"
                    onClick={saveVehicle}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={saving}
                    className={`flex-1 py-3 rounded-xl font-heading font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
                      saved ? "bg-[#22C55E] text-white" : "bg-[#FFD700] text-[#0A0A0A] hover:bg-[#E6C200] shadow-[0_4px_15px_rgba(255,215,0,0.3)]"
                    }`}
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                    ) : saved ? (
                      <><Check className="w-4 h-4" /> Salvo!</>
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
              <h3 className="font-heading font-black text-white text-xl mb-2">Remover Veículo?</h3>
              <p className="text-[#6B6B6B] font-body text-sm mb-8">
                O veículo será removido do estoque e não aparecerá mais no site.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl border border-[#2A2A2A] text-[#E0E0E0] font-heading font-semibold hover:bg-[#1A1A1A] transition-colors">
                  Cancelar
                </button>
                <button id="admin-confirm-delete" onClick={executeDelete} className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white font-heading font-bold hover:bg-[#DC2626] transition-colors">
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
