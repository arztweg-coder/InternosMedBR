/**
 * surgery-calculators.ts — Calculadoras de Cirurgia
 * 🔪 Cirurgia (ordem alfabética)
 * ASA — Risco Cirúrgico
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. ASA — RISCO CIRÚRGICO ─────────────────────────────────────────────────

export const ASA_SCORE: Calculator = {
  id: 'asa-score',
  name: 'ASA — Classificação de Risco Cirúrgico',
  specialty: 'Cirurgia',
  emoji: '🔪',
  description: 'Classificação da American Society of Anesthesiologists (ASA) para estratificação do risco cirúrgico/anestésico com base no estado físico pré-operatório do paciente. Sistema universal, aplicado em todos os procedimentos eletivos e de urgência. Prediz mortalidade perioperatória e complicações anestésicas.',
  tooltip: 'ASA I: saudável (mortalidade 0,06%). ASA II: doença sistêmica leve (0,47%). ASA III: doença sistêmica grave (1,8%). ASA IV: risco de vida (7,8%). ASA V: moribundo, <24h sem cirurgia (9,4%). ASA VI: morte encefálica (doação). Sufixo E: emergência (+mortalidade).',
  category: 'assessment',
  fields: [
    {
      id: 'asa_class', label: 'Classificação ASA', type: 'radio', required: true,
      options: [
        { value: '1', label: 'ASA I — Paciente saudável, sem doença sistêmica' },
        { value: '2', label: 'ASA II — Doença sistêmica leve, sem limitação funcional' },
        { value: '3', label: 'ASA III — Doença sistêmica grave, limitação funcional definida' },
        { value: '4', label: 'ASA IV — Doença sistêmica grave com risco de vida constante' },
        { value: '5', label: 'ASA V — Moribundo, não esperado sobreviver sem a cirurgia' },
        { value: '6', label: 'ASA VI — Morte encefálica confirmada (doação de órgãos)' },
      ],
      info: 'Classificar com base no estado físico atual do paciente, não apenas pela patologia principal',
    },
    {
      id: 'emergencia', label: 'Cirurgia de emergência?', type: 'checkbox',
      info: 'Adiciona sufixo "E" — aumenta significativamente a mortalidade perioperatória',
    },
    {
      id: 'tipo_cirurgia', label: 'Porte da cirurgia', type: 'radio', required: true,
      options: [
        { value: 'menor', label: 'Menor — ambulatorial, <30 min, anestesia local/sedação (ex: biópsia, curetagem)' },
        { value: 'moderado', label: 'Moderado — laparoscopia, colecistectomia, apendicectomia, RTU' },
        { value: 'maior', label: 'Maior — laparotomia, toracotomia, artroplastia, CRM' },
        { value: 'muito_maior', label: 'Muito maior — emergência abdominal, cirurgia aórtica, transplantes' },
      ],
    },
  ],
  calculate: (values) => {
    const asa = Number(values.asa_class);
    const emergencia = Boolean(values.emergencia);
    const porte = String(values.tipo_cirurgia || 'moderado');

    const mortalidades: Record<number, string> = {
      1: '0,06%', 2: '0,47%', 3: '1,8%', 4: '7,8%', 5: '9,4%', 6: 'N/A (doação)',
    };
    const mortBase = mortalidades[asa] ?? 'N/A';

    let category = '';
    let severity: CalculatorResult['severity'] = 'low';
    let recommendations: string[] = [];
    const sufixo = emergencia ? 'E' : '';

    if (asa === 1) {
      category = `ASA I${sufixo} — Risco Mínimo`;
      severity = emergencia ? 'low' : 'low';
      recommendations = [
        'Paciente saudável — risco anestésico mínimo',
        'Avaliação pré-operatória padrão: hemograma, ECG se >40 anos',
        'Jejum de 6h para sólidos e 2h para líquidos claros',
        'Alta hospitalar no mesmo dia possível para cirurgias menores',
      ];
    } else if (asa === 2) {
      category = `ASA II${sufixo} — Risco Leve`;
      severity = emergencia ? 'moderate' : 'low';
      recommendations = [
        'Doença sistêmica leve: HAS controlada, DM2 bem controlado, obesidade grau I, tabagismo, gravidez',
        'Avaliação pré-operatória: hemograma, glicemia, eletrólitos, função renal, ECG',
        'Controle otimizado das comorbidades antes da cirurgia eletiva',
        'Informar anestesiologista sobre medicações em uso (anti-hipertensivos, metformina)',
        'Internação de 24h pós-operatória para cirurgias moderadas',
      ];
    } else if (asa === 3) {
      category = `ASA III${sufixo} — Risco Moderado-Alto`;
      severity = emergencia ? 'high' : 'moderate';
      recommendations = [
        'Doença sistêmica grave: ICC compensada, angina estável, DPOC moderado, DM com complicações, IRC, obesidade grau III, alcoolismo',
        'Avaliação cardiológica pré-operatória obrigatória para cirurgias maiores',
        'Ecocardiograma se suspeita de disfunção ventricular ou valvopatia',
        'Otimização clínica máxima antes da cirurgia eletiva (4-6 semanas)',
        'Avaliação pelo anestesiologista com antecedência (pré-anestesia)',
        'Monitorização intraoperatória avançada: pressão arterial invasiva se necessário',
        'UTI ou UCO pós-operatória para cirurgias de grande porte',
        emergencia ? '⚠️ EMERGÊNCIA — Risco aumentado: minimizar tempo, suporte intensivo' : 'Adiar se não otimizado',
      ];
    } else if (asa === 4) {
      category = `ASA IV${sufixo} — Risco Alto`;
      severity = 'high';
      recommendations = [
        'Doença sistêmica grave com risco de vida: ICC descompensada, angina instável, IAM recente (<3m), DAI implantado, sepse, ERC dialítica, hepatite grave',
        'Avaliação multidisciplinar obrigatória (cardio, pneumo, nefro conforme comorbidades)',
        'Discussão risco-benefício da cirurgia com paciente e família',
        'Monitorização invasiva perioperatória (cateter de Swan-Ganz em casos selecionados)',
        'UTI pós-operatória obrigatória',
        'Avaliar técnica cirúrgica minimamente invasiva quando possível',
        emergencia ? '⚠️ EMERGÊNCIA GRAVE — Risco muito alto: equipe especializada, UTI desde o intraoperatório' : 'Postergar e otimizar ao máximo — considerar alternativas menos invasivas',
      ];
    } else if (asa === 5) {
      category = `ASA V${sufixo} — Risco Muito Alto (Moribundo)`;
      severity = 'critical';
      recommendations = [
        'Paciente moribundo — cirurgia como último recurso para preservar a vida',
        'Ruptura de aneurisma de aorta, trauma grave, sepse fulminante',
        'Discussão IMEDIATA sobre prognóstico e diretivas antecipadas de vontade com família',
        'Equipe cirúrgica e anestésica de plantão de nível máximo',
        'UTI desde a indução anestésica',
        'Suporte hemodinâmico máximo: vasopressores, inotrópicos',
        'Monitorização invasiva completa',
        'Cuidados paliativos integrados se decisão de limitação',
      ];
    } else if (asa === 6) {
      category = 'ASA VI — Morte Encefálica (Doação de Órgãos)';
      severity = 'critical';
      recommendations = [
        'Paciente com morte encefálica confirmada para doação de órgãos',
        'Protocolo de manutenção do doador: hemodinâmica, ventilação, endócrino',
        'Coordenação com Central de Transplantes (CNCDO)',
        'Avaliação de elegibilidade para doação de órgãos e tecidos',
        'Documentação legal: consentimento familiar ou registro de doador',
        'Comunicação com equipes de transplante receptoras',
      ];
    }

    const emergStr = emergencia ? ' (EMERGÊNCIA)' : '';
    return {
      value: `ASA ${asa}${sufixo}`,
      category,
      interpretation: `Classificação ASA: ${asa}${sufixo}${emergStr}\nMortalidade perioperatória estimada: ${mortBase}${emergencia ? ' (×2-4 em emergência)' : ''}\nPorte cirúrgico: ${porte}\n${category}`,
      severity,
      recommendations,
    };
  },
  references: [
    'Doyle DJ, Garmon EH. American Society of Anesthesiologists Classification (ASA Class). StatPearls. 2023',
    'Daabiss M. Br J Anaesth (Educ). 2011;11(4):120-2',
    'CFM. Resolução 2.174/2017 — Anestesiologia e Risco Cirúrgico',
  ],
};

export const SURGERY_CALCULATORS: Calculator[] = [ASA_SCORE];
