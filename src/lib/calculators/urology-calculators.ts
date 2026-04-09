/**
 * urology-calculators.ts — Calculadoras de Urologia
 * 🩺 Urologia (ordem alfabética)
 * Densidade do PSA (PSAD) | PSA Livre/Total | Velocidade do PSA
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. DENSIDADE DO PSA ──────────────────────────────────────────────────────

export const PSAD: Calculator = {
  id: 'psad',
  name: 'Densidade do PSA (PSAD)',
  specialty: 'Urologia',
  emoji: '🩺',
  description: 'Cálculo da Densidade do PSA (PSA Density) obtido pela divisão do PSA total pelo volume prostático estimado pelo ultrassom transretal. Útil para discriminar câncer de próstata de hiperplasia benigna prostática (HBP) quando o PSA está na zona cinzenta (4-10 ng/mL).',
  tooltip: 'PSAD = PSA total (ng/mL) / Volume próstata (cm³). PSAD <0,10: baixo risco. 0,10-0,15: intermediário. 0,15-0,20: suspeito (biópsia a considerar). >0,20: forte suspeita de CaP (biópsia indicada).',
  category: 'formula',
  fields: [
    { id: 'psa_total', label: 'PSA Total (ng/mL)', type: 'number', min: 0.01, max: 100, step: 0.01, required: true, unit: 'ng/mL', info: 'Coleta sem ejaculação prévia de 48h e sem toque retal recente' },
    { id: 'volume', label: 'Volume da Próstata (cm³)', type: 'number', min: 5, max: 300, step: 0.1, required: true, unit: 'cm³', info: 'USTR ou USG abdominal. Fórmula: 0,52 × comprimento × largura × altura' },
  ],
  calculate: (values) => {
    const psa = Number(values.psa_total);
    const vol = Number(values.volume);
    const psad = parseFloat((psa / vol).toFixed(3));

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (psad < 0.10) {
      category = 'Baixo Risco — HBP provável'; severity = 'low';
      recommendations = ['PSAD baixo favorece HBP', 'Monitorização com PSA anual', 'Considerar tratamento de HBP se sintomático (IPSS)', 'Biópsia geralmente não indicada isoladamente'];
    } else if (psad < 0.15) {
      category = 'Risco Intermediário'; severity = 'moderate';
      recommendations = ['Risco intermediário — avaliação individualizada', 'Correlacionar com %PSA livre (se disponível)', 'RM multiparamétrica de próstata (PI-RADS)', 'Discussão com urologista'];
    } else if (psad < 0.20) {
      category = 'Suspeito — Considerar biópsia'; severity = 'moderate';
      recommendations = ['PSAD suspeito para câncer de próstata', 'RM multiparamétrica de próstata antes da biópsia (se disponível)', 'Biópsia de próstata guiada por USTR ou fusão de imagens', 'Encaminhar ao urologista'];
    } else {
      category = 'Alta Suspeita de Câncer de Próstata — Biópsia Indicada'; severity = 'high';
      recommendations = ['PSAD elevado — alta suspeita de CaP', 'RM multiparamétrica (PI-RADS) pré-biópsia se disponível', 'Biópsia de próstata guiada por USTR', 'Encaminhar ao urologista urgentemente', 'Se biópsia negativa e PSAD persistente: repetir RM + biópsia de fusão'];
    }
    return { value: psad, category, interpretation: `PSAD: ${psad} ng/mL/cm³\nPSA: ${psa} ng/mL | Volume: ${vol} cm³\n${category}`, severity, recommendations };
  },
  references: ['Benson MC, et al. J Urol. 1992;147(3 Pt 2):815-6', 'SBU. Diretrizes Brasileiras de Câncer de Próstata. 2021'],
};

// ── 2. PSA LIVRE/TOTAL ───────────────────────────────────────────────────────

export const PSA_LIVRE_TOTAL: Calculator = {
  id: 'psa-livre-total',
  name: 'PSA Livre/Total — Risco de Câncer',
  specialty: 'Urologia',
  emoji: '🩺',
  description: 'Cálculo da porcentagem de PSA livre em relação ao PSA total. O PSA produzido pelo câncer de próstata liga-se mais a proteínas (PSA complexado), resultando em menor proporção de PSA livre. Mais útil na zona cinzenta do PSA (4-10 ng/mL) para evitar biópsias desnecessárias.',
  tooltip: '%PSA livre = (PSA livre / PSA total) × 100. <10%: alto risco CaP (biópsia). 10-25%: risco intermediário (RM ± biópsia). >25%: baixo risco (HBP provável, monitorar). Especificidade 30% para PSA >10.',
  category: 'formula',
  fields: [
    { id: 'psa_livre', label: 'PSA Livre (ng/mL)', type: 'number', min: 0.01, max: 50, step: 0.01, required: true, unit: 'ng/mL' },
    { id: 'psa_total', label: 'PSA Total (ng/mL)', type: 'number', min: 0.1, max: 200, step: 0.01, required: true, unit: 'ng/mL' },
  ],
  calculate: (values) => {
    const livre = Number(values.psa_livre);
    const total = Number(values.psa_total);
    if (livre > total) return { value: 'Erro', category: 'Valores inválidos', interpretation: 'PSA livre não pode ser maior que PSA total', severity: 'low', recommendations: ['Verificar valores informados'] };
    const pct = parseFloat((livre / total * 100).toFixed(1));

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (pct < 10) {
      category = 'Alto Risco de Câncer de Próstata'; severity = 'high';
      recommendations = ['%PSA livre baixo — risco elevado de CaP', 'Biópsia de próstata indicada', 'RM multiparamétrica pré-biópsia (PI-RADS)', 'Encaminhar ao urologista urgente'];
    } else if (pct <= 25) {
      category = 'Risco Intermediário'; severity = 'moderate';
      recommendations = ['Zona cinzenta — avaliação individualizada', 'RM multiparamétrica de próstata', 'Correlacionar com PSAD e toque retal', 'Discutir biópsia com urologista'];
    } else {
      category = 'Baixo Risco — HBP provável'; severity = 'low';
      recommendations = ['%PSA livre alto favorece HBP benigna', 'Monitorização com PSA a cada 6-12 meses', 'Considerar tratamento de HBP se sintomático', 'Manter rastreio anual'];
    }
    return { value: `${pct}%`, category, interpretation: `%PSA livre: ${pct}%\nPSA livre: ${livre} | PSA total: ${total} ng/mL\n${category}`, severity, recommendations };
  },
  references: ['Catalona WJ, et al. N Engl J Med. 1998;338(23):1638-44', 'Roddam AW, et al. Lancet Oncol. 2005;6(9):659-67'],
};

// ── 3. VELOCIDADE DO PSA ─────────────────────────────────────────────────────

export const PSA_VELOCITY: Calculator = {
  id: 'psa-velocity',
  name: 'Velocidade do PSA (PSAV)',
  specialty: 'Urologia',
  emoji: '🩺',
  description: 'Cálculo da taxa de variação do PSA ao longo do tempo (PSA Velocity). Detecta aumento acelerado que pode indicar câncer de próstata clinicamente significativo, mesmo com valores absolutos de PSA dentro da faixa normal. Útil para monitoramento longitudinal.',
  tooltip: 'PSAV = (PSA2 - PSA1) / Tempo (anos). >0,75 ng/mL/ano (com PSA inicial 4-10): suspeito. >2 ng/mL/ano: forte suspeita de CaP agressivo. Intervalos mínimos de 12-18 meses entre medidas para maior confiabilidade.',
  category: 'formula',
  fields: [
    { id: 'psa1', label: 'PSA inicial (ng/mL)', type: 'number', min: 0.01, max: 200, step: 0.01, required: true, unit: 'ng/mL' },
    { id: 'psa2', label: 'PSA atual (ng/mL)', type: 'number', min: 0.01, max: 200, step: 0.01, required: true, unit: 'ng/mL' },
    { id: 'tempo_meses', label: 'Intervalo entre medidas (meses)', type: 'number', min: 1, max: 120, step: 1, required: true, unit: 'meses', info: 'Mínimo recomendado: 12-18 meses' },
  ],
  calculate: (values) => {
    const psa1 = Number(values.psa1);
    const psa2 = Number(values.psa2);
    const meses = Number(values.tempo_meses);
    const anos = meses / 12;
    const psav = parseFloat(((psa2 - psa1) / anos).toFixed(2));
    const variacao = parseFloat((psa2 - psa1).toFixed(2));
    const variPct = parseFloat(((variacao / psa1) * 100).toFixed(1));

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (psav < 0) {
      category = 'PSA em Queda — Favorável'; severity = 'low';
      recommendations = ['PSA em queda (resposta a tratamento ou variação natural)', 'Monitorização contínua', 'Se em tratamento hormonal: avaliação de resposta'];
    } else if (psav < 0.75) {
      category = 'Velocidade Normal'; severity = 'low';
      recommendations = ['Velocidade dentro da faixa aceitável', 'Manter rastreio anual com PSA', 'Correlacionar com valor absoluto e %PSA livre'];
    } else if (psav < 2) {
      category = 'Velocidade Suspeita (>0,75 ng/mL/ano)'; severity = 'moderate';
      recommendations = ['PSAV suspeito para CaP — investigar', 'RM multiparamétrica de próstata', 'Correlacionar com PSAD e %PSA livre', 'Discutir biópsia com urologista', 'Repetir PSA em 3-6 meses'];
    } else {
      category = 'Velocidade Alta — Forte Suspeita de CaP'; severity = 'high';
      recommendations = ['PSAV muito elevado — alto risco de CaP agressivo', 'Biópsia urgente (guiada por RM ou USTR)', 'RM multiparamétrica obrigatória pré-biópsia', 'Encaminhar ao urologista URGENTE', 'Staging completo se biópsia positiva'];
    }
    return {
      value: `${psav} ng/mL/ano`, category,
      interpretation: `PSAV: ${psav} ng/mL/ano\nPSA inicial: ${psa1} → atual: ${psa2} ng/mL\nVariação: ${variacao >= 0 ? '+' : ''}${variacao} ng/mL (${variPct >= 0 ? '+' : ''}${variPct}%)\nPeríodo: ${meses} meses\n${category}`,
      severity, recommendations,
    };
  },
  references: ['Carter HB, et al. JAMA. 1992;267(16):2215-20', 'D\'Amico AV, et al. N Engl J Med. 2004;351(2):125-35'],
};

export const UROLOGY_CALCULATORS: Calculator[] = [PSAD, PSA_LIVRE_TOTAL, PSA_VELOCITY];
