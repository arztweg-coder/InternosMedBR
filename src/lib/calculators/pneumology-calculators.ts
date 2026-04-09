/**
 * pneumology-calculators.ts — Calculadoras de Pneumologia
 * 🫁 Pneumologia — Espirometria | GINA (Asma) | STOP-BANG
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. ESPIROMETRIA ──────────────────────────────────────────────────────────

export const SPIROMETRY: Calculator = {
  id: 'espirometria',
  name: 'Espirometria — Interpretação',
  specialty: 'Pneumologia',
  emoji: '🫁',
  description: 'Interpretação sistemática de espirometria conforme diretrizes da Sociedade Brasileira de Pneumologia e Tisiologia (SBPT) e ATS/ERS 2022. Classifica padrão ventilatório (obstrutivo, restritivo, misto) e grau de comprometimento funcional.',
  tooltip: 'CVF, VEF1 e VEF1/CVF são os pilares. Padrão obstrutivo: VEF1/CVF <70% (ou LIN). Reversibilidade: ↑VEF1 ≥200 mL e ≥12% pós-broncodilatador. GOLD: VEF1 ≥80%=leve, 50-79%=moderado, 30-49%=grave, <30%=muito grave.',
  category: 'assessment',
  fields: [
    { id: 'vef1_cvf', label: 'VEF1/CVF (%)', type: 'number', min: 20, max: 100, step: 0.1, required: true, info: 'Normal: >70% (LIN); usa LIN em idosos' },
    { id: 'vef1_pred', label: 'VEF1 (% do previsto)', type: 'number', min: 10, max: 140, step: 0.1, required: true, info: 'Normal: ≥80% do previsto' },
    { id: 'cvf_pred', label: 'CVF (% do previsto)', type: 'number', min: 10, max: 140, step: 0.1, required: true, info: 'Normal: ≥80% do previsto' },
    { id: 'reversibilidade', label: 'Teste broncodilatador: aumento VEF1 ≥200 mL e ≥12%?', type: 'radio', required: true, options: [{ value: 'nao_feito', label: 'Não realizado' }, { value: 'negativo', label: 'Negativo' }, { value: 'positivo', label: 'Positivo (≥200 mL e ≥12%)' }] },
  ],
  calculate: (values) => {
    const ratio = Number(values.vef1_cvf);
    const vef1 = Number(values.vef1_pred);
    const cvf = Number(values.cvf_pred);
    const rev = String(values.reversibilidade);

    let padrao = ''; let grau = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];

    const obstrucao = ratio < 70;
    const reducaoVEF1 = vef1 < 80;
    const reducaoCVF = cvf < 80;

    if (obstrucao) {
      padrao = 'Padrão Obstrutivo';
      if (vef1 >= 80) { grau = 'Grau I — Leve'; severity = 'low'; }
      else if (vef1 >= 50) { grau = 'Grau II — Moderado'; severity = 'moderate'; }
      else if (vef1 >= 30) { grau = 'Grau III — Grave'; severity = 'high'; }
      else { grau = 'Grau IV — Muito Grave'; severity = 'critical'; }
      recommendations = [
        'Solicitar: raio-X tórax, TC tórax se suspeita de enfisema',
        'Avaliar DPOC (GOLD) ou asma',
        rev === 'positivo' ? '✓ Reversível — diagnóstico de asma suportado' : 'Broncodilatador de longa ação indicado',
        'Vacinação: influenza anual, pneumocócica',
        grau.includes('Moderado') || grau.includes('Grave') ? 'Reabilitação pulmonar' : '',
      ].filter(Boolean);
    } else if (!obstrucao && reducaoCVF) {
      padrao = 'Padrão Restritivo (provável)';
      grau = cvf >= 70 ? 'Leve' : cvf >= 50 ? 'Moderado' : 'Grave';
      severity = cvf >= 70 ? 'low' : cvf >= 50 ? 'moderate' : 'high';
      recommendations = ['Confirmar com pletismografia (VR e CPT)', 'Investigar: fibrose pulmonar, derrame, cifoescoliose, obesidade', 'TC de tórax de alta resolução', 'Encaminhar ao pneumologista'];
    } else if (!obstrucao && !reducaoCVF && !reducaoVEF1) {
      padrao = 'Normal'; grau = ''; severity = 'low';
      recommendations = ['Espirometria dentro da normalidade', 'Reavaliação conforme sintomas'];
    } else {
      padrao = 'Padrão Misto'; grau = ''; severity = 'moderate';
      recommendations = ['Padrão obstrutivo + restritivo', 'Pletismografia para melhor caracterização', 'Encaminhar ao pneumologista'];
    }

    return {
      value: `VEF1/CVF: ${ratio}%`,
      category: `${padrao}${grau ? ' — ' + grau : ''}`,
      interpretation: `Padrão: ${padrao}${grau ? ' — ' + grau : ''}\nVEF1: ${vef1}% | CVF: ${cvf}% | VEF1/CVF: ${ratio}%\nReversibilidade: ${rev === 'positivo' ? '✓ Positiva' : rev === 'negativo' ? 'Negativa' : 'Não realizada'}`,
      severity, recommendations,
    };
  },
  references: ['SBPT. Espirometria. J Bras Pneumol. 2002;28(Supl3):S1-S82', 'Stanojevic S, et al. Eur Respir J. 2022;60(1):2101499'],
};

// ── 2. GINA — Controle da Asma ───────────────────────────────────────────────

export const GINA_ASTHMA: Calculator = {
  id: 'gina-asma',
  name: 'GINA — Controle da Asma',
  specialty: 'Pneumologia',
  emoji: '🫁',
  description: 'Avaliação do controle da asma segundo critérios GINA (Global Initiative for Asthma) nas últimas 4 semanas. Classifica o controle em bem controlado, parcialmente controlado ou não controlado, orientando escalonamento ou desescalonamento do tratamento.',
  tooltip: 'Avalia 4 critérios nas últimas 4 semanas: sintomas diurnos, uso de SABA, limitação atividades, sintomas noturnos. 0 critérios = bem controlado. 1-2 = parcialmente controlado. 3-4 = não controlado.',
  category: 'questionnaire',
  fields: [
    { id: 'sintomas_diurnos', label: 'Sintomas diurnos mais de 2×/semana nas últimas 4 semanas?', type: 'radio', required: true, options: [{ value: 0, label: 'Não (0)' }, { value: 1, label: 'Sim (1)' }] },
    { id: 'acordar_noite', label: 'Acordar à noite devido à asma?', type: 'radio', required: true, options: [{ value: 0, label: 'Não (0)' }, { value: 1, label: 'Sim (1)' }] },
    { id: 'saba', label: 'Uso de SABA (salbutamol) de resgate mais de 2×/semana?', type: 'radio', required: true, options: [{ value: 0, label: 'Não (0)' }, { value: 1, label: 'Sim (1)' }] },
    { id: 'limitacao', label: 'Limitação de atividade física por causa da asma?', type: 'radio', required: true, options: [{ value: 0, label: 'Não (0)' }, { value: 1, label: 'Sim (1)' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s:number,v)=>s+Number(v),0);
    let category=''; let severity: CalculatorResult['severity']='low'; let recommendations:string[]=[];
    if(total===0){
      category='Asma Bem Controlada'; severity='low';
      recommendations=['Manter tratamento atual','Avaliar desescalonamento após 3 meses de controle','Revisão a cada 3-6 meses','Plano de ação por escrito'];
    } else if(total<=2){
      category='Asma Parcialmente Controlada'; severity='moderate';
      recommendations=['Revisar adesão e técnica inalatória antes de escalonar','Identificar e tratar comorbidades: rinite, DRGE, obesidade','Escalonar 1 nível GINA se confirmada falta de controle','Revisão em 2-4 semanas'];
    } else {
      category='Asma Não Controlada'; severity='high';
      recommendations=['Escalonar tratamento IMEDIATAMENTE (GINA steps 4-5)','Adicionar LABA se não em uso','Verificar adesão e técnica inalatória','Investigar fenótipo: eosinofílico (anti-IL5), alérgico (omalizumab)','Referência ao pneumologista especialista em asma'];
    }
    return { value:total, category, interpretation:`GINA Score: ${total}/4\n${category}`, severity, recommendations };
  },
  references: ['GINA 2024 Report. ginasthma.org','SBPT. Diretrizes de Asma. J Bras Pneumol. 2012'],
};

// ── 3. STOP-BANG ─────────────────────────────────────────────────────────────

export const STOP_BANG: Calculator = {
  id: 'stop-bang',
  name: 'STOP-BANG — Apneia do Sono',
  specialty: 'Pneumologia',
  emoji: '🫁',
  description: 'Questionário STOP-BANG para triagem de Síndrome de Apneia Obstrutiva do Sono (SAOS). Desenvolvido para populações cirúrgicas e validado amplamente. Alta sensibilidade para SAOS moderada-grave (IAH ≥15). Orienta solicitação de polissonografia.',
  tooltip: '0-2: baixo risco de SAOS. 3-4: risco intermediário. ≥5: alto risco (especialmente homem, IMC>35 ou pescoço>40cm). Sensibilidade para SAOS grave: 93%. Especificidade moderada.',
  category: 'questionnaire',
  fields: [
    { id: 'S', label: 'S — Snoring: Ronca alto (audível através de portas fechadas)?', type: 'checkbox' },
    { id: 'T', label: 'T — Tired: Frequentemente cansado ou sonolento durante o dia?', type: 'checkbox' },
    { id: 'O', label: 'O — Observed: Alguém já observou você parar de respirar durante o sono?', type: 'checkbox' },
    { id: 'P', label: 'P — Pressure: Tem ou é tratado para hipertensão arterial?', type: 'checkbox' },
    { id: 'B', label: 'B — BMI: IMC > 35 kg/m²?', type: 'checkbox' },
    { id: 'A', label: 'A — Age: Idade > 50 anos?', type: 'checkbox' },
    { id: 'N', label: 'N — Neck: Circunferência do pescoço > 40 cm?', type: 'checkbox' },
    { id: 'G', label: 'G — Gender: Sexo masculino?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const total = Object.values(values).filter(Boolean).length;
    // Critérios de alto risco adicionais
    const altaSpecificidade = (values.B || values.N || values.G) && total >= 2;
    let category=''; let severity: CalculatorResult['severity']='low'; let recommendations:string[]=[];
    if(total<=2){
      category='Baixo Risco de SAOS'; severity='low';
      recommendations=['Baixo risco de apneia obstrutiva significativa','Reavaliação se surgir ronco, sonolência excessiva ou HAS de difícil controle'];
    } else if(total<=4){
      category='Risco Intermediário de SAOS'; severity='moderate';
      recommendations=['Polissonografia recomendada (ou oximetria domiciliar como triagem)','Orientar higiene do sono','Controle de peso se IMC >25','Evitar álcool e sedativos antes de dormir','Avaliar contexto clínico (HAS, fibrilação, ICC)'];
    } else {
      category=`Alto Risco de SAOS${altaSpecificidade?' (muito provável)':''}`; severity='high';
      recommendations=['Polissonografia IMEDIATA','CPAP terapêutico se confirmado IAH ≥5 com sintomas ou ≥15 sem sintomas','Mandibular repositioning device como alternativa ao CPAP','Perda de peso: reduz IAH em ~3/hora para cada 10% de perda','Cirurgia bariátrica se IMC ≥40 com SAOS grave','Encaminhar ao pneumologista/otorrinolaringologista'];
    }
    return { value:`${total}/8`, category, interpretation:`STOP-BANG: ${total}/8\n${category}`, severity, recommendations };
  },
  references: ['Chung F, et al. Anesthesiology. 2008;108(5):812-21','Chung F, et al. Br J Anaesth. 2012;108(5):768-75'],
};

// ── 4. ACT — Asthma Control Test ─────────────────────────────────────────────

export const ACT: Calculator = {
  id: 'act',
  name: 'ACT — Asthma Control Test',
  specialty: 'Pneumologia',
  emoji: '🫁',
  description: 'Teste de Controle da Asma (ACT) — questionário validado de 5 itens para autoavaliação do controle da asma nas últimas 4 semanas. Pontuação de 5 a 25. Desenvolvido para uso clínico e monitoramento longitudinal.',
  tooltip: '≤19: não bem controlada. 20-24: bem controlada. 25: controle total. Diferença ≥3 pontos = mudança clínica significativa.',
  category: 'questionnaire',
  fields: [
    { id: 'q1', label: '1. Com que frequência a asma impediu você de realizar atividades (trabalho, escola, casa) nas últimas 4 semanas?', type: 'radio', required: true,
      options: [{value:1,label:'1 — Sempre'},{value:2,label:'2 — Quase sempre'},{value:3,label:'3 — Às vezes'},{value:4,label:'4 — Raramente'},{value:5,label:'5 — Nunca'}] },
    { id: 'q2', label: '2. Com que frequência você teve falta de ar nas últimas 4 semanas?', type: 'radio', required: true,
      options: [{value:1,label:'1 — Mais de 1×/dia'},{value:2,label:'2 — 1×/dia'},{value:3,label:'3 — 3–6×/semana'},{value:4,label:'4 — 1–2×/semana'},{value:5,label:'5 — Nenhuma vez'}] },
    { id: 'q3', label: '3. Com que frequência os sintomas (chiado, tosse, falta de ar, aperto) acordaram você à noite nas últimas 4 semanas?', type: 'radio', required: true,
      options: [{value:1,label:'1 — 4+ noites/semana'},{value:2,label:'2 — 2–3 noites/semana'},{value:3,label:'3 — 1×/semana'},{value:4,label:'4 — 1–2×/mês'},{value:5,label:'5 — Nenhuma vez'}] },
    { id: 'q4', label: '4. Com que frequência você usou inalador de alívio (salbutamol) nas últimas 4 semanas?', type: 'radio', required: true,
      options: [{value:1,label:'1 — 3+ vezes/dia'},{value:2,label:'2 — 1–2×/dia'},{value:3,label:'3 — 2–3×/semana'},{value:4,label:'4 — ≤1×/semana'},{value:5,label:'5 — Nenhuma vez'}] },
    { id: 'q5', label: '5. Como você avalia o controle da sua asma nas últimas 4 semanas?', type: 'radio', required: true,
      options: [{value:1,label:'1 — Sem controle algum'},{value:2,label:'2 — Pouco controlada'},{value:3,label:'3 — Parcialmente controlada'},{value:4,label:'4 — Bem controlada'},{value:5,label:'5 — Completamente controlada'}] },
  ],
  calculate: (values) => {
    const total = Number(values.q1)+Number(values.q2)+Number(values.q3)+Number(values.q4)+Number(values.q5);
    let category=''; let severity: CalculatorResult['severity']='low'; let recommendations:string[]=[];
    if(total<=19){
      category='Asma Não Bem Controlada'; severity='high';
      recommendations=['Revisar técnica inalatória e adesão ao tratamento','Identificar gatilhos (alérgenos, AINE, DRGE, rinite)','Considerar escalonamento GINA','Monitorar com ACT em 4 semanas'];
    } else if(total<=24){
      category='Asma Bem Controlada'; severity='low';
      recommendations=['Manter tratamento atual','Avaliar desescalonamento após 3 meses estável','Revisão em 3–6 meses'];
    } else {
      category='Controle Total da Asma'; severity='low';
      recommendations=['Controle ótimo — considerar desescalonamento','Revisão a cada 6 meses'];
    }
    return { value:total, category, interpretation:`ACT: ${total}/25\n${category}`, severity, recommendations };
  },
  references: ['Nathan RA, et al. J Allergy Clin Immunol. 2004;113(1):59-65','GINA 2024. ginasthma.org'],
};

// ── 5. GOAL — Triagem de Apneia do Sono ─────────────────────────────────────

export const GOAL: Calculator = {
  id: 'goal',
  name: 'GOAL — Triagem de Apneia do Sono',
  specialty: 'Pneumologia',
  emoji: '😴',
  description: 'Questionário GOAL (Gender, Obesity, Age, Loud snoring) para triagem simplificada de Síndrome de Apneia Obstrutiva do Sono. Versão reduzida de 4 itens, útil em ambulatório geral.',
  tooltip: '0–1: baixo risco. 2: risco intermediário. 3–4: alto risco. Complementar com STOP-BANG se score ≥2.',
  category: 'questionnaire',
  fields: [
    { id: 'G', label: 'G — Gender: Sexo masculino?', type: 'checkbox' },
    { id: 'O', label: 'O — Obesity: IMC ≥ 30 kg/m²?', type: 'checkbox' },
    { id: 'A', label: 'A — Age: Idade ≥ 50 anos?', type: 'checkbox' },
    { id: 'L', label: 'L — Loud snoring: Ronco audível (ouvido em outro cômodo)?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const total = Object.values(values).filter(Boolean).length;
    let category=''; let severity: CalculatorResult['severity']='low'; let recommendations:string[]=[];
    if(total<=1){
      category='Baixo Risco de SAOS'; severity='low';
      recommendations=['Baixo risco — reavaliação se surgirem novos sintomas'];
    } else if(total===2){
      category='Risco Intermediário de SAOS'; severity='moderate';
      recommendations=['Complementar com STOP-BANG','Oximetria domiciliar se sintomas presentes','Orientar higiene do sono'];
    } else {
      category='Alto Risco de SAOS'; severity='high';
      recommendations=['Solicitar polissonografia','Aplicar STOP-BANG completo','Encaminhar ao pneumologista'];
    }
    return { value:`${total}/4`, category, interpretation:`GOAL: ${total}/4\n${category}`, severity, recommendations };
  },
  references: ['Chung F, et al. Chest. 2012;141(3):616-25'],
};

// ── 6. BODE — Índice Prognóstico DPOC ───────────────────────────────────────

export const BODE: Calculator = {
  id: 'bode',
  name: 'BODE — Índice Prognóstico DPOC',
  specialty: 'Pneumologia',
  emoji: '🫁',
  description: 'Índice BODE para avaliação prognóstica multidimensional da DPOC. Combina IMC (B), obstrução ao fluxo (O), dispneia mMRC (D) e capacidade de exercício — TC6min (E). Prediz sobrevida em 4 anos.',
  tooltip: 'Pontuação 0-10. Q1 (0-2): sobrevida 80%. Q2 (3-4): 67%. Q3 (5-6): 57%. Q4 (7-10): 18% em 4 anos.',
  category: 'score',
  fields: [
    { id: 'imc', label: 'IMC (kg/m²)', type: 'number', min: 10, max: 60, step: 0.1, required: true, info: '≤21: 1 ponto; >21: 0 pontos' },
    { id: 'vef1', label: 'VEF1 (% do previsto)', type: 'number', min: 10, max: 100, step: 1, required: true, info: '≥65%=0 | 50–64%=1 | 36–49%=2 | ≤35%=3' },
    { id: 'mmrc', label: 'Dispneia mMRC', type: 'radio', required: true,
      options: [{value:0,label:'0 — Só esforço intenso'},{value:1,label:'1 — Ladeira/apressar passo'},{value:2,label:'2 — Mais lento que colegas'},{value:3,label:'3 — Para após 100m'},{value:4,label:'4 — Falta de ar em repouso'}] },
    { id: 'tc6min', label: 'TC6min — Teste de caminhada 6 minutos (metros)', type: 'number', min: 0, max: 700, step: 1, required: true, info: '≥350=0 | 250–349=1 | 150–249=2 | ≤149=3' },
  ],
  calculate: (values) => {
    const imc = Number(values.imc);
    const vef1 = Number(values.vef1);
    const mmrc = Number(values.mmrc);
    const tc6 = Number(values.tc6min);

    const pB = imc <= 21 ? 1 : 0;
    const pO = vef1 >= 65 ? 0 : vef1 >= 50 ? 1 : vef1 >= 36 ? 2 : 3;
    const pD = mmrc <= 1 ? 0 : mmrc === 2 ? 1 : mmrc === 3 ? 2 : 3;
    const pE = tc6 >= 350 ? 0 : tc6 >= 250 ? 1 : tc6 >= 150 ? 2 : 3;
    const total = pB + pO + pD + pE;

    let category=''; let severity: CalculatorResult['severity']='low'; let sobrevida=''; let recommendations:string[]=[];
    if(total<=2){ category='Quartil 1 (0–2)'; severity='low'; sobrevida='~80% em 4 anos';
      recommendations=['Manutenção do tratamento GOLD','Reabilitação pulmonar','Vacinação em dia'];
    } else if(total<=4){ category='Quartil 2 (3–4)'; severity='moderate'; sobrevida='~67% em 4 anos';
      recommendations=['Otimizar broncodilatação (LAMA+LABA)','Reabilitação pulmonar obrigatória','Avaliar oxigenoterapia'];
    } else if(total<=6){ category='Quartil 3 (5–6)'; severity='high'; sobrevida='~57% em 4 anos';
      recommendations=['Considerar transplante pulmonar','OCD se hipoxemia','Cuidados de suporte intensivos'];
    } else { category='Quartil 4 (7–10)'; severity='critical'; sobrevida='~18% em 4 anos';
      recommendations=['Avaliação para transplante pulmonar urgente','Cuidados paliativos integrados','OCD 24h se indicado'];
    }
    return { value:total, category,
      interpretation:`BODE: ${total}/10 (${category})\nSobrevida estimada 4 anos: ${sobrevida}\nB:${pB} O:${pO} D:${pD} E:${pE}`,
      severity, recommendations };
  },
  references: ['Celli BR, et al. N Engl J Med. 2004;350(10):1005-12','GOLD 2024. goldcopd.org'],
};

// ── 7. FAGERSTRÖM — Dependência à Nicotina ───────────────────────────────────

export const FAGERSTROM: Calculator = {
  id: 'fagerstrom',
  name: 'Fagerström — Dependência à Nicotina',
  specialty: 'Pneumologia',
  emoji: '🚬',
  description: 'Teste de Fagerström para avaliação da dependência física à nicotina. 6 itens, pontuação 0–10. Orienta escolha de farmacoterapia para cessação tabágica (Vareniclina, Bupropiona, TRN).',
  tooltip: '0–2: muito baixa. 3–4: baixa. 5: média. 6–7: elevada. 8–10: muito elevada. Score ≥5: TRN em dose alta ou Vareniclina preferencial.',
  category: 'questionnaire',
  fields: [
    { id: 'q1', label: '1. Quanto tempo após acordar você fuma o primeiro cigarro?', type: 'radio', required: true,
      options: [{value:3,label:'Nos primeiros 5 min (3)'},{value:2,label:'De 6 a 30 minutos (2)'},{value:1,label:'De 31 a 60 minutos (1)'},{value:0,label:'Mais de 60 minutos (0)'}] },
    { id: 'q2', label: '2. Você acha difícil não fumar em lugares proibidos (hospitais, ônibus)?', type: 'radio', required: true,
      options: [{value:1,label:'Sim (1)'},{value:0,label:'Não (0)'}] },
    { id: 'q3', label: '3. Qual cigarro lhe traz mais satisfação?', type: 'radio', required: true,
      options: [{value:1,label:'O primeiro da manhã (1)'},{value:0,label:'Qualquer outro (0)'}] },
    { id: 'q4', label: '4. Quantos cigarros você fuma por dia?', type: 'radio', required: true,
      options: [{value:0,label:'≤10 cigarros (0)'},{value:1,label:'11–20 cigarros (1)'},{value:2,label:'21–30 cigarros (2)'},{value:3,label:'≥31 cigarros (3)'}] },
    { id: 'q5', label: '5. Você fuma mais nas primeiras horas após acordar do que no restante do dia?', type: 'radio', required: true,
      options: [{value:1,label:'Sim (1)'},{value:0,label:'Não (0)'}] },
    { id: 'q6', label: '6. Você fuma mesmo doente, quando precisa ficar na cama?', type: 'radio', required: true,
      options: [{value:1,label:'Sim (1)'},{value:0,label:'Não (0)'}] },
  ],
  calculate: (values) => {
    const total = Number(values.q1)+Number(values.q2)+Number(values.q3)+Number(values.q4)+Number(values.q5)+Number(values.q6);
    let category=''; let severity: CalculatorResult['severity']='low'; let recommendations:string[]=[];
    if(total<=2){ category='Dependência muito baixa'; severity='low';
      recommendations=['TRN de baixa dose (adesivo 14mg ou goma 2mg)','Apoio comportamental é suficiente na maioria'];
    } else if(total<=4){ category='Dependência baixa'; severity='low';
      recommendations=['TRN dose padrão (adesivo 21mg ou goma 2–4mg)','Bupropiona 150mg 12/12h como alternativa'];
    } else if(total===5){ category='Dependência média'; severity='moderate';
      recommendations=['Vareniclina 1mg 12/12h (1ª escolha)','TRN combinada: adesivo + goma','Bupropiona 150mg 12/12h'];
    } else if(total<=7){ category='Dependência elevada'; severity='high';
      recommendations=['Vareniclina 1mg 12/12h (1ª escolha)','TRN combinada obrigatória se não usar Vareniclina','Apoio intensivo + grupos de suporte'];
    } else { category='Dependência muito elevada'; severity='critical';
      recommendations=['Vareniclina 1mg 12/12h por 12 semanas','TRN combinada: adesivo 21mg + goma 4mg ad libitum','Considerar associação Bupropiona + TRN','Acompanhamento intensivo obrigatório'];
    }
    return { value:total, category, interpretation:`Fagerström: ${total}/10\n${category}`, severity, recommendations };
  },
  references: ['Fagerström KO. Addict Behav. 1978;3(3-4):235-41','Heatherton TF, et al. Br J Addict. 1991;86(9):1119-27'],
};

// ── 8. GLOVER-NILSSON — Dependência Comportamental ───────────────────────────

export const GLOVER_NILSSON: Calculator = {
  id: 'glover-nilsson',
  name: 'Glover-Nilsson — Dependência Comportamental',
  specialty: 'Pneumologia',
  emoji: '🧠',
  description: 'Escala de Glover-Nilsson para avaliação da dependência comportamental/psicológica ao tabaco. 11 itens Sim/Não. Complementa o Teste de Fagerström (dependência física). Orienta intensidade do suporte comportamental.',
  tooltip: '0–3: baixa. 4–6: moderada. 7–11: alta dependência comportamental. Score alto: suporte comportamental intensivo obrigatório.',
  category: 'questionnaire',
  fields: [
    { id: 'q1',  label: '1. Você fuma para sentir-se mais confortável em situações sociais?', type: 'checkbox' },
    { id: 'q2',  label: '2. Acender um cigarro ajuda você a relaxar quando está tenso ou ansioso?', type: 'checkbox' },
    { id: 'q3',  label: '3. Você fuma quando está irritado ou com raiva?', type: 'checkbox' },
    { id: 'q4',  label: '4. Você tem vontade de fumar quando está feliz ou animado?', type: 'checkbox' },
    { id: 'q5',  label: '5. Parece que falta algo quando você está sem cigarro na mão?', type: 'checkbox' },
    { id: 'q6',  label: '6. Você usa o cigarro como um "apoio psicológico" para enfrentar situações?', type: 'checkbox' },
    { id: 'q7',  label: '7. Às vezes você acende um cigarro sem perceber que já está fumando?', type: 'checkbox' },
    { id: 'q8',  label: '8. Fumar é uma forma de recompensa ou conforto em certas situações?', type: 'checkbox' },
    { id: 'q9',  label: '9. Você às vezes fuma só porque os outros ao redor estão fumando?', type: 'checkbox' },
    { id: 'q10', label: '10. Você se sente desconfortável quando não pode fumar em situações sociais?', type: 'checkbox' },
    { id: 'q11', label: '11. Em momentos importantes, você inconscientemente busca um cigarro?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const total = Object.values(values).filter(Boolean).length;
    let category=''; let severity: CalculatorResult['severity']='low'; let recommendations:string[]=[];
    if(total<=3){ category='Dependência comportamental baixa'; severity='low';
      recommendations=['Apoio comportamental básico','Identificar e evitar gatilhos principais'];
    } else if(total<=6){ category='Dependência comportamental moderada'; severity='moderate';
      recommendations=['Terapia cognitivo-comportamental (TCC) recomendada','Identificar rituais do tabagismo','Técnicas de manejo de craving'];
    } else { category='Dependência comportamental alta'; severity='high';
      recommendations=['TCC intensiva obrigatória','Grupos de suporte para cessação','Mindfulness para controle de craving','Avaliar comorbidades psiquiátricas (ansiedade, depressão)'];
    }
    return { value:`${total}/11`, category, interpretation:`Glover-Nilsson: ${total}/11\n${category}`, severity, recommendations };
  },
  references: ['Glover ED, Nilsson F, et al. Am J Health Behav. 2005;29(5):443-54'],
};

export const PNEUMOLOGY_CALCULATORS: Calculator[] = [
  SPIROMETRY, GINA_ASTHMA, STOP_BANG, ACT, GOAL, BODE, FAGERSTROM, GLOVER_NILSSON,
];
