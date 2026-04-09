/**
 * neurology-calculators.ts — Calculadoras de Neurologia
 * 🧠 Neurologia (ordem alfabética)
 * Glasgow | ICH Score | NIHSS
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. GLASGOW COMA SCALE ────────────────────────────────────────────────────

export const GLASGOW: Calculator = {
  id: 'glasgow',
  name: 'Glasgow Coma Scale — Nível de Consciência',
  specialty: 'Neurologia',
  emoji: '🧠',
  description: 'Escala de Coma de Glasgow (GCS) para avaliação quantitativa do nível de consciência após TCE, AVC ou outras causas de rebaixamento. Avalia abertura ocular, resposta verbal e resposta motora. Prediz mortalidade e necessidade de intubação orotraqueal.',
  tooltip: 'Pontuação 3-15. 13-15: TCE leve. 9-12: moderado. ≤8: grave — INDICAÇÃO DE IOT. Componentes: Ocular (1-4) + Verbal (1-5) + Motor (1-6). Registrar separadamente (ex: O3V4M5 = GCS 12).',
  category: 'score',
  fields: [
    { id: 'ocular', label: 'Abertura Ocular (O)', type: 'radio', required: true, options: [{ value: 4, label: '4 — Espontânea' }, { value: 3, label: '3 — Ao comando verbal' }, { value: 2, label: '2 — À dor' }, { value: 1, label: '1 — Sem resposta' }] },
    { id: 'verbal', label: 'Resposta Verbal (V)', type: 'radio', required: true, options: [{ value: 5, label: '5 — Orientado' }, { value: 4, label: '4 — Confuso' }, { value: 3, label: '3 — Palavras inapropriadas' }, { value: 2, label: '2 — Sons incompreensíveis' }, { value: 1, label: '1 — Sem resposta (usar "T" se intubado)' }] },
    { id: 'motor', label: 'Resposta Motora (M)', type: 'radio', required: true, options: [{ value: 6, label: '6 — Obedece comandos' }, { value: 5, label: '5 — Localiza o estímulo doloroso' }, { value: 4, label: '4 — Retirada inespecífica à dor' }, { value: 3, label: '3 — Flexão anormal (decorticação)' }, { value: 2, label: '2 — Extensão anormal (descerebração)' }, { value: 1, label: '1 — Sem resposta' }] },
  ],
  calculate: (values) => {
    const O = Number(values.ocular); const V = Number(values.verbal); const M = Number(values.motor);
    const total = O + V + M;
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total >= 13) {
      category = 'TCE / Lesão Leve'; severity = 'low';
      recommendations = ['Monitorização clínica neurológica', 'TC de crânio se: cefaleia intensa, amnésia, vômitos, uso de anticoagulante, idoso', 'Observação hospitalar de 24h se TC indicada'];
    } else if (total >= 9) {
      category = 'TCE / Lesão Moderada'; severity = 'moderate';
      recommendations = ['TC de crânio OBRIGATÓRIA', 'Internação hospitalar', 'Avaliação neurocirúrgica', 'Monitorização em UTI ou UCO neurológica', 'Reavaliação neurológica seriada (a cada 1-2h)'];
    } else {
      category = `TCE / Lesão Grave — INTUBAÇÃO INDICADA (GCS ≤8)`; severity = 'critical';
      recommendations = ['INTUBAÇÃO OROTRAQUEAL IMEDIATA se GCS ≤8', 'TC de crânio urgente pós-estabilização', 'UTI Neurológica / UTI Geral', 'Monitorização de PIC se lesão expansiva', 'Neurocirurgia de sobreaviso', 'Manitol ou solução hipertônica se hipertensão intracraniana'];
    }
    return { value: `${total}/15`, category, interpretation: `GCS: ${total}/15 (O${O}V${V}M${M})\n${category}`, severity, recommendations };
  },
  references: ['Teasdale G, Jennett B. Lancet. 1974;2(7872):81-4', 'Teasdale G, et al. Lancet Neurol. 2014;13(8):844-54'],
};

// ── 2. ICH SCORE ─────────────────────────────────────────────────────────────

export const ICH_SCORE: Calculator = {
  id: 'ich-score',
  name: 'ICH Score — AVC Hemorrágico',
  specialty: 'Neurologia',
  emoji: '🧠',
  description: 'Intracerebral Hemorrhage (ICH) Score para predição de mortalidade em 30 dias após AVC hemorrágico (hemorragia intracerebral espontânea). Pontuação de 0-6 baseada em fatores clínicos e de imagem, com mortalidade variando de 0% a >70%.',
  tooltip: 'Variáveis: Glasgow, volume hematoma (≥30 cm³), sangue intraventricular, localização infratentorial, idade ≥80 anos. ICH Score 0: 0% mortalidade. ICH Score ≥5: >70%. Guia prognóstico e decisão de cuidados.',
  category: 'score',
  fields: [
    { id: 'glasgow', label: 'GCS na admissão', type: 'radio', required: true, options: [{ value: 0, label: 'GCS 13-15 (0)' }, { value: 1, label: 'GCS 5-12 (1)' }, { value: 2, label: 'GCS 3-4 (2)' }] },
    { id: 'volume', label: 'Volume do hematoma (cm³)', type: 'radio', required: true, options: [{ value: 0, label: '< 30 cm³ (0)' }, { value: 1, label: '≥ 30 cm³ (1)' }], info: 'Fórmula ABC/2: A×B×C/2 na TC' },
    { id: 'ivh', label: 'Sangue intraventricular (HIV)?', type: 'radio', required: true, options: [{ value: 0, label: 'Não (0)' }, { value: 1, label: 'Sim (1)' }] },
    { id: 'local', label: 'Localização do hematoma', type: 'radio', required: true, options: [{ value: 0, label: 'Supratentorial (0)' }, { value: 1, label: 'Infratentorial/fossa posterior (1)' }] },
    { id: 'idade', label: 'Idade ≥ 80 anos?', type: 'radio', required: true, options: [{ value: 0, label: 'Não (0)' }, { value: 1, label: 'Sim (1)' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    const mortalidade: Record<number, string> = { 0: '0%', 1: '13%', 2: '26%', 3: '72%', 4: '97%', 5: '100%', 6: '100%' };
    const mort = mortalidade[Math.min(total, 6)] ?? '100%';

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total <= 1) {
      category = 'Baixa Mortalidade'; severity = 'low';
      recommendations = ['TC seriada para monitorar expansão', 'Controle pressórico intensivo (alvo PAS <140 mmHg se estável)', 'Reverter anticoagulação se em uso (vitamina K, CCP)', 'Neurointensivismo'];
    } else if (total <= 3) {
      category = 'Mortalidade Intermediária a Alta'; severity = 'high';
      recommendations = ['UTI Neurológica', 'Neurocirurgia: avaliar craniectomia ou DVE (se HIV sintomático)', 'Controle rigoroso de PA, glicemia, temperatura', 'Discutir prognóstico com família', 'Suporte nutricional precoce'];
    } else {
      category = 'Mortalidade Muito Alta (≥97%)'; severity = 'critical';
      recommendations = ['Discussão imediata sobre prognóstico com família', 'Considerar cuidados paliativos/conforto', 'Limitação de suporte se diretivas antecipadas', 'Avaliação de doação de órgãos se morte encefálica iminente'];
    }
    return { value: `${total}/6`, category, interpretation: `ICH Score: ${total}/6\nMortalidade em 30 dias: ${mort}\n${category}`, severity, recommendations };
  },
  references: ['Hemphill JC 3rd, et al. Stroke. 2001;32(4):891-7', 'Broderick JP, et al. Stroke. 2007;38(6):2001-23'],
};

// ── 3. NIHSS ─────────────────────────────────────────────────────────────────

export const NIHSS: Calculator = {
  id: 'nihss',
  name: 'NIHSS — Gravidade do AVC Isquêmico',
  specialty: 'Neurologia',
  emoji: '🧠',
  description: 'National Institutes of Health Stroke Scale (NIHSS) para quantificação da gravidade neurológica no AVC isquêmico. Avalia 11 itens em 15 sub-itens com pontuação 0-42. Prediz necessidade de trombólise/trombectomia, prognóstico funcional e mortalidade.',
  tooltip: 'NIHSS 0: sem déficit. 1-4: leve. 5-15: moderado. 16-20: moderado-grave. 21-42: muito grave. Indicação de trombólise: NIHSS ≥4 (ou déficit incapacitante). Trombectomia: NIHSS ≥6 com grande vaso.',
  category: 'score',
  fields: [
    { id: 'consciencia', label: '1a. Nível de consciência', type: 'radio', required: true, options: [{ value: 0, label: 'Alerta (0)' }, { value: 1, label: 'Sonolento (1)' }, { value: 2, label: 'Estuporoso (2)' }, { value: 3, label: 'Coma/sem resposta (3)' }] },
    { id: 'conscperguntas', label: '1b. Perguntas de orientação (mês, idade)', type: 'radio', required: true, options: [{ value: 0, label: 'Ambas corretas (0)' }, { value: 1, label: 'Uma correta (1)' }, { value: 2, label: 'Nenhuma / intubado (2)' }] },
    { id: 'conscomandos', label: '1c. Comandos (fechar olhos, empurrar mão)', type: 'radio', required: true, options: [{ value: 0, label: 'Ambos corretos (0)' }, { value: 1, label: 'Um correto (1)' }, { value: 2, label: 'Nenhum correto (2)' }] },
    { id: 'olhar', label: '2. Olhar conjugado', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Paresia parcial do olhar (1)' }, { value: 2, label: 'Desvio forçado / paralisia completa (2)' }] },
    { id: 'visual', label: '3. Campos visuais', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Hemianopsia parcial (1)' }, { value: 2, label: 'Hemianopsia completa (2)' }, { value: 3, label: 'Cegueira bilateral (3)' }] },
    { id: 'facial', label: '4. Paresia facial', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Leve (1)' }, { value: 2, label: 'Parcial (2)' }, { value: 3, label: 'Completa/paralisia (3)' }] },
    { id: 'mmsd', label: '5a. Motor braço D', type: 'radio', required: true, options: [{ value: 0, label: 'Sem queda em 10s (0)' }, { value: 1, label: 'Queda antes de 10s (1)' }, { value: 2, label: 'Esforço contra gravidade (2)' }, { value: 3, label: 'Sem esforço contra gravidade (3)' }, { value: 4, label: 'Plegia (4)' }] },
    { id: 'mmse', label: '5b. Motor braço E', type: 'radio', required: true, options: [{ value: 0, label: 'Sem queda em 10s (0)' }, { value: 1, label: 'Queda antes de 10s (1)' }, { value: 2, label: 'Esforço contra gravidade (2)' }, { value: 3, label: 'Sem esforço contra gravidade (3)' }, { value: 4, label: 'Plegia (4)' }] },
    { id: 'mmisd', label: '6a. Motor perna D', type: 'radio', required: true, options: [{ value: 0, label: 'Sem queda em 5s (0)' }, { value: 1, label: 'Queda antes de 5s (1)' }, { value: 2, label: 'Esforço contra gravidade (2)' }, { value: 3, label: 'Sem esforço contra gravidade (3)' }, { value: 4, label: 'Plegia (4)' }] },
    { id: 'mmise', label: '6b. Motor perna E', type: 'radio', required: true, options: [{ value: 0, label: 'Sem queda em 5s (0)' }, { value: 1, label: 'Queda antes de 5s (1)' }, { value: 2, label: 'Esforço contra gravidade (2)' }, { value: 3, label: 'Sem esforço contra gravidade (3)' }, { value: 4, label: 'Plegia (4)' }] },
    { id: 'ataxia', label: '7. Ataxia de membros', type: 'radio', required: true, options: [{ value: 0, label: 'Ausente (0)' }, { value: 1, label: 'Um membro (1)' }, { value: 2, label: 'Dois membros (2)' }] },
    { id: 'sensorial', label: '8. Sensorial', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Hipoestesia leve-moderada (1)' }, { value: 2, label: 'Hipoestesia grave/anestesia (2)' }] },
    { id: 'linguagem', label: '9. Linguagem / Afasia', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Afasia leve-moderada (1)' }, { value: 2, label: 'Afasia grave (2)' }, { value: 3, label: 'Mudo / afasia global (3)' }] },
    { id: 'articulacao', label: '10. Disartria', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Leve-moderada (1)' }, { value: 2, label: 'Grave / intubado (2)' }] },
    { id: 'negligencia', label: '11. Extinção / Negligência', type: 'radio', required: true, options: [{ value: 0, label: 'Sem negligência (0)' }, { value: 1, label: 'Negligência parcial (1)' }, { value: 2, label: 'Negligência grave (2)' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total === 0) {
      category = 'Sem déficit neurológico'; severity = 'low';
      recommendations = ['Manter monitorização e antitrombótico', 'TC ou RM de difusão para confirmar diagnóstico'];
    } else if (total <= 4) {
      category = 'AVC Isquêmico Leve'; severity = 'low';
      recommendations = ['Trombólise endovenosa se NIHSS ≥4 + déficit incapacitante + <4,5h', 'AAS 300 mg agudo + 100 mg manutenção', 'Internação em Unidade de AVC', 'RM de difusão / TC perfusão'];
    } else if (total <= 15) {
      category = 'AVC Isquêmico Moderado'; severity = 'moderate';
      recommendations = ['Trombólise IV (rt-PA) se <4,5h e sem contraindicações', 'Trombectomia mecânica se oclusão de grande vaso e <24h', 'Unidade de AVC com monitorização', 'Swallowing test antes de dieta VO'];
    } else if (total <= 20) {
      category = 'AVC Isquêmico Moderado-Grave'; severity = 'high';
      recommendations = ['Trombólise IV + avaliação para trombectomia', 'Angiografia cerebral urgente (TC com contraste)', 'UTI Neurológica', 'Fisioterapia motora precoce (24-48h)'];
    } else {
      category = 'AVC Isquêmico Muito Grave'; severity = 'critical';
      recommendations = ['Avaliação para trombectomia mecânica URGENTE', 'Cuidados intensivos neurológicos', 'Craniectomia descompressiva se infarto maligno de ACM', 'Discussão prognóstica precoce com família'];
    }
    return { value: total, category, interpretation: `NIHSS: ${total}/42\n${category}`, severity, recommendations };
  },
  references: ['Brott T, et al. Stroke. 1989;20(7):864-70', 'Powers WJ, et al. Stroke. 2019;50(12):e344-e418 (AHA/ASA 2019)'],
};

export const NEUROLOGY_CALCULATORS: Calculator[] = [GLASGOW, ICH_SCORE, NIHSS];
