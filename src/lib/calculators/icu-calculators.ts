/**
 * icu-calculators.ts — Calculadoras de UTI / Sepse
 * 🏥 UTI/Sepse (ordem alfabética)
 * qSOFA | SAPS 3 | SOFA
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. qSOFA ─────────────────────────────────────────────────────────────────

export const QSOFA: Calculator = {
  id: 'qsofa',
  name: 'qSOFA — Triagem Rápida de Sepse',
  specialty: 'UTI/Sepse',
  emoji: '🏥',
  description: 'Quick Sequential Organ Failure Assessment (qSOFA) para triagem rápida de sepse em pacientes fora da UTI. Três critérios clínicos simples que predizem disfunção orgânica e mortalidade. Recomendado pelo Surviving Sepsis Campaign 2021 como alerta inicial.',
  tooltip: '3 critérios (1 ponto cada): FR ≥22 irpm, alteração de consciência, PAS ≤100 mmHg. ≥2 pontos: alto risco de disfunção orgânica (mortalidade ~10×). Acionar lactato e culturas. POSITIVO ≠ diagnóstico de sepse.',
  category: 'score',
  fields: [
    { id: 'fr22', label: 'Frequência respiratória ≥ 22 irpm?', type: 'checkbox', info: '+1 ponto' },
    { id: 'consciencia', label: 'Alteração de consciência (novo rebaixamento ou agitação)?', type: 'checkbox', info: '+1 ponto' },
    { id: 'pas100', label: 'Pressão arterial sistólica ≤ 100 mmHg?', type: 'checkbox', info: '+1 ponto' },
  ],
  calculate: (values) => {
    const total = Object.values(values).filter(Boolean).length;
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total < 2) {
      category = 'qSOFA Negativo'; severity = 'low';
      recommendations = ['Baixo risco de disfunção orgânica por sepse no momento', 'Monitorizar — reavaliar se deterioração clínica', 'Considerar SOFA completo se em UTI'];
    } else {
      category = 'qSOFA POSITIVO — Alto Risco de Sepse'; severity = 'critical';
      recommendations = ['⚠️ ALTA SUSPEITA DE SEPSE — INICIAR BUNDLES', 'Sepse Bundle (1ª hora):', '• Lactato sérico IMEDIATO', '• Hemoculturas (2 pares) antes do ATB', '• Antibioticoterapia de amplo espectro em 1 hora', '• 30 mL/kg de cristaloides se hipoperfusão', '• Noradrenalina se PAM <65 após ressuscitação', 'Aplicar SOFA completo para diagnóstico formal de sepse', 'UTI se lactato >2 mmol/L ou instabilidade'];
    }
    return { value: `${total}/3`, category, interpretation: `qSOFA: ${total}/3\n${category}`, severity, recommendations };
  },
  references: ['Singer M, et al. JAMA. 2016;315(8):801-10 (Sepsis-3)', 'Evans L, et al. Intensive Care Med. 2021;47(11):1181-247 (SSC 2021)'],
};

// ── 2. SAPS 3 ────────────────────────────────────────────────────────────────

export const SAPS_3: Calculator = {
  id: 'saps3',
  name: 'SAPS 3 — Prognóstico em UTI',
  specialty: 'UTI/Sepse',
  emoji: '🏥',
  description: 'Simplified Acute Physiology Score 3 (SAPS 3) para predição de mortalidade hospitalar em pacientes admitidos na UTI. Coletado na admissão (1h pré a 1h pós). Validado para a América Latina com equação de Moreno customizada, mais precisa que a equação original.',
  tooltip: 'Avalia 20 variáveis em 3 grupos: pré-UTI (comorbidades, cirurgia, localização), admissão UTI (PA, FC, Glasgow, temperatura), e fisiológicas (leucócitos, plaquetas, bilirrubina, creatinina). Pontuação 0-217.',
  category: 'score',
  fields: [
    { id: 'idade', label: 'Faixa etária', type: 'radio', required: true, options: [{ value: 0, label: '<40 anos (0)' }, { value: 5, label: '40-59 anos (5)' }, { value: 9, label: '60-69 anos (9)' }, { value: 13, label: '70-74 anos (13)' }, { value: 15, label: '75-79 anos (15)' }, { value: 18, label: '≥80 anos (18)' }] },
    { id: 'comorbidades', label: 'Comorbidades', type: 'radio', required: true, options: [{ value: 0, label: 'Nenhuma relevante (0)' }, { value: 1, label: 'Cardiovascular / respiratória crônica (1)' }, { value: 6, label: 'Câncer sem metástase (6)' }, { value: 11, label: 'Câncer com metástase / hematológico (11)' }, { value: 7, label: 'Cirrose / AIDS (7)' }] },
    { id: 'localizacao_pre', label: 'Localização pré-UTI (últimas 24h)', type: 'radio', required: true, options: [{ value: 0, label: 'Cirurgia eletiva / pré-operatório (0)' }, { value: 6, label: 'Pós-operatório emergência (6)' }, { value: 8, label: 'Clínica (8)' }, { value: 7, label: 'Urgência/Emergência hospitalar (7)' }, { value: 13, label: 'Outro hospital (13)' }] },
    { id: 'glasgow', label: 'Escore de Glasgow na admissão', type: 'radio', required: true, options: [{ value: 0, label: '15 pontos (0)' }, { value: 4, label: '13-14 (4)' }, { value: 8, label: '10-12 (8)' }, { value: 13, label: '7-9 (13)' }, { value: 18, label: '3-6 (18)' }] },
    { id: 'pas', label: 'PAS na admissão (mmHg)', type: 'radio', required: true, options: [{ value: 0, label: '120-159 (0)' }, { value: 2, label: '160-179 (2)' }, { value: 3, label: '100-119 (3)' }, { value: 6, label: '≥180 (6)' }, { value: 7, label: '70-99 (7)' }, { value: 11, label: '<70 (11)' }] },
    { id: 'fc', label: 'FC na admissão (bpm)', type: 'radio', required: true, options: [{ value: 0, label: '60-119 (0)' }, { value: 2, label: '120-159 (2)' }, { value: 6, label: '≥160 ou <60 (6)' }] },
    { id: 'temperatura', label: 'Temperatura na admissão (°C)', type: 'radio', required: true, options: [{ value: 0, label: '36-38,9°C (0)' }, { value: 2, label: '39-39,9 (2)' }, { value: 4, label: '<36 ou ≥40 (4)' }] },
    { id: 'creatinina', label: 'Creatinina (mg/dL)', type: 'radio', required: true, options: [{ value: 0, label: '<1,2 (0)' }, { value: 2, label: '1,2-1,9 (2)' }, { value: 7, label: '2,0-3,4 (7)' }, { value: 11, label: '≥3,5 (11)' }] },
    { id: 'bilirrubina', label: 'Bilirrubina total (mg/dL)', type: 'radio', required: true, options: [{ value: 0, label: '<2,0 (0)' }, { value: 4, label: '2,0-5,9 (4)' }, { value: 8, label: '≥6,0 (8)' }] },
    { id: 'plaquetas', label: 'Plaquetas (×10³/μL)', type: 'radio', required: true, options: [{ value: 0, label: '≥100 (0)' }, { value: 5, label: '50-99 (5)' }, { value: 13, label: '<50 (13)' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    // Equação América Latina (Moreno): logit = -16.6262 + ln(total + 1) × 2.6256
    const logit = -16.6262 + Math.log(total + 1) * 2.6256;
    const mortalidade = parseFloat((1 / (1 + Math.exp(-logit)) * 100).toFixed(1));

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (mortalidade < 20) {
      category = 'Baixo Risco (mortalidade estimada <20%)'; severity = 'low';
      recommendations = ['Monitorização standard de UTI', 'Reavaliação diária com SOFA'];
    } else if (mortalidade < 50) {
      category = 'Risco Moderado (20-50%)'; severity = 'moderate';
      recommendations = ['Monitorização intensiva', 'Otimização hemodinâmica e ventilatória', 'Prevenção de complicações (PAVM, IPCS, TVP)', 'Nutrição enteral precoce'];
    } else {
      category = 'Alto Risco (>50%)'; severity = 'high';
      recommendations = ['Discussão prognóstica com família', 'Avaliação de limitação de suporte terapêutico', 'Cuidados paliativos integrados desde UTI', 'Avaliar critérios para suporte especializado'];
    }
    return { value: `${total} pts`, category, interpretation: `SAPS 3: ${total} pontos\nMortalidade estimada: ${mortalidade}% (equação AL)\n${category}`, severity, recommendations };
  },
  references: ['Moreno RP, et al. Intensive Care Med. 2005;31(9):1250-8', 'Silva Junior JM, et al. Rev Bras Ter Intensiva. 2010;22(1):17-26'],
};

// ── 3. SOFA ──────────────────────────────────────────────────────────────────

export const SOFA: Calculator = {
  id: 'sofa',
  name: 'SOFA — Disfunção Orgânica (Sepse)',
  specialty: 'UTI/Sepse',
  emoji: '🏥',
  description: 'Sequential Organ Failure Assessment (SOFA) para avaliação de disfunção orgânica em sepse e outros estados críticos. Avalia 6 sistemas orgânicos (respiratório, coagulação, hepático, cardiovascular, neurológico e renal) com pontuação 0-4 cada (total 0-24). Definição de sepse: aumento ≥2 pontos no SOFA (Sepsis-3).',
  tooltip: 'SOFA ≥2 = disfunção orgânica (critério diagnóstico de sepse). Cada +1 ponto = ~10% de mortalidade adicional. SOFA <2: <10% mortalidade. 2-5: 10-20%. 6-9: 20-40%. ≥10: >40%.',
  category: 'score',
  fields: [
    { id: 'respiratorio', label: 'Respiratório — PaO₂/FiO₂ (razão P/F)', type: 'radio', required: true, options: [{ value: 0, label: '≥400 (0)' }, { value: 1, label: '300-399 (1)' }, { value: 2, label: '200-299 (2)' }, { value: 3, label: '100-199 + ventilação (3)' }, { value: 4, label: '<100 + ventilação (4)' }] },
    { id: 'coagulacao', label: 'Coagulação — Plaquetas (×10³/μL)', type: 'radio', required: true, options: [{ value: 0, label: '≥150 (0)' }, { value: 1, label: '100-149 (1)' }, { value: 2, label: '50-99 (2)' }, { value: 3, label: '20-49 (3)' }, { value: 4, label: '<20 (4)' }] },
    { id: 'hepatico', label: 'Hepático — Bilirrubina total (mg/dL)', type: 'radio', required: true, options: [{ value: 0, label: '<1,2 (0)' }, { value: 1, label: '1,2-1,9 (1)' }, { value: 2, label: '2,0-5,9 (2)' }, { value: 3, label: '6,0-11,9 (3)' }, { value: 4, label: '≥12,0 (4)' }] },
    { id: 'cardiovascular', label: 'Cardiovascular — PAM / vasopressor', type: 'radio', required: true, options: [{ value: 0, label: 'PAM ≥70 mmHg (0)' }, { value: 1, label: 'PAM <70 mmHg (1)' }, { value: 2, label: 'Dopamina ≤5 ou dobutamina qualquer dose (2)' }, { value: 3, label: 'Dopamina >5 ou adrenalina ≤0,1 ou noradrenalina ≤0,1 (3)' }, { value: 4, label: 'Dopamina >15 ou adrenalina >0,1 ou noradrenalina >0,1 (4)' }] },
    { id: 'neurologico', label: 'Neurológico — Escore de Glasgow', type: 'radio', required: true, options: [{ value: 0, label: '15 (0)' }, { value: 1, label: '13-14 (1)' }, { value: 2, label: '10-12 (2)' }, { value: 3, label: '6-9 (3)' }, { value: 4, label: '<6 (4)' }] },
    { id: 'renal', label: 'Renal — Creatinina (mg/dL) ou Débito Urinário', type: 'radio', required: true, options: [{ value: 0, label: '<1,2 mg/dL (0)' }, { value: 1, label: '1,2-1,9 mg/dL (1)' }, { value: 2, label: '2,0-3,4 mg/dL (2)' }, { value: 3, label: '3,5-4,9 mg/dL ou DU <500 mL/d (3)' }, { value: 4, label: '≥5,0 mg/dL ou DU <200 mL/d (4)' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    let mortalidade = ''; let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total < 2) {
      mortalidade = '<10%'; category = 'Sem disfunção orgânica significativa'; severity = 'low';
      recommendations = ['Monitorização contínua', 'Reavaliação diária'];
    } else if (total < 6) {
      mortalidade = '10-20%'; category = 'Disfunção orgânica leve-moderada'; severity = 'moderate';
      recommendations = ['Critério diagnóstico de SEPSE (delta SOFA ≥2)', 'Sepsis Bundle obrigatório', 'Otimização hemodinâmica: PAM ≥65', 'Ressuscitação com cristaloides'];
    } else if (total < 10) {
      mortalidade = '20-40%'; category = 'Disfunção orgânica moderada'; severity = 'high';
      recommendations = ['Suporte orgânico múltiplo em UTI', 'Vasopressores se necessário (noradrenalina 1ª linha)', 'Corticoide se choque séptico refratário (hidrocortisona 200mg/d)', 'Protocolos de ventilação protetora', 'Controle de foco infeccioso'];
    } else if (total < 13) {
      mortalidade = '40-50%'; category = 'Falência orgânica grave'; severity = 'critical';
      recommendations = ['Suporte orgânico máximo', 'Discutir prognóstico e limitação de suporte', 'Metas de sedoanalgesia (protocolo ABCDE)'];
    } else {
      mortalidade = '>50%'; category = 'Falência orgânica muito grave'; severity = 'critical';
      recommendations = ['Mortalidade muito elevada', 'Discussão prognóstica URGENTE com família', 'Avaliar diretivas antecipadas de vontade', 'Cuidados paliativos integrados'];
    }
    return { value: `${total}/24`, category, interpretation: `SOFA: ${total}/24\nMortalidade estimada: ${mortalidade}\n${category}`, severity, recommendations };
  },
  references: ['Vincent JL, et al. Intensive Care Med. 1996;22(7):707-10', 'Singer M, et al. JAMA. 2016;315(8):801-10 (Sepsis-3)'],
};

export const ICU_CALCULATORS: Calculator[] = [QSOFA, SAPS_3, SOFA];
