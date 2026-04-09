/**
 * infectology-calculators.ts — Calculadoras de Infectologia
 * 🦠 Infectologia (ordem alfabética)
 * CURB-65
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. CURB-65 ───────────────────────────────────────────────────────────────

export const CURB65: Calculator = {
  id: 'curb65',
  name: 'CURB-65 — Gravidade da Pneumonia',
  specialty: 'Infectologia',
  emoji: '🦠',
  description: 'Escore CURB-65 para estratificação de gravidade da pneumonia adquirida na comunidade (PAC) e decisão de local de tratamento (ambulatorial, internação ou UTI). Validado pela British Thoracic Society (BTS). Cinco critérios simples, aplicáveis à beira do leito.',
  tooltip: 'C=Confusão, U=Ureia>50mg/dL, R=FR≥30irpm, B=PA sistólica<90 ou diastólica≤60mmHg, 65=Idade≥65. 0-1: baixo risco → ambulatorial. 2: risco moderado → internação. ≥3: alto risco → considerar UTI. Mortalidade: 0-1: <3%; 2: ~9%; ≥3: >15-40%.',
  category: 'score',
  fields: [
    { id: 'confusao', label: 'C — Confusão mental aguda (novo desorientação tempo/espaço)', type: 'checkbox', info: '+1 ponto' },
    { id: 'ureia', label: 'U — Ureia sérica > 50 mg/dL (ou BUN > 19 mg/dL)', type: 'checkbox', info: '+1 ponto' },
    { id: 'fr', label: 'R — Frequência respiratória ≥ 30 irpm', type: 'checkbox', info: '+1 ponto' },
    { id: 'pa', label: 'B — PA sistólica < 90 mmHg ou diastólica ≤ 60 mmHg', type: 'checkbox', info: '+1 ponto' },
    { id: 'idade65', label: '65 — Idade ≥ 65 anos', type: 'checkbox', info: '+1 ponto' },
  ],
  calculate: (values) => {
    const total = Object.values(values).filter(Boolean).length;

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total <= 1) {
      category = 'Baixo Risco — Tratamento Ambulatorial'; severity = 'low';
      recommendations = [
        'Mortalidade estimada <3%',
        'Tratamento ambulatorial na maioria dos casos',
        'Antibioticoterapia VO: amoxicilina 500mg 8/8h × 5-7d (sem comorbidades)',
        'Se atípico suspeito: azitromicina 500mg/d × 3-5d ou doxiciclina',
        'Retorno em 48-72h ou imediatamente se piora',
        'Indicar internação se: hipoxemia, comorbidades descompensadas, impossibilidade de adesão VO',
      ];
    } else if (total === 2) {
      category = 'Risco Moderado — Internação Hospitalar'; severity = 'moderate';
      recommendations = [
        'Mortalidade estimada ~9%',
        'Internação hospitalar recomendada',
        'Antibioticoterapia EV: ampicilina-sulbactam 3g 6/6h ou ceftriaxona 1-2g/d',
        'Associar macrolídeo se atípico suspeito (azitromicina EV)',
        'Monitorização de SatO₂, função renal e hepática',
        'Cultura de escarro e hemoculturas antes do ATB',
        'Radiografia de tórax AP e perfil na admissão',
        'Critérios de troca para VO após 48-72h de melhora clínica',
      ];
    } else if (total <= 4) {
      category = 'Alto Risco — Internação (considerar UTI)'; severity = 'high';
      recommendations = [
        'Mortalidade estimada 15-40%',
        'Internação hospitalar obrigatória — avaliar UTI',
        'Antibioticoterapia EV dupla cobertura: beta-lactâmico + macrolídeo ou fluoroquinolona respiratória',
        'Avaliar critérios de SARI e sepse (qSOFA + SOFA)',
        'Oxigenoterapia e suporte ventilatório conforme necessidade',
        'Hemoculturas × 2, uroantígenos (Legionella e Pneumococo)',
        'Gasometria arterial e lactato se deterioração',
        'Avaliar internação em UTI se: PaO₂/FiO₂ <250, confusão, extensão radiológica >1 lobo',
      ];
    } else {
      category = 'Risco Muito Alto — UTI'; severity = 'critical';
      recommendations = [
        'Mortalidade estimada >40%',
        'INTERNAÇÃO EM UTI obrigatória',
        'Antibioticoterapia empírica de amplo espectro (incluir cobertura para Pseudomonas se risco)',
        'Suporte ventilatório: VNI ou IOT conforme quadro',
        'Monitorização hemodinâmica contínua',
        'Vasopressores se necessário (noradrenalina 1ª linha)',
        'Corticoterapia adjuvante: dexametasona 6mg/d × 10d se grave',
        'Aplicar protocolos de sepse se critérios atendidos',
      ];
    }
    return {
      value: `${total}/5`, category,
      interpretation: `CURB-65: ${total}/5\n${category}`,
      severity, recommendations,
    };
  },
  references: [
    'Lim WS, et al. Thorax. 2003;58(5):377-82 (BTS Guidelines)',
    'Mandell LA, et al. Clin Infect Dis. 2007;44(Suppl 2):S27-72 (IDSA/ATS 2007)',
    'SBPT. Diretrizes Brasileiras para PAC. J Bras Pneumol. 2009;35(6):574-601',
  ],
};

export const INFECTOLOGY_CALCULATORS: Calculator[] = [CURB65];
