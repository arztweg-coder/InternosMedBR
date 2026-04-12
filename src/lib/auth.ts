import type { User } from "@/types";
import { registerUserInList, getUserRole } from "@/lib/access";

const USER_KEY = "internosmed_user";
const PROFILE_PREFIX = "internosmed_profile_";

// ============================================================================
// CORREÇÃO CRÍTICA: Sistema de persistência aprimorado
// ============================================================================
// PROBLEMA: Dados sendo perdidos ao fazer logout/login
// SOLUÇÃO: Salvar SEMPRE que qualquer dado mudar + validação de integridade
// ============================================================================

export function validateUFGEmail(email: string): boolean {
  const allowed = ["@ufg.br", "@discente.ufg.br", "@estudante.ufg.br", "@medico.ufg.br", "@ebserh.gov.br"];
  return allowed.some((domain) => email.toLowerCase().endsWith(domain));
}

/**
 * Salva perfil do usuário de forma PERSISTENTE
 * Esta função SEMPRE salva em ambos os locais (sessão + perfil persistente)
 */
function saveProfilePersistent(user: User): void {
  try {
    const profileKey = PROFILE_PREFIX + user.email;
    const userData = JSON.stringify(user);
    
    // Salvar em AMBOS os locais SEMPRE
    localStorage.setItem(USER_KEY, userData);           // Sessão atual
    localStorage.setItem(profileKey, userData);         // Perfil persistente
    
    // Debug log (remover em produção)
    console.log(`✅ Perfil salvo: ${user.email}`, {
      nome: user.name,
      crm: user.crm,
      cargo: user.cargo,
      phone: user.phone
    });
  } catch (error) {
    console.error("❌ Erro ao salvar perfil:", error);
  }
}

/**
 * Carrega perfil persistente do usuário
 */
function loadProfilePersistent(email: string): User | null {
  try {
    const profileKey = PROFILE_PREFIX + email;
    const raw = localStorage.getItem(profileKey);
    if (!raw) return null;
    
    const user: User = JSON.parse(raw);
    
    // Validar integridade dos dados
    if (!user.email || !user.id) {
      console.warn("⚠️ Perfil corrompido detectado, removendo...");
      localStorage.removeItem(profileKey);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error("❌ Erro ao carregar perfil:", error);
    return null;
  }
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user: User = JSON.parse(raw);
    
    // SEMPRE sincronizar role da lista de usuários
    if (user.email) {
      user.role = getUserRole(user.email);
    }
    
    return user;
  } catch (error) {
    console.error("❌ Erro ao obter usuário:", error);
    return null;
  }
}

export function storeUser(user: User): void {
  // Salvar de forma persistente (ambos os locais)
  saveProfilePersistent(user);
  
  // Registrar na lista global de usuários
  registerUserInList({ id: user.id, name: user.name, email: user.email });
}

/**
 * ATUALIZAR perfil do usuário
 * Esta função deve ser chamada TODA VEZ que qualquer dado mudar
 */
export function updateUserProfile(updates: Partial<User>): User | null {
  const current = getStoredUser();
  if (!current) {
    console.error("❌ Nenhum usuário logado para atualizar");
    return null;
  }
  
  // Mesclar atualizações com dados existentes
  const updated: User = {
    ...current,
    ...updates,
    // NUNCA sobrescrever estes campos críticos
    id: current.id,
    email: current.email,
  };
  
  // Salvar imediatamente
  saveProfilePersistent(updated);
  
  console.log("✅ Perfil atualizado:", updates);
  return updated;
}

export function clearUser(): void {
  // Remove APENAS a sessão ativa, NÃO o perfil persistente
  localStorage.removeItem(USER_KEY);
  console.log("🔓 Logout realizado (perfil preservado)");
}

export function mockLogin(email: string, _password: string): User | null {
  if (!validateUFGEmail(email)) {
    console.warn("⚠️ Email não autorizado:", email);
    return null;
  }
  
  // 1. Verificar sessão ativa
  const stored = getStoredUser();
  if (stored && stored.email === email) {
    console.log("✅ Sessão ativa encontrada:", email);
    return stored;
  }
  
  // 2. Carregar perfil persistente
  const profile = loadProfilePersistent(email);
  if (profile) {
    // Restaurar sessão com perfil persistente
    storeUser(profile);
    console.log("✅ Perfil restaurado do localStorage:", email);
    return profile;
  }
  
  console.log("⚠️ Nenhum perfil encontrado para:", email);
  return null;
}

export function mockRegister(
  name: string,
  email: string,
  crm: string,
  specialty: string,
  turma: string
): User {
  // Verificar se já existe perfil salvo
  const existing = loadProfilePersistent(email);
  
  // Criar usuário mesclando com dados existentes
  const user: User = {
    id: existing?.id || crypto.randomUUID(),
    name: name || existing?.name || "",
    email,
    crm: crm || existing?.crm || "",
    specialty: specialty || existing?.specialty || "",
    turma: turma || existing?.turma || "",
    role: existing?.role || getUserRole(email) || "free",
    
    // PRESERVAR TODOS os campos do perfil anterior
    cargo: existing?.cargo || "",
    matricula: existing?.matricula || "",
    rqe: existing?.rqe || "",
    phone: existing?.phone || "",
    dataNascimento: existing?.dataNascimento || "",
    address: existing?.address || "",
    institution: existing?.institution || "",
    profileComplete: existing?.profileComplete || false,
  };
  
  // Salvar de forma persistente
  storeUser(user);
  
  console.log("✅ Usuário registrado/atualizado:", email);
  return user;
}

/**
 * Limpar COMPLETAMENTE um perfil (para debugging)
 * USE COM CUIDADO - Remove tudo do usuário
 */
export function deleteUserProfile(email: string): void {
  const profileKey = PROFILE_PREFIX + email;
  localStorage.removeItem(profileKey);
  localStorage.removeItem(USER_KEY);
  console.log("🗑️ Perfil deletado completamente:", email);
}

/**
 * Listar todos os perfis salvos (para debugging)
 */
export function listAllProfiles(): string[] {
  const profiles: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PROFILE_PREFIX)) {
      const email = key.replace(PROFILE_PREFIX, "");
      profiles.push(email);
    }
  }
  return profiles;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ============================================================================
// EXPORTAR TAMBÉM a função de atualização para usar em componentes
// ============================================================================
export { updateUserProfile as updateProfile };
