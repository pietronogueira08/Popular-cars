"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Vehicle } from "@/types/vehicle";
import { vehicles as mockVehicles } from "@/lib/vehicles";

// ─────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────
interface VehicleContextValue {
  vehicles: Vehicle[];
  isLoaded: boolean;
  addVehicle: (v: Vehicle) => void;
  updateVehicle: (v: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  resetToMock: () => void;
}

const VehicleContext = createContext<VehicleContextValue | null>(null);

const STORAGE_KEY = "pv-vehicles-v1";

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage (or fallback to mock data)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Vehicle[];
        setVehicles(parsed);
      } else {
        setVehicles(mockVehicles);
      }
    } catch {
      setVehicles(mockVehicles);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage whenever vehicles change (after hydration)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch (err) {
      // Quota exceeded — e.g. too many base64 images
      console.warn("localStorage quota exceeded, some images may not persist.", err);
    }
  }, [vehicles, isLoaded]);

  const addVehicle = useCallback((v: Vehicle) => {
    setVehicles((prev) => [v, ...prev]);
  }, []);

  const updateVehicle = useCallback((v: Vehicle) => {
    setVehicles((prev) => prev.map((existing) => (existing.id === v.id ? v : existing)));
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const resetToMock = useCallback(() => {
    setVehicles(mockVehicles);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <VehicleContext.Provider
      value={{ vehicles, isLoaded, addVehicle, updateVehicle, deleteVehicle, resetToMock }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useVehicles() {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicles must be used inside <VehicleProvider>");
  return ctx;
}
