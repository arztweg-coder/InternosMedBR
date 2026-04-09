/**
 * pocus-protocols.ts — Protocolos POCUS
 * 🔊 Point-of-Care Ultrasound — BLUE | FAST | RUSH
 */

import { Calculator, CalculatorResult } from './types';

// ── 1. BLUE PROTOCOL ─────────────────────────────────────────────────────────

export const BLUE_PROTOCOL: Calculator = {
  id: 'blue-protocol',
  name: 'BLUE Protocol — Dispneia Aguda',
  specialty: 'POCUS',
  emoji: '🔊',
  description: 'Bedside Lung Ultrasound in Emergency (BLUE Protocol) para diagnóstico diferencial de dispneia aguda à beira do leito. Algoritmo de alta acurácia (90,5%) baseado em 5 padrões ultrassonográficos para identificar pneumotórax, edema pulmonar, pneumonia, DPOC/asma e TEP.',
  tooltip: 'Sliding + Linhas A = DPOC/asma. Linhas B difusas = edema (ICC). Consolidação + Linhas B focais = pneumonia. Ausência sliding + Lung point = pneumotórax. TEP: perfil A + TVP + sem consolidação.',
  category: 'assessment',
  fields: [
    { id: 'sliding', label: 'Lung Sliding (deslizamento pulmonar)', type: 'radio', required: true, options: [{ value: 'bilateral', label: 'Presente bilateral' }, { value: 'ausente_unilateral', label: 'Ausente unilateral' }, { value: 'ausente_bilateral', label: 'Ausente bilateral' }], info: 'Movimento da pleura visceral sobre a parietal — "formiguinhas marchando"' },
    { id: 'linhas_b', label: 'Linhas B (caudas de cometa)', type: 'radio', required: true, options: [{ value: 'ausentes', label: 'Ausentes (<3 por campo)' }, { value: 'focais', label: 'Múltiplas focais (≥3, unilateral)' }, { value: 'difusas', label: 'Múltiplas difusas bilaterais' }], info: 'Artefatos verticais hiperecogênicos da linha pleural até fundo da tela' },
    { id: 'consolidacao', label: 'Consolidação pulmonar', type: 'radio', required: true, options: [{ value: 'ausente', label: 'Ausente' }, { value: 'presente', label: 'Presente (hepatização pulmonar)' }] },
    { id: 'lung_point', label: 'Lung Point (ponto pulmonar)', type: 'checkbox', info: 'Transição entre sliding presente/ausente — PATOGNOMÔNICO de pneumotórax (especificidade 100%)' },
    { id: 'derrame', label: 'Derrame pleural', type: 'radio', required: true, options: [{ value: 'ausente', label: 'Ausente' }, { value: 'pequeno', label: 'Pequeno (<1 cm)' }, { value: 'moderado_grande', label: 'Moderado/Grande (>1 cm)' }] },
  ],
  calculate: (values) => {
    let diagnosis = ''; let severity: CalculatorResult['severity'] = 'moderate'; let recommendations: string[] = [];
    if (values.lung_point || values.sliding === 'ausente_unilateral') {
      diagnosis = 'PNEUMOTÓRAX'; severity = 'critical';
      recommendations = ['⚠️ PNEUMOTÓRAX — avaliação imediata', 'Oxigênio em alto fluxo', 'Drenagem torácica se sintomático ou >2 cm na TC', 'Radiografia de tórax para confirmação', 'Avaliar pneumotórax hipertensivo (instabilidade hemodinâmica)'];
    } else if (values.linhas_b === 'difusas' && values.sliding === 'bilateral') {
      diagnosis = 'EDEMA PULMONAR / ICC'; severity = 'high';
      recommendations = ['Edema pulmonar cardiogênico provável', 'Furosemida IV: 40-80 mg', 'Nitratos se PA adequada (>100 mmHg)', 'VNI (CPAP/BiPAP) se SpO₂ <90%', 'BNP/Pro-BNP + ECG + ecocardiograma'];
    } else if (values.consolidacao === 'presente' && values.linhas_b === 'focais') {
      diagnosis = 'PNEUMONIA'; severity = 'high';
      recommendations = ['Pneumonia confirmada por USG', 'Radiografia de tórax complementar', 'Coleta de hemoculturas antes do ATB', 'Antibioticoterapia empírica', 'Estratificar gravidade (CURB-65)'];
    } else if (values.derrame === 'moderado_grande') {
      diagnosis = 'DERRAME PLEURAL'; severity = 'moderate';
      recommendations = ['Toracocentese diagnóstica se >1 cm', 'Análise do líquido: citologia, bioquímica, cultura', 'Radiografia de tórax', 'Investigar causa: ICC, neoplasia, infecção'];
    } else if (values.sliding === 'bilateral' && values.linhas_b === 'ausentes') {
      diagnosis = 'DPOC / ASMA (padrão obstrutivo)'; severity = 'moderate';
      recommendations = ['SABA inalatório (salbutamol 4-8 puffs com espaçador)', 'Corticoide sistêmico se grave', 'Oxigenioterapia controlada na DPOC', 'Gasometria arterial', 'VNI se hipercapnia'];
    } else {
      diagnosis = 'Padrão Indeterminado'; severity = 'moderate';
      recommendations = ['Radiografia de tórax', 'TC se necessário', 'Reavaliação clínica', 'Repetir BLUE em 30 minutos'];
    }
    return { value: diagnosis, category: diagnosis, interpretation: `Diagnóstico BLUE: ${diagnosis}`, severity, recommendations };
  },
  references: ['Lichtenstein DA, Mezière GA. Chest. 2008;134(1):117-25', 'Volpicelli G, et al. Intensive Care Med. 2012;38(4):577-91'],
  howToPerform: 'Sonda linear 7-10 MHz. Examinar 3 zonas por hemitórax (superior, lateral, PLAPS). Lung sliding: "formiguinhas marchando" na linha pleural. Linhas B: verticais, partem da pleura, apagam linhas A. Lung point: patognomônico de PNX.',
};

// ── 2. FAST PROTOCOL ─────────────────────────────────────────────────────────

export const FAST_PROTOCOL: Calculator = {
  id: 'fast-protocol',
  name: 'FAST — Trauma Abdominal',
  specialty: 'POCUS',
  emoji: '🔊',
  description: 'Focused Assessment with Sonography for Trauma (FAST) para detecção de líquido livre intraperitoneal e hemopericárdio após trauma. Exame rápido (<5 min) com 4 janelas ultrassonográficas. Sensibilidade 73-88% para hemoperitoneu clinicamente significativo.',
  tooltip: 'Avalia 4 janelas: Morrison (hepatorrenal), esplenorrenal, pélvica e subxifóide. FAST positivo = líquido anecoico nas interfaces. Falso negativo em lesões de órgãos sólidos sem sangramento livre.',
  category: 'assessment',
  fields: [
    { id: 'morrison', label: '1. Janela Hepatorrenal (Espaço de Morrison)', type: 'radio', required: true, options: [{ value: 'neg', label: 'Negativo' }, { value: 'pos', label: 'Positivo (líquido livre)' }, { value: 'inc', label: 'Inconclusivo' }], info: 'QSD, entre fígado e rim direito' },
    { id: 'esplenorrenal', label: '2. Janela Esplenorrenal', type: 'radio', required: true, options: [{ value: 'neg', label: 'Negativo' }, { value: 'pos', label: 'Positivo (líquido livre)' }, { value: 'inc', label: 'Inconclusivo' }], info: 'QSE, entre baço e rim esquerdo' },
    { id: 'pelvica', label: '3. Janela Pélvica (Douglas)', type: 'radio', required: true, options: [{ value: 'neg', label: 'Negativo' }, { value: 'pos', label: 'Positivo (líquido livre)' }, { value: 'inc', label: 'Inconclusivo' }], info: 'Suprapúbica, cortes longitudinal e transversal' },
    { id: 'subxifoide', label: '4. Janela Subxifóide (Pericárdio)', type: 'radio', required: true, options: [{ value: 'neg', label: 'Negativo (sem derrame)' }, { value: 'pos', label: 'Positivo (derrame pericárdico)' }, { value: 'inc', label: 'Inconclusivo' }], info: 'Logo abaixo do apêndice xifóide' },
  ],
  calculate: (values) => {
    const positivas = Object.values(values).filter(v => v === 'pos').length;
    const inconclusivas = Object.values(values).filter(v => v === 'inc').length;
    let category = ''; let severity: CalculatorResult['severity'] = 'low'; let recommendations: string[] = [];
    const correlacoes: string[] = [];
    if (values.morrison === 'pos') correlacoes.push('Morrison: suspeita de lesão hepática ou vascular direita');
    if (values.esplenorrenal === 'pos') correlacoes.push('Esplenorrenal: suspeita de lesão esplênica');
    if (values.pelvica === 'pos') correlacoes.push('Pélvica: acúmulo gravitacional ou lesão pélvica');
    if (values.subxifoide === 'pos') correlacoes.push('Pericárdio: hemopericárdio — trauma cardíaco');

    if (positivas > 0) {
      category = `FAST POSITIVO (${positivas} janela${positivas>1?'s':''} positiva${positivas>1?'s':''})`; severity = 'critical';
      recommendations = ['⚠️ HEMORRAGIA INTERNA PROVÁVEL', 'Ativar protocolo de trauma', 'Cirurgia geral URGENTE se instável', 'Protocolo de transfusão maciça (proporção 1:1:1)', 'TC de abdome se estável hemodinamicamente', ...correlacoes];
    } else if (inconclusivas > 0) {
      category = 'FAST INCONCLUSIVO'; severity = 'moderate';
      recommendations = ['Repetir FAST em 30 minutos', 'TC de abdome se disponível e indicado', 'Lavado peritoneal diagnóstico se TC indisponível', 'Monitorização contínua de sinais vitais'];
    } else {
      category = 'FAST NEGATIVO'; severity = 'low';
      recommendations = ['FAST negativo NÃO exclui lesão intra-abdominal', 'Repetir se deterioração clínica', 'TC de abdome se mecanismo grave ou suspeita clínica alta', 'Observação por 6-24h em trauma significativo'];
    }
    return { value: positivas, category, interpretation: `${category}\nJanelas positivas: ${positivas}/4`, severity, recommendations };
  },
  references: ['Scalea TM, et al. J Trauma. 1999;46(3):466-72', 'ATLS 10th Edition. American College of Surgeons, 2018'],
  howToPerform: 'Sonda convex 3,5-5 MHz. Paciente supino. Janela Morrison: LAM direita 10-11° EIC. Esplenorrenal: mais posterior/superior. Pélvica: suprapúbica, 2 cortes. Subxifóide: abaixo do xifóide, apontar para ombro esquerdo.',
};

// ── 3. RUSH PROTOCOL ─────────────────────────────────────────────────────────

export const RUSH_PROTOCOL: Calculator = {
  id: 'rush-protocol',
  name: 'RUSH Protocol — Choque',
  specialty: 'POCUS',
  emoji: '🔊',
  description: 'Rapid Ultrasound in Shock (RUSH) para avaliação hemodinâmica à beira do leito em paciente em choque. Avalia 3 componentes — Bomba (coração), Tanque (volemia) e Tubos (grandes vasos) — para classificar o tipo de choque e guiar ressuscitação.',
  tooltip: 'Bomba: FEVE, VD, pericárdio. Tanque: VCI, FAST. Tubos: Aorta, TVP. Choque cardiogênico: VE ruim. Obstrutivo: VD dilatado (TEP) ou derrame+tamponamento. Hipovolêmico: VCI colapsada. Distributivo: VCI dilatada + VE hipercinético.',
  category: 'assessment',
  fields: [
    { id: 'feve', label: 'BOMBA — Função do VE (FEVE visual)', type: 'radio', required: true, options: [{ value: 'hiper', label: 'Hiperdinâmica (FEVE >65%)' }, { value: 'normal', label: 'Normal (50-65%)' }, { value: 'reduzida', label: 'Reduzida (<50%)' }, { value: 'acinesia', label: 'Acinesia / Para cardíaca' }] },
    { id: 'vd', label: 'BOMBA — Tamanho do VD', type: 'radio', required: true, options: [{ value: 'normal', label: 'Normal (VD < VE)' }, { value: 'dilatado', label: 'Dilatado (VD = VE)' }, { value: 'muito_dilatado', label: 'Muito dilatado (VD > VE)' }] },
    { id: 'pericardio', label: 'BOMBA — Derrame pericárdico', type: 'radio', required: true, options: [{ value: 'ausente', label: 'Ausente' }, { value: 'pequeno', label: 'Pequeno (<1 cm)' }, { value: 'grande', label: 'Grande (>2 cm) com colapso câmaras' }] },
    { id: 'vci', label: 'TANQUE — Veia Cava Inferior', type: 'radio', required: true, options: [{ value: 'colapsada', label: 'Colapsada (<1 cm, >50% colapso)' }, { value: 'normal', label: 'Normal (1,5-2,5 cm, ~50% colapso)' }, { value: 'dilatada', label: 'Dilatada (>2,5 cm, sem colapso)' }] },
    { id: 'fast_pos', label: 'TANQUE — FAST: líquido livre intraperitoneal?', type: 'checkbox' },
    { id: 'aorta', label: 'TUBOS — Aorta abdominal', type: 'radio', required: true, options: [{ value: 'normal', label: 'Normal (<3 cm)' }, { value: 'aneurisma', label: 'Aneurisma (≥3 cm)' }] },
    { id: 'tvp', label: 'TUBOS — TVP (teste de compressão)', type: 'radio', required: true, options: [{ value: 'ausente', label: 'Ausente (veia compressível)' }, { value: 'presente', label: 'Presente (veia não compressível)' }, { value: 'nao', label: 'Não avaliado' }] },
  ],
  calculate: (values) => {
    const diagnoses: string[] = [];
    const recommendations: string[] = [];

    if (values.feve === 'reduzida' || values.feve === 'acinesia') {
      diagnoses.push('CHOQUE CARDIOGÊNICO');
      recommendations.push('💔 Choque Cardiogênico:', '• Inotrópicos: dobutamina 2-20 mcg/kg/min', '• Noradrenalina se PA <65 mmHg', '• Avaliar revascularização se IAM', '• Ecocardiograma completo urgente');
    }
    if (values.pericardio === 'grande') {
      diagnoses.push('TAMPONAMENTO CARDÍACO');
      recommendations.push('⚠️ Tamponamento — PERICARDIOCENTESE URGENTE:', '• Guiada por USG', '• Reposição volêmica enquanto prepara', '• Cirurgia cardíaca de sobreaviso');
    }
    if (values.vd === 'dilatado' || values.vd === 'muito_dilatado') {
      diagnoses.push('CHOQUE OBSTRUTIVO (TEP provável)');
      recommendations.push('🫁 Sobrecarga VD — TEP:', '• AngioTC urgente se estável', '• Anticoagulação plena imediata', '• Trombólise sistêmica se instável e sem contraindicação');
    }
    if (values.vci === 'colapsada') {
      diagnoses.push('CHOQUE HIPOVOLÊMICO');
      recommendations.push('💧 Hipovolemia:', '• Cristaloides 30 mL/kg em 30 min', '• Hemoderivados se sangramento (protocolo 1:1:1)', '• Controlar fonte de hemorragia');
    }
    if (values.aorta === 'aneurisma' && values.fast_pos) {
      diagnoses.push('AAA ROTO');
      recommendations.push('🩸 AAA ROTO — CIRURGIA IMEDIATA:', '• Não elevar PA acima de 90 mmHg', '• Transfusão maciça', '• Cirurgia vascular de emergência');
    }
    if (diagnoses.length === 0 && (values.feve === 'hiper' || values.vci === 'dilatada')) {
      diagnoses.push('CHOQUE DISTRIBUTIVO / SÉPTICO');
      recommendations.push('🦠 Choque Distributivo:', '• Sepsis Bundle: lactato, hemoculturas, ATB em 1h', '• Cristaloides 30 mL/kg', '• Noradrenalina se PAM <65 após ressuscitação');
    }
    if (diagnoses.length === 0) { diagnoses.push('Etiologia indeterminada'); recommendations.push('Reavaliação clínica e laboratorial complementar'); }

    const severity: CalculatorResult['severity'] = 'critical';
    return { value: diagnoses.join(' + '), category: diagnoses[0], interpretation: `Tipo(s) de choque: ${diagnoses.join(', ')}`, severity, recommendations };
  },
  references: ['Perera P, et al. Crit Care Res Pract. 2012;2012:503254', 'Atkinson PR, et al. Emerg Med Clin North Am. 2016;34(4):e1-e20'],
  howToPerform: 'Bomba: janelas subxifóide + paraesternal (eixo longo e curto). Tanque: VCI subxifóide + FAST. Tubos: aorta epigástrica + compressão venosa femoral/poplítea.',
};

export const POCUS_PROTOCOLS: Calculator[] = [BLUE_PROTOCOL, FAST_PROTOCOL, RUSH_PROTOCOL];
