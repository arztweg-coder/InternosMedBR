/**
 * rheumatology-calculators.ts — Calculadoras de Reumatologia
 * 🦴 Reumatologia (ordem alfabética)
 * ASAS — Espondiloartrite Axial
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. ASAS — ESPONDILOARTRITE AXIAL ─────────────────────────────────────────

export const ASAS_AXESPA: Calculator = {
  id: 'asas-axespa',
  name: 'ASAS — Critérios para Espondiloartrite Axial',
  specialty: 'Reumatologia',
  emoji: '🦴',
  description: 'Critérios ASAS (Assessment of SpondyloArthritis International Society) para classificação de Espondiloartrite Axial (EspAax) em pacientes com lombalgia crônica ≥3 meses de início antes dos 45 anos. Permite diagnóstico de EspAax não-radiográfica (nr-EspAax) e EspAax radiográfica (Espondilite Anquilosante — EA).',
  tooltip: 'Diagnóstico se: Imagem (sacroiliite na RM ou RX) + ≥1 característica SpA; OU HLA-B27+ + ≥2 características SpA. Características SpA: dor lombar inflamatória, artrite, entesite, uveíte, dactilite, psoríase, DII, boa resposta a AINEs, HF de SpA, HLA-B27, PCR elevada.',
  category: 'assessment',
  fields: [
    {
      id: 'entrada', label: 'CRITÉRIO DE ENTRADA', type: 'radio', required: true,
      options: [
        { value: 'imagem', label: 'Via Imagem: Sacroiliite em RM ou RX + HLA-B27 disponível' },
        { value: 'hlab27', label: 'Via HLA-B27: HLA-B27 positivo (sem imagem ou imagem negativa)' },
      ],
      info: 'Lombalgia crônica ≥3 meses, início <45 anos. Escolha a via diagnóstica aplicável',
    },
    {
      id: 'sacroiliite', label: 'Sacroiliite em imagem (RM ou RX)?', type: 'radio', required: true,
      options: [
        { value: 'rm_ativa', label: 'RM com inflamação ativa (edema ósseo subcondral)' },
        { value: 'rx_definitivo', label: 'RX com sacroiliite definitiva (grau II bilateral ou III-IV unilateral — New York)' },
        { value: 'nao', label: 'Não / não realizado / negativo' },
      ],
    },
    { id: 'hlab27', label: 'HLA-B27 positivo?', type: 'checkbox', info: 'Característica SpA — também critério de entrada pela via HLA-B27' },
    { id: 'dli', label: 'Dor lombar inflamatória (DLI)?', type: 'checkbox', info: '≥4 de 5 critérios de Berlim: início <40 anos, início insidioso, melhora com exercício, sem melhora com repouso, dor noturna com melhora ao levantar' },
    { id: 'artrite', label: 'Artrite periférica (presente ou prévia)?', type: 'checkbox', info: 'Artrite assimétrica predominantemente de MMII' },
    { id: 'entesite', label: 'Entesite do calcâneo (talão)?', type: 'checkbox', info: 'Dor no tendão de Aquiles ou fáscia plantar' },
    { id: 'uveite', label: 'Uveíte anterior (presente ou prévia)?', type: 'checkbox', info: 'Diagnóstico por oftalmologista' },
    { id: 'dactilite', label: 'Dactilite (presente ou prévia)?', type: 'checkbox', info: '"Dedo em salsicha" — dedos de mãos ou pés' },
    { id: 'psoriase', label: 'Psoríase (presente ou prévia)?', type: 'checkbox', info: 'Diagnóstico médico confirmado' },
    { id: 'dii', label: 'Doença inflamatória intestinal (DII)?', type: 'checkbox', info: 'Doença de Crohn ou Retocolite Ulcerativa — diagnóstico médico' },
    { id: 'resposta_aine', label: 'Boa resposta a AINEs?', type: 'checkbox', info: 'Melhora >50% da dor lombar em 24-48h com AINE em dose plena' },
    { id: 'hf_espa', label: 'Familiar de 1º/2º grau com SpA?', type: 'checkbox', info: 'EA, psoríase, uveíte, artrite reativa, DII em parentes de 1º ou 2º grau' },
    { id: 'pcr', label: 'PCR elevada (sem outra explicação)?', type: 'checkbox', info: 'Proteína C Reativa aumentada em presença de lombalgia' },
  ],
  calculate: (values) => {
    const entrada = String(values.entrada || '');
    const sacroiliite = String(values.sacroiliite || 'nao');
    const temSacroiliite = sacroiliite !== 'nao';
    const hlab27 = Boolean(values.hlab27);

    const caracteristicasSpA = [
      'dli', 'artrite', 'entesite', 'uveite', 'dactilite',
      'psoriase', 'dii', 'resposta_aine', 'hf_espa', 'pcr',
    ];
    const nCaract = caracteristicasSpA.filter(k => Boolean(values[k])).length + (hlab27 ? 1 : 0);

    let classificado = false;
    let via = '';
    let category = '';
    let severity: CalculatorResult['severity'] = 'low';
    let recommendations: string[] = [];

    if (entrada === 'imagem' && temSacroiliite && nCaract >= 1) {
      classificado = true;
      via = 'Via Imagem';
      if (sacroiliite === 'rx_definitivo') {
        category = 'Espondiloartrite Axial Radiográfica (Espondilite Anquilosante)';
        severity = 'high';
      } else {
        category = 'Espondiloartrite Axial não-Radiográfica (nr-EspAax)';
        severity = 'moderate';
      }
    } else if (entrada === 'hlab27' && hlab27 && nCaract >= 3) {
      // HLA-B27 conta como 1 característica, mais 2 adicionais = 3 total
      const nSemHLA = nCaract - 1;
      if (nSemHLA >= 2) {
        classificado = true;
        via = 'Via HLA-B27';
        category = 'Espondiloartrite Axial (via HLA-B27)';
        severity = 'moderate';
      }
    }

    if (classificado) {
      recommendations = [
        `Classificação ASAS positiva para EspAax — ${via}`,
        'Encaminhar ao reumatologista para confirmação diagnóstica e início de tratamento',
        'AINEs como 1ª linha: ibuprofeno, naproxeno ou diclofenaco em dose plena por 2-4 semanas',
        'Se falha a 2 AINEs sequenciais × 4 semanas: indicar biológico (anti-TNF ou anti-IL17)',
        'Fisioterapia/exercício aquático: componente essencial do tratamento',
        'Radiografia de bacia (AP) e coluna lombossacra (AP e perfil)',
        'RM sacroilíacas se RX negativo e alta suspeita',
        'Avaliar comorbidades: uveíte, DII, psoríase, osteoporose',
        'Monitorar BASDAI e ASDAS para atividade da doença',
      ];
    } else {
      category = 'Critérios ASAS não preenchidos';
      severity = 'low';
      const faltam: string[] = [];
      if (entrada === 'imagem' && !temSacroiliite) faltam.push('Sacroiliite em imagem (RM ou RX) necessária para via Imagem');
      if (entrada === 'imagem' && temSacroiliite && nCaract < 1) faltam.push('≥1 característica SpA necessária');
      if (entrada === 'hlab27' && !hlab27) faltam.push('HLA-B27 positivo necessário para via HLA-B27');
      if (entrada === 'hlab27' && hlab27 && nCaract < 3) faltam.push(`≥2 características SpA adicionais necessárias (atual: ${nCaract - 1})`);
      recommendations = [
        'Critérios ASAS não preenchidos com as informações atuais',
        ...faltam.map(f => `• Pendente: ${f}`),
        'Critérios ASAS são de classificação (pesquisa), não diagnósticos — avaliação clínica prevalece',
        'Complementar com: HLA-B27, PCR/VHS, RM sacroilíacas se não realizadas',
        'Considerar diagnósticos diferenciais: hérnia discal, SFM, osteoartrose, DDM',
        'Encaminhar ao reumatologista se dor lombar inflamatória ≥3 meses com início <45 anos',
      ];
    }

    const caractDisplay = nCaract - (hlab27 ? 1 : 0);
    return {
      value: classificado ? 'Positivo' : 'Negativo',
      category,
      interpretation: `ASAS: ${classificado ? 'CLASSIFICADO como EspAax' : 'Critérios não preenchidos'}\nVia: ${entrada === 'imagem' ? 'Imagem' : 'HLA-B27'} | Sacroiliite: ${temSacroiliite ? 'Sim' : 'Não'} | HLA-B27: ${hlab27 ? 'Positivo' : 'Negativo'}\nCaracterísticas SpA (excl. HLA-B27): ${caractDisplay}/10\n${category}`,
      severity,
      recommendations,
    };
  },
  references: [
    'Rudwaleit M, et al. Ann Rheum Dis. 2009;68(6):777-83 (ASAS criteria)',
    'van der Heijde D, et al. Ann Rheum Dis. 2017;76(6):978-91 (ASAS-EULAR 2016)',
    'SBR. Consenso Brasileiro de Espondiloartrites. Rev Bras Reumatol. 2013;53(2):98-121',
  ],
};

export const RHEUMATOLOGY_CALCULATORS: Calculator[] = [ASAS_AXESPA];
