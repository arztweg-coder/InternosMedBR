/**
 * Sistema de controle de acesso por plano: FREE, PREMIUM, AMBASSADOR, ADMIN
 * Configuração armazenada em localStorage pelo administrador.
 */

export type UserRole = "free" | "premium" | "ambassador" | "admin";

export interface FeatureDef {
  id: string;
  label: string;
  path: string;
  category: "document" | "tool";
  defaultFree: boolean;
  price: number; // preço mensal unitário em R$
}

export interface PlanConfig {
  features: Record<string, { free: boolean; ambassador: boolean }>;
  prices: Record<string, number>; // preço por feature em R$
  discount: number; // % de desconto admin-definido no pacote premium
  ambassadorFeatures: string[]; // quais features o embaixador acessa
}

export interface UserManagementEntry {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registeredAt: string;
}

const PLAN_CONFIG_KEY = "internosmed_plan_config";
const USER_LIST_KEY = "internosmed_user_list";

// Definição de todas as features disponíveis
export const ALL_FEATURES: FeatureDef[] = [
  { id: "exames", label: "Pedido de Exames", path: "/exames", category: "document", defaultFree: true, price: 4.9 },
  { id: "receita-simples", label: "Receita Simples", path: "/receita-simples", category: "document", defaultFree: true, price: 4.9 },
  { id: "receita-controlada", label: "Receita Controlada", path: "/receita-controlada", category: "document", defaultFree: false, price: 7.9 },
  { id: "atestado", label: "Atestado Médico", path: "/atestado", category: "document", defaultFree: true, price: 4.9 },
  { id: "alta", label: "Alta do Paciente", path: "/alta", category: "document", defaultFree: false, price: 7.9 },
  { id: "encaminhamento", label: "Encaminhamento", path: "/encaminhamento", category: "document", defaultFree: false, price: 5.9 },
  { id: "retorno", label: "Retorno / SAMIS", path: "/retorno", category: "document", defaultFree: false, price: 5.9 },
  { id: "lme", label: "LME (CEAF/SUS)", path: "/lme", category: "document", defaultFree: false, price: 9.9 },
  { id: "apac", label: "APAC", path: "/apac", category: "document", defaultFree: false, price: 9.9 },
  { id: "calculadoras", label: "Calculadoras Clínicas", path: "/calculadoras", category: "tool", defaultFree: true, price: 6.9 },
  { id: "historico", label: "Histórico de Documentos", path: "/historico", category: "tool", defaultFree: false, price: 3.9 },
  { id: "perfil", label: "Perfil / Carimbo Digital", path: "/perfil", category: "tool", defaultFree: true, price: 0 },
];

function getDefaultConfig(): PlanConfig {
  const features: Record<string, { free: boolean; ambassador: boolean }> = {};
  const prices: Record<string, number> = {};
  const ambassadorFeatures: string[] = [];

  ALL_FEATURES.forEach((f) => {
    features[f.id] = { free: f.defaultFree, ambassador: true };
    prices[f.id] = f.price;
    if (f.defaultFree || f.id === "calculadoras") ambassadorFeatures.push(f.id);
  });

  return { features, prices, discount: 20, ambassadorFeatures };
}

export function getPlanConfig(): PlanConfig {
  try {
    const raw = localStorage.getItem(PLAN_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return getDefaultConfig();
}

export function savePlanConfig(config: PlanConfig): void {
  localStorage.setItem(PLAN_CONFIG_KEY, JSON.stringify(config));
}

export function canAccessFeature(_featureId: string, _role: UserRole): boolean {
  return true;
}

export function getFreeFeatureIds(): string[] {
  const config = getPlanConfig();
  return ALL_FEATURES.filter((f) => config.features[f.id]?.free).map((f) => f.id);
}

export function getAmbassadorFeatureIds(): string[] {
  const config = getPlanConfig();
  return ALL_FEATURES.filter((f) => config.features[f.id]?.ambassador).map((f) => f.id);
}

export function getPremiumPrice(): { subtotal: number; discount: number; total: number } {
  const config = getPlanConfig();
  const subtotal = ALL_FEATURES.reduce((sum, f) => sum + (config.prices[f.id] || 0), 0);
  const discountAmount = (subtotal * config.discount) / 100;
  const total = subtotal - discountAmount;
  return { subtotal, discount: config.discount, total };
}

// User management
export function getUserList(): UserManagementEntry[] {
  try {
    const raw = localStorage.getItem(USER_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserList(list: UserManagementEntry[]): void {
  localStorage.setItem(USER_LIST_KEY, JSON.stringify(list));
}

export function registerUserInList(user: { id: string; name: string; email: string }): void {
  const list = getUserList();
  const exists = list.find((u) => u.email === user.email);
  if (!exists) {
    list.push({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "free",
      registeredAt: new Date().toISOString(),
    });
    saveUserList(list);
  }
}

export function setUserRole(email: string, role: UserRole): void {
  const list = getUserList();
  const idx = list.findIndex((u) => u.email === email);
  if (idx >= 0) {
    list[idx].role = role;
    saveUserList(list);
  }
}

export function getUserRole(email: string): UserRole {
  const list = getUserList();
  const u = list.find((u) => u.email === email);
  return u?.role || "free";
}
