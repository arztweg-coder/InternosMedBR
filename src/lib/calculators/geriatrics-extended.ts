/**
 * geriatrics-extended.ts — Escalas Geriátricas Estendidas
 * 👴 Geriatria — MEEM | GDS-15 | Barthel | Pfeffer | SARC-F | FRAIL
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. BARTHEL ───────────────────────────────────────────────────────────────

export const BARTHEL_INDEX: Calculator = {
  id: 'barthel',
  name: 'Índice de Barthel — AVD',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Avaliação de independência em Atividades de Vida Diária (AVD). Mede capacidade funcional em 10 domínios com pontuação 0-100. Amplamente usado para planejamento de reabilitação e definição de necessidade de cuidador.',
  tooltip: 'Pontuação 0-100. 100: independente. 60-99: dependência leve. 40-59: moderada. 20-39: grave. <20: dependência total. Útil para alta hospitalar e elegibilidade para home care.',
  category: 'score',
  fields: [
    { id: 'alimentacao', label: 'Alimentação', type: 'radio', required: true, options: [{ value: 10, label: 'Independente (10)' }, { value: 5, label: 'Necessita ajuda (5)' }, { value: 0, label: 'Dependente (0)' }] },
    { id: 'banho', label: 'Banho', type: 'radio', required: true, options: [{ value: 5, label: 'Independente (5)' }, { value: 0, label: 'Dependente (0)' }] },
    { id: 'higiene', label: 'Higiene pessoal', type: 'radio', required: true, options: [{ value: 5, label: 'Independente (5)' }, { value: 0, label: 'Dependente (0)' }] },
    { id: 'vestuario', label: 'Vestuário', type: 'radio', required: true, options: [{ value: 10, label: 'Independente (10)' }, { value: 5, label: 'Necessita ajuda (5)' }, { value: 0, label: 'Dependente (0)' }] },
    { id: 'intestino', label: 'Controle intestinal', type: 'radio', required: true, options: [{ value: 10, label: 'Continente (10)' }, { value: 5, label: 'Incontinência ocasional (5)' }, { value: 0, label: 'Incontinente (0)' }] },
    { id: 'bexiga', label: 'Controle vesical', type: 'radio', required: true, options: [{ value: 10, label: 'Continente (10)' }, { value: 5, label: 'Incontinência ocasional (5)' }, { value: 0, label: 'Incontinente (0)' }] },
    { id: 'vaso', label: 'Uso do vaso sanitário', type: 'radio', required: true, options: [{ value: 10, label: 'Independente (10)' }, { value: 5, label: 'Necessita ajuda (5)' }, { value: 0, label: 'Dependente (0)' }] },
    { id: 'transferencia', label: 'Transferência cadeira-cama', type: 'radio', required: true, options: [{ value: 15, label: 'Independente (15)' }, { value: 10, label: 'Ajuda mínima (10)' }, { value: 5, label: 'Grande ajuda (5)' }, { value: 0, label: 'Dependente (0)' }] },
    { id: 'mobilidade', label: 'Mobilidade', type: 'radio', required: true, options: [{ value: 15, label: 'Independente (15)' }, { value: 10, label: 'Anda com ajuda (10)' }, { value: 5, label: 'Cadeira de rodas (5)' }, { value: 0, label: 'Imóvel (0)' }] },
    { id: 'escadas', label: 'Escadas', type: 'radio', required: true, options: [{ value: 10, label: 'Independente (10)' }, { value: 5, label: 'Necessita ajuda (5)' }, { value: 0, label: 'Incapaz (0)' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total === 100) {
      category = 'Independente'; severity = 'low';
      recommendations = ['Manter independência com estimulação ativa', 'Atividade física regular', 'Reavaliação anual'];
    } else if (total >= 60) {
      category = 'Dependência Leve'; severity = 'low';
      recommendations = ['Fisioterapia para manter função', 'Adaptações ambientais', 'Cuidador parcial'];
    } else if (total >= 40) {
      category = 'Dependência Moderada'; severity = 'moderate';
      recommendations = ['Reabilitação intensiva', 'Suporte de cuidador contínuo', 'Adaptações domiciliares', 'Avaliar home care'];
    } else if (total >= 20) {
      category = 'Dependência Grave'; severity = 'high';
      recommendations = ['Cuidador em tempo integral', 'Avaliar institucionalização', 'Prevenção de úlceras por pressão'];
    } else {
      category = 'Dependência Total'; severity = 'critical';
      recommendations = ['Cuidados paliativos e suporte familiar', 'Prevenção de TVP, pneumonia e úlceras', 'Avaliar diretivas antecipadas de vontade'];
    }
    return { value: total, category, interpretation: `Barthel: ${total}/100 — ${category}`, severity, recommendations };
  },
  references: ['Mahoney FI, Barthel DW. Md State Med J. 1965;14:61-5', 'Minosso JSM, et al. Acta Paul Enferm. 2010;23(6):796-801'],
};

// ── 2. FRAIL SCALE ───────────────────────────────────────────────────────────

export const FRAIL_SCALE: Calculator = {
  id: 'frail-scale',
  name: 'Escala FRAIL — Fragilidade',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Rastreio rápido de síndrome de fragilidade em idosos com 5 critérios (FRAIL). Prediz risco de quedas, hospitalização, incapacidade e morte. Ferramenta validada pela SBGG para triagem na atenção primária e ambulatorial.',
  tooltip: '0: Robusto. 1-2: Pré-frágil. 3-5: Frágil. Critérios: Fadiga (F), Resistência (R), Ambulação (A), Doenças >5 (I), Perda de peso >5% (L). Pré-fragilidade é reversível com intervenção.',
  category: 'questionnaire',
  fields: [
    { id: 'fadiga', label: 'F — Fadiga: Sente-se cansado(a) a maior parte do tempo?', type: 'checkbox' },
    { id: 'resistencia', label: 'R — Resistência: Dificuldade para subir um lance de escadas?', type: 'checkbox' },
    { id: 'ambulacao', label: 'A — Ambulação: Dificuldade para caminhar 100 metros?', type: 'checkbox' },
    { id: 'doencas', label: 'I — Doenças: Tem 5 ou mais doenças crônicas diagnosticadas?', type: 'checkbox', info: 'HAS, DM, ICC, DPOC, AVC, câncer, artrite, osteoporose...' },
    { id: 'peso', label: 'L — Perda de peso: Perdeu >5% do peso nos últimos 6 meses?', type: 'checkbox' },
  ],
  calculate: (values) => {
    const score = Object.values(values).filter(Boolean).length;
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (score === 0) {
      category = 'Robusto'; severity = 'low';
      recommendations = ['Manter estilo de vida saudável', 'Atividade física aeróbica e resistida', 'Reavaliação anual'];
    } else if (score <= 2) {
      category = 'Pré-Frágil'; severity = 'moderate';
      recommendations = ['Exercícios multicomponentes (força + aeróbico + equilíbrio)', 'Otimizar nutrição: proteína 1,0-1,2 g/kg/dia', 'Revisão medicamentosa — desprescrição', 'Vitamina D se deficiente (<30 ng/mL)', 'Reavaliação semestral'];
    } else {
      category = 'Frágil'; severity = 'high';
      recommendations = ['Avaliação Geriátrica Ampla URGENTE', 'Programa estruturado de exercícios resistidos', 'Suplementação nutricional (1,2-1,5 g/kg/dia de proteína)', 'Manejo de polifarmácia (Critérios de Beers)', 'Prevenção de quedas — ambiente seguro', 'Avaliação social e familiar'];
    }
    return { value: `${score}/5`, category, interpretation: `FRAIL Score: ${score}/5 — ${category}`, severity, recommendations };
  },
  references: ['Morley JE, et al. J Nutr Health Aging. 2012;16(7):601-8', 'Fried LP, et al. J Gerontol A. 2001;56(3):M146-56'],
};

// ── 3. GDS-15 ────────────────────────────────────────────────────────────────

export const GDS_15: Calculator = {
  id: 'gds-15',
  name: 'GDS-15 — Depressão Geriátrica',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Escala de Depressão Geriátrica — versão abreviada com 15 itens. Rastreia sintomas depressivos em idosos com linguagem simples, validada para uso na atenção primária e hospitalar. Não substitui avaliação psiquiátrica.',
  tooltip: 'Pontuação 0-15. ≤5: normal. 6-10: depressão leve. >10: depressão grave. Sensibilidade 92%, especificidade 89%. Aplicar em idosos com queixas de humor, memória ou isolamento.',
  category: 'questionnaire',
  fields: [
    { id: 'q1', label: '1. Está satisfeito(a) com sua vida?', type: 'radio', required: true, options: [{ value: 0, label: 'Sim' }, { value: 1, label: 'Não' }] },
    { id: 'q2', label: '2. Abandonou muitas atividades e interesses?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
    { id: 'q3', label: '3. Sente que sua vida está vazia?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
    { id: 'q4', label: '4. Aborrece-se com frequência?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
    { id: 'q5', label: '5. Sente-se bem disposto(a) a maior parte do tempo?', type: 'radio', required: true, options: [{ value: 0, label: 'Sim' }, { value: 1, label: 'Não' }] },
    { id: 'q6', label: '6. Tem medo de que algo ruim possa lhe acontecer?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
    { id: 'q7', label: '7. Sente-se feliz a maior parte do tempo?', type: 'radio', required: true, options: [{ value: 0, label: 'Sim' }, { value: 1, label: 'Não' }] },
    { id: 'q8', label: '8. Sente-se desamparado(a) com frequência?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
    { id: 'q9', label: '9. Prefere ficar em casa em vez de sair e fazer coisas novas?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
    { id: 'q10', label: '10. Acha que tem mais problemas de memória do que outras pessoas?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
    { id: 'q11', label: '11. Acha que é maravilhoso estar vivo(a) agora?', type: 'radio', required: true, options: [{ value: 0, label: 'Sim' }, { value: 1, label: 'Não' }] },
    { id: 'q12', label: '12. Sente-se inútil da maneira que está agora?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
    { id: 'q13', label: '13. Sente-se cheio(a) de energia?', type: 'radio', required: true, options: [{ value: 0, label: 'Sim' }, { value: 1, label: 'Não' }] },
    { id: 'q14', label: '14. Acha que sua situação é sem esperança?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
    { id: 'q15', label: '15. Acha que a maioria das pessoas está em melhor situação do que você?', type: 'radio', required: true, options: [{ value: 1, label: 'Sim' }, { value: 0, label: 'Não' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total <= 5) {
      category = 'Normal'; severity = 'low';
      recommendations = ['Sem sinais sugestivos de depressão', 'Estimular atividades sociais', 'Reavaliação anual'];
    } else if (total <= 10) {
      category = 'Depressão Leve'; severity = 'moderate';
      recommendations = ['Avaliação psiquiátrica recomendada', 'Psicoterapia (TCC)', 'Atividade física regular', 'Afastar causas orgânicas (TSH, B12)', 'Reavaliação em 1 mês'];
    } else {
      category = 'Depressão Grave'; severity = 'high';
      recommendations = ['Encaminhar URGENTE ao psiquiatra', 'Avaliar risco de suicídio (perguntar diretamente)', 'Antidepressivo: ISRS (Sertralina, Escitalopram)', 'Psicoterapia concomitante', 'Acompanhamento semanal inicial'];
    }
    return { value: `${total}/15`, category, interpretation: `GDS-15: ${total}/15 — ${category}`, severity, recommendations };
  },
  references: ['Yesavage JA, et al. J Psychiatr Res. 1982;17(1):37-49', 'Almeida OP, Almeida SA. Arq Neuropsiquiatr. 1999;57(2B):421-6'],
};

// ── 4. MEEM ──────────────────────────────────────────────────────────────────

export const MEEM: Calculator = {
  id: 'meem',
  name: 'MEEM — Mini-Exame do Estado Mental',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Mini-Exame do Estado Mental (MEEM / MMSE) ajustado por escolaridade para rastreio de declínio cognitivo. Avalia orientação, memória, atenção, linguagem e praxia. Amplamente utilizado em consultório e enfermaria para triagem de demência.',
  tooltip: 'Pontuação 0-30. Pontos de corte variam por escolaridade (Brucki 2003): analfabeto <20, 1-4 anos <25, 5-8 anos <26, 9-11 anos <28, ≥12 anos <29. Sensibilidade ~87% para demência.',
  category: 'questionnaire',
  fields: [
    {
      id: 'escolaridade', label: 'Escolaridade', type: 'radio', required: true,
      options: [{ value: 'analfabeto', label: 'Analfabeto' }, { value: '1-4', label: '1 a 4 anos' }, { value: '5-8', label: '5 a 8 anos' }, { value: '9-11', label: '9 a 11 anos' }, { value: '12+', label: '12 anos ou mais' }],
    },
    { id: 'pontuacao', label: 'Pontuação Total do MEEM', type: 'number', min: 0, max: 30, required: true, info: 'Aplicar o MEEM completo e informar a pontuação (0-30)' },
  ],
  calculate: (values) => {
    const pontos = Number(values.pontuacao);
    const esc = String(values.escolaridade);
    const cutoffs: Record<string, number> = { 'analfabeto': 20, '1-4': 25, '5-8': 26, '9-11': 28, '12+': 29 };
    const corte = cutoffs[esc] ?? 24;
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (pontos >= corte) {
      category = 'Cognição Preservada'; severity = 'low';
      recommendations = ['Cognição dentro da normalidade para escolaridade', 'Estimulação cognitiva (leitura, jogos, socialização)', 'Reavaliação anual'];
    } else {
      category = 'Sugestivo de Declínio Cognitivo'; severity = 'high';
      recommendations = ['Investigar causas reversíveis: B12, TSH, VDRL, glicemia', 'Neuroimagem: TC ou RM de crânio', 'Avaliação neuropsicológica completa (MoCA, CDR)', 'Encaminhar ao neurologista ou geriatra', 'Pesquisar polifarmácia e delirium como causa aguda'];
    }
    return { value: `${pontos}/30`, category, interpretation: `MEEM: ${pontos}/30\nPonto de corte para escolaridade: ${corte}\n${pontos >= corte ? '✓ Normal' : '⚠️ Abaixo do esperado'}`, severity, recommendations };
  },
  references: ['Brucki SMD, et al. Arq Neuropsiquiatr. 2003;61(3B):777-81', 'Folstein MF, et al. J Psychiatr Res. 1975;12(3):189-98'],
};

// ── 5. PFEFFER ───────────────────────────────────────────────────────────────

export const PFEFFER: Calculator = {
  id: 'pfeffer',
  name: 'Escala de Pfeffer — AIVDs',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Functional Activities Questionnaire (FAQ) de Pfeffer para avaliação de Atividades Instrumentais de Vida Diária (AIVDs). Avalia capacidade funcional mais complexa que o Barthel, com forte correlação com comprometimento cognitivo.',
  tooltip: 'Pontuação 0-30. <6: independente. ≥6: sugere dependência/comprometimento cognitivo. Respondido por cuidador ou familiar. Discrimina demência leve de envelhecimento normal.',
  category: 'questionnaire',
  fields: [
    { id: 'q1', label: '1. Manusear dinheiro para compras', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
    { id: 'q2', label: '2. Fazer compras sozinho(a)', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
    { id: 'q3', label: '3. Esquentar água/alimento e apagar o fogo', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
    { id: 'q4', label: '4. Preparar uma refeição completa', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
    { id: 'q5', label: '5. Manter-se informado(a) com notícias', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
    { id: 'q6', label: '6. Prestar atenção e entender TV/rádio', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
    { id: 'q7', label: '7. Lembrar compromissos e medicamentos', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
    { id: 'q8', label: '8. Viajar sozinho(a) para lugares familiares', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
    { id: 'q9', label: '9. Manusear telefone (discar e atender)', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
    { id: 'q10', label: '10. Ficar sozinho(a) em casa com segurança', type: 'radio', required: true, options: [{ value: 0, label: 'Normal (0)' }, { value: 1, label: 'Com dificuldade (1)' }, { value: 2, label: 'Necessita ajuda (2)' }, { value: 3, label: 'Dependente (3)' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total < 6) {
      category = 'Independente'; severity = 'low';
      recommendations = ['Funcionalmente independente nas AIVDs', 'Estimular atividades cognitivas e sociais', 'Reavaliação anual'];
    } else {
      category = 'Dependência / Possível Comprometimento Cognitivo'; severity = 'high';
      recommendations = ['Investigar declínio cognitivo: MEEM, MoCA, CDR', 'Avaliação neuropsicológica completa', 'Suporte de cuidador para AIVDs', 'Encaminhar ao geriatra/neurologista', 'Avaliar segurança domiciliar'];
    }
    return { value: `${total}/30`, category, interpretation: `Pfeffer: ${total}/30\nPonto de corte: ≥6 = dependência\n${category}`, severity, recommendations };
  },
  references: ['Pfeffer RI, et al. J Gerontol. 1982;37(3):323-9', 'Quirino P, et al. Dement Neuropsychol. 2010;4(3):197-202'],
};

// ── 6. SARC-F ────────────────────────────────────────────────────────────────

export const SARC_F: Calculator = {
  id: 'sarc-f',
  name: 'SARC-F — Rastreio de Sarcopenia',
  specialty: 'Geriatria',
  emoji: '👴',
  description: 'Questionário de 5 itens para rastreio rápido de sarcopenia (Strength, Assistance, Rise, Climb, Falls). Validado pelo Consenso Europeu (EWGSOP2) e Consenso Asiático (AWGS). Deve ser seguido de confirmação com medida de força muscular e massa.',
  tooltip: 'Pontuação 0-10. ≥4: rastreio positivo para sarcopenia — confirmar com handgrip <27/16 kg (H/M) e/ou velocidade marcha <0,8 m/s. Prevalência em idosos hospitalizados: 20-40%.',
  category: 'questionnaire',
  fields: [
    { id: 'forca', label: 'S — Força: Dificuldade para levantar/carregar 4,5 kg?', type: 'radio', required: true, options: [{ value: 0, label: 'Nenhuma (0)' }, { value: 1, label: 'Alguma (1)' }, { value: 2, label: 'Muita / incapaz (2)' }] },
    { id: 'marcha', label: 'A — Assistência: Dificuldade para caminhar em uma sala?', type: 'radio', required: true, options: [{ value: 0, label: 'Nenhuma (0)' }, { value: 1, label: 'Alguma (1)' }, { value: 2, label: 'Muita / usa auxílio (2)' }] },
    { id: 'levantar', label: 'R — Rise: Dificuldade para levantar de cadeira/cama?', type: 'radio', required: true, options: [{ value: 0, label: 'Nenhuma (0)' }, { value: 1, label: 'Alguma (1)' }, { value: 2, label: 'Muita / incapaz sem ajuda (2)' }] },
    { id: 'escadas', label: 'C — Climb: Dificuldade para subir 10 degraus?', type: 'radio', required: true, options: [{ value: 0, label: 'Nenhuma (0)' }, { value: 1, label: 'Alguma (1)' }, { value: 2, label: 'Muita / incapaz (2)' }] },
    { id: 'quedas', label: 'F — Falls: Quantas quedas no último ano?', type: 'radio', required: true, options: [{ value: 0, label: 'Nenhuma (0)' }, { value: 1, label: '1-3 quedas (1)' }, { value: 2, label: '≥4 quedas (2)' }] },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s: number, v) => s + Number(v), 0);
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    if (total < 4) {
      category = 'Baixo Risco de Sarcopenia'; severity = 'low';
      recommendations = ['Manter atividade física regular', 'Ingestão proteica adequada (1,0-1,2 g/kg/dia)', 'Reavaliação anual'];
    } else {
      category = 'Rastreio Positivo — Investigar Sarcopenia'; severity = 'high';
      recommendations = ['Avaliar força de preensão palmar (dinamômetro)', 'Velocidade de marcha: 4 metros (corte <0,8 m/s)', 'Composição corporal: DEXA ou BIA', 'Confirmar critérios EWGSOP2 / AWGS 2019', 'Exercícios resistidos OBRIGATÓRIOS', 'Proteína: 1,2-1,5 g/kg/dia (leucina)', 'Vitamina D se <30 ng/mL'];
    }
    return { value: `${total}/10`, category, interpretation: `SARC-F: ${total}/10\nPonto de corte: ≥4 = suspeita de sarcopenia`, severity, recommendations };
  },
  references: ['Malmstrom TK, Morley JE. J Am Med Dir Assoc. 2013;14(8):531-2', 'Cruz-Jentoft AJ, et al. Age Ageing. 2019;48(1):16-31'],
};

export const GERIATRICS_EXTENDED_CALCULATORS: Calculator[] = [
  BARTHEL_INDEX, FRAIL_SCALE, GDS_15, MEEM, PFEFFER, SARC_F,
];
