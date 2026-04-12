import type { User } from "@/types";
import { registerUserInList, getUserRole } from "@/lib/access";

const USER_KEY = "internosmed_user";
const PROFILE_KEY = "internosmed_profile";

export function validateUFGEmail(email: string): boolean {
  const allowed = ["@ufg.br", "@discente.ufg.br", "@estudante.ufg.br", "@medico.ufg.br"];
  return allowed.some((domain) => email.toLowerCase().endsWith(domain));
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user: User = JSON.parse(raw);
    // Always sync role from user list
    if (user.email) {
      user.role = getUserRole(user.email);
    }
    return user;
  } catch {
    return null;
  }
}

export function storeUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Persist profile data separately so it survives logout
  localStorage.setItem(PROFILE_KEY + "_" + user.email, JSON.stringify(user));
  // Register in global user list
  registerUserInList({ id: user.id, name: user.name, email: user.email });
}

/** Restore saved profile data for a given email */
function getStoredProfile(email: string): User | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY + "_" + email);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearUser(): void {
  // Only remove the active session, NOT the profile data
  localStorage.removeItem(USER_KEY);
}

export function mockLogin(email: string, _password: string): User | null {
  if (!validateUFGEmail(email)) return null;
  // First check if there's an active session
  const stored = getStoredUser();
  if (stored && stored.email === email) return stored;
  // Then check if there's saved profile data for this email
  const profile = getStoredProfile(email);
  if (profile) {
    storeUser(profile);
    return profile;
  }
  return null;
}

export function mockRegister(
  name: string,
  email: string,
  crm: string,
  specialty: string,
  turma: string
): User {
  // Check if profile already exists — merge with existing data
  const existing = getStoredProfile(email);
  const user: User = {
    id: existing?.id || crypto.randomUUID(),
    name: name || existing?.name || "",
    email,
    crm: crm || existing?.crm || "",
    specialty: specialty || existing?.specialty || "",
    turma: turma || existing?.turma || "",
    role: existing?.role || "free",
    // Preserve all profile fields from previous sessions
    cargo: existing?.cargo,
    matricula: existing?.matricula || "",
    rqe: existing?.rqe || "",
    phone: existing?.phone || "",
    dataNascimento: existing?.dataNascimento || "",
    address: existing?.address || "",
    institution: existing?.institution || "",
    profileComplete: existing?.profileComplete || false,
  };
  storeUser(user);
  return user;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
