/**
 * Stamp (Carimbo) utility — reads doctor profile from localStorage
 * and returns a structured stamp object for use in print sections.
 */
import { getStoredUser } from "@/lib/auth";

export interface DoctorStamp {
  name: string;
  crm: string;
  rqe: string;
  specialty: string;
  institution: string;
  phone: string;
  address: string;
}

const STAMP_KEY = "internosmed_stamp";

export function getStamp(): DoctorStamp {
  try {
    const raw = localStorage.getItem(STAMP_KEY);
    if (raw) return JSON.parse(raw) as DoctorStamp;
  } catch { /* empty */ }
  // Fall back to user profile
  const user = getStoredUser();
  return {
    name: user?.name || "",
    crm: user?.crm || "",
    rqe: "",
    specialty: user?.specialty || "",
    institution: user?.institution || "HC-UFG – Hospital das Clínicas da UFG",
    phone: user?.phone || "",
    address: user?.address || "",
  };
}

export function saveStamp(stamp: DoctorStamp): void {
  localStorage.setItem(STAMP_KEY, JSON.stringify(stamp));
}
