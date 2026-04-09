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

export const PNEUMOLOGY_CALCULATORS: Calculator[] = [SPIROMETRY, GINA_ASTHMA, STOP_BANG];
