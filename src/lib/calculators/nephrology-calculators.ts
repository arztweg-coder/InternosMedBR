/**
 * nephrology-calculators.ts — Calculadoras de Nefrologia
 * 🩺 Nefrologia (ordem alfabética)
 * CKD-EPI | Correção de Sódio | Gasometria Arterial
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. CKD-EPI ──────────────────────────────────────────────────────────────

export const CKD_EPI: Calculator = {
  id: 'ckd-epi',
  name: 'CKD-EPI - Taxa de Filtração Glomerular',
  specialty: 'Nefrologia',
  emoji: '🩺',
  description: 'Cálculo da Taxa de Filtração Glomerular (TFG) estimada pela equação CKD-EPI 2021 (sem raça). Mais preciso que MDRD, especialmente para TFG >60 mL/min. Utilizado para estadiar doença renal crônica (DRC) e ajustar doses de medicamentos.',
  tooltip: 'Equação CKD-EPI 2021 (race-free). TFG normal: >90 mL/min/1.73m². Estadios G1-G5. Mais preciso que Cockcroft-Gault para monitoramento de DRC.',
  category: 'formula',
  fields: [
    { id: 'idade', label: 'Idade (anos)', type: 'number', min: 18, max: 120, required: true },
    {
      id: 'sexo', label: 'Sexo', type: 'radio', required: true,
      options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }],
    },
    {
      id: 'creatinina', label: 'Creatinina Sérica (mg/dL)', type: 'number',
      min: 0.1, max: 20, step: 0.01, required: true, unit: 'mg/dL',
      info: 'Use creatinina em estado estacionário (não em IRA aguda)',
    },
  ],
  calculate: (values) => {
    const idade = Number(values.idade);
    const sexo = String(values.sexo);
    const cr = Number(values.creatinina);
    const kappa = sexo === 'F' ? 0.7 : 0.9;
    const alpha = sexo === 'F' ? -0.241 : -0.302;
    const factor = sexo === 'F' ? 1.012 : 1;
    const minVal = Math.min(cr / kappa, 1);
    const maxVal = Math.max(cr / kappa, 1);
    const tfg = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.2) * Math.pow(0.9938, idade) * factor;
    const v = parseFloat(tfg.toFixed(1));

    let category = ''; let severity: CalculatorResult['severity'] = 'low';
    let recommendations: string[] = [];
    if (v >= 90) {
      category = 'G1 — Normal ou Aumentada'; severity = 'low';
      recommendations = ['Sem evidência de lesão renal (se sem albuminúria/hematúria)', 'Controle de fatores de risco cardiovascular', 'Reavaliação anual'];
    } else if (v >= 60) {
      category = 'G2 — Leve Redução'; severity = 'low';
      recommendations = ['Investigar causas de DRC', 'Solicitar albuminúria e ultrassom renal', 'Controlar HAS e DM', 'Reavaliação anual'];
    } else if (v >= 45) {
      category = 'G3a — Redução Leve a Moderada'; severity = 'moderate';
      recommendations = ['Ajuste de dose de medicamentos obrigatório', 'Rastreio de albuminúria', 'Evitar nefrotóxicos (AINEs, contraste)', 'Encaminhar ao nefrologista se progressão'];
    } else if (v >= 30) {
      category = 'G3b — Redução Moderada a Grave'; severity = 'moderate';
      recommendations = ['Encaminhamento ao nefrologista', 'Rastreio: anemia, hiperparatireoidismo 2º', 'Evitar metformina se TFG <45', 'Dieta hipoproteica (0,8 g/kg/dia)'];
    } else if (v >= 15) {
      category = 'G4 — Redução Grave (Pré-dialítico)'; severity = 'high';
      recommendations = ['Acompanhamento nefrológico OBRIGATÓRIO', 'Preparar acesso vascular (FAV)', 'Vacina hepatite B', 'Orientar sobre TRS (HD, DP, transplante)'];
    } else {
      category = 'G5 — Falência Renal'; severity = 'critical';
      recommendations = ['TERAPIA RENAL SUBSTITUTIVA URGENTE', 'Hemodiálise ou Diálise Peritoneal', 'Avaliar transplante renal', 'Controle hidroeletrolítico rigoroso'];
    }
    return {
      value: v, category,
      interpretation: `TFG estimada: ${v} mL/min/1,73m²\nEstádio: ${category}`,
      severity, recommendations,
    };
  },
  references: [
    'Inker LA, et al. N Engl J Med. 2021;385(19):1737-49',
    'KDIGO 2024 Clinical Practice Guideline for CKD',
  ],
};

// ── 2. CORREÇÃO DE SÓDIO ─────────────────────────────────────────────────────

export const SODIUM_CORRECTION: Calculator = {
  id: 'correcao-sodio',
  name: 'Correção de Sódio na Hiperglicemia',
  specialty: 'Nefrologia',
  emoji: '🩺',
  description: 'Calcula o sódio sérico corrigido na presença de hiperglicemia. A glicose elevada causa deslocamento osmótico de água do intracelular, diluindo o sódio. Essencial na cetoacidose diabética (CAD) e estado hiperglicêmico hiperosmolar (EHH).',
  tooltip: 'Fórmula de Katz: Na corrigido = Na medido + 1,6 × [(Glicose - 100) / 100]. Para cada 100 mg/dL de glicose acima de 100, o sódio real é ~1,6 mEq/L maior.',
  category: 'formula',
  fields: [
    { id: 'sodio_medido', label: 'Sódio Sérico Medido (mEq/L)', type: 'number', min: 100, max: 200, required: true, unit: 'mEq/L' },
    { id: 'glicemia', label: 'Glicemia (mg/dL)', type: 'number', min: 50, max: 1500, required: true, unit: 'mg/dL' },
  ],
  calculate: (values) => {
    const na = Number(values.sodio_medido);
    const gli = Number(values.glicemia);
    const naCorr = na + 1.6 * ((gli - 100) / 100);
    const v = parseFloat(naCorr.toFixed(1));
    const dif = parseFloat((v - na).toFixed(1));

    let category = ''; let severity: CalculatorResult['severity'] = 'low';
    let recommendations: string[] = [];
    if (v < 135) {
      category = 'Hiponatremia Real'; severity = 'moderate';
      recommendations = ['Hiponatremia VERDADEIRA — investigar causa', 'Diferenciar: hipovolemia, SIADH, hipotireoidismo', 'Corrigir lentamente: máx 10-12 mEq/L em 24h', 'Não corrigir rápido (risco de mielinólise pontina)'];
    } else if (v <= 145) {
      category = 'Normonatremia (Pseudohiponatremia)'; severity = 'low';
      recommendations = ['Hiponatremia falsa por hiperglicemia', 'Sódio normalizará com controle glicêmico', 'Não repor sódio — tratar hiperglicemia', 'Monitorar sódio conforme insulina'];
    } else {
      category = 'Hipernatremia Real'; severity = 'high';
      recommendations = ['Hipernatremia + hiperglicemia = situação GRAVE', 'Repor água livre lentamente', 'Cuidado com osmolalidade (EHH)', 'Monitorar sódio e osmolalidade a cada 2-4h'];
    }
    return {
      value: v, category,
      interpretation: `Na medido: ${na} mEq/L\nNa corrigido: ${v} mEq/L\nDiferença: +${dif} mEq/L`,
      severity, recommendations,
    };
  },
  references: [
    'Katz MA. N Engl J Med. 1973;289(16):843-4',
    'Hillier TA, et al. Arch Intern Med. 1999;159(4):369-74',
  ],
};

// ── 3. GASOMETRIA ARTERIAL ───────────────────────────────────────────────────

export const ABG_INTERPRETATION: Calculator = {
  id: 'gasometria',
  name: 'Gasometria Arterial — Interpretação',
  specialty: 'Nefrologia',
  emoji: '🩺',
  description: 'Interpretação sistemática de gasometria arterial usando o método de Henderson-Hasselbalch. Identifica distúrbios ácido-base primários, calcula compensação esperada e anion gap. Essencial em UTI, emergência e nefrologia.',
  tooltip: 'Analisa pH, pCO₂, HCO₃⁻ e anion gap. Classifica: acidose/alcalose, metabólica/respiratória, compensada/não compensada. Aplica Fórmula de Winter e regras de compensação.',
  category: 'assessment',
  fields: [
    { id: 'ph', label: 'pH', type: 'number', min: 6.8, max: 7.8, step: 0.01, required: true, info: 'Normal: 7,35–7,45' },
    { id: 'pco2', label: 'pCO₂ (mmHg)', type: 'number', min: 10, max: 150, step: 1, required: true, unit: 'mmHg', info: 'Normal: 35–45 mmHg' },
    { id: 'hco3', label: 'HCO₃⁻ (mEq/L)', type: 'number', min: 5, max: 50, step: 0.1, required: true, unit: 'mEq/L', info: 'Normal: 22–26 mEq/L' },
    { id: 'na', label: 'Na⁺ sérico (mEq/L)', type: 'number', min: 120, max: 160, required: true, unit: 'mEq/L', info: 'Para cálculo do Anion Gap' },
    { id: 'cl', label: 'Cl⁻ sérico (mEq/L)', type: 'number', min: 80, max: 120, required: true, unit: 'mEq/L', info: 'Para cálculo do Anion Gap' },
  ],
  calculate: (values) => {
    const ph = Number(values.ph);
    const pco2 = Number(values.pco2);
    const hco3 = Number(values.hco3);
    const na = Number(values.na);
    const cl = Number(values.cl);
    const ag = na - (cl + hco3);

    const parts: string[] = [];
    const recs: string[] = [];
    let primary = ''; let severity: CalculatorResult['severity'] = 'moderate';

    if (ph < 7.35) {
      severity = 'high';
      if (pco2 > 45) {
        primary = 'Acidose Respiratória';
        const hco3Ac = 24 + (pco2 - 40) / 10;
        const hco3Ch = 24 + 4 * (pco2 - 40) / 10;
        parts.push(hco3 >= hco3Ac - 2 && hco3 <= hco3Ch + 2 ? 'Compensação presente' : hco3 < hco3Ac - 2 ? '⚠️ Acidose metabólica associada' : '⚠️ Alcalose metabólica associada');
        recs.push('Suporte ventilatório', 'Investigar: DPOC, sedação, fraqueza muscular', 'Considerar VNI ou IOT se grave');
      } else if (hco3 < 22) {
        primary = 'Acidose Metabólica';
        const pco2Esp = 1.5 * hco3 + 8;
        parts.push(Math.abs(pco2 - pco2Esp) <= 2 ? 'Compensação adequada (Fórmula de Winter ✓)' : pco2 > pco2Esp + 2 ? '⚠️ Acidose respiratória associada' : 'Alcalose respiratória associada');
        parts.push(ag > 12 ? `Anion Gap ELEVADO (${ag.toFixed(1)} mEq/L) — Causas: MUDILES (Metanol, Uremia, DKA, Isoniazida, Láctica, Etilenoglicol, Salicilatos)` : `Anion Gap NORMAL (${ag.toFixed(1)} mEq/L) — Causas: diarreia, ATR, ileostomia`);
        recs.push('Tratar causa base', ag > 12 ? 'Investigar: cetoacidose, acidose láctica, uremia, intoxicações' : 'Investigar: diarreia, ATR, uso de acetazolamida', 'Bicarbonato se pH <7,1 com sintomas graves');
      }
    } else if (ph > 7.45) {
      severity = 'moderate';
      if (pco2 < 35) {
        primary = 'Alcalose Respiratória';
        recs.push('Investigar: hiperventilação, sepse, dor, ansiedade, gravidez', 'Tratar causa base', 'Respiração em saco se hiperventilação psicogênica');
      } else if (hco3 > 26) {
        primary = 'Alcalose Metabólica';
        const pco2Esp = 40 + 0.7 * (hco3 - 24);
        parts.push(Math.abs(pco2 - pco2Esp) <= 5 ? 'Compensação adequada' : 'Distúrbio misto');
        recs.push('Repor Cl⁻ e K⁺', 'Investigar: vômitos, diuréticos, hiperaldosteronismo', 'Reposição volêmica se Cl-responsiva (NaCl 0,9%)');
      }
    } else {
      primary = 'pH Normal'; severity = 'low';
      recs.push('Avaliar contexto clínico', 'Checar se há distúrbio misto compensado');
    }

    const phStatus = ph < 7.35 ? '(BAIXO)' : ph > 7.45 ? '(ALTO)' : '(NORMAL)';
    const pco2Status = pco2 > 45 ? '(ALTO)' : pco2 < 35 ? '(BAIXO)' : '(NORMAL)';
    const hco3Status = hco3 < 22 ? '(BAIXO)' : hco3 > 26 ? '(ALTO)' : '(NORMAL)';
    const agStatus = ag > 12 ? '(ELEVADO)' : '(NORMAL)';

    const interp = [
      `Distúrbio: ${primary}`,
      ...parts,
      '',
      `pH: ${ph} ${phStatus}`,
      `pCO₂: ${pco2} mmHg ${pco2Status}`,
      `HCO₃⁻: ${hco3} mEq/L ${hco3Status}`,
      `Anion Gap: ${ag.toFixed(1)} mEq/L ${agStatus}`,
    ].join('\n');

    return { value: ph, category: primary, interpretation: interp, severity, recommendations: recs };
  },
  references: [
    'Berend K, et al. Clin J Am Soc Nephrol. 2014;9(6):1141-51',
    'Emmett M, Narins RG. Medicine. 1977;56(1):38-54',
  ],
};

export const NEPHROLOGY_CALCULATORS: Calculator[] = [CKD_EPI, SODIUM_CORRECTION, ABG_INTERPRETATION];
