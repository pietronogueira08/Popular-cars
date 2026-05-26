"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { Testimonial, NewTestimonial, EditableTestimonial } from "@/types/testimonial";

// ─── Fallback mock data (used when DB is not yet set up) ───
const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "mock-1",
    client_name: "Marcos Vinícius Silva",
    location: "São Paulo/SP",
    vehicle_info: "Trocou por um VW T-Cross 2023",
    rating: 5,
    text_content:
      "Troquei meu Gol 2016 e recebi um valor muito acima do que esperava. O processo foi transparente do início ao fim — apresentaram a vistoria completa antes mesmo de eu pedir. Saí com o T-Cross emplacado em menos de 5 dias. Atendimento impecável do Rodrigo!",
    avatar_url: null,
    is_approved: true,
    created_at: "2025-03-15T10:00:00Z",
  },
  {
    id: "mock-2",
    client_name: "Fernanda Cristina Oliveira",
    location: "Campinas/SP",
    vehicle_info: "Comprou uma Honda CB 1000R 2024",
    rating: 5,
    text_content:
      "Sempre tive receio de comprar moto em revenda, mas a Popular Veículos quebrou todos os meus preconceitos. A CB 1000R estava impecável, exatamente como anunciada. Revisão em dia, nota fiscal emitida e entregaram até o capacete de brinde. Nota 10, com certeza volto!",
    avatar_url: null,
    is_approved: true,
    created_at: "2025-01-22T14:30:00Z",
  },
  {
    id: "mock-3",
    client_name: "Ricardo Mendes Costa",
    location: "Santo André/SP",
    vehicle_info: "Comprou uma Toyota Hilux SW4 2022",
    rating: 5,
    text_content:
      "Pesquisei bastante antes de ir na Popular Veículos. A Hilux SW4 estava com preço justo e, diferente de outras revendas, me deixaram levar para uma vistoria independente sem problema algum. Isso passa confiança. Financiamento aprovado em 24h. Recomendo de olhos fechados!",
    avatar_url: null,
    is_approved: true,
    created_at: "2025-02-10T09:15:00Z",
  },
  {
    id: "mock-4",
    client_name: "Amanda Santos Rocha",
    location: "Osasco/SP",
    vehicle_info: "Comprou um VW Polo GTS 2022",
    rating: 5,
    text_content:
      "Encontrei o Polo GTS no Instagram da loja e fui pessoalmente. O carro era ainda melhor do que nas fotos! O time de vendas é super atencioso e honesto, sem pressão nenhuma. Entrega rápida e com laço surpresa no carro. Amei a experiência, super indico!",
    avatar_url: null,
    is_approved: true,
    created_at: "2025-04-05T11:00:00Z",
  },
  {
    id: "mock-5",
    client_name: "Paulo Henrique Almeida",
    location: "Guarulhos/SP",
    vehicle_info: "Comprou um Gol AP 1.8 Stage 2 Forjado",
    rating: 5,
    text_content:
      "Comprei o Gol preparado Stage 2 e ficou melhor do que eu esperava — entregaram todos os comprovantes das peças instaladas, com laudo do preparador. A garantia foi honrada quando surgiu um ajuste no câmbio. Suporte pós-venda presente de verdade. Equipe top!",
    avatar_url: null,
    is_approved: true,
    created_at: "2025-05-01T16:45:00Z",
  },
];

interface TestimonialContextValue {
  // Public (approved only)
  publicTestimonials: Testimonial[];
  loadingPublic: boolean;
  // Admin (all)
  allTestimonials: Testimonial[];
  loadingAdmin: boolean;
  // CRUD
  addTestimonial: (data: NewTestimonial, avatarFile?: File) => Promise<void>;
  updateTestimonial: (id: string, data: EditableTestimonial, avatarFile?: File) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  toggleApproval: (id: string, current: boolean) => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const TestimonialContext = createContext<TestimonialContextValue | null>(null);

export function TestimonialProvider({ children }: { children: ReactNode }) {
  const [publicTestimonials, setPublicTestimonials] = useState<Testimonial[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [useMock, setUseMock] = useState(false);

  const supabase = createClient();

  // ── Fetch public (approved only) ──────────────────────────────────────────
  useEffect(() => {
    const fetchPublic = async () => {
      setLoadingPublic(true);
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error || !data) {
        // Table might not exist yet — use mock data
        setUseMock(true);
        setPublicTestimonials(MOCK_TESTIMONIALS.filter((t) => t.is_approved));
      } else {
        setPublicTestimonials(data as Testimonial[]);
      }
      setLoadingPublic(false);
    };
    fetchPublic();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch all (admin) ─────────────────────────────────────────────────────
  const refreshAdmin = useCallback(async () => {
    setLoadingAdmin(true);
    if (useMock) {
      setAllTestimonials(MOCK_TESTIMONIALS);
      setLoadingAdmin(false);
      return;
    }
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAllTestimonials(data as Testimonial[]);
    }
    setLoadingAdmin(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMock]);

  // ── Upload avatar ─────────────────────────────────────────────────────────
  const uploadAvatar = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `avatar-${Date.now()}-${Math.random()}.${ext}`;
    const { error } = await supabase.storage
      .from("testimonial-avatars")
      .upload(fileName, file);
    if (error) return null;
    const { data } = supabase.storage
      .from("testimonial-avatars")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  // ── Add ───────────────────────────────────────────────────────────────────
  const addTestimonial = async (data: NewTestimonial, avatarFile?: File) => {
    let avatarUrl = data.avatar_url;
    if (avatarFile) {
      avatarUrl = await uploadAvatar(avatarFile);
    }
    const payload = { ...data, avatar_url: avatarUrl };

    if (useMock) {
      const newItem: Testimonial = {
        ...payload,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      setAllTestimonials((prev) => [newItem, ...prev]);
      if (newItem.is_approved) {
        setPublicTestimonials((prev) => [newItem, ...prev]);
      }
      return;
    }

    const { data: inserted, error } = await supabase
      .from("testimonials")
      .insert([payload])
      .select()
      .single();

    if (!error && inserted) {
      setAllTestimonials((prev) => [inserted as Testimonial, ...prev]);
      if ((inserted as Testimonial).is_approved) {
        setPublicTestimonials((prev) => [inserted as Testimonial, ...prev]);
      }
    }
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const updateTestimonial = async (
    id: string,
    data: EditableTestimonial,
    avatarFile?: File
  ) => {
    let avatarUrl = data.avatar_url;
    if (avatarFile) {
      avatarUrl = await uploadAvatar(avatarFile);
    }
    const payload = { ...data, avatar_url: avatarUrl };

    if (useMock) {
      setAllTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...payload } : t))
      );
      setPublicTestimonials((prev) =>
        prev
          .filter((t) => t.id !== id || payload.is_approved)
          .map((t) => (t.id === id ? { ...t, ...payload } : t))
      );
      return;
    }

    const { data: updated, error } = await supabase
      .from("testimonials")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (!error && updated) {
      const u = updated as Testimonial;
      setAllTestimonials((prev) => prev.map((t) => (t.id === id ? u : t)));
      setPublicTestimonials((prev) => {
        const without = prev.filter((t) => t.id !== id);
        return u.is_approved ? [u, ...without] : without;
      });
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteTestimonial = async (id: string) => {
    if (useMock) {
      setAllTestimonials((prev) => prev.filter((t) => t.id !== id));
      setPublicTestimonials((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    await supabase.from("testimonials").delete().eq("id", id);
    setAllTestimonials((prev) => prev.filter((t) => t.id !== id));
    setPublicTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Toggle approval ───────────────────────────────────────────────────────
  const toggleApproval = async (id: string, current: boolean) => {
    const newVal = !current;

    if (useMock) {
      setAllTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_approved: newVal } : t))
      );
      setPublicTestimonials((prev) => {
        if (newVal) {
          const item = allTestimonials.find((t) => t.id === id);
          return item ? [{ ...item, is_approved: true }, ...prev.filter((t) => t.id !== id)] : prev;
        }
        return prev.filter((t) => t.id !== id);
      });
      return;
    }

    const { data: updated } = await supabase
      .from("testimonials")
      .update({ is_approved: newVal })
      .eq("id", id)
      .select()
      .single();

    if (updated) {
      const u = updated as Testimonial;
      setAllTestimonials((prev) => prev.map((t) => (t.id === id ? u : t)));
      setPublicTestimonials((prev) => {
        const without = prev.filter((t) => t.id !== id);
        return u.is_approved ? [u, ...without] : without;
      });
    }
  };

  return (
    <TestimonialContext.Provider
      value={{
        publicTestimonials,
        loadingPublic,
        allTestimonials,
        loadingAdmin,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        toggleApproval,
        refreshAdmin,
      }}
    >
      {children}
    </TestimonialContext.Provider>
  );
}

export function useTestimonials() {
  const ctx = useContext(TestimonialContext);
  if (!ctx) throw new Error("useTestimonials must be used inside TestimonialProvider");
  return ctx;
}
