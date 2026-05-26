"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface AuthContextValue {
  credentials: {
    username: string;
    passwordHash: string; // for simplicity, we'll store plain for now since it's demo before supabase
    recoveryEmail: string;
  };
  isLoaded: boolean;
  updateCredentials: (username: string, passwordHash: string, recoveryEmail: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_STORAGE_KEY = "pv-admin-settings-v1";

const defaultCredentials = {
  username: "admin",
  passwordHash: "12345678", // Plain text until supabase
  recoveryEmail: "dono@popularveiculos.com.br",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState(defaultCredentials);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        setCredentials(JSON.parse(raw));
      }
    } catch {
      setCredentials(defaultCredentials);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateCredentials = useCallback(
    (username: string, passwordHash: string, recoveryEmail: string) => {
      const newCreds = { username, passwordHash, recoveryEmail };
      setCredentials(newCreds);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newCreds));
    },
    []
  );

  return (
    <AuthContext.Provider value={{ credentials, isLoaded, updateCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
