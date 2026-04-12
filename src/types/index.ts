import type { UserRole } from "@/lib/access";

export type { UserRole };

/** Cargo/função do usuário no HC-UFG */
export type UserCargo = "interno" | "residente" | "preceptor" | "enfermagem" | "colaborador";

export interface User {
  id: string;
  name: string;
  email: string;
  crm?: string;
  rqe?: string;
  specialty?: string;
  turma?: string;
  institution?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
  /** Cargo selecionado no cadastro */
  cargo?: UserCargo;
  /** Matrícula institucional */
  matricula?: string;
  /** Data de nascimento (ISO string) */
  dataNascimento?: string;
  /** Se true, o perfil inicial já foi preenchido */
  profileComplete?: boolean;
}

export interface MedicationItem {
  id: string;
  via: string;
  item: string;
  apresentacao: string;
  quantidade: string;
  posologia: string;
}

export interface LMEMedItem {
  id: string;
  nome: string;
  qtd1: string;
  qtd2: string;
  qtd3: string;
  qtd4: string;
  qtd5: string;
  qtd6: string;
}

export interface HistoryEntry {
  id: string;
  type: string;
  label: string;
  patientName: string;
  date: string;
  createdAt: string;
}

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
};
