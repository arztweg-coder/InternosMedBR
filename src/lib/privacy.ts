/**
 * privacy.ts
 * Sistema de Privacidade e Conformidade LGPD - InternosMed
 *
 * POLÍTICA: NÃO ARMAZENAMOS DADOS DE PACIENTES
 */

export interface TemporaryPatientData {
  nome?: string;
  cpf?: string;
  cns?: string;
  dataNascimento?: string;
  endereco?: string;
  telefone?: string;
}

export function clearAllPatientData(): void {
  sessionStorage.clear();

  const keysToRemove = ['patient_data', 'form_draft', 'recent_patients', 'temp_data'];
  keysToRemove.forEach(key => localStorage.removeItem(key));

  console.log('✓ InternosMed — dados de pacientes removidos (LGPD)');
}

export function setupPrivacyProtection(): void {
  window.addEventListener('beforeunload', clearAllPatientData);
  window.addEventListener('unload', clearAllPatientData);

  let blurTimeout: ReturnType<typeof setTimeout>;

  window.addEventListener('blur', () => {
    blurTimeout = setTimeout(() => {
      clearAllPatientData();
      console.log('✓ InternosMed — dados limpos por inatividade (LGPD)');
    }, 5 * 60 * 1000);
  });

  window.addEventListener('focus', () => {
    if (blurTimeout) clearTimeout(blurTimeout);
  });

  console.log('✓ InternosMed — proteção de privacidade LGPD ativada');
}

export const LGPD_DISCLAIMER = {
  short: 'InternosMed não armazena dados de pacientes. Todos os dados são apagados ao sair.',

  full: `
POLÍTICA DE PRIVACIDADE - LGPD

O InternosMed respeita sua privacidade e a dos pacientes:

✓ NÃO armazenamos dados de pacientes em nossos servidores
✓ Todos os dados são temporários e existem apenas durante sua sessão
✓ Ao fechar o navegador, TODOS os dados são automaticamente apagados
✓ Nenhuma informação sensível é enviada ou salva permanentemente

Conformidade com a Lei nº 13.709/2018 (LGPD).
Domínio: www.internos.med.br
  `.trim(),

  banner: '🔒 InternosMed: Seus dados são privados e temporários. Nada é salvo após sair.',
};

export function auditStoredData(): { hasPatientData: boolean; violations: string[] } {
  const violations: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key);
    if (!value) continue;

    const sensitivePatterns = [
      /cpf.*\d{11}/i,
      /cns.*\d{15}/i,
      /paciente.*nome/i,
      /data.*nascimento/i,
    ];

    if (sensitivePatterns.some(p => p.test(value))) {
      violations.push(`localStorage.${key} contém dados sensíveis`);
    }
  }

  return { hasPatientData: violations.length > 0, violations };
}

export function usePrivacyProtection() {
  return clearAllPatientData;
}
