/**
 * CALCULADORAS VASCULARES - InternosMed
 * 
 * 5 Calculadoras essenciais para Cirurgia Vascular:
 * 1. ITB e DAOP (Doença Arterial Obstrutiva Periférica)
 * 2. Escore de Wells (TVP e TEP)
 * 3. Classificação CEAP (Insuficiência Venosa Crônica)
 * 4. Classificação de Rutherford para Isquemia Aguda
 * 5. Risco de Ruptura de AAA
 * 
 * ArztWeg Company - O Caminho Médico - Cirurgia Vascular HC-UFG
 */

import { Calculator, CalculatorResult } from './types';

// ═══════════════════════════════════════════════════════════════
// 1️⃣ ITB e DAOP - Índice Tornozelo-Braço
// ═══════════════════════════════════════════════════════════════

export const ITB_DAOP: Calculator = {
  id: 'itb-daop',
  name: 'ITB e DAOP',
  specialty: '🩸 Vascular',
  emoji: '🩸',
  description: 'Índice Tornozelo-Braço + Classificação de Fontaine/Rutherford/WIfI',
  category: 'diagnostic',
  
  fields: [
    {
      id: 'pressao_pediosa',
      label: 'Pressão Sistólica na Artéria Pediosa (mmHg)',
      type: 'number',
      required: true,
      info: 'Maior valor entre pediosa e tibial posterior'
    },
    {
      id: 'pressao_tibial',
      label: 'Pressão Sistólica na Artéria Tibial Posterior (mmHg)',
      type: 'number',
      required: true
    },
    {
      id: 'pressao_braquial',
      label: 'Maior Pressão Sistólica Braquial (mmHg)',
      type: 'number',
      required: true,
      info: 'Medir em ambos os braços, usar a maior'
    },
    {
      id: 'sintomas',
      label: 'Sintomas Clínicos',
      type: 'radio',
      required: true,
      options: [
        { value: 'assintomatico', label: 'Assintomático' },
        { value: 'claudicacao_leve', label: 'Claudicação Leve (>200m)' },
        { value: 'claudicacao_moderada', label: 'Claudicação Moderada (50-200m)' },
        { value: 'claudicacao_grave', label: 'Claudicação Grave (<50m)' },
        { value: 'dor_repouso', label: 'Dor em Repouso' },
        { value: 'ulcera', label: 'Úlcera ou Gangrena' }
      ]
    },
    {
      id: 'tem_ulcera',
      label: 'Presença de Úlcera/Gangrena?',
      type: 'checkbox',
      info: 'Para classificação WIfI'
    }
  ],
  
  calculate: (values) => {
    const pediosa = parseFloat(values.pressao_pediosa as string);
    const tibial = parseFloat(values.pressao_tibial as string);
    const braquial = parseFloat(values.pressao_braquial as string);
    
    // Calcular ITB
    const maiorTornozelo = Math.max(pediosa, tibial);
    const itb = maiorTornozelo / braquial;
    
    let category = '';
    let severity: CalculatorResult['severity'] = 'low';
    let interpretation = '';
    const recommendations: string[] = [];
    
    // Classificar ITB
    if (itb > 1.30) {
      category = 'ITB Elevado (Calcificação)';
      severity = 'moderate';
      interpretation = `ITB = ${itb.toFixed(2)} - **ELEVADO**\n\nSugere calcificação arterial (Mönckeberg). ITB não confiável.\n\n**Fontaine:** Inconclusivo\n**Rutherford:** Inconclusivo`;
      recommendations.push(
        '⚠️ CALCIFICAÇÃO ARTERIAL (Esclerose de Mönckeberg):',
        '• ITB não confiável para DAOP',
        '• Solicitar Duplex Doppler arterial',
        '• Medir pressão digital do hálux (Toe Pressure)',
        '• Índice Hálux-Braço normal: >0,70',
        '• Comum em diabéticos e IRC'
      );
    } else if (itb >= 0.90) {
      category = 'ITB Normal';
      severity = 'low';
      const fontaine = values.sintomas === 'assintomatico' ? 'I' : 'II (se houver sintomas)';
      interpretation = `ITB = ${itb.toFixed(2)} - **NORMAL**\n\n**Fontaine:** ${fontaine}\n**Rutherford:** 0-1\n\nSem evidência de DAOP significativa.`;
      recommendations.push(
        '✓ ITB NORMAL (0,90 - 1,30):',
        '• Sem evidência de DAOP',
        '• Controle de fatores de risco cardiovascular',
        '• Atividade física regular',
        '• Cessar tabagismo',
        '• Controle de HAS, DM, dislipidemia',
        '• Reavaliação anual se sintomas'
      );
    } else if (itb >= 0.70) {
      category = 'DAOP Leve a Moderada';
      severity = 'moderate';
      const fontaine = values.sintomas === 'claudicacao_leve' || values.sintomas === 'claudicacao_moderada' ? 'IIa-IIb' : 'I';
      interpretation = `ITB = ${itb.toFixed(2)} - **DAOP LEVE A MODERADA**\n\n**Fontaine:** ${fontaine}\n**Rutherford:** 1-3\n\nIsquemia moderada.`;
      recommendations.push(
        '🚶 DAOP LEVE A MODERADA (ITB 0,70-0,89):',
        '• Programa de exercícios supervisionados',
        '  - Caminhada 30-45min, 3-5x/semana',
        '  - Caminhar até claudicação moderada',
        '  - Parar, descansar, retomar',
        '• AAS 100mg/dia (antiagregante)',
        '• Estatina de alta potência (Rosuvastatina 20-40mg)',
        '• Cilostazol 100mg 12/12h (se claudicação)',
        '• Cessar tabagismo (CRÍTICO)',
        '• Considerar revascularização se:',
        '  - Claudicação limitante apesar de 3-6 meses de TMO',
        '  - Impacto significativo na qualidade de vida'
      );
    } else if (itb >= 0.40) {
      category = 'DAOP Grave';
      severity = 'high';
      const fontaine = values.sintomas === 'dor_repouso' ? 'III' : 'IIb';
      interpretation = `ITB = ${itb.toFixed(2)} - **DAOP GRAVE**\n\n**Fontaine:** ${fontaine}\n**Rutherford:** 3-4\n\nIsquemia grave. Avaliar revascularização.`;
      recommendations.push(
        '⚠️ DAOP GRAVE (ITB 0,40-0,69):',
        '• AAS 100mg + Clopidogrel 75mg (dupla antiagregação)',
        '• Estatina de alta potência',
        '• Programa de exercícios (se tolerado)',
        '• Angiografia com Doppler/AngioTC/AngioRM',
        '• **CONSIDERAR REVASCULARIZAÇÃO:**',
        '  - Angioplastia (se lesão focal)',
        '  - Cirurgia de Bypass (se lesão extensa)',
        '• Indicações prioritárias:',
        '  - Claudicação limitante refratária',
        '  - Dor em repouso',
        '  - Úlcera isquêmica',
        '• Controle rigoroso de DM, HAS',
        '• Evitar vasoconstrição (β-bloqueadores, exposição ao frio)'
      );
    } else {
      category = 'ISQUEMIA CRÍTICA';
      severity = 'critical';
      const fontaine = values.tem_ulcera ? 'IV' : 'III';
      interpretation = `ITB = ${itb.toFixed(2)} - **ISQUEMIA CRÍTICA DE MEMBRO**\n\n**Fontaine:** ${fontaine}\n**Rutherford:** 4-6\n\n⚠️ EMERGÊNCIA VASCULAR - Risco de amputação!`;
      recommendations.push(
        '🚨 ISQUEMIA CRÍTICA (ITB <0,40):',
        '• **URGÊNCIA VASCULAR - Chamar cirurgião vascular imediatamente**',
        '• Analgesia (opioides se necessário)',
        '• Manter membro em posição pendente',
        '• Hidratação EV vigorosa',
        '• Heparina plena (5000 UI bolus + 18 UI/kg/h)',
        '• AngioTC ou Angiografia URGENTE',
        '• **REVASCULARIZAÇÃO URGENTE:**',
        '  - Angioplastia',
        '  - Bypass',
        '  - Trombolíse (se oclusão aguda)',
        '• Amputação primária apenas se:',
        '  - Necrose extensa irreversível',
        '  - Sepse não controlada',
        '  - Comorbidades impedem revascularização',
        '• Pós-revascularização:',
        '  - Dupla antiagregação por 1 mês mínimo',
        '  - AAS indefinido',
        '  - Estatina de alta potência'
      );
    }
    
    return {
      value: itb,
      category,
      interpretation,
      severity,
      recommendations,
    };
  },
  
  interpretation: (result) => {
    if (typeof result === 'number') {
      return `ITB = ${result.toFixed(2)}`;
    }
    return String(result);
  },
  
  references: [
    'Aboyans V et al. Eur Heart J 2018;39(9):763-816 - ESC Guidelines',
    'Gerhard-Herman MD et al. Circulation 2017;135(12):e726-79 - AHA/ACC Guideline',
    'Norgren L et al. J Vasc Surg 2007;45(Suppl S):S5-67 - TASC II',
    'Mills JL et al. J Vasc Surg 2014;59(1):220-34 - WIfI Classification',
  ]
};

// ═══════════════════════════════════════════════════════════════
// 2️⃣ ESCORE DE WELLS - TVP e TEP
// ═══════════════════════════════════════════════════════════════

export const WELLS_TVP: Calculator = {
  id: 'wells-tvp',
  name: 'Wells - TVP',
  specialty: '🩸 Vascular',
  emoji: '🩸',
  description: 'Escore de Wells para Trombose Venosa Profunda',
  category: 'diagnostic',
  
  fields: [
    {
      id: 'cancer_ativo',
      label: 'Câncer ativo (tratamento atual ou nos últimos 6 meses)',
      type: 'checkbox',
      info: '+1 ponto'
    },
    {
      id: 'paralisia',
      label: 'Paralisia ou imobilização recente de MMII',
      type: 'checkbox',
      info: '+1 ponto'
    },
    {
      id: 'acamado',
      label: 'Acamado >3 dias ou cirurgia nas últimas 4 semanas',
      type: 'checkbox',
      info: '+1 ponto'
    },
    {
      id: 'dor_localizada',
      label: 'Dor localizada no trajeto do sistema venoso profundo',
      type: 'checkbox',
      info: '+1 ponto'
    },
    {
      id: 'edema_todo_membro',
      label: 'Edema de todo o membro',
      type: 'checkbox',
      info: '+1 ponto'
    },
    {
      id: 'panturrilha',
      label: 'Circunferência da panturrilha >3cm maior que o lado assintomático',
      type: 'checkbox',
      info: '+1 ponto. Medir 10cm abaixo da tuberosidade tibial'
    },
    {
      id: 'cacifo',
      label: 'Edema com cacifo (maior na perna sintomática)',
      type: 'checkbox',
      info: '+1 ponto'
    },
    {
      id: 'veias_colaterais',
      label: 'Veias superficiais colaterais (não varicosas)',
      type: 'checkbox',
      info: '+1 ponto'
    },
    {
      id: 'tvp_previa',
      label: 'TVP prévia documentada',
      type: 'checkbox',
      info: '+1 ponto'
    },
    {
      id: 'diagnostico_alternativo',
      label: 'Diagnóstico alternativo tão ou mais provável que TVP',
      type: 'checkbox',
      info: '-2 pontos. Ex: celulite, ruptura de cisto de Baker'
    }
  ],
  
  calculate: (values) => {
    let score = 0;
    
    // Cada item vale +1 ponto
    if (values.cancer_ativo) score += 1;
    if (values.paralisia) score += 1;
    if (values.acamado) score += 1;
    if (values.dor_localizada) score += 1;
    if (values.edema_todo_membro) score += 1;
    if (values.panturrilha) score += 1;
    if (values.cacifo) score += 1;
    if (values.veias_colaterais) score += 1;
    if (values.tvp_previa) score += 1;
    
    // Diagnóstico alternativo vale -2
    if (values.diagnostico_alternativo) score -= 2;
    
    let category = '';
    let severity: CalculatorResult['severity'] = 'low';
    let interpretation = '';
    const recommendations: string[] = [];
    
    if (score >= 3) {
      category = 'Probabilidade ALTA de TVP';
      severity = 'high';
      interpretation = `**Wells = ${score} pontos**\n\n**PROBABILIDADE ALTA** (≥3 pontos)\n\nRisco de TVP: **~75%**`;
      recommendations.push(
        '🔴 PROBABILIDADE ALTA DE TVP (≥3 pontos):',
        '• **Solicitar Doppler venoso URGENTE**',
        '  - Se positivo → Tratar como TVP',
        '  - Se negativo → Repetir em 1 semana OU Dímero-D',
        '• **Iniciar anticoagulação IMEDIATAMENTE** enquanto aguarda resultado:',
        '  - Heparina EV (80 UI/kg bolus + 18 UI/kg/h) OU',
        '  - Enoxaparina 1mg/kg SC 12/12h OU',
        '  - Rivaroxabana 15mg 12/12h',
        '• Não aguardar resultado de imagem para anticoagular',
        '• Elevação do membro',
        '• Analgesia se necessário',
        '• Investigar trombofilia se:',
        '  - TVP não provocada em <50 anos',
        '  - História familiar forte',
        '  - TVP recorrente',
        '  - Sítio incomum (mesentérica, cerebral)'
      );
    } else if (score >= 1) {
      category = 'Probabilidade MODERADA de TVP';
      severity = 'moderate';
      interpretation = `**Wells = ${score} pontos**\n\n**PROBABILIDADE MODERADA** (1-2 pontos)\n\nRisco de TVP: **~17%**`;
      recommendations.push(
        '🟡 PROBABILIDADE MODERADA DE TVP (1-2 pontos):',
        '• **Solicitar Dímero-D:**',
        '  - Se **negativo** (<500 ng/mL): Exclui TVP',
        '  - Se **positivo** (≥500 ng/mL): Doppler venoso',
        '• Se Doppler positivo → Anticoagulação',
        '• Se Doppler negativo + alta suspeita clínica:',
        '  - Repetir Doppler em 1 semana',
        '• **Não anticoagular empiricamente** (risco x benefício desfavorável)',
        '• Medidas gerais:',
        '  - Elevação do membro',
        '  - Evitar imobilização prolongada',
        '  - Meias de compressão (se possível)',
        '• Reavaliação em 24-48h se não melhorar'
      );
    } else {
      category = 'Probabilidade BAIXA de TVP';
      severity = 'low';
      interpretation = `**Wells = ${score} pontos**\n\n**PROBABILIDADE BAIXA** (≤0 pontos)\n\nRisco de TVP: **~5%**`;
      recommendations.push(
        '🟢 PROBABILIDADE BAIXA DE TVP (≤0 pontos):',
        '• **Solicitar Dímero-D:**',
        '  - Se **negativo**: TVP excluída, não precisa Doppler',
        '  - Se **positivo**: Doppler venoso',
        '• **Não anticoagular empiricamente**',
        '• Causas alternativas mais prováveis:',
        '  - Celulite',
        '  - Ruptura de cisto de Baker',
        '  - Insuficiência venosa crônica',
        '  - Linfedema',
        '  - Hematoma muscular',
        '• Tratamento sintomático:',
        '  - Elevação',
        '  - Anti-inflamatórios (se celulite excluída)',
        '  - Meias elásticas',
        '• Reavaliação se piora'
      );
    }
    
    return {
      value: score,
      category,
      interpretation,
      severity,
      recommendations,
    };
  },
  
  interpretation: (result) => {
    if (typeof result === 'number') {
      if (result >= 3) return 'Probabilidade ALTA';
      if (result >= 1) return 'Probabilidade MODERADA';
      return 'Probabilidade BAIXA';
    }
    return String(result);
  },
  
  references: [
    'Wells PS et al. Lancet 1997;350(9094):1795-8 - Original Wells DVT',
    'Wells PS et al. N Engl J Med 2003;349(13):1227-35 - Validation',
    'Kearon C et al. Chest 2016;149(2):315-52 - CHEST Guidelines',
    'Bates SM et al. J Thromb Haemost 2012;10(12):2512-9 - Clinical probability',
  ]
};

// ═══════════════════════════════════════════════════════════════
// 3️⃣ CLASSIFICAÇÃO CEAP - Insuficiência Venosa Crônica
// ═══════════════════════════════════════════════════════════════

export const CEAP_IVC: Calculator = {
  id: 'ceap-ivc',
  name: 'CEAP - Insuficiência Venosa',
  specialty: '🩸 Vascular',
  emoji: '🩸',
  description: 'Classificação CEAP para Insuficiência Venosa Crônica',
  category: 'classification',
  
  fields: [
    {
      id: 'ceap_c',
      label: 'Classificação Clínica (C)',
      type: 'radio',
      required: true,
      options: [
        { value: 'c0', label: 'C0 - Sem sinais visíveis ou palpáveis de doença venosa' },
        { value: 'c1', label: 'C1 - Telangiectasias ou veias reticulares' },
        { value: 'c2', label: 'C2 - Veias varicosas (≥3mm de diâmetro)' },
        { value: 'c3', label: 'C3 - Edema venoso' },
        { value: 'c4a', label: 'C4a - Pigmentação ou eczema venoso' },
        { value: 'c4b', label: 'C4b - Lipodermatoesclerose ou atrofia branca' },
        { value: 'c5', label: 'C5 - Úlcera venosa cicatrizada' },
        { value: 'c6', label: 'C6 - Úlcera venosa ativa' }
      ]
    },
    {
      id: 'sintomas',
      label: 'Presença de Sintomas?',
      type: 'checkbox',
      info: 'Dor, peso, cansaço, prurido, queimação'
    }
  ],
  
  calculate: (values) => {
    const c = values.ceap_c as string;
    const sintomatico = values.sintomas ? 'S' : 'A';
    
    let category = '';
    let severity: CalculatorResult['severity'] = 'low';
    let interpretation = '';
    const recommendations: string[] = [];
    
    // Mapear classificação
    const ceapMap: Record<string, { desc: string; sev: CalculatorResult['severity']; recs: string[] }> = {
      c0: {
        desc: 'C0 - Sem sinais de doença venosa',
        sev: 'low',
        recs: [
          '✓ SEM DOENÇA VENOSA VISÍVEL:',
          '• Sem varizes detectáveis ao exame',
          '• Sintomas (se presentes) podem ser:',
          '  - Síndrome das pernas inquietas',
          '  - Fadiga muscular',
          '  - Neuropatia periférica',
          '• Medidas gerais:',
          '  - Atividade física regular',
          '  - Evitar ortostatismo prolongado',
          '  - Controle de peso',
          '• Reavaliação se sintomas persistirem'
        ]
      },
      c1: {
        desc: 'C1 - Telangiectasias/Vasinhos',
        sev: 'low',
        recs: [
          '🔵 TELANGIECTASIAS (C1):',
          '• Vasinhos <1mm (telangiectasias) ou',
          '• Veias reticulares 1-3mm',
          '• Sem indicação clínica de tratamento',
          '• **Tratamento estético** (opcional):',
          '  - Escleroterapia líquida ou foam',
          '  - Laser transdérmico',
          '• Medidas preventivas:',
          '  - Meias de compressão leve (15-20 mmHg) se sintomas',
          '  - Atividade física',
          '  - Controle de peso',
          '  - Evitar ACO de alta dose se possível'
        ]
      },
      c2: {
        desc: 'C2 - Varizes',
        sev: 'moderate',
        recs: [
          '🟣 VARIZES (C2):',
          '• Veias varicosas ≥3mm',
          '• **Indicações de tratamento:**',
          '  - Sintomas (dor, peso, cansaço)',
          '  - Preocupação estética',
          '  - Flebite superficial recorrente',
          '• **Doppler venoso** para mapear refluxo',
          '• **Opções de tratamento:**',
          '  1. Cirurgia convencional (safenectomia + flebectomias)',
          '  2. Laser endovenoso (EVLT)',
          '  3. Radiofrequência',
          '  4. Escleroterapia com foam',
          '• Meias de compressão 20-30 mmHg:',
          '  - Alívio sintomático',
          '  - Não previnem progressão',
          '• Atividade física (fortalece bomba muscular)',
          '• Elevação de MMII ao dormir'
        ]
      },
      c3: {
        desc: 'C3 - Edema Venoso',
        sev: 'moderate',
        recs: [
          '🟡 EDEMA VENOSO (C3):',
          '• Edema por insuficiência venosa',
          '• Descartar outras causas:',
          '  - IC (edema bilateral + dispneia)',
          '  - Nefropatia (anasarca + proteinúria)',
          '  - Hepatopatia (ascite + icterícia)',
          '  - Linfedema (não reduz com elevação)',
          '• Doppler venoso obrigatório',
          '• **Tratamento compressivo:**',
          '  - Meias 30-40 mmHg (compressão média)',
          '  - Uso diário (retirar apenas para dormir)',
          '• Drenagem linfática manual',
          '• Elevação de MMII ao repouso',
          '• Tratar refluxo se sintomático',
          '• Diuréticos NÃO indicados (edema mecânico)',
          '• Perda de peso se obeso'
        ]
      },
      c4a: {
        desc: 'C4a - Alterações Cutâneas Iniciais',
        sev: 'high',
        recs: [
          '🟠 ALTERAÇÕES TRÓFICAS INICIAIS (C4a):',
          '• Pigmentação (hemossiderina)',
          '• Eczema/Dermatite venosa',
          '• **ALTO RISCO** de úlcera',
          '• Doppler venoso obrigatório',
          '• **Tratamento compressivo INTENSIVO:**',
          '  - Meias 30-40 mmHg',
          '  - Uso rigoroso e contínuo',
          '• Dermatite venosa:',
          '  - Corticoide tópico (hidrocortisona 1%)',
          '  - Emolientes',
          '  - Evitar trauma',
          '• **INDICAÇÃO DE CORREÇÃO CIRÚRGICA DO REFLUXO:**',
          '  - Previne progressão para úlcera',
          '  - Reduz sintomas',
          '  - Melhora qualidade de vida',
          '• Pentoxifilina 400mg 8/8h (adjuvante)',
          '• Seguimento rigoroso (risco de C6)'
        ]
      },
      c4b: {
        desc: 'C4b - Lipodermatoesclerose',
        sev: 'high',
        recs: [
          '🔴 LIPODERMATOESCLEROSE (C4b):',
          '• Fibrose do tecido subcutâneo',
          '• Atrofia branca (isquemia dérmica)',
          '• Perna em "garrafa invertida"',
          '• **ALTÍSSIMO RISCO** de úlcera',
          '• Doppler venoso + investigação arterial (ITB)',
          '• **TRATAMENTO COMPRESSIVO OBRIGATÓRIO:**',
          '  - Meias 30-40 mmHg',
          '  - Bandagens compressivas se intolerância',
          '• **INDICAÇÃO FORMAL DE CIRURGIA:**',
          '  - Correção de refluxo é ESSENCIAL',
          '  - Previne úlcera',
          '  - Melhora trofismo',
          '• Pentoxifilina 400mg 8/8h',
          '• Evitar trauma (alto risco úlcera)',
          '• Hidratar pele',
          '• Seguimento mensal'
        ]
      },
      c5: {
        desc: 'C5 - Úlcera Cicatrizada',
        sev: 'high',
        recs: [
          '🟣 ÚLCERA VENOSA CICATRIZADA (C5):',
          '• Alto risco de recidiva (50-70% em 1 ano sem tratamento)',
          '• **COMPRESSÃO VITALÍCIA:**',
          '  - Meias 30-40 mmHg',
          '  - Uso diário obrigatório',
          '  - Nunca suspender',
          '• **CIRURGIA INDICADA:**',
          '  - Reduz recorrência de 70% para 10-30%',
          '  - Melhora qualidade de vida',
          '• Pentoxifilina 400mg 8/8h (reduz recorrência)',
          '• Diosmina 900mg/dia (adjuvante)',
          '• Hidratação rigorosa da pele',
          '• Evitar trauma',
          '• Seguimento a cada 3 meses',
          '• Se recidiva → C6 (úlcera ativa)'
        ]
      },
      c6: {
        desc: 'C6 - Úlcera Ativa',
        sev: 'critical',
        recs: [
          '🚨 ÚLCERA VENOSA ATIVA (C6):',
          '• **TRATAMENTO COMPRESSIVO IMEDIATO:**',
          '  - Bandagem compressiva multicamadas (Unna Boot)',
          '  - Ou meias 30-40 mmHg se tolerado',
          '• **Curativos:**',
          '  - Limpeza com SF 0,9%',
          '  - Coberturas não aderentes (hidrogel, alginato)',
          '  - AGE (ácidos graxos essenciais) na borda',
          '  - Trocar 2-3x/semana',
          '  - NUNCA usar antissépticos (PVPI, clorexidina)',
          '• Descartar infecção:',
          '  - Se celulite: ATB sistêmico',
          '  - Se osteomielite: Desbridamento + ATB 6 semanas',
          '• Pentoxifilina 400mg 8/8h',
          '• Diosmina 900mg/dia',
          '• **CIRURGIA após cicatrização:**',
          '  - Correção do refluxo',
          '  - Enxerto de pele se úlcera extensa',
          '• Avaliar ITB (descartar componente arterial)',
          '• Otimizar nutrição (albumina >3)',
          '• Controle de DM rigoroso',
          '• Seguimento semanal até cicatrização',
          '• Cicatrização esperada: 12-24 semanas'
        ]
      }
    };
    
    const result = ceapMap[c];
    category = result.desc;
    severity = result.sev;
    interpretation = `**CEAP: ${c.toUpperCase()}${sintomatico}**\n\n${result.desc}\n\n**Sintomático:** ${sintomatico === 'S' ? 'SIM' : 'NÃO'}`;
    recommendations.push(...result.recs);
    
    return {
      value: `${c.toUpperCase()}${sintomatico}`,
      category,
      interpretation,
      severity,
      recommendations,
    };
  },
  
  interpretation: (result) => {
    return String(result);
  },
  
  references: [
    'Eklöf B et al. J Vasc Surg 2004;40(6):1248-52 - CEAP Classification',
    'Lurie F et al. J Vasc Surg Venous Lymphat Disord 2020;8(3):342-52 - CEAP update 2020',
    'Nicolaides A et al. Int Angiol 2018;37(3):181-254 - UIP Guidelines',
    'O\'Donnell TF et al. J Vasc Surg Venous Lymphat Disord 2014;2(3):248-74 - Treatment',
  ]
};

// ═══════════════════════════════════════════════════════════════
// 4️⃣ RUTHERFORD para Isquemia Aguda
// ═══════════════════════════════════════════════════════════════

export const RUTHERFORD_AGUDA: Calculator = {
  id: 'rutherford-isquemia-aguda',
  name: 'Rutherford - Isquemia Aguda',
  specialty: '🩸 Vascular',
  emoji: '🩸',
  description: 'Classificação de Rutherford para Isquemia Aguda de Membro',
  category: 'classification',
  
  fields: [
    {
      id: 'categoria',
      label: 'Categoria Clínica',
      type: 'radio',
      required: true,
      options: [
        { value: 'i', label: 'I - Viável: Sem ameaça imediata' },
        { value: 'iia', label: 'IIa - Marginalmente ameaçado: Salvável se tratado prontamente' },
        { value: 'iib', label: 'IIb - Imediatamente ameaçado: Salvável com revascularização imediata' },
        { value: 'iii', label: 'III - Irreversível: Perda tecidual maior ou dano neurológico permanente' }
      ]
    },
    {
      id: 'perda_sensorial',
      label: 'Perda Sensorial',
      type: 'radio',
      required: true,
      options: [
        { value: 'nenhuma', label: 'Nenhuma' },
        { value: 'minima', label: 'Mínima (dedos) ou nenhuma' },
        { value: 'mais_dedos', label: 'Mais que dedos, associada a dor' },
        { value: 'profunda', label: 'Profunda, anestesia' }
      ]
    },
    {
      id: 'fraqueza_muscular',
      label: 'Fraqueza Muscular',
      type: 'radio',
      required: true,
      options: [
        { value: 'nenhuma', label: 'Nenhuma' },
        { value: 'nenhuma_paralisia', label: 'Nenhuma' },
        { value: 'leve_moderada', label: 'Leve a moderada' },
        { value: 'profunda', label: 'Profunda, paralisia (rigor)' }
      ]
    },
    {
      id: 'doppler_arterial',
      label: 'Sinal de Doppler Arterial',
      type: 'radio',
      required: true,
      options: [
        { value: 'audivel', label: 'Audível' },
        { value: 'ausente', label: 'Inaudível' },
        { value: 'ausente_aguda', label: 'Inaudível' },
        { value: 'ausente_irreversivel', label: 'Inaudível' }
      ]
    },
    {
      id: 'doppler_venoso',
      label: 'Sinal de Doppler Venoso',
      type: 'radio',
      required: true,
      options: [
        { value: 'audivel', label: 'Audível' },
        { value: 'audivel_agudo', label: 'Audível' },
        { value: 'ausente', label: 'Inaudível' },
        { value: 'ausente_irreversivel', label: 'Inaudível' }
      ]
    }
  ],
  
  calculate: (values) => {
    const cat = values.categoria as string;
    
    let category = '';
    let severity: CalculatorResult['severity'] = 'low';
    let interpretation = '';
    const recommendations: string[] = [];
    
    const rutherfordMap: Record<string, { desc: string; sev: CalculatorResult['severity']; recs: string[]; tempo: string }> = {
      i: {
        desc: 'Categoria I - Membro Viável',
        sev: 'moderate',
        tempo: 'Horas a dias',
        recs: [
          '🟢 MEMBRO VIÁVEL (Categoria I):',
          '• Não há ameaça imediata de perda do membro',
          '• Capaz de caminhar',
          '• Dor em repouso ausente ou leve',
          '• Sensibilidade intacta',
          '• Força muscular preservada',
          '• Doppler arterial audível',
          '• **JANELA TERAPÊUTICA: Horas a dias**',
          '• **Conduta:**',
          '  - Angiografia ou AngioTC para planejamento',
          '  - Anticoagulação plena (Heparina 80 UI/kg bolus + 18 UI/kg/h)',
          '  - Analgesia',
          '  - Hidratação EV',
          '  - Revascularização eletiva (em 24-48h)',
          '• Opções de revascularização:',
          '  - Angioplastia',
          '  - Bypass',
          '  - Cirurgia eletiva'
        ]
      },
      iia: {
        desc: 'Categoria IIa - Marginalmente Ameaçado',
        sev: 'high',
        tempo: '⏰ Horas (urgente)',
        recs: [
          '🟡 MARGINALMENTE AMEAÇADO (Categoria IIa):',
          '• Membro salvável SE tratamento pronto',
          '• Perda sensorial MÍNIMA (dedos)',
          '• SEM fraqueza muscular',
          '• Doppler arterial ausente, venoso presente',
          '• **JANELA TERAPÊUTICA: HORAS (Urgente)**',
          '• **Conduta URGENTE:**',
          '  - Chamar cirurgião vascular IMEDIATAMENTE',
          '  - Heparina plena EV (bolus + infusão contínua)',
          '  - AngioTC ou Angiografia URGENTE',
          '  - **Revascularização em <6 horas:**',
          '    * Trombólise catheter-directed (se tempo <14 dias)',
          '    * Trombectomia percutânea',
          '    * Bypass de urgência',
          '  - Analgesia (opioides)',
          '  - Manter membro pendente',
          '  - Hidratação vigorosa',
          '  - Evitar aquecimento direto',
          '• Após revascularização:',
          '  - Monitorar síndrome compartimental',
          '  - Fasciotomia se pressão compartimental >30 mmHg',
          '  - Anticoagulação por 3-6 meses'
        ]
      },
      iib: {
        desc: 'Categoria IIb - Imediatamente Ameaçado',
        sev: 'critical',
        tempo: '⚠️ EMERGÊNCIA (minutos a horas)',
        recs: [
          '🔴 IMEDIATAMENTE AMEAÇADO (Categoria IIb):',
          '• **EMERGÊNCIA VASCULAR ABSOLUTA**',
          '• Perda sensorial significativa (mais que dedos)',
          '• Fraqueza muscular leve a moderada',
          '• Doppler arterial ausente, venoso presente',
          '• Dor em repouso INTENSA',
          '• **JANELA TERAPÊUTICA: MINUTOS A HORAS**',
          '• **Conduta EMERGENCIAL:**',
          '  - **CHAMAR VASCULAR IMEDIATAMENTE (código azul vascular)**',
          '  - Heparina plena EV AGORA',
          '  - Analgesia com opioides',
          '  - **REVASCULARIZAÇÃO IMEDIATA (<2 horas):**',
          '    * Embolectomia com cateter de Fogarty (se êmbolo)',
          '    * Bypass de emergência',
          '    * Trombólise apenas se tempo permitir',
          '  - NÃO perder tempo com exames de imagem extensos',
          '  - Angiografia intraoperatória se necessário',
          '• **Fasciotomia profilática** (alto risco de síndrome compartimental)',
          '• Monitorar:',
          '  - Mioglobinúria (rabdomiólise)',
          '  - Hipercalemia (necrose muscular)',
          '  - Acidose metabólica',
          '  - IRA (ATN)',
          '• Pós-operatório em UTI',
          '• Anticoagulação por 6-12 meses',
          '• Risco de amputação: 20-30% mesmo com tratamento'
        ]
      },
      iii: {
        desc: 'Categoria III - Irreversível',
        sev: 'critical',
        tempo: '⚠️ Irreversível',
        recs: [
          '⚫ ISQUEMIA IRREVERSÍVEL (Categoria III):',
          '• Perda tecidual EXTENSA e irreversível',
          '• Paralisia COMPLETA (rigor mortis)',
          '• Anestesia profunda',
          '• Doppler arterial E venoso ausentes',
          '• Marmoreado, rigidez muscular',
          '• **REVASCULARIZAÇÃO CONTRAINDICADA**',
          '  - Risco de síndrome de reperfusão FATAL',
          '  - Liberação maciça de K+, mioglobina, ácido lático',
          '  - Parada cardíaca durante reperfusão',
          '• **Conduta:**',
          '  - **AMPUTAÇÃO PRIMÁRIA**',
          '  - Nível: Transtibial ou transfemoral',
          '  - Guilhotina (aberta) se sepse',
          '  - Definitiva (com retalho) se estável',
          '• Medidas de suporte:',
          '  - Hidratação vigorosa',
          '  - Alcalinização (prevenir ATN)',
          '  - Analgesia (morfina)',
          '  - ATB de amplo espectro se necrose infectada',
          '  - Correção de distúrbios eletrolíticos',
          '• Cuidados paliativos se comorbidades impedem cirurgia',
          '• Encaminhar para reabilitação e prótese após amputação',
          '• Anticoagulação do membro contralateral (prevenir evento bilateral)'
        ]
      }
    };
    
    const result = rutherfordMap[cat];
    category = result.desc;
    severity = result.sev;
    interpretation = `**${result.desc}**\n\n**Janela Terapêutica:** ${result.tempo}\n\n**Achados Clínicos:**\n• Sensorial: ${values.perda_sensorial}\n• Motor: ${values.fraqueza_muscular}\n• Doppler arterial: ${values.doppler_arterial}\n• Doppler venoso: ${values.doppler_venoso}`;
    recommendations.push(...result.recs);
    
    return {
      value: cat.toUpperCase(),
      category,
      interpretation,
      severity,
      recommendations,
    };
  },
  
  interpretation: (result) => {
    return `Categoria ${String(result).toUpperCase()}`;
  },
  
  references: [
    'Rutherford RB et al. J Vasc Surg 1986;4(1):80-94 - Original classification',
    'Norgren L et al. J Vasc Surg 2007;45(Suppl S):S5-67 - TASC II',
    'Conte MS et al. J Vasc Surg 2019;69(6S):3S-125S - SVS Guidelines',
    'Creager MA et al. Circulation 2012;126(25):3097-137 - AHA/ACC Statement',
  ]
};

// ═══════════════════════════════════════════════════════════════
// 5️⃣ RISCO DE RUPTURA DE AAA
// ═══════════════════════════════════════════════════════════════

export const RISCO_AAA: Calculator = {
  id: 'risco-aaa',
  name: 'Risco de Ruptura de AAA',
  specialty: '🩸 Vascular',
  emoji: '🩸',
  description: 'Cálculo de risco de ruptura de Aneurisma de Aorta Abdominal',
  category: 'prognosis',
  
  fields: [
    {
      id: 'diametro',
      label: 'Diâmetro Máximo do Aneurisma (cm)',
      type: 'number',
      required: true,
      info: 'Medido no maior diâmetro transversal em TC ou USG'
    },
    {
      id: 'sexo',
      label: 'Sexo',
      type: 'radio',
      required: true,
      options: [
        { value: 'masculino', label: 'Masculino' },
        { value: 'feminino', label: 'Feminino' }
      ]
    },
    {
      id: 'tabagismo',
      label: 'Tabagismo Atual',
      type: 'checkbox',
      info: 'Aumenta risco de ruptura em 2-4x'
    },
    {
      id: 'sintomatico',
      label: 'Aneurisma Sintomático?',
      type: 'checkbox',
      info: 'Dor abdominal/lombar, sinal de ruptura iminente'
    },
    {
      id: 'dpoc',
      label: 'DPOC',
      type: 'checkbox',
      info: 'Aumenta risco de ruptura'
    },
    {
      id: 'has',
      label: 'HAS não controlada',
      type: 'checkbox',
      info: 'PA >140/90 mmHg'
    }
  ],
  
  calculate: (values) => {
    const diametro = parseFloat(values.diametro as string);
    const sexo = values.sexo as string;
    const sintomatico = values.sintomatico;
    const tabagismo = values.tabagismo;
    
    let category = '';
    let severity: CalculatorResult['severity'] = 'low';
    let interpretation = '';
    const recommendations: string[] = [];
    
    // Critérios cirúrgicos padrão
    const cirurgiaMasculino = 5.5;
    const cirurgiaFeminino = 5.0;
    const limiarCirurgico = sexo === 'feminino' ? cirurgiaFeminino : cirurgiaMasculino;
    
    // Cálculo de risco de ruptura por ano (aproximado)
    let riscoAnual = 0;
    if (diametro < 4.0) {
      riscoAnual = 0;
    } else if (diametro < 5.0) {
      riscoAnual = 0.5;
    } else if (diametro < 6.0) {
      riscoAnual = 3;
    } else if (diametro < 7.0) {
      riscoAnual = 15;
    } else {
      riscoAnual = 33;
    }
    
    // Ajustes de risco
    if (sexo === 'feminino') riscoAnual *= 2;
    if (tabagismo) riscoAnual *= 2;
    if (sintomatico) riscoAnual = 100; // Ruptura iminente
    
    // Classificar
    if (sintomatico) {
      category = '🚨 ANEURISMA SINTOMÁTICO - RUPTURA IMINENTE';
      severity = 'critical';
      interpretation = `**Diâmetro:** ${diametro} cm\n**SINTOMÁTICO** - Risco de ruptura iminente!\n\n⚠️ EMERGÊNCIA CIRÚRGICA`;
      recommendations.push(
        '🚨 ANEURISMA SINTOMÁTICO - EMERGÊNCIA:',
        '• **CHAMAR CIRURGIA VASCULAR IMEDIATAMENTE**',
        '• Sintomas de ruptura iminente:',
        '  - Dor abdominal/lombar súbita',
        '  - Massa pulsátil dolorosa',
        '  - Sincope',
        '  - Choque hipovolêmico',
        '• **Conduta EMERGENCIAL:**',
        '  - Acesso venoso calibroso (2x)',
        '  - Reserva de hemoderivados (10 CH + 6 PFC + 1 aférese plaquetas)',
        '  - AngioTC URGENTE (se estável)',
        '  - **NÃO otimizar PA** (risco de re-sangramento)',
        '  - Manter PAS 70-90 mmHg (permissive hypotension)',
        '  - Beta-bloqueador EV (reduz shear stress)',
        '  - Analgesia',
        '• **CIRURGIA EMERGENCIAL:**',
        '  - EVAR (endovascular) se anatomia favorável',
        '  - Cirurgia aberta se EVAR impossível',
        '• Mortalidade cirurgia emergencial: 40-70%',
        '• Mortalidade ruptura sem cirurgia: ~100%'
      );
    } else if (diametro >= limiarCirurgico) {
      category = 'INDICAÇÃO CIRÚRGICA';
      severity = 'high';
      interpretation = `**Diâmetro:** ${diametro} cm\n**Sexo:** ${sexo === 'feminino' ? 'Feminino' : 'Masculino'}\n\n**Risco de ruptura:** ~${riscoAnual.toFixed(1)}% ao ano\n\n✅ **INDICAÇÃO DE CIRURGIA ELETIVA**\n\nCritério: ≥${limiarCirurgico} cm em ${sexo === 'feminino' ? 'mulheres' : 'homens'}`;
      recommendations.push(
        '✅ INDICAÇÃO CIRÚRGICA ELETIVA:',
        `• Diâmetro ≥${limiarCirurgico} cm (critério em ${sexo === 'feminino' ? 'mulheres' : 'homens'})`,
        `• Risco de ruptura: ~${riscoAnual.toFixed(1)}% ao ano`,
        '• **Benefício cirúrgico comprovado** (reduz mortalidade)',
        '• Avaliar risco cirúrgico:',
        '  - Função pulmonar (DPOC grave)',
        '  - Função cardíaca (ICO, IAM recente)',
        '  - Função renal (Cr >2,0)',
        '  - Índice de Lee (RCRI)',
        '• **Opções cirúrgicas:**',
        '  1. **EVAR (Endovascular)** - Preferencial se anatomia favorável:',
        '     - Mortalidade: 1-2%',
        '     - Recuperação: 1-3 dias',
        '     - Requer colo proximal ≥15mm',
        '     - Seguimento vitalício (endoleak)',
        '  2. **Cirurgia Aberta** - Se EVAR contraindicado:',
        '     - Mortalidade: 3-5%',
        '     - Recuperação: 1-2 semanas',
        '     - Mais durável (sem seguimento rigoroso)',
        '• Pré-operatório:',
        '  - ECO/Cate se sintomas coronarianos',
        '  - Prova de função pulmonar',
        '  - AngioTC com protocolo AAA',
        '  - Cessar tabagismo (reduz complicações)',
        '• Beta-bloqueador até cirurgia (reduz expansão)',
        '• Estatina (estabiliza placa)'
      );
    } else if (diametro >= 4.0 && diametro < limiarCirurgico) {
      const proximoCutoff = limiarCirurgico - diametro;
      const intervalo = diametro >= 4.5 ? '6 meses' : '12 meses';
      
      category = 'SEGUIMENTO RIGOROSO';
      severity = 'moderate';
      interpretation = `**Diâmetro:** ${diametro} cm\n**Sexo:** ${sexo === 'feminino' ? 'Feminino' : 'Masculino'}\n\n**Risco de ruptura:** ~${riscoAnual.toFixed(1)}% ao ano\n\n⚠️ Ainda **NÃO** atinge critério cirúrgico (≥${limiarCirurgico} cm)\n\nFaltam **${proximoCutoff.toFixed(1)} cm** para indicação.`;
      recommendations.push(
        `⚠️ AAA EM SEGUIMENTO (${diametro} cm):`,
        `• Ainda NÃO atinge critério cirúrgico (≥${limiarCirurgico} cm)`,
        `• Risco de ruptura: ~${riscoAnual.toFixed(1)}% ao ano`,
        `• **Seguimento com USG ou TC a cada ${intervalo}:**`,
        `  - 4,0-4,4 cm: USG a cada 12 meses`,
        `  - 4,5-5,4 cm: USG a cada 6 meses`,
        `  - Crescimento >0,5 cm/ano: Considerar cirurgia precoce`,
        '• Controle de fatores de risco:',
        '  - **CESSAR TABAGISMO** (mais importante!)',
        '  - Controle rigoroso de PA (<140/90 mmHg)',
        '  - Beta-bloqueador (reduz shear stress)',
        '  - Estatina (estabiliza placa)',
        '  - Controle de dislipidemia (LDL <70)',
        '• Sinais de alerta (procurar emergência):',
        '  - Dor abdominal ou lombar súbita',
        '  - Massa pulsátil dolorosa',
        '  - Síncope',
        '• **Cirurgia precoce** se:',
        '  - Crescimento rápido (>1 cm/ano)',
        '  - Morfologia sacular (vs fusiforme)',
        '  - Sintomas',
        '  - Sexo feminino + diâmetro >4,5 cm',
        '  - HAS não controlada',
        '• Evitar atividades que aumentem PA (levantar peso)'
      );
    } else {
      category = 'DILATAÇÃO LEVE - SEGUIMENTO';
      severity = 'low';
      interpretation = `**Diâmetro:** ${diametro} cm\n\n**Aorta normal:** <3,0 cm\n**Ectasia:** 3,0-3,9 cm\n**Aneurisma:** ≥4,0 cm\n\nRisco de ruptura: <0,5% ao ano`;
      recommendations.push(
        '🔵 DILATAÇÃO LEVE DA AORTA (<4,0 cm):',
        '• Risco de ruptura muito baixo (<0,5%/ano)',
        '• **Seguimento com USG a cada 2-3 anos**',
        '• Controle de fatores de risco:',
        '  - Cessar tabagismo',
        '  - Controle de PA',
        '  - Estatina se dislipidemia',
        '• Repetir USG se sintomas',
        '• Reavaliação se crescimento >0,3 cm/ano'
      );
    }
    
    return {
      value: diametro,
      category,
      interpretation,
      severity,
      recommendations,
    };
  },
  
  interpretation: (result) => {
    return `${result} cm`;
  },
  
  references: [
    'Chaikof EL et al. J Vasc Surg 2018;67(1):2-77 - SVS Practice Guidelines',
    'Wanhainen A et al. Eur J Vasc Endovasc Surg 2019;57(1):8-93 - ESVS Guidelines',
    'Lederle FA et al. N Engl J Med 2002;346(19):1437-44 - UKSAT Trial',
    'Powell JT et al. Lancet 2011;377(9771):1005-10 - EVAR-1 Trial',
  ]
};

// ═══════════════════════════════════════════════════════════════
// EXPORTAR TODAS AS CALCULADORAS VASCULARES
// ═══════════════════════════════════════════════════════════════

export const CALCULADORAS_VASCULARES = [
  ITB_DAOP,
  WELLS_TVP,
  CEAP_IVC,
  RUTHERFORD_AGUDA,
  RISCO_AAA,
];
