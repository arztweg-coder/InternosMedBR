/**
 * auth-v2.ts
 * Sistema de Autenticação Unificado - InternosMed
 *
 * PROJETO: InternosMed - Portal do Interno de Medicina HC-UFG
 * DOMÍNIO: www.internos.med.br
 *
 * MIGRAÇÃO AUTOMÁTICA:
 * - hcufg_user → internosmed_user
 * - internacional_* → internosmed_*
 */

// ═══════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY  = 'internosmed_user';
const TOKENS_KEY   = 'internosmed_tokens';
const SESSION_KEY  = 'internosmed_session';
const ACTIVITY_KEY = 'internosmed_last_activity';

// Chaves antigas (migração automática)
const LEGACY_KEYS = {
  hcufg:                  'hcufg_user',
  internacional:          'internacional_user',
  internacional_tokens:   'internacional_tokens',
  internacional_session:  'internacional_session',
  internacional_activity: 'internacional_last_activity',
};

// Domínios autorizados
export const AUTHORIZED_DOMAINS = [
  'ufg.br',
  'discente.ufg.br',
  'ebserh.gov.br',
] as const;

export type AuthorizedDomain = typeof AUTHORIZED_DOMAINS[number];

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

export interface UserProfile {
  id: string;
  email: string;
  domain?: AuthorizedDomain;
  name: string;
  role: 'interno' | 'medico' | 'preceptor' | 'admin' | 'free';
  crm?: string;
  rqe?: string;
  specialty?: string;
  turma?: string;
  institution?: string;
  createdAt?: string;
  lastLogin?: string;
  mfaEnabled?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ═══════════════════════════════════════════════════════════════
// MIGRAÇÃO AUTOMÁTICA
// ═══════════════════════════════════════════════════════════════

/**
 * Migra dados de sistemas antigos (hcufg_user, internacional_user → internosmed_user)
 */
function migrateLegacyData(): UserProfile | null {
  const sources = [
    { key: LEGACY_KEYS.internacional, name: 'InterNACIONAL' },
    { key: LEGACY_KEYS.hcufg,         name: 'HC-UFG Legacy'  },
  ];

  for (const source of sources) {
    const dataStr = localStorage.getItem(source.key);
    if (!dataStr) continue;

    try {
      const legacyUser = JSON.parse(dataStr);
      console.log(`🔄 InternosMed — migrando de ${source.name}...`);

      const migratedUser: UserProfile = {
        id:          legacyUser.id          || generateUserId(),
        email:       legacyUser.email       || 'usuario@ufg.br',
        name:        legacyUser.name        || 'Usuário',
        role:        legacyUser.role        || 'interno',
        crm:         legacyUser.crm,
        rqe:         legacyUser.rqe,
        specialty:   legacyUser.specialty,
        turma:       legacyUser.turma,
        institution: legacyUser.institution || 'HC-UFG',
        createdAt:   legacyUser.createdAt   || new Date().toISOString(),
        lastLogin:   new Date().toISOString(),
        mfaEnabled:  legacyUser.mfaEnabled  || false,
      };

      const domain = validateEmailDomain(migratedUser.email);
      if (domain) migratedUser.domain = domain;

      setCurrentUser(migratedUser);

      // Limpar todas as chaves antigas
      localStorage.removeItem(source.key);
      Object.values(LEGACY_KEYS).forEach(k => localStorage.removeItem(k));

      console.log(`✅ InternosMed — migração concluída: ${migratedUser.email}`);
      return migratedUser;
    } catch (error) {
      console.error(`❌ Erro ao migrar de ${source.name}:`, error);
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES PRINCIPAIS
// ═══════════════════════════════════════════════════════════════

/**
 * Retorna usuário atual (com migração automática de sessões legadas)
 */
export function getCurrentUser(): UserProfile | null {
  const userStr = localStorage.getItem(STORAGE_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr) as UserProfile;
    } catch (error) {
      console.error('❌ Erro ao parsear usuário:', error);
    }
  }

  return migrateLegacyData();
}

/**
 * Salva usuário no storage
 */
export function setCurrentUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Logout com limpeza completa (chaves atuais + legadas)
 */
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKENS_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ACTIVITY_KEY);
  Object.values(LEGACY_KEYS).forEach(k => localStorage.removeItem(k));
  console.log('🚪 InternosMed — logout completo');
}

/**
 * Verifica se há sessão ativa
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// ═══════════════════════════════════════════════════════════════
// VALIDAÇÕES
// ═══════════════════════════════════════════════════════════════

export function validateEmailDomain(email: string): AuthorizedDomain | null {
  const emailLower = email.toLowerCase().trim();
  for (const domain of AUTHORIZED_DOMAINS) {
    if (emailLower.endsWith(`@${domain}`)) return domain;
  }
  return null;
}

export function extractDomain(email: string): string {
  const parts = email.toLowerCase().trim().split('@');
  return parts.length === 2 ? parts[1] : '';
}

export function getDefaultRoleByDomain(domain: AuthorizedDomain): UserProfile['role'] {
  switch (domain) {
    case 'discente.ufg.br': return 'interno';
    case 'ebserh.gov.br':   return 'medico';
    case 'ufg.br':          return 'preceptor';
    default:                return 'interno';
  }
}

export function validateCRM(crm: string): boolean {
  return /^CRM\/[A-Z]{2}\s?\d{4,6}$/i.test(crm.trim());
}

export function validateRQE(rqe: string): boolean {
  return /^RQE\s?\d{4,6}$/i.test(rqe.trim());
}

// ═══════════════════════════════════════════════════════════════
// TIMEOUT DE SESSÃO
// ═══════════════════════════════════════════════════════════════

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutos
let lastActivity = Date.now();

export function updateActivity() {
  lastActivity = Date.now();
  localStorage.setItem(ACTIVITY_KEY, String(lastActivity));
}

export function checkSessionTimeout(): boolean {
  const stored = localStorage.getItem(ACTIVITY_KEY);
  const last = stored ? parseInt(stored) : lastActivity;
  return (Date.now() - last) > SESSION_TIMEOUT;
}

export function initActivityListener() {
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
  });

  setInterval(() => {
    if (isAuthenticated() && checkSessionTimeout()) {
      logout();
      window.location.href = '/login?timeout=true';
    }
  }, 60_000);
}

// ═══════════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════════

export function generateUserId(): string {
  return `USR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function hasFullAccess(): boolean {
  return true;
}

export function getDefaultInstitution(domain: AuthorizedDomain): string {
  switch (domain) {
    case 'ufg.br':
    case 'discente.ufg.br':
      return 'Hospital das Clínicas – Universidade Federal de Goiás (HC-UFG)';
    case 'ebserh.gov.br':
      return 'HC-UFG/EBSERH';
    default:
      return 'HC-UFG';
  }
}

// ═══════════════════════════════════════════════════════════════
// MIGRAÇÃO AUTOMÁTICA AO CARREGAR O MÓDULO
// ═══════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  const hasCurrentUser = localStorage.getItem(STORAGE_KEY);
  const hasLegacyData  = localStorage.getItem(LEGACY_KEYS.internacional) ||
                         localStorage.getItem(LEGACY_KEYS.hcufg);

  if (!hasCurrentUser && hasLegacyData) {
    console.log('🔄 InternosMed — iniciando migração automática...');
    migrateLegacyData();
  }
}
