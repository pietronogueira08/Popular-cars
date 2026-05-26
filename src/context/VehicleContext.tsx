"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Vehicle } from "@/types/vehicle";
import { createClient } from "@/utils/supabase/client";

interface VehicleContextType {
  vehicles: Vehicle[];
  isLoaded: boolean;
  addVehicle: (v: Omit<Vehicle, "id">) => Promise<void>;
  updateVehicle: (id: string, v: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  refreshVehicles: () => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabase = createClient();

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setVehicles(data as Vehicle[]);
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const addVehicle = async (vehicle: Omit<Vehicle, "id">) => {
    const { data, error } = await supabase
      .from("vehicles")
      .insert([vehicle])
      .select()
      .single();

    if (!error && data) {
      setVehicles((prev) => [data as Vehicle, ...prev]);
    } else {
      console.error("Error adding vehicle:", error);
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    const { data, error } = await supabase
      .from("vehicles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setVehicles((prev) => prev.map((v) => (v.id === id ? (data as Vehicle) : v)));
    } else {
      console.error("Error updating vehicle:", error);
    }
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (!error) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } else {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        isLoaded,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        refreshVehicles: fetchVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error("useVehicles must be used within a VehicleProvider");
  }
  return context;
}
