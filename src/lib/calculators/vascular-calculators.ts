/**
 * vascular-calculators.ts — Calculadoras Vasculares
 * 🫀 Vascular (ordem alfabética)
 * PERC Rule | Wells TEP | Wells TVP
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. PERC RULE ─────────────────────────────────────────────────────────────

export const PERC_RULE: Calculator = {
  id: 'perc-rule',
  name: 'PERC Rule — Exclusão de TEP',
  specialty: 'Vascular',
  emoji: '🫀',
  description: 'Pulmonary Embolism Rule-out Criteria (PERC) para exclusão clínica de TEP sem necessidade de D-dímero ou angiotomografia. Válido apenas em pacientes com BAIXA probabilidade clínica pré-teste. Reduz exames desnecessários em ~30% dos pacientes.',
  tooltip: 'TODOS os 8 critérios devem ser NEGATIVOS + baixa probabilidade pré-teste para excluir TEP (probabilidade pós-teste <2%). Se qualquer critério positivo: solicitar D-dímero. Não usar se Wells TEP >4.',
  category: 'assessment',
  fields: [
    { id: 'idade50', label: 'Idade ≥ 50 anos?', type: 'checkbox' },
    { id: 'fc100', label: 'FC ≥ 100 bpm?', type: 'checkbox' },
    { id: 'spo292', label: 'SpO₂ < 95% em ar ambiente?', type: 'checkbox' },
    { id: 'tvp_unilateral', label: 'Edema unilateral de membro inferior?', type: 'checkbox' },
    { id: 'hemoptise', label: 'Hemoptise?', type: 'checkbox' },
    { id: 'cirurgia', label: 'Cirurgia ou trauma recente (≤4 semanas)?', type: 'checkbox' },
    { id: 'tve_previa', label: 'TVE prévia (TEP ou TVP diagnosticada)?', type: 'checkbox' },
    { id: 'anticoagulante', label: 'Em uso de anticoagulante oral?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const positivos = Object.values(values).filter(Boolean).length;
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (positivos === 0) {
      category = 'PERC NEGATIVO — TEP pode ser excluído'; severity = 'low';
      recommendations = ['TEP pode ser excluído clinicamente SEM D-dímero', 'Válido apenas se probabilidade pré-teste BAIXA (Wells ≤1 ou gestalt clínico baixo)', 'Investigar outras causas de dispneia/dor torácica', 'Orientar retorno se piora'];
    } else {
      category = `PERC POSITIVO (${positivos} critério${positivos > 1 ? 's' : ''})`; severity = 'moderate';
      recommendations = ['PERC positivo: NOT excluído por critério clínico', 'Solicitar D-dímero (sensível com baixo VPP)', 'D-dímero negativo (<500 ng/mL): TEP excluído se probabilidade baixa', 'D-dímero positivo: AngioTC de tórax', 'Ou aplicar Wells TEP para estratificação'];
    }
    return { value: positivos, category, interpretation: `PERC: ${positivos}/8 critérios positivos\n${category}`, severity, recommendations };
  },
  references: ['Kline JA, et al. J Thromb Haemost. 2004;2(8):1247-55', 'Singh B, et al. Ann Emerg Med. 2012;59(6):517-20'],
};

// ── 2. WELLS TEP ─────────────────────────────────────────────────────────────

export const WELLS_TEP: Calculator = {
  id: 'wells-tep',
  name: 'Wells TEP — Probabilidade de Embolia Pulmonar',
  specialty: 'Vascular',
  emoji: '🫀',
  description: 'Escore de Wells para estratificação da probabilidade clínica pré-teste de tromboembolismo pulmonar (TEP). Orienta a decisão entre D-dímero (baixa probabilidade) ou angiotomografia direta (alta probabilidade), otimizando a investigação diagnóstica.',
  tooltip: 'Escore: ≤1: baixa probabilidade → D-dímero. 2-6: moderada → D-dímero ou AngioTC. >6: alta → AngioTC imediata. Dicotômico: ≤4 improvável, >4 provável. Sensibilidade 83%, especificidade 78%.',
  category: 'score',
  fields: [
    { id: 'sinais_tvp', label: 'Sinais clínicos de TVP (edema + dor em trajeto venoso profundo)', type: 'checkbox', info: '+3 pontos' },
    { id: 'tep_provavel', label: 'TEP mais provável que diagnóstico alternativo (gestalt)', type: 'checkbox', info: '+3 pontos' },
    { id: 'fc_100', label: 'Frequência cardíaca > 100 bpm', type: 'checkbox', info: '+1,5 pontos' },
    { id: 'imob', label: 'Imobilização ≥3 dias ou cirurgia nas últimas 4 semanas', type: 'checkbox', info: '+1,5 pontos' },
    { id: 'tve_prev', label: 'TVE prévia (TVP ou TEP diagnosticados)', type: 'checkbox', info: '+1,5 pontos' },
    { id: 'hemoptise', label: 'Hemoptise', type: 'checkbox', info: '+1 ponto' },
    { id: 'malignidade', label: 'Neoplasia maligna ativa (tratamento em ≤6 meses ou paliativa)', type: 'checkbox', info: '+1 ponto' },
  ],
  calculate: (values) => {
    let total = 0;
    if (values.sinais_tvp) total += 3; if (values.tep_provavel) total += 3;
    if (values.fc_100) total += 1.5; if (values.imob) total += 1.5; if (values.tve_prev) total += 1.5;
    if (values.hemoptise) total += 1; if (values.malignidade) total += 1;
    const v = parseFloat(total.toFixed(1));

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (v <= 1) {
      category = 'Probabilidade Baixa (~10%)'; severity = 'low';
      recommendations = ['D-dímero de alta sensibilidade', 'D-dímero negativo: TEP excluído', 'D-dímero positivo: AngioTC de tórax', 'PERC Rule se disponível (pode evitar D-dímero)'];
    } else if (v <= 6) {
      category = 'Probabilidade Moderada (~30%)'; severity = 'moderate';
      recommendations = ['D-dímero se Wells 2-4 (escore dicotômico ≤4)', 'AngioTC direta se Wells >4', 'Anticoagulação empírica se alta suspeita e atraso no exame', 'Considerar cintilografia V/Q se contraste contraindicado'];
    } else {
      category = 'Probabilidade Alta (~65%)'; severity = 'high';
      recommendations = ['AngioTC de tórax IMEDIATA', 'Iniciar anticoagulação terapêutica enquanto aguarda resultado', 'Avaliar gravidade: ecocardiograma (disfunção VD)', 'Trombólise se choque ou hipotensão refratária', 'Heparina não fracionada IV se TEP maciço'];
    }
    return { value: v, category, interpretation: `Wells TEP: ${v} pontos\n${category}`, severity, recommendations };
  },
  references: ['Wells PS, et al. Thromb Haemost. 2000;83(3):416-20', 'Konstantinides SV, et al. Eur Heart J. 2020;41(4):543-603 (ESC 2019)'],
};

// ── 3. WELLS TVP ─────────────────────────────────────────────────────────────

export const WELLS_TVP: Calculator = {
  id: 'wells-tvp',
  name: 'Wells TVP — Probabilidade de Trombose Venosa Profunda',
  specialty: 'Vascular',
  emoji: '🫀',
  description: 'Escore de Wells para estratificação clínica pré-teste de trombose venosa profunda de membros inferiores. Valida a suspeita clínica e orienta decisão entre D-dímero (improvável) ou ultrassom com Doppler venoso direto (provável), reduzindo exames desnecessários.',
  tooltip: 'Escore -2 a 9. ≤0: improvável → D-dímero. Se D-dímero negativo: excluído. 1-2: moderado → D-dímero ou US Doppler. ≥3: provável → US Doppler imediato. Sensibilidade 85%, especificidade 75%.',
  category: 'score',
  fields: [
    { id: 'cancer', label: 'Câncer ativo (tratamento ≤6 meses ou paliativo)', type: 'checkbox', info: '+1 ponto' },
    { id: 'paralisia', label: 'Paralisia, paresia ou gesso recente no membro', type: 'checkbox', info: '+1 ponto' },
    { id: 'acamado', label: 'Acamado >3 dias ou cirurgia nas últimas 12 semanas', type: 'checkbox', info: '+1 ponto' },
    { id: 'dor_veias', label: 'Dor à palpação em trajeto das veias profundas', type: 'checkbox', info: '+1 ponto' },
    { id: 'edema_total', label: 'Edema de todo o membro inferior', type: 'checkbox', info: '+1 ponto' },
    { id: 'edema_panturrilha', label: 'Edema de panturrilha >3 cm comparado ao lado oposto', type: 'checkbox', info: '+1 ponto' },
    { id: 'edema_cacifo', label: 'Edema com cacifo apenas no membro sintomático', type: 'checkbox', info: '+1 ponto' },
    { id: 'veias_colaterais', label: 'Veias superficiais colaterais (não varicosas)', type: 'checkbox', info: '+1 ponto' },
    { id: 'tve_previa', label: 'TVE prévia documentada', type: 'checkbox', info: '+1 ponto' },
    { id: 'diag_alt', label: 'Diagnóstico alternativo tão ou mais provável que TVP', type: 'checkbox', info: '-2 pontos' },
  ],
  calculate: (values) => {
    let total = 0;
    const positivos = ['cancer','paralisia','acamado','dor_veias','edema_total','edema_panturrilha','edema_cacifo','veias_colaterais','tve_previa'];
    positivos.forEach(k => { if (values[k]) total += 1; });
    if (values.diag_alt) total -= 2;

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total <= 0) {
      category = 'Probabilidade Baixa (~5%) — TVP Improvável'; severity = 'low';
      recommendations = ['D-dímero de alta sensibilidade', 'D-dímero negativo: TVP excluída', 'D-dímero positivo: US Doppler venoso', 'Investigar outras causas: insuficiência venosa, celulite, ruptura de Baker'];
    } else if (total <= 2) {
      category = 'Probabilidade Moderada (~17%)'; severity = 'moderate';
      recommendations = ['US Doppler venoso de membros inferiores', 'Se US negativo e D-dímero positivo: repetir US em 5-7 dias', 'Considerar anticoagulação empírica se atraso no exame'];
    } else {
      category = 'Probabilidade Alta (~53%) — TVP Provável'; severity = 'high';
      recommendations = ['US Doppler venoso IMEDIATO (fêmoro-poplíteo)', 'Iniciar anticoagulação terapêutica SEM aguardar resultado se atraso', 'Venografia se US inconcluso', 'Anticoagulação: NOAC (rivaroxabana 15mg 2×d por 21d) ou enoxaparina 1 mg/kg 12/12h', 'Pesquisar trombofilia se <45 anos ou recorrente'];
    }
    return { value: total, category, interpretation: `Wells TVP: ${total} pontos\n${category}`, severity, recommendations };
  },
  references: ['Wells PS, et al. Lancet. 1997;350(9094):1795-8', 'Kearon C, et al. CHEST. 2016;149(2):315-52'],
};

export const VASCULAR_CALCULATORS: Calculator[] = [PERC_RULE, WELLS_TEP, WELLS_TVP];
