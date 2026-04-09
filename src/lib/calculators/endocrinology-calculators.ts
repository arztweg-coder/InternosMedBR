/**
 * endocrinology-calculators.ts — Calculadoras de Endocrinologia
 * 🩺 Endocrinologia (ordem alfabética)
 * FINDRISK | HOMA-IR | Rastreio de Tireopatias
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. FINDRISK ──────────────────────────────────────────────────────────────

export const FINDRISK: Calculator = {
  id: 'findrisk',
  name: 'FINDRISK — Risco de Diabetes em 10 Anos',
  specialty: 'Endocrinologia',
  emoji: '🩺',
  description: 'Finnish Diabetes Risk Score (FINDRISK) para estimativa do risco de desenvolver diabetes tipo 2 em 10 anos. Validado para a população brasileira pela SBD. Permite triagem rápida sem exames laboratoriais, baseando-se em fatores de risco modificáveis.',
  tooltip: 'Pontuação 0-26. <7: baixo risco (<1%). 7-11: leve risco (~4%). 12-14: moderado (~17%). 15-20: alto (~33%). >20: muito alto (~50%). Recomendado pela SBD para rastreio na APS.',
  category: 'questionnaire',
  fields: [
    {
      id: 'idade', label: 'Faixa etária', type: 'radio', required: true,
      options: [{ value: 0, label: 'Menos de 45 anos (0)' }, { value: 2, label: '45 a 54 anos (2)' }, { value: 3, label: '55 a 64 anos (3)' }, { value: 4, label: 'Mais de 64 anos (4)' }],
    },
    {
      id: 'imc', label: 'IMC (kg/m²)', type: 'radio', required: true,
      options: [{ value: 0, label: 'Menos de 25 kg/m² (0)' }, { value: 1, label: '25 a 30 kg/m² (1)' }, { value: 3, label: 'Mais de 30 kg/m² (3)' }],
    },
    {
      id: 'cintura', label: 'Circunferência da cintura', type: 'radio', required: true,
      options: [
        { value: 0, label: 'H: <94 cm / M: <80 cm (0)' },
        { value: 3, label: 'H: 94-102 cm / M: 80-88 cm (3)' },
        { value: 4, label: 'H: >102 cm / M: >88 cm (4)' },
      ],
    },
    { id: 'atividade', label: 'Pratica atividade física ≥30 min/dia ou equivalente?', type: 'radio', required: true, options: [{ value: 0, label: 'Sim (0)' }, { value: 2, label: 'Não (2)' }] },
    { id: 'frutas', label: 'Consome frutas, vegetais, cereais integrais diariamente?', type: 'radio', required: true, options: [{ value: 0, label: 'Sim (0)' }, { value: 1, label: 'Não (1)' }] },
    { id: 'anti_hipert', label: 'Já usou ou usa medicamento para hipertensão?', type: 'radio', required: true, options: [{ value: 0, label: 'Não (0)' }, { value: 2, label: 'Sim (2)' }] },
    { id: 'glicemia_alta', label: 'Alguma vez teve glicemia elevada (exame, gestação)?', type: 'radio', required: true, options: [{ value: 0, label: 'Não (0)' }, { value: 5, label: 'Sim (5)' }] },
    {
      id: 'familiar', label: 'Familiar com diagnóstico de diabetes?', type: 'radio', required: true,
      options: [{ value: 0, label: 'Nenhum (0)' }, { value: 3, label: 'Avô, tio, primo (3)' }, { value: 5, label: 'Pai, mãe, irmão, filho (5)' }],
    },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let risco = ''; let recommendations: string[] = [];
    if (total < 7) {
      category = 'Baixo Risco'; risco = '<1% em 10 anos'; severity = 'low';
      recommendations = ['Hábitos saudáveis para manutenção', 'Glicemia de jejum a cada 3 anos', 'Manter IMC <25 e cintura ideal'];
    } else if (total <= 11) {
      category = 'Risco Leve'; risco = '~4% em 10 anos'; severity = 'low';
      recommendations = ['Dieta hipocalórica com baixo índice glicêmico', 'Atividade física: 150 min/semana', 'Glicemia de jejum e HbA1c anuais'];
    } else if (total <= 14) {
      category = 'Risco Moderado'; risco = '~17% em 10 anos'; severity = 'moderate';
      recommendations = ['Solicitar: glicemia jejum, HbA1c, TOTG 75g', 'Intervenção intensiva no estilo de vida', 'Redução de 5-7% do peso corporal', 'Metformina se pré-diabetes confirmada e risco muito alto'];
    } else if (total <= 20) {
      category = 'Alto Risco'; risco = '~33% em 10 anos'; severity = 'high';
      recommendations = ['Rastreio laboratorial IMEDIATO: TOTG 75g', 'Programa de prevenção de DM (Programa Viver Bem)', 'Encaminhar a endocrinologista', 'Tratar fatores de risco: HAS, dislipidemia, obesidade'];
    } else {
      category = 'Risco Muito Alto'; risco = '~50% em 10 anos'; severity = 'critical';
      recommendations = ['Diagnóstico de pré-diabetes ou DM muito provável', 'Avaliação endocrinológica urgente', 'TOTG 75g + HbA1c imediatos', 'Iniciar intervenção farmacológica se pré-diabetes'];
    }
    return { value: total, category, interpretation: `FINDRISK: ${total} pontos\nRisco: ${risco}\n${category}`, severity, recommendations };
  },
  references: ['Lindström J, Tuomilehto J. Diabetes Care. 2003;26(3):725-31', 'SBD. Diretrizes da Sociedade Brasileira de Diabetes. 2023'],
};

// ── 2. HOMA-IR ───────────────────────────────────────────────────────────────

export const HOMA_IR: Calculator = {
  id: 'homa-ir',
  name: 'HOMA-IR — Resistência à Insulina',
  specialty: 'Endocrinologia',
  emoji: '🩺',
  description: 'Homeostatic Model Assessment of Insulin Resistance (HOMA-IR) para avaliação quantitativa da resistência insulínica e função das células β pancreáticas. Marcador indireto de resistência à insulina, correlaciona-se com o clamp euglicêmico-hiperinsulinêmico.',
  tooltip: 'HOMA-IR = (Insulina jejum × Glicemia jejum) / 405. Normal: <2,5 (alguns labs usam <2,7). >2,5: resistência leve. >3,0: moderada. >5,0: grave. Útil em pré-diabetes, SOP e obesidade.',
  category: 'formula',
  fields: [
    { id: 'insulina', label: 'Insulina de Jejum (μUI/mL)', type: 'number', min: 0.1, max: 200, step: 0.1, required: true, unit: 'μUI/mL', info: 'Coleta em jejum de 8-12h' },
    { id: 'glicemia', label: 'Glicemia de Jejum (mg/dL)', type: 'number', min: 50, max: 500, required: true, unit: 'mg/dL', info: 'Em mmol/L divida por 18' },
  ],
  calculate: (values) => {
    const ins = Number(values.insulina);
    const gli = Number(values.glicemia);
    const homa = (ins * gli) / 405;
    const v = parseFloat(homa.toFixed(2));

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (v < 2.5) {
      category = 'Normal — Sem Resistência à Insulina'; severity = 'low';
      recommendations = ['Sensibilidade insulínica preservada', 'Manter dieta e exercícios regulares'];
    } else if (v < 3.0) {
      category = 'Resistência Leve'; severity = 'moderate';
      recommendations = ['Modificação do estilo de vida: dieta hipocalórica de baixo IG', 'Atividade física: mínimo 150 min/semana', 'Reduzir carboidratos refinados e açúcar simples', 'Reavaliação em 3 meses'];
    } else if (v < 5.0) {
      category = 'Resistência Moderada'; severity = 'moderate';
      recommendations = ['Avaliação endocrinológica', 'Rastreio de SOP em mulheres', 'Rastreio de DHGNA', 'Considerar metformina se pré-diabetes', 'Exercício aeróbico + resistência'];
    } else {
      category = 'Resistência Grave'; severity = 'high';
      recommendations = ['Encaminhar URGENTE ao endocrinologista', 'Rastreio completo de síndrome metabólica', 'Iniciar metformina (após confirmar indicação)', 'Considerar investigação de acantose nigricans, SOP, Cushing', 'Hepatograma + ultrassom para DHGNA'];
    }
    return { value: v, category, interpretation: `HOMA-IR: ${v}\nInsulina: ${ins} μUI/mL | Glicemia: ${gli} mg/dL\n${category}`, severity, recommendations };
  },
  references: ['Matthews DR, et al. Diabetologia. 1985;28(7):412-9', 'Geloneze B, et al. Arq Bras Endocrinol Metab. 2009;53(2):281-7'],
};

// ── 3. RASTREIO DE TIREOPATIAS ───────────────────────────────────────────────

export const THYROID_SCREENING: Calculator = {
  id: 'rastreio-tireoide',
  name: 'Rastreio de Tireopatias',
  specialty: 'Endocrinologia',
  emoji: '🩺',
  description: 'Avaliação de fatores de risco e sintomas para triagem de doenças da tireoide (hipo e hipertireoidismo). Auxilia na decisão de solicitação de TSH e na frequência de rastreio, especialmente em grupos de risco como idosos, gestantes e pacientes com doenças autoimunes.',
  tooltip: 'Principais grupos de risco: mulher >45 anos, história familiar, tireoide prévia, uso de amiodarona/lítio, DM tipo 1, vitiligo, anemia perniciosa, síndrome de Down. TSH é o exame de triagem.',
  category: 'assessment',
  fields: [
    { id: 'sexo_fem', label: 'Sexo feminino?', type: 'checkbox' },
    { id: 'idade_45', label: 'Idade ≥ 45 anos?', type: 'checkbox' },
    { id: 'hist_familiar', label: 'História familiar de tireoidopatia?', type: 'checkbox' },
    { id: 'doenca_autoimune', label: 'Doença autoimune: DM1, vitiligo, anemia perniciosa, LES?', type: 'checkbox' },
    { id: 'cirurgia_previa', label: 'Cirurgia de tireoide ou pescoço prévia?', type: 'checkbox' },
    { id: 'amiodarona', label: 'Uso de amiodarona, lítio ou interferon?', type: 'checkbox' },
    { id: 'irradiacao', label: 'Irradiação de cabeça e pescoço prévia?', type: 'checkbox' },
    { id: 'hipotireoidismo_sx', label: 'Sintomas de hipotireoidismo: fadiga, ganho de peso, constipação, frio, bradicardia?', type: 'checkbox' },
    { id: 'hipertireoidismo_sx', label: 'Sintomas de hipertireoidismo: palpitação, perda de peso, tremor, calor, diarreia, taquicardia?', type: 'checkbox' },
    { id: 'nodulo', label: 'Nódulo palpável na tireoide?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const fatores = Object.values(values).filter(Boolean).length;
    const nodulo = Boolean(values.nodulo);
    const hipo = Boolean(values.hipotireoidismo_sx);
    const hiper = Boolean(values.hipertireoidismo_sx);

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (nodulo) {
      category = 'Nódulo Tireoidiano — Avaliação Obrigatória'; severity = 'high';
      recommendations = ['TSH + T4 livre URGENTE', 'US tireoide (avaliar risco TIRADS)', 'Cintilografia se TSH suprimido', 'PAAF se nódulo >1cm ou características suspeitas', 'Encaminhar ao endocrinologista'];
    } else if (hipo || hiper) {
      category = 'Sintomas Sugestivos — Rastreio Indicado'; severity = 'moderate';
      recommendations = ['TSH + T4 livre imediatos', hipo ? 'Hipotireoidismo: repor levotiroxina se confirmado' : 'Hipertireoidismo: propiltiouracil ou metimazol se Graves', 'Anticorpos: anti-TPO, TRAb se suspeita autoimune', 'ECG se taquicardia'];
    } else if (fatores >= 3) {
      category = 'Alto Risco — Rastreio Periódico Recomendado'; severity = 'moderate';
      recommendations = ['TSH anual', 'US tireoide se bócio ou nódulo ao exame físico', 'Anti-TPO em grupos de risco autoimune'];
    } else if (fatores >= 1) {
      category = 'Risco Moderado — Rastreio a cada 2-3 anos'; severity = 'low';
      recommendations = ['TSH a cada 2-3 anos', 'Orientar sinais de alarme para retorno precoce'];
    } else {
      category = 'Baixo Risco'; severity = 'low';
      recommendations = ['Rastreio universal: TSH a partir dos 35 anos, a cada 5 anos', 'Orientar sobre fatores de risco'];
    }
    return { value: fatores, category, interpretation: `Fatores de risco: ${fatores}/10\n${category}`, severity, recommendations };
  },
  references: ['SBE. Consenso Brasileiro de Nódulos Tireoidianos. 2020', 'Vanderpump MP. Br Med Bull. 2011;99(1):39-51'],
};

export const ENDOCRINOLOGY_CALCULATORS: Calculator[] = [FINDRISK, HOMA_IR, THYROID_SCREENING];
