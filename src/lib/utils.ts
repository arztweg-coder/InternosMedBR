import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function todayBR(): string {
  return formatDate(new Date());
}

export function isoToBR(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function brToISO(br: string): string {
  if (!br) return "";
  const [d, m, y] = br.split("/");
  return `${y}-${m}-${d}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}
