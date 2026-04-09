/**
 * protocol.ts
 * Sistema de Geração de Protocolos para Documentos Médicos
 * 
 * Formato: INTERNOSMED-AAAAMMDD-TIPO-UUID8
 * Exemplo: INTERNOSMED-20260407-ATE-A3F8C1D2
 */

import { v4 as uuidv4 } from 'uuid';

export type DocumentType = 
  | 'ATE' // Atestado
  | 'ALT' // Alta Hospitalar
  | 'ENC' // Encaminhamento
  | 'REC' // Receita Simples
  | 'RCC' // Receita Controlada
  | 'EXA' // Pedido de Exames
  | 'LME' // Laudo para Medicação Especial
  | 'APC' // APAC
  | 'AIH' // Autorização de Internação Hospitalar
  | 'SAM' // Retorno SAMIS
  | 'OUT'; // Outros

/**
 * Gera protocolo único para documento
 */
export function generateProtocol(type: DocumentType): string {
  const uuid = uuidv4().split('-')[0].toUpperCase(); // Primeiros 8 caracteres
  const date = new Date().toISOString().split('T')[0].replace(/-/g, ''); // AAAAMMDD
  
  return `INTERNOSMED-${date}-${type}-${uuid}`;
}

/**
 * Valida formato de protocolo
 */
export function validateProtocol(protocol: string): boolean {
  const regex = /^INTERNOSMED-\d{8}-[A-Z]{3}-[A-F0-9]{8}$/;
  return regex.test(protocol);
}

/**
 * Extrai informações do protocolo
 */
export function parseProtocol(protocol: string): {
  valid: boolean;
  date?: string;
  type?: DocumentType;
  uuid?: string;
} {
  if (!validateProtocol(protocol)) {
    return { valid: false };
  }

  const parts = protocol.split('-');
  
  return {
    valid: true,
    date: parts[1], // AAAAMMDD
    type: parts[2] as DocumentType,
    uuid: parts[3],
  };
}

/**
 * Formata data do protocolo para exibição
 */
export function formatProtocolDate(dateStr: string): string {
  // dateStr: AAAAMMDD
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  
  return `${day}/${month}/${year}`;
}

/**
 * Nome legível do tipo de documento
 */
export function getDocumentTypeName(type: DocumentType): string {
  const names: Record<DocumentType, string> = {
    ATE: 'Atestado Médico',
    ALT: 'Alta Hospitalar',
    ENC: 'Encaminhamento',
    REC: 'Receita Simples',
    RCC: 'Receita Controlada',
    EXA: 'Pedido de Exames',
    LME: 'Laudo para Medicação Especial (LME)',
    APC: 'Autorização de Procedimento Ambulatorial (APAC)',
    AIH: 'Autorização de Internação Hospitalar (AIH)',
    SAM: 'Retorno SAMIS',
    OUT: 'Outros Documentos',
  };
  
  return names[type] || 'Documento Médico';
}

/**
 * Gera QR Code payload para documento
 * (Para implementação futura de verificação via QR Code)
 */
export function generateQRPayload(protocol: string, additionalData?: Record<string, any>): string {
  const base = {
    protocol,
    timestamp: new Date().toISOString(),
    system: 'INTERNOSMED-HCUFG',
    ...additionalData,
  };
  
  return JSON.stringify(base);
}

/**
 * Watermark de segurança para impressão
 */
export function getSecurityWatermark(): string {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  });
  
  return `Impresso em ${timestamp} via InternosMed HC-UFG`;
}
