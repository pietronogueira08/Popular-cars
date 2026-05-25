"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, Check, Car, BarChart3 } from "lucide-react";
import Image from "next/image";
import { vehicles as initialVehicles, formatPrice, formatMileage } from "@/lib/vehicles";
import { Vehicle, VehicleStatus, VehicleCategory } from "@/types/vehicle";

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
  image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
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

export default function AdminDashboardPage() {
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(initialVehicles);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<EditableVehicle>(emptyVehicle);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [featuresInput, setFeaturesInput] = useState("");

  const filtered = vehicleList.filter(
    (v) =>
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingVehicle(null);
    setFormData(emptyVehicle);
    setFeaturesInput("");
    setModalOpen(true);
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
    setModalOpen(true);
  };

  const saveVehicle = () => {
    const features = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const slug = `${formData.brand}-${formData.model}-${formData.year}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (editingVehicle) {
      setVehicleList((prev) =>
        prev.map((v) =>
          v.id === editingVehicle.id
            ? { ...editingVehicle, ...formData, features, slug }
            : v
        )
      );
    } else {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        slug,
        ...formData,
        features,
      };
      setVehicleList((prev) => [newVehicle, ...prev]);
    }
    setModalOpen(false);
  };

  const confirmDelete = (id: string) => setDeleteId(id);

  const executeDelete = () => {
    if (deleteId) {
      setVehicleList((prev) => prev.filter((v) => v.id !== deleteId));
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
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-heading font-black text-white text-3xl">
            Inventário
          </h1>
          <p className="text-[#6B6B6B] font-body text-sm mt-1">
            Gerencie o estoque de veículos
          </p>
        </div>
        <motion.button
          id="admin-add-vehicle"
          onClick={openCreate}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-[#FFD700] text-[#0A0A0A] font-heading font-bold px-5 py-3 rounded-xl shadow-[0_4px_15px_rgba(255,215,0,0.3)] hover:bg-[#E6C200] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Veículo
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, icon: Car, color: "text-[#FFD700]" },
          { label: "Disponíveis", value: stats.disponivel, icon: Check, color: "text-[#22C55E]" },
          { label: "Reservados", value: stats.reservado, icon: BarChart3, color: "text-[#F59E0B]" },
          { label: "Vendidos", value: stats.vendido, icon: X, color: "text-[#EF4444]" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#141414] rounded-xl p-5 border border-[#2A2A2A]"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#6B6B6B] font-body text-xs uppercase tracking-wider">
                {s.label}
              </p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`font-heading font-black text-3xl ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
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

      {/* Table */}
      <div className="bg-[#141414] rounded-2xl border border-[#2A2A2A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Veículo", "Categoria", "Ano / Km", "Preço", "Status", "Ações"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-[#6B6B6B] font-body text-xs uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
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
                        <div className="w-16 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                          <Image
                            src={v.image}
                            alt={v.model}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="text-[#6B6B6B] text-xs font-body">
                            {v.brand}
                          </p>
                          <p className="font-heading font-bold text-white text-sm">
                            {v.model}
                          </p>
                          {v.stage && (
                            <span className="stage-badge mt-1 inline-block">
                              {v.stage}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-[#E0E0E0] font-body text-sm">
                        {categoryLabels[v.category]}
                      </span>
                    </td>

                    {/* Year / Km */}
                    <td className="px-6 py-4">
                      <p className="text-white font-body text-sm">{v.year}</p>
                      <p className="text-[#6B6B6B] font-body text-xs">
                        {formatMileage(v.mileage)}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <p className="text-[#FFD700] font-heading font-bold text-sm">
                        {formatPrice(v.price)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-body font-medium px-3 py-1 rounded-full status-${v.status}`}
                      >
                        {statusLabels[v.status]}
                      </span>
                    </td>

                    {/* Actions */}
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
                    <p className="text-[#6B6B6B] font-body">
                      Nenhum veículo encontrado.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] rounded-2xl p-8 w-full max-w-2xl border border-[#2A2A2A] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading font-black text-white text-xl">
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
                {/* Image preview */}
                {formData.image && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="600px"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-3 gap-4">
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
                    <label className="text-[#6B6B6B] text-xs font-body mb-1 block">Km Rodados</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-3 gap-4">
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
                      placeholder="Stage 1, 2, 3..."
                      value={formData.stage ?? ""}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value || undefined })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-1 block">URL da Foto</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[#6B6B6B] text-xs font-body mb-1 block">
                    Opcionais (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="Teto Solar, Bancos de Couro, Multimídia..."
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                  />
                </div>

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

                <div className="flex gap-4 pt-2">
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
                    className="flex-1 py-3 rounded-xl bg-[#FFD700] text-[#0A0A0A] font-heading font-bold hover:bg-[#E6C200] transition-colors shadow-[0_4px_15px_rgba(255,215,0,0.3)]"
                  >
                    {editingVehicle ? "Salvar Alterações" : "Criar Veículo"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
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
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="font-heading font-black text-white text-xl mb-2">
                Remover Veículo?
              </h3>
              <p className="text-[#6B6B6B] font-body text-sm mb-8">
                Esta ação não pode ser desfeita.
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
