import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, storeUser, clearUser, mockRegister, validateUFGEmail } from "@/lib/auth";
import type { User } from "@/types";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(getStoredUser());

  const login = useCallback(
    (email: string, _password: string): string | null => {
      if (!validateUFGEmail(email)) {
        return "Utilize um e-mail institucional da UFG (@ufg.br ou @discente.ufg.br).";
      }
      const existing = getStoredUser();
      if (existing && existing.email === email) {
        setUser(existing);
        navigate("/");
        return null;
      }
      return "Usuário não encontrado. Faça o cadastro primeiro.";
    },
    [navigate]
  );

  const register = useCallback(
    (name: string, email: string, crm: string, specialty: string, turma: string): string | null => {
      if (!validateUFGEmail(email)) {
        return "Utilize um e-mail institucional da UFG (@ufg.br ou @discente.ufg.br).";
      }
      if (!name.trim()) return "Informe seu nome completo.";
      const newUser = mockRegister(name, email, crm, specialty, turma);
      setUser(newUser);
      navigate("/");
      return null;
    },
    [navigate]
  );

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const updateUser = useCallback((updates: Partial<User>) => {
    const current = getStoredUser();
    if (!current) return;
    const updated = { ...current, ...updates };
    storeUser(updated);
    setUser(updated);
  }, []);

  return { user, login, register, logout, updateUser };
}
