import type { User } from "@/types";
import { registerUserInList, getUserRole } from "@/lib/access";

const USER_KEY = "internosmed_user";

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
  // Register in global user list
  registerUserInList({ id: user.id, name: user.name, email: user.email });
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function mockLogin(email: string, _password: string): User | null {
  if (!validateUFGEmail(email)) return null;
  const stored = getStoredUser();
  if (stored && stored.email === email) return stored;
  return null;
}

export function mockRegister(
  name: string,
  email: string,
  crm: string,
  specialty: string,
  turma: string
): User {
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    crm,
    specialty,
    turma,
    role: "free",
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
