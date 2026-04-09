/**
 * geriatrics-calculators.ts — Calculadoras Geriátricas Complementares
 * 👴 Geriatria — CAM | FRAX | MoCA | Polifarmácia | Síndrome do Caidoor
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. CAM — Delirium ────────────────────────────────────────────────────────

export const CAM: Calculator = {
  id: 'cam',
  name: 'CAM — Avaliação de Delirium',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Confusion Assessment Method (CAM) para diagnóstico de delirium à beira do leito. Avalia os 4 critérios diagnósticos de delirium do DSM. Sensibilidade 94-100%, especificidade 90-95%. Deve ser aplicado após avaliação do estado mental basal.',
  tooltip: 'CAM POSITIVO: obrigatório ter critérios 1 e 2, mais 3 ou 4. 1=Início agudo/flutuante. 2=Desatenção. 3=Pensamento desorganizado. 4=Nível alterado de consciência.',
  category: 'assessment',
  fields: [
    {
      id: 'c1', label: 'Critério 1: Início agudo ou curso flutuante do estado mental?',
      type: 'radio', required: true,
      options: [{ value: 'sim', label: 'Sim — início agudo ou piora/melhora ao longo do dia' }, { value: 'nao', label: 'Não' }],
      info: 'Mudança aguda do estado mental comparado ao basal, com flutuação ao longo do dia',
    },
    {
      id: 'c2', label: 'Critério 2: Desatenção presente?',
      type: 'radio', required: true,
      options: [{ value: 'sim', label: 'Sim — dificuldade para manter atenção' }, { value: 'nao', label: 'Não' }],
      info: 'Paciente distrai-se facilmente, tem dificuldade em acompanhar conversa',
    },
    {
      id: 'c3', label: 'Critério 3: Pensamento desorganizado?',
      type: 'radio', required: true,
      options: [{ value: 'sim', label: 'Sim — pensamento incoerente ou ilógico' }, { value: 'nao', label: 'Não' }],
    },
    {
      id: 'c4', label: 'Critério 4: Nível de consciência alterado?',
      type: 'radio', required: true,
      options: [{ value: 'sim', label: 'Sim — hiperalerta, letárgico, estupor ou comatoso' }, { value: 'nao', label: 'Não — normal/alerta' }],
    },
  ],
  calculate: (values) => {
    const c1 = values.c1 === 'sim';
    const c2 = values.c2 === 'sim';
    const c3 = values.c3 === 'sim';
    const c4 = values.c4 === 'sim';
    const positivo = c1 && c2 && (c3 || c4);
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (positivo) {
      category = 'CAM POSITIVO — Delirium Presente'; severity = 'critical';
      recommendations = [
        '⚠️ DELIRIUM CONFIRMADO — iniciar protocolo',
        'Identificar e tratar causas: PINCH-ME (Pain, Infection, Nutrition, Constipation, Hydration, Medication, Environment)',
        'Reorientação: calendário, relógio, luz natural',
        'Mobilização precoce e fisioterapia diária',
        'Suspender medicamentos precipitantes (opioides, anticolinérgicos, BZD)',
        'Antipsicótico apenas se agitação grave e risco de segurança',
        'Evitar contenção física',
        'Envolver família no cuidado',
      ];
    } else {
      category = 'CAM Negativo — Sem Evidência de Delirium'; severity = 'low';
      recommendations = ['Sem critérios para delirium no momento', 'Monitorizar estado mental (reavaliar 2x/dia em paciente de risco)', 'Prevenção: mobilização precoce, hidratação, orientação'];
    }
    const criterios = `C1 (Início agudo): ${c1 ? '✓' : '✗'}\nC2 (Desatenção): ${c2 ? '✓' : '✗'}\nC3 (Desorganização): ${c3 ? '✓' : '✗'}\nC4 (Consciência alterada): ${c4 ? '✓' : '✗'}`;
    return { value: positivo ? 'POSITIVO' : 'NEGATIVO', category, interpretation: `${category}\n\n${criterios}`, severity, recommendations };
  },
  references: ['Inouye SK, et al. Ann Intern Med. 1990;113(12):941-8', 'Wei LA, et al. J Am Geriatr Soc. 2008;56(7):1346-52'],
};

// ── 2. FRAX ──────────────────────────────────────────────────────────────────

export const FRAX_SIMPLE: Calculator = {
  id: 'frax',
  name: 'FRAX — Risco de Fratura (Simplificado)',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Versão simplificada do FRAX (WHO Fracture Risk Assessment) para estimativa de risco de fratura osteoporótica maior em 10 anos. Baseada nos principais fatores de risco clínicos validados para a população brasileira.',
  tooltip: 'Fatores incluem: idade, sexo, IMC, corticoide, artrite reumatoide, fratura prévia, fratura parental de quadril, tabagismo, álcool. FRAX ≥20% (fratura maior) ou ≥3% (quadril): tratar independente da densitometria.',
  category: 'score',
  fields: [
    { id: 'idade', label: 'Idade (anos)', type: 'number', min: 40, max: 90, required: true },
    { id: 'sexo', label: 'Sexo', type: 'radio', required: true, options: [{ value: 'F', label: 'Feminino' }, { value: 'M', label: 'Masculino' }] },
    { id: 'imc', label: 'IMC (kg/m²)', type: 'number', min: 10, max: 50, step: 0.1, required: true },
    { id: 'fratura_previa', label: 'Fratura por fragilidade prévia (após 40 anos)?', type: 'checkbox' },
    { id: 'fratura_parental', label: 'Fratura de quadril em pai/mãe?', type: 'checkbox' },
    { id: 'corticoide', label: 'Uso atual ou prévio de corticoide (≥3 meses, prednisona ≥5mg/d)?', type: 'checkbox' },
    { id: 'artrite_reum', label: 'Artrite reumatoide diagnosticada?', type: 'checkbox' },
    { id: 'tabagismo', label: 'Tabagismo atual?', type: 'checkbox' },
    { id: 'alcool', label: 'Consumo de álcool ≥3 doses/dia?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const idade = Number(values.idade);
    const sexo = String(values.sexo);
    const imc = Number(values.imc);
    let pontos = 0;
    // Fatores de risco — pontuação simplificada baseada no FRAX
    if (idade >= 70) pontos += 3; else if (idade >= 65) pontos += 2; else if (idade >= 60) pontos += 1;
    if (sexo === 'F') pontos += 2;
    if (imc < 19) pontos += 2; else if (imc < 23) pontos += 1;
    if (values.fratura_previa) pontos += 3;
    if (values.fratura_parental) pontos += 1;
    if (values.corticoide) pontos += 2;
    if (values.artrite_reum) pontos += 1;
    if (values.tabagismo) pontos += 1;
    if (values.alcool) pontos += 1;

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (pontos <= 3) {
      category = 'Baixo Risco de Fratura'; severity = 'low';
      recommendations = ['Cálcio 1000-1200 mg/dia (dieta/suplemento)', 'Vitamina D 800-1000 UI/dia', 'Exercícios com impacto e resistência', 'Reavaliação em 3-5 anos'];
    } else if (pontos <= 6) {
      category = 'Risco Intermediário'; severity = 'moderate';
      recommendations = ['Densitometria óssea indicada', 'Cálcio + Vitamina D obrigatórios', 'Exercícios supervisionados', 'Avaliar FRAX completo no site da OMS'];
    } else {
      category = 'Alto Risco de Fratura'; severity = 'high';
      recommendations = ['Densitometria óssea imediata', 'Iniciar tratamento farmacológico: alendronato 70mg/semana (1ª linha)', 'Suplementação: cálcio 1200mg + vitamina D 1000-2000 UI', 'Fisioterapia e prevenção de quedas', 'Avaliação pelo endocrinologista se falha terapêutica'];
    }
    return { value: pontos, category, interpretation: `Pontuação FRAX simplificado: ${pontos} pontos\n${category}`, severity, recommendations };
  },
  references: ['Kanis JA, et al. Osteoporos Int. 2010;21(12):2010-80', 'Pinheiro MM, et al. Osteoporos Int. 2006;17(9):1364-70'],
};

// ── 3. MoCA ──────────────────────────────────────────────────────────────────

export const MOCA: Calculator = {
  id: 'moca',
  name: 'MoCA — Montreal Cognitive Assessment',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Montreal Cognitive Assessment (MoCA) para avaliação de comprometimento cognitivo leve (MCI). Superior ao MEEM para detecção de déficits sutis em memória de trabalho, atenção executiva e fluência verbal. Pontuação 0-30, com correção por escolaridade.',
  tooltip: 'Normal: ≥26 (ou ≥25 com <12 anos de escolaridade). Sensibilidade para CCL: 90%, para demência: 100%. Avalia 8 domínios cognitivos em ~10 min. Adicionar 1 ponto se <12 anos de escolaridade.',
  category: 'questionnaire',
  fields: [
    { id: 'escolaridade_12', label: 'Escolaridade menor que 12 anos?', type: 'checkbox', info: 'Se sim, adiciona-se 1 ponto automático' },
    { id: 'pontuacao', label: 'Pontuação bruta do MoCA (0-30)', type: 'number', min: 0, max: 30, required: true, info: 'Aplicar formulário completo do MoCA e informar pontuação bruta' },
  ],
  calculate: (values) => {
    const bruto = Number(values.pontuacao);
    const baixaEsc = Boolean(values.escolaridade_12);
    const pontos = Math.min(30, bruto + (baixaEsc ? 1 : 0));
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (pontos >= 26) {
      category = 'Normal'; severity = 'low';
      recommendations = ['Cognição dentro da normalidade', 'Estimulação cognitiva preventiva', 'Reavaliação em 2 anos'];
    } else if (pontos >= 20) {
      category = 'Comprometimento Cognitivo Leve (MCI)'; severity = 'moderate';
      recommendations = ['Investigar causas reversíveis: B12, TSH, folato, VDRL', 'Avaliação neuropsicológica completa', 'Neuroimagem: RM de crânio', 'Discutir risco de progressão para demência (10-15%/ano)', 'Estimulação cognitiva estruturada', 'Controlar fatores vasculares'];
    } else {
      category = 'Déficit Cognitivo Significativo'; severity = 'high';
      recommendations = ['Encaminhar ao neurologista/geriatra', 'Investigação de demência: RM, PET-FDG (se disponível)', 'Biomarkers se disponível', 'Avaliar capacidade para tomada de decisões', 'Suporte ao cuidador'];
    }
    return { value: `${pontos}/30`, category, interpretation: `MoCA: ${pontos}/30 (bruto: ${bruto}${baixaEsc ? '+1 escolaridade' : ''})\n${category}`, severity, recommendations };
  },
  references: ['Nasreddine ZS, et al. J Am Geriatr Soc. 2005;53(4):695-9', 'Memória CM, et al. Arq Neuropsiquiatr. 2013;71(5):311-5'],
};

// ── 4. POLIFARMÁCIA ──────────────────────────────────────────────────────────

export const POLIFARMACIA: Calculator = {
  id: 'polifarmacia',
  name: 'Avaliação de Polifarmácia',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Ferramenta de triagem para polifarmácia e medicamentos potencialmente inapropriados em idosos. Baseada nos Critérios de Beers (AGS 2023) e na Lista PRISCUS brasileira. O uso de ≥5 medicamentos aumenta risco de interações, quedas e hospitalização.',
  tooltip: '≥5 medicamentos: polifarmácia. ≥10: polifarmácia excessiva. Revisar: anticolinérgicos, BZD, AINEs, sulfonilureias de longa ação, digoxina >0,125mg, antipsicóticos em demência.',
  category: 'questionnaire',
  fields: [
    { id: 'num_medicamentos', label: 'Número total de medicamentos em uso (incluindo fitoterápicos e vitaminas)', type: 'number', min: 0, max: 40, required: true },
    { id: 'bzd', label: 'Benzodiazepínico (diazepam, clonazepam, alprazolam, midazolam)?', type: 'checkbox' },
    { id: 'antiarritmico', label: 'Antiarrítmico (amiodarona, digoxina, flecainida)?', type: 'checkbox' },
    { id: 'aine', label: 'Anti-inflamatório não esteroidal (AINE) contínuo?', type: 'checkbox' },
    { id: 'antipsic', label: 'Antipsicótico (haloperidol, quetiapina, risperidona)?', type: 'checkbox' },
    { id: 'hipoglicemiante', label: 'Sulfonilureia de longa ação (glibenclamida, glipizida)?', type: 'checkbox' },
    { id: 'anticolinergico', label: 'Anticolinérgico de alto risco (oxibutinina, prometazina, difenidramina)?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const n = Number(values.num_medicamentos);
    const alertas = ['bzd', 'antiarritmico', 'aine', 'antipsic', 'hipoglicemiante', 'anticolinergico'].filter(k => values[k]).length;
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (n < 5 && alertas === 0) {
      category = 'Sem Polifarmácia'; severity = 'low';
      recommendations = ['Número de medicamentos adequado', 'Manter revisão anual', 'Avaliar necessidade de cada medicamento'];
    } else if (n < 5) {
      category = 'Medicamentos Potencialmente Inapropriados'; severity = 'moderate';
      recommendations = ['Revisar medicamentos potencialmente inapropriados', 'Critérios de Beers e PRISCUS', 'Considerar alternativas mais seguras'];
    } else if (n < 10) {
      category = 'Polifarmácia'; severity = 'moderate';
      recommendations = ['Revisão completa da prescrição obrigatória', 'Aplicar Critérios de Beers (AGS 2023)', 'Ferramenta STOPP/START', 'Desprescrição gradual dos medicamentos desnecessários', 'Checar interações medicamentosas', 'Alertas: BZD, AINE, antipsicóticos, sulfonilureias longas'];
    } else {
      category = 'Polifarmácia Excessiva (≥10 medicamentos)'; severity = 'high';
      recommendations = ['REVISÃO URGENTE por médico e farmacêutico clínico', 'Alto risco de cascata de prescrição', 'Interações potencialmente fatais', 'Deprescrição estruturada (reduzir para ≤5 medicamentos)', 'Encaminhar para consulta de polifarmácia', 'Monitorar função renal e hepática'];
    }
    return {
      value: n, category,
      interpretation: `${n} medicamentos em uso\nMedicamentos de alerta: ${alertas}\n${category}`,
      severity, recommendations,
    };
  },
  references: ['By the 2023 AGS Beers Criteria® Update Expert Panel. J Am Geriatr Soc. 2023', 'Holt S, et al. Drugs Aging. 2010;27(10):817-24 (PRISCUS)'],
};

// ── 5. SÍNDROME DO CAIDOOR ───────────────────────────────────────────────────

export const FALL_RISK: Calculator = {
  id: 'fall-risk',
  name: 'Síndrome do Caidoor — Risco de Quedas',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Avaliação multifatorial de risco de quedas em idosos, baseada nos principais fatores validados pelas diretrizes da Sociedade Brasileira de Geriatria e Gerontologia (SBGG). Queda = evento cardeal da geriatria, com mortalidade de 15-20% em 1 ano após fratura de quadril.',
  tooltip: 'Fatores de risco: queda prévia, marcha instável, uso de ≥4 medicamentos, hipotensão postural, déficit visual, déficit cognitivo, ambiente inseguro. ≥3 fatores = alto risco.',
  category: 'assessment',
  fields: [
    { id: 'queda_previa', label: 'Queda nos últimos 12 meses (≥1 queda)?', type: 'checkbox' },
    { id: 'marcha', label: 'Marcha instável, lenta ou uso de dispositivo auxiliar?', type: 'checkbox' },
    { id: 'medicamentos', label: 'Uso de ≥4 medicamentos (especialmente BZD, hipnóticos, diuréticos)?', type: 'checkbox' },
    { id: 'hipotensao', label: 'Hipotensão ortostática (queda PA ≥20 mmHg ao levantar)?', type: 'checkbox' },
    { id: 'visao', label: 'Déficit visual não corrigido?', type: 'checkbox' },
    { id: 'cognicao', label: 'Déficit cognitivo (demência, delirium, MCI)?', type: 'checkbox' },
    { id: 'fraqueza', label: 'Fraqueza muscular de membros inferiores?', type: 'checkbox' },
    { id: 'ambiente', label: 'Ambiente doméstico com riscos (tapetes, banheiro sem barras, iluminação ruim)?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const score = Object.values(values).filter(Boolean).length;
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (score === 0) {
      category = 'Baixo Risco de Queda'; severity = 'low';
      recommendations = ['Orientação preventiva', 'Exercícios de equilíbrio (Tai Chi, fisioterapia)', 'Reavaliação anual'];
    } else if (score <= 2) {
      category = 'Risco Moderado de Queda'; severity = 'moderate';
      recommendations = ['Fisioterapia para força e equilíbrio obrigatória', 'Revisar medicamentos precipitantes', 'Corrigir déficits visuais e auditivos', 'Suplementação vitamina D se deficiente', 'Adequação do ambiente domiciliar'];
    } else {
      category = 'Alto Risco de Queda'; severity = 'high';
      recommendations = ['Programa multifatorial de prevenção de quedas', 'Fisioterapia intensiva: Otago/FAME protocol', 'Revisão medicamentosa urgente (Beers/STOPP)', 'Avaliação: hipotensão postural, visão, audição', 'Adaptações domiciliares: barras, iluminação, antiderrapante', 'Protetor de quadril se osteoporose', 'Educação de familiar/cuidador'];
    }
    return { value: `${score}/8`, category, interpretation: `Fatores de risco: ${score}/8\n${category}`, severity, recommendations };
  },
  references: ['SBGG. Consenso de Quedas. 2018', 'Panel on Prevention of Falls in Older Persons, AGS/BGS. J Am Geriatr Soc. 2011;59(1):148-57'],
};

export const GERIATRICS_CALCULATORS: Calculator[] = [CAM, FRAX_SIMPLE, MOCA, POLIFARMACIA, FALL_RISK];
