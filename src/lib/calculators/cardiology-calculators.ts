/**
 * cardiology-calculators.ts — Calculadoras de Cardiologia
 * ❤️ Cardiologia (ordem alfabética)
 * CHA₂DS₂-VASc | Framingham | GRACE | HEART | TIMI
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. CHA₂DS₂-VASc ─────────────────────────────────────────────────────────

export const CHADS2_VASC: Calculator = {
  id: 'chads2-vasc',
  name: 'CHA₂DS₂-VASc — Risco de AVC na FA',
  specialty: 'Cardiologia',
  emoji: '❤️',
  description: 'Escore CHA₂DS₂-VASc para estratificação do risco de AVC em pacientes com fibrilação atrial não valvar. Orienta a decisão de anticoagulação oral. Recomendado pelo ACC/AHA/ESC como principal ferramenta de risco tromboembólico na FA.',
  tooltip: 'Escore 0-9. Anticoagular se: homem ≥2 pontos ou mulher ≥3 pontos (NOAC preferencial). Variáveis: ICC, HAS, Idade ≥75 (+2), DM, AVC/AIT (+2), Doença vascular, Idade 65-74, Sexo feminino.',
  category: 'score',
  fields: [
    { id: 'icc', label: 'C — Insuficiência cardíaca ou disfunção sistólica (FE <40%)', type: 'checkbox' },
    { id: 'has', label: 'H — Hipertensão arterial sistêmica', type: 'checkbox' },
    { id: 'idade75', label: 'A₂ — Idade ≥ 75 anos (+2 pontos)', type: 'checkbox' },
    { id: 'dm', label: 'D — Diabetes mellitus', type: 'checkbox' },
    { id: 'avc', label: 'S₂ — AVC, AIT ou tromboembolismo prévio (+2 pontos)', type: 'checkbox' },
    { id: 'vascular', label: 'V — Doença vascular: IAM prévio, placa aórtica, DAP', type: 'checkbox' },
    { id: 'idade65', label: 'A — Idade 65-74 anos', type: 'checkbox' },
    { id: 'sexo_fem', label: 'Sc — Sexo feminino', type: 'checkbox' },
  ],
  calculate: (values) => {
    let total = 0;
    if (values.icc) total += 1; if (values.has) total += 1;
    if (values.idade75) total += 2; if (values.dm) total += 1;
    if (values.avc) total += 2; if (values.vascular) total += 1;
    if (values.idade65) total += 1; if (values.sexo_fem) total += 1;

    const avcRates: Record<number, string> = { 0: '0%', 1: '1,3%', 2: '2,2%', 3: '3,2%', 4: '4,0%', 5: '6,7%', 6: '9,8%', 7: '9,6%', 8: '12,5%', 9: '15,2%' };
    const avcAnual = avcRates[Math.min(total, 9)] ?? '≥15%';

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    const mulher = Boolean(values.sexo_fem);
    const limiar = mulher ? 3 : 2;

    if (total === 0 || (mulher && total === 1)) {
      category = 'Risco Muito Baixo'; severity = 'low';
      recommendations = ['Anticoagulação não indicada rotineiramente', 'Reavaliar periodicamente e a cada mudança clínica'];
    } else if (total === 1 && !mulher) {
      category = 'Risco Baixo'; severity = 'low';
      recommendations = ['Considerar anticoagulação (avaliação individual do benefício-risco)', 'NOAC preferencial ao warfarin', 'Discutir com paciente'];
    } else if (total < limiar) {
      category = 'Risco Moderado'; severity = 'moderate';
      recommendations = ['Anticoagulação oral indicada', 'NOAC preferencial: apixabana, rivaroxabana ou dabigatrana', 'Contraindicação a NOAC? → Warfarin (INR 2-3)'];
    } else {
      category = 'Alto Risco — Anticoagulação Obrigatória'; severity = 'high';
      recommendations = ['Anticoagulação oral OBRIGATÓRIA', 'NOAC de preferência (apixabana ou rivaroxabana)', 'Avaliar risco de sangramento (HAS-BLED)', 'Warfarin se estenose mitral reumática ou prótese valvar'];
    }
    return { value: `${total}/9`, category, interpretation: `CHA₂DS₂-VASc: ${total} pontos\nRisco de AVC anual: ${avcAnual}\n${category}`, severity, recommendations };
  },
  references: ['Lip GYH, et al. Chest. 2010;137(2):263-72', 'Hindricks G, et al. Eur Heart J. 2021;42(5):373-498 (ESC 2020)'],
};

// ── 2. FRAMINGHAM ────────────────────────────────────────────────────────────

export const FRAMINGHAM: Calculator = {
  id: 'framingham',
  name: 'Framingham — Risco Cardiovascular 10 Anos',
  specialty: 'Cardiologia',
  emoji: '❤️',
  description: 'Framingham Risk Score para estimativa do risco de evento cardiovascular maior (IAM, angina, AVC, ICC ou morte CV) em 10 anos. Ferramenta fundamental para decisão de estatina, AAS e modificação do estilo de vida na prevenção primária.',
  tooltip: 'Variáveis: idade, sexo, colesterol total, HDL, PAS (tratada/não tratada), tabagismo, diabetes. Risco <10%: baixo. 10-20%: intermediário. >20%: alto. Escore alto: estatina + AAS + metas lipídicas agressivas.',
  category: 'formula',
  fields: [
    { id: 'idade', label: 'Idade (anos)', type: 'number', min: 20, max: 79, step: 1, required: true },
    { id: 'sexo', label: 'Sexo', type: 'radio', required: true, options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }] },
    { id: 'col_total', label: 'Colesterol Total (mg/dL)', type: 'number', min: 100, max: 400, step: 1, required: true, unit: 'mg/dL' },
    { id: 'hdl', label: 'HDL-Colesterol (mg/dL)', type: 'number', min: 20, max: 100, step: 1, required: true, unit: 'mg/dL' },
    { id: 'pas', label: 'Pressão Arterial Sistólica (mmHg)', type: 'number', min: 80, max: 200, step: 1, required: true, unit: 'mmHg' },
    { id: 'trat_has', label: 'Em tratamento para hipertensão?', type: 'checkbox' },
    { id: 'fumante', label: 'Tabagismo atual?', type: 'checkbox' },
    { id: 'diabetes', label: 'Diabetes mellitus?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const idade = Number(values.idade);
    const sexo = String(values.sexo);
    const ct = Number(values.col_total);
    const hdl = Number(values.hdl);
    const pas = Number(values.pas);
    const trat = Boolean(values.trat_has);
    const fum = Boolean(values.fumante);
    const dm = Boolean(values.diabetes);

    let pts = 0;
    if (sexo === 'M') {
      if (idade < 35) pts -= 1; else if (idade <= 39) pts += 0; else if (idade <= 44) pts += 1; else if (idade <= 49) pts += 2; else if (idade <= 54) pts += 3; else if (idade <= 59) pts += 4; else if (idade <= 64) pts += 5; else if (idade <= 69) pts += 6; else pts += 7;
    } else {
      if (idade < 35) pts -= 9; else if (idade <= 39) pts -= 4; else if (idade <= 44) pts += 0; else if (idade <= 49) pts += 3; else if (idade <= 54) pts += 6; else if (idade <= 59) pts += 8; else if (idade <= 64) pts += 10; else if (idade <= 69) pts += 11; else pts += 13;
    }
    if (ct < 160) pts -= 3; else if (ct < 200) pts += 0; else if (ct < 240) pts += 1; else if (ct < 280) pts += 2; else pts += 3;
    if (hdl >= 60) pts -= 2; else if (hdl >= 50) pts -= 1; else if (hdl >= 40) pts += 0; else pts += 2;
    if (!trat) {
      if (pas < 130) pts += 0; else if (pas < 140) pts += 1; else if (pas < 160) pts += 2; else pts += 3;
    } else {
      if (pas < 130) pts += 0; else if (pas < 140) pts += 3; else if (pas < 160) pts += 4; else pts += 5;
    }
    if (fum) pts += 2;
    if (dm) pts += 2;

    const tabelaM: Record<string, number> = {'-3':1,'-2':1,'-1':2,'0':3,'1':4,'2':5,'3':6,'4':7,'5':8,'6':10,'7':13,'8':16,'9':20,'10':25,'11':31,'12':37,'13':45};
    const tabelaF: Record<string, number> = {'-3':1,'-2':1,'-1':1,'0':2,'1':2,'2':3,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':11,'11':13,'12':15,'13':17};
    const tabela = sexo === 'M' ? tabelaM : tabelaF;
    const clamped = Math.max(-3, Math.min(13, pts));
    const risco10 = tabela[String(clamped)] ?? (clamped >= 13 ? (sexo === 'M' ? 45 : 17) : 1);

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (risco10 < 10) {
      category = 'Risco Baixo (<10%)'; severity = 'low';
      recommendations = ['Modificações de estilo de vida', 'Estatina se LDL >190 mg/dL ou DM', 'Reavaliação a cada 1-2 anos'];
    } else if (risco10 < 20) {
      category = 'Risco Intermediário (10-20%)'; severity = 'moderate';
      recommendations = ['Estatina moderada (sinvastatina 40 mg ou equivalente)', 'Meta LDL <100 mg/dL', 'AAS 100mg se sem risco de sangramento', 'Controle de todos os fatores de risco'];
    } else {
      category = 'Risco Alto (>20%)'; severity = 'high';
      recommendations = ['Estatina de alta intensidade (atorvastatina 40-80 mg)', 'Meta LDL <70 mg/dL', 'AAS 100 mg/dia', 'Anti-hipertensivo, cessação tabágica, controle glicêmico', 'Considerar ezetimibe se LDL fora da meta'];
    }
    return { value: `${risco10}%`, category, interpretation: `Framingham: ${risco10}% em 10 anos\n${category}`, severity, recommendations };
  },
  references: ["D'Agostino RB Sr, et al. Circulation. 2008;117(6):743-53", 'SBC. Diretriz de Prevenção Cardiovascular. Arq Bras Cardiol. 2019'],
};

// ── 3. GRACE SCORE ───────────────────────────────────────────────────────────

export const GRACE_SCORE: Calculator = {
  id: 'grace-score',
  name: 'GRACE Score — Síndrome Coronariana Aguda',
  specialty: 'Cardiologia',
  emoji: '❤️',
  description: 'Global Registry of Acute Coronary Events (GRACE) Score para estratificação de risco em síndrome coronariana aguda (SCA). Prediz mortalidade intra-hospitalar e em 6 meses. Orienta estratégia invasiva (cateterismo precoce vs. conservadora) conforme diretrizes ACC/AHA/ESC.',
  tooltip: 'Variáveis: idade, FC, PAS, creatinina, classe Killip, parada cardíaca, supra ST, troponina elevada. GRACE >140: alto risco → estratégia invasiva precoce. 109-140: intermediário. <109: baixo.',
  category: 'score',
  fields: [
    { id: 'idade', label: 'Idade (anos)', type: 'number', min: 18, max: 110, step: 1, required: true },
    { id: 'fc', label: 'Frequência Cardíaca (bpm)', type: 'number', min: 20, max: 300, step: 1, required: true, unit: 'bpm' },
    { id: 'pas', label: 'Pressão Arterial Sistólica (mmHg)', type: 'number', min: 50, max: 250, step: 1, required: true, unit: 'mmHg' },
    { id: 'creatinina', label: 'Creatinina sérica (mg/dL)', type: 'number', min: 0.3, max: 15, step: 0.1, required: true, unit: 'mg/dL' },
    {
      id: 'killip', label: 'Classe Killip', type: 'radio', required: true,
      options: [{ value: 1, label: 'I — Sem sinais de ICC (0)' }, { value: 2, label: 'II — Estertores ou VJ/S3 (+20)' }, { value: 3, label: 'III — Edema pulmonar (+40)' }, { value: 4, label: 'IV — Choque cardiogênico (+80)' }],
    },
    { id: 'parada', label: 'Parada cardíaca na admissão?', type: 'checkbox', info: '+43 pontos' },
    { id: 'supradesn', label: 'Desvio de ST na admissão?', type: 'checkbox', info: '+30 pontos' },
    { id: 'troponina', label: 'Troponina elevada?', type: 'checkbox', info: '+15 pontos' },
  ],
  calculate: (values) => {
    let pts = 0;
    const idade = Number(values.idade);
    if (idade < 30) pts += 0; else if (idade < 40) pts += 8; else if (idade < 50) pts += 25; else if (idade < 60) pts += 41; else if (idade < 70) pts += 58; else if (idade < 80) pts += 75; else pts += 91;
    const fc = Number(values.fc);
    if (fc < 50) pts += 0; else if (fc < 70) pts += 3; else if (fc < 90) pts += 9; else if (fc < 110) pts += 15; else if (fc < 150) pts += 24; else if (fc < 200) pts += 38; else pts += 46;
    const pas = Number(values.pas);
    if (pas < 80) pts += 63; else if (pas < 100) pts += 58; else if (pas < 120) pts += 47; else if (pas < 140) pts += 37; else if (pas < 160) pts += 26; else if (pas < 200) pts += 11; else pts += 0;
    const cr = Number(values.creatinina);
    if (cr < 0.4) pts += 2; else if (cr < 0.8) pts += 5; else if (cr < 1.2) pts += 8; else if (cr < 1.6) pts += 11; else if (cr < 2.0) pts += 14; else if (cr < 4.0) pts += 23; else pts += 31;
    const killip = Number(values.killip);
    if (killip === 2) pts += 20; else if (killip === 3) pts += 40; else if (killip === 4) pts += 80;
    if (values.parada) pts += 43;
    if (values.supradesn) pts += 30;
    if (values.troponina) pts += 15;

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (pts < 109) {
      category = 'Baixo Risco'; severity = 'low';
      recommendations = ['Estratégia invasiva seletiva (cinecoronariografia em 72-96h)', 'Monitorização por 24-48h', 'Dupla antiagregação plaquetária (AAS + Ticagrelor/Clopidogrel)', 'Anticoagulação com enoxaparina ou fondaparinux'];
    } else if (pts <= 140) {
      category = 'Risco Intermediário'; severity = 'moderate';
      recommendations = ['Estratégia invasiva precoce (cinecoronariografia em 24-72h)', 'UTI Coronariana', 'DAPT + Anticoagulação', 'Monitorização contínua'];
    } else {
      category = 'Alto Risco'; severity = 'high';
      recommendations = ['Estratégia invasiva MUITO precoce (<24h — urgente se instável)', 'UTI Coronariana com monitorização contínua', 'DAPT: AAS + Ticagrelor 180 mg (bolus) + Anticoagulação', 'Considerar inibidor de GPIIb/IIIa se alto risco trombótico', 'Suporte hemodinâmico se choque (inotrópicos, BIA)'];
    }
    return { value: pts, category, interpretation: `GRACE Score: ${pts} pontos\n${category}`, severity, recommendations };
  },
  references: ['Granger CB, et al. JAMA. 2003;290(11):1593-9', 'Collet JP, et al. Eur Heart J. 2021;42(14):1289-367 (ESC 2020 NSTE-ACS)'],
};

// ── 4. HEART SCORE ───────────────────────────────────────────────────────────

export const HEART_SCORE: Calculator = {
  id: 'heart-score',
  name: 'HEART Score — Dor Torácica',
  specialty: 'Cardiologia',
  emoji: '❤️',
  description: 'HEART Score (History, ECG, Age, Risk factors, Troponin) para estratificação rápida de risco em pacientes com dor torácica na emergência. Validado para predizer eventos cardiovasculares maiores (MACE) em 6 semanas. Auxilia decisão de internação vs. alta segura.',
  tooltip: 'Pontuação 0-10. 0-3: baixo risco (MACE <2% → alta + acompanhamento). 4-6: risco moderado. 7-10: alto risco (MACE 65% → hospitalização e cateterismo).',
  category: 'score',
  fields: [
    { id: 'historia', label: 'H — História da dor', type: 'radio', required: true, options: [{ value: 0, label: 'Levemente suspeita (0)' }, { value: 1, label: 'Moderadamente suspeita (1)' }, { value: 2, label: 'Altamente suspeita (2)' }], info: 'Características: irradiação, relação esforço, sudorese, melhora com nitrato' },
    { id: 'ecg', label: 'E — ECG', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'BRE/BRD, repolarização inespecífica, HVE (1)' }, { value: 2, label: 'Alterações isquêmicas significativas (2)' }] },
    { id: 'idade', label: 'A — Idade', type: 'radio', required: true, options: [{ value: 0, label: '< 45 anos (0)' }, { value: 1, label: '45-64 anos (1)' }, { value: 2, label: '≥ 65 anos (2)' }] },
    { id: 'fatores', label: 'R — Fatores de risco CV', type: 'radio', required: true, options: [{ value: 0, label: 'Nenhum ou 1 fator menor (0)' }, { value: 1, label: '≥2 fatores menores ou 1 fator maior (1)' }, { value: 2, label: 'Aterosclerose conhecida ou IAM/AVC/DAP/Revascularização (2)' }], info: 'Menores: HAS, dislipidemia, DM, obesidade, tabagismo, HF. Maiores: IAM prévio, stent, cirurgia' },
    { id: 'troponina', label: 'T — Troponina inicial', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (≤limite superior) (0)' }, { value: 1, label: '1-3× o limite superior (1)' }, { value: 2, label: '>3× o limite superior (2)' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total <= 3) {
      category = 'Baixo Risco (MACE <2% em 6 sem)'; severity = 'low';
      recommendations = ['Alta hospitalar segura', 'Acompanhamento ambulatorial em 1-2 semanas', 'Troponina seriada se dúvida (3h e 6h)', 'Orientar retorno se piora dos sintomas', 'Teste ergométrico ambulatorial se diagnóstico incerto'];
    } else if (total <= 6) {
      category = 'Risco Moderado'; severity = 'moderate';
      recommendations = ['Internação para observação', 'Troponina seriada obrigatória', 'Monitorização cardíaca', 'Estratificar com teste de esforço ou cintilografia'];
    } else {
      category = 'Alto Risco (MACE ~65% em 6 sem)'; severity = 'high';
      recommendations = ['HOSPITALIZAÇÃO IMEDIATA', 'UTI Coronariana', 'Cinecoronariografia precoce (<24h)', 'DAPT: AAS + Ticagrelor ou Clopidogrel', 'Anticoagulação: enoxaparina ou HNF'];
    }
    return { value: `${total}/10`, category, interpretation: `HEART Score: ${total}/10\n${category}`, severity, recommendations };
  },
  references: ['Six AJ, et al. Neth Heart J. 2008;16(6):191-6', 'Backus BE, et al. Int J Cardiol. 2013;168(3):2153-8'],
};

// ── 5. TIMI SCORE (NSTE-ACS) ─────────────────────────────────────────────────

export const TIMI_SCORE: Calculator = {
  id: 'timi-score',
  name: 'TIMI Score — IAMSST/Angina Instável',
  specialty: 'Cardiologia',
  emoji: '❤️',
  description: 'TIMI Risk Score para síndrome coronariana aguda sem supra de ST (NSTE-ACS). Prediz risco de morte, novo IAM ou isquemia recorrente em 14 dias. Simples, com 7 variáveis binárias. Auxilia decisão de estratégia invasiva e clopidogrel/heparina de baixo peso molecular.',
  tooltip: 'Pontuação 0-7. 0-2: baixo risco (8%). 3-4: intermediário (26%). 5-7: alto risco (41%). Variáveis: ≥3 FRC, estenose coronária ≥50%, desvio ST, ≥2 episódios angina em 24h, uso de AAS, marcadores elevados, idade ≥65.',
  category: 'score',
  fields: [
    { id: 'idade65', label: '1. Idade ≥ 65 anos', type: 'checkbox' },
    { id: 'fatores3', label: '2. ≥3 fatores de risco CV (HAS, DL, DM, tabagismo, HF)', type: 'checkbox' },
    { id: 'estenose', label: '3. Estenose coronariana ≥50% conhecida', type: 'checkbox', info: 'Cinecoronariografia prévia ou equivalente' },
    { id: 'desviost', label: '4. Desvio do segmento ST no ECG', type: 'checkbox' },
    { id: 'angina', label: '5. ≥2 episódios de angina nas últimas 24 horas', type: 'checkbox' },
    { id: 'aps', label: '6. Uso de AAS nos últimos 7 dias', type: 'checkbox', info: 'Uso de AAS mesmo tomando AAS indica maior risco' },
    { id: 'marcadores', label: '7. Marcadores cardíacos elevados (troponina ou CK-MB)', type: 'checkbox' },
  ],
  calculate: (values) => {
    const total = Object.values(values).filter(Boolean).length;
    const taxas: Record<number, string> = { 0: '~5%', 1: '~5%', 2: '~8%', 3: '~13%', 4: '~20%', 5: '~26%', 6: '~41%', 7: '~41%' };
    const taxa = taxas[Math.min(total, 7)];

    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total <= 2) {
      category = 'Baixo Risco'; severity = 'low';
      recommendations = ['Estratégia conservadora', 'AAS + Heparina de baixo peso', 'Monitorização por 24-48h', 'Troponina seriada'];
    } else if (total <= 4) {
      category = 'Risco Intermediário'; severity = 'moderate';
      recommendations = ['DAPT (AAS + Ticagrelor/Clopidogrel)', 'Anticoagulação com enoxaparina ou fondaparinux', 'Cinecoronariografia em 24-72h', 'UTI Coronariana'];
    } else {
      category = 'Alto Risco'; severity = 'high';
      recommendations = ['Estratégia invasiva URGENTE (<24h)', 'DAPT: AAS + Ticagrelor 180 mg bolus', 'Anticoagulação plena', 'UTI Coronariana obrigatória', 'Considerar inibidor de GP IIb/IIIa'];
    }
    return { value: `${total}/7`, category, interpretation: `TIMI Score: ${total}/7\nRisco de eventos: ${taxa}\n${category}`, severity, recommendations };
  },
  references: ['Antman EM, et al. JAMA. 2000;284(7):835-42', 'Collet JP, et al. Eur Heart J. 2021;42(14):1289-367'],
};

export const CARDIOLOGY_CALCULATORS: Calculator[] = [CHADS2_VASC, FRAMINGHAM, GRACE_SCORE, HEART_SCORE, TIMI_SCORE];
