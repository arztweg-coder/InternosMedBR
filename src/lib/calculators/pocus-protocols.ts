/**
 * pocus-protocols.ts — Protocolos POCUS
 * 🔊 Point-of-Care Ultrasound — eFAST | BLUE | RUSH
 *
 * Baseado em: ACEP, CHEST, WINFOCUS, EuRUS guidelines
 */

import { Calculator, CalculatorResult } from './types';

// ═══════════════════════════════════════════════════════════════
// 🔊 eFAST — Extended FAST (Trauma + Pneumotórax)
// ═══════════════════════════════════════════════════════════════

export const eFAST_PROTOCOL: Calculator = {
  id: 'efast-protocol',
  name: 'eFAST — Trauma + Pneumotórax',
  specialty: 'POCUS',
  emoji: '🔊',
  description: 'Extended Focused Assessment with Sonography for Trauma (eFAST). Detecta líquido livre intraperitoneal, hemopericárdio, pneumotórax e hemotórax em trauma. Exame completo em 2–5 minutos com 8 janelas.',
  tooltip: 'Morrison + esplenorrenal + pélvica = hemoperitônio. Subxifóide = tamponamento. Ausência sliding + sem linhas B + ponto pulmonar = pneumotórax. Anecoico acima do diafragma = hemotórax.',
  category: 'assessment',
  fields: [
    { id: 'morrison', label: '1. Janela Hepatorrenal (Morrison)', type: 'radio', required: true,
      options: [{ value: 'negativo', label: 'Negativo (sem líquido)' }, { value: 'positivo', label: 'Positivo (líquido livre)' }, { value: 'inconclusivo', label: 'Inconclusivo' }],
      info: 'QSD entre fígado e rim. Mínimo 100–200 mL para detectar' },
    { id: 'esplenorrenal', label: '2. Janela Esplenorrenal', type: 'radio', required: true,
      options: [{ value: 'negativo', label: 'Negativo (sem líquido)' }, { value: 'positivo', label: 'Positivo (líquido livre)' }, { value: 'inconclusivo', label: 'Inconclusivo' }],
      info: 'QSE entre baço e rim. Mais posterior e superior que Morrison' },
    { id: 'pelvico', label: '3. Janela Pélvica (Douglas)', type: 'radio', required: true,
      options: [{ value: 'negativo', label: 'Negativo (sem líquido)' }, { value: 'positivo', label: 'Positivo (líquido livre)' }, { value: 'inconclusivo', label: 'Inconclusivo' }],
      info: '♂ Retrovesical | ♀ Fundo de saco de Douglas. Ponto mais gravitacional' },
    { id: 'subxifoide', label: '4. Janela Subxifóide (Pericárdio)', type: 'radio', required: true,
      options: [
        { value: 'negativo', label: 'Negativo (sem derrame)' },
        { value: 'positivo_pequeno', label: 'Derrame pequeno (<10 mm)' },
        { value: 'positivo_moderado', label: 'Derrame moderado (10–20 mm)' },
        { value: 'positivo_grande', label: 'Derrame grande (>20 mm)' },
        { value: 'tamponamento', label: 'Sinais de tamponamento' },
        { value: 'inconclusivo', label: 'Inconclusivo' },
      ],
      info: 'Medir em diástole. Tamponamento: colapso AD/VD + swing + VCI dilatada' },
    { id: 'pneumotorax_d', label: '5. Pneumotórax Direito', type: 'radio', required: true,
      options: [{ value: 'negativo', label: 'Negativo (sliding presente + linhas B visíveis)' }, { value: 'positivo', label: 'Positivo (sem sliding + sem linhas B + ponto pulmonar)' }, { value: 'inconclusivo', label: 'Inconclusivo' }],
      info: '2–3 EIC na LMC. Modo-M: "código de barras" = PNX' },
    { id: 'pneumotorax_e', label: '6. Pneumotórax Esquerdo', type: 'radio', required: true,
      options: [{ value: 'negativo', label: 'Negativo (sliding presente + linhas B visíveis)' }, { value: 'positivo', label: 'Positivo (sem sliding + sem linhas B + ponto pulmonar)' }, { value: 'inconclusivo', label: 'Inconclusivo' }],
      info: 'Ponto pulmonar = 100% específico para PNX' },
    { id: 'hemotorax_d', label: '7. Hemotórax Direito', type: 'radio', required: true,
      options: [{ value: 'ausente', label: 'Ausente' }, { value: 'pequeno', label: 'Pequeno (<5 cm)' }, { value: 'moderado', label: 'Moderado (5–10 cm)' }, { value: 'grande', label: 'Grande (>10 cm ou colapso pulmonar)' }],
      info: 'Anecoico acima do diafragma. Medir na inspiração profunda' },
    { id: 'hemotorax_e', label: '8. Hemotórax Esquerdo', type: 'radio', required: true,
      options: [{ value: 'ausente', label: 'Ausente' }, { value: 'pequeno', label: 'Pequeno (<5 cm)' }, { value: 'moderado', label: 'Moderado (5–10 cm)' }, { value: 'grande', label: 'Grande (>10 cm ou colapso pulmonar)' }],
      info: 'Sinal do sinusóide: movimento com respiração. Baço como janela acústica' },
  ],
  calculate: (values) => {
    const liquidoLivre = ['morrison','esplenorrenal','pelvico'].filter(k => values[k] === 'positivo').length;
    const pnx = ['pneumotorax_d','pneumotorax_e'].filter(k => values[k] === 'positivo').length;
    const hemotorax = ['hemotorax_d','hemotorax_e'].filter(k => values[k] !== 'ausente').length;
    const tamponamento = values.subxifoide === 'tamponamento';
    const derrPeric = ['positivo_pequeno','positivo_moderado','positivo_grande','tamponamento'].includes(String(values.subxifoide));

    const achados: string[] = [];
    const recommendations: string[] = [];
    let severity: CalculatorResult['severity'] = 'low';

    if (pnx > 0) {
      achados.push(`Pneumotórax (${pnx === 2 ? 'bilateral' : 'unilateral'})`);
      severity = 'critical';
      recommendations.push('⚠️ PNEUMOTÓRAX: Drenagem torácica se instável/VM/hipertensivo', 'O₂ 100% | Rx tórax controle | Avaliar drenagem profilática se VM');
    }
    if (hemotorax > 0) {
      const grande = values.hemotorax_d === 'grande' || values.hemotorax_e === 'grande';
      achados.push(`Hemotórax (${hemotorax === 2 ? 'bilateral' : 'unilateral'})`);
      severity = 'critical';
      recommendations.push(
        grande ? '🩸 HEMOTÓRAX GRANDE: Cirurgia torácica urgente se >1500 mL' : '🩸 HEMOTÓRAX: Drenagem calibrosa (28–32 Fr)',
        'Ressuscitação volêmica | Cirurgia se débito >200 mL/h por 2–4h'
      );
    }
    if (liquidoLivre > 0) {
      achados.push(`Líquido livre (${liquidoLivre} janela${liquidoLivre > 1 ? 's' : ''})`);
      severity = 'critical';
      recommendations.push('🩸 HEMOPERITÔNIO: Cirurgia geral urgente se instável', 'Protocolo de transfusão maciça (1:1:1) | TC se estável | Repetir FAST se deterioração');
    }
    if (tamponamento) {
      achados.push('TAMPONAMENTO CARDÍACO');
      severity = 'critical';
      recommendations.push('⚠️ TAMPONAMENTO — EMERGÊNCIA: Pericardiocentese imediata guiada por USG', 'Reposição volêmica agressiva | Cirurgia cardíaca de sobreaviso | Nunca VPP antes do alívio');
    } else if (derrPeric) {
      achados.push('Derrame pericárdico (sem tamponamento)');
      recommendations.push('🫀 Derrame pericárdico traumático: monitorização contínua + ECO completo + cirurgia cardíaca de sobreaviso');
    }

    let category: string;
    let interpretation: string;

    if (achados.length === 0) {
      category = 'eFAST NEGATIVO';
      severity = 'low';
      interpretation = 'Sem achados no momento. eFAST negativo não exclui lesão (sens. 60–90%).';
      recommendations.push('Repetir em 30 min se deterioração clínica', 'TC se mecanismo grave ou suspeita alta', 'Observação rigorosa | Reavaliação ABCDE seriada');
    } else {
      category = 'eFAST POSITIVO';
      interpretation = `ACHADOS: ${achados.join(' + ')}`;
    }

    return { value: achados.length, category, interpretation, severity, recommendations };
  },
  references: [
    'Scalea TM et al. J Trauma 1999;46(3):466-72',
    'Kirkpatrick AW et al. Trauma Surg Acute Care Open 2016;1:e000027',
    'Wilkerson RG, Stone MB. Ann Emerg Med 2010;56(4):360-4',
    'ATLS 10th Edition. American College of Surgeons 2018',
  ],
  howToPerform: `
EFAST COMPLETO (2–5 minutos):

PARTE 1 — FAST (Líquido livre):
1. Morrison (hepatorrenal): QSD, LAM D 10–11° EIC. Sonda convex 3.5–5 MHz. Líquido anecoico entre fígado e rim.
2. Esplenorrenal: Mais posterior/superior que Morrison. Baço menor → varredura ampla.
3. Pélvica: Suprapúbica 2 cortes (longitudinal + transversal). ♂ retrovesical | ♀ fundo de saco Douglas.
4. Subxifóide: Abaixo do xifóide, marcador direita, apontar para ombro E. Medir derrame em diástole.
   → Tamponamento: colapso diastólico AD/VD + swing cardíaco + VCI dilatada sem colapso.

PARTE 2 — Extended (Pulmão):
5/6. Pneumotórax (bilateral): Sonda linear 7–12 MHz. 2–3 EIC, LMC.
   → Normal: lung sliding presente + linhas B visíveis.
   → PNX: ausência de sliding + ausência de linhas B + PONTO PULMONAR (100% específico).
   → Modo-M: "praia" = normal | "código de barras" = PNX.
7/8. Hemotórax (bilateral): Convex 3.5 MHz, posição axilar posterior. Anecoico acima do diafragma.
   → Medir em inspiração profunda. Sinal do sinusóide = derrame confirmado.

ARMADILHAS:
• Sliding ausente ≠ PNX (outras causas: apneia, intubação seletiva, aderências, consolidação extensa)
• Uma única linha B EXCLUI PNX naquele ponto
• Gordura epicárdica ≠ derrame pericárdico (não circunferencial, ecogênica)
`,
};

// ═══════════════════════════════════════════════════════════════
// 🔊 BLUE PROTOCOL — Dispneia Aguda
// ═══════════════════════════════════════════════════════════════

export const BLUE_PROTOCOL: Calculator = {
  id: 'blue-protocol',
  name: 'BLUE Protocol — Dispneia Aguda',
  specialty: 'POCUS',
  emoji: '🔊',
  description: 'Bedside Lung Ultrasound in Emergency (BLUE Protocol). Diagnóstico diferencial de dispneia aguda com acurácia de 90,5%. Identifica pneumotórax, edema pulmonar (ICC), pneumonia, DPOC/asma e TEP à beira do leito em 3 minutos.',
  tooltip: 'Linhas A bilateral + TVP = TEP. Linhas B difusas bilaterais = ICC. Ausência sliding + ponto pulmonar = PNX. Consolidação + linhas B focais = pneumonia. Linhas A + sem TVP + sem consolidação = DPOC/asma.',
  category: 'assessment',
  fields: [
    { id: 'sliding_pulmao', label: 'Deslizamento pulmonar (Lung Sliding)', type: 'radio', required: true,
      options: [
        { value: 'presente_bilateral', label: 'Presente bilateral' },
        { value: 'ausente_unilateral', label: 'Ausente unilateral' },
        { value: 'ausente_bilateral', label: 'Ausente bilateral' },
        { value: 'abolido', label: 'Abolido (aderências/cirurgia prévia)' },
      ],
      info: 'Movimento da pleura visceral sobre a parietal. Modo-M: "praia à beira-mar"' },
    { id: 'linhas_b', label: 'Linhas B (Síndrome intersticial)', type: 'radio', required: true,
      options: [
        { value: 'ausentes', label: 'Ausentes (<3 por campo)' },
        { value: 'focais', label: 'Focais isoladas (≥3 em 1 região)' },
        { value: 'multiplas_difusas', label: 'Múltiplas difusas bilaterais' },
        { value: 'coalescentes', label: 'Coalescentes ("pulmão branco")' },
      ],
      info: 'Artefatos verticais que apagam linhas A. ≥3 linhas B por campo = síndrome intersticial' },
    { id: 'consolidacao', label: 'Consolidação pulmonar', type: 'radio', required: true,
      options: [
        { value: 'ausente', label: 'Ausente' },
        { value: 'subpleural', label: 'Subpleural (<1 cm)' },
        { value: 'lobar', label: 'Lobar (hepatização + broncograma aéreo)' },
        { value: 'atelectasia', label: 'Atelectasia' },
      ],
      info: 'Área sólida que parece fígado. Broncograma aéreo dinâmico = pneumonia' },
    { id: 'ponto_pulmao', label: 'Ponto pulmonar (Lung Point)', type: 'checkbox',
      info: 'Transição sliding presente/ausente — 100% específico para PNX' },
    { id: 'derrame_pleural', label: 'Derrame pleural', type: 'radio', required: true,
      options: [
        { value: 'ausente', label: 'Ausente' },
        { value: 'pequeno', label: 'Pequeno (<5 mm separação)' },
        { value: 'moderado', label: 'Moderado (5–20 mm)' },
        { value: 'grande', label: 'Grande (>20 mm ou colapso pulmonar)' },
      ],
      info: 'Anecoico acima do diafragma. Sinal do sinusóide. Medir em inspiração' },
    { id: 'tvp_presente', label: 'TVP no teste de 2 pontos (femoral + poplítea)', type: 'checkbox',
      info: 'Veia não compressível = TVP positiva' },
  ],
  calculate: (values) => {
    let diagnosis = ''; let severity: CalculatorResult['severity'] = 'moderate';
    const recommendations: string[] = [];

    // 1. PNX (Perfil A')
    if ((values.sliding_pulmao === 'ausente_unilateral' || values.sliding_pulmao === 'ausente_bilateral') &&
        (values.linhas_b === 'ausentes') && values.ponto_pulmao) {
      diagnosis = 'PNEUMOTÓRAX (Perfil A\' + Ponto Pulmonar)';
      severity = 'critical';
      recommendations.push(
        '⚠️ PNEUMOTÓRAX:', '• Drenagem se >2 cm, instável, VM ou bilateral',
        '• O₂ 100% | Rx tórax de controle', '• Ponto pulmonar = 100% específico'
      );
    }
    // 2. Edema pulmonar (Perfil B)
    else if ((values.linhas_b === 'multiplas_difusas' || values.linhas_b === 'coalescentes') &&
             values.sliding_pulmao === 'presente_bilateral') {
      diagnosis = 'EDEMA PULMONAR CARDIOGÊNICO (Perfil B)';
      severity = 'critical';
      recommendations.push(
        '💧 EDEMA AGUDO DE PULMÃO:', '• Posição sentada | O₂ alto fluxo ou VNI (CPAP/BiPAP)',
        '• Furosemida 40–80 mg EV | Nitrato se PAS >110',
        '• ECO à beira do leito | Troponina | BNP/NT-proBNP',
        '• Inotrópicos se baixo débito + congestão'
      );
    }
    // 3. TEP (Perfil A + TVP)
    else if (values.linhas_b === 'ausentes' && values.sliding_pulmao === 'presente_bilateral' &&
             values.tvp_presente && values.consolidacao === 'ausente') {
      diagnosis = 'EMBOLIA PULMONAR (Perfil A + TVP)';
      severity = 'critical';
      recommendations.push(
        '🫁 EMBOLIA PULMONAR PROVÁVEL:', '• AngioTC urgente | Anticoagulação plena imediata',
        '• Troponina + BNP + ECG', '• Trombólise se choque ou disfunção VD grave'
      );
    }
    // 4. Pneumonia (Perfil C)
    else if (values.consolidacao === 'lobar' || (values.consolidacao === 'subpleural' && values.linhas_b === 'focais')) {
      diagnosis = 'PNEUMONIA (Perfil C)';
      severity = 'high';
      recommendations.push(
        '🦠 PNEUMONIA:', '• ATB empírico: Ceftriaxone 1–2g + Azitromicina 500mg (comunitária)',
        '• Hemoculturas antes ATB | CURB-65',
        '• O₂ para SatO₂ >90% | Rx tórax para extensão'
      );
    }
    // 5. Derrame pleural
    else if (values.derrame_pleural !== 'ausente' && values.consolidacao === 'ausente') {
      diagnosis = 'DERRAME PLEURAL';
      severity = 'moderate';
      recommendations.push(
        '💧 DERRAME PLEURAL:', '• Toracocentese diagnóstica (proteínas, DHL, citologia, cultura)',
        '• Critérios de Light | Drenagem se empiema (pH<7.2, glicose<60, pus)'
      );
    }
    // 6. DPOC/Asma
    else if (values.linhas_b === 'ausentes' && values.sliding_pulmao === 'presente_bilateral' &&
             values.consolidacao === 'ausente' && values.derrame_pleural === 'ausente') {
      diagnosis = 'ASMA / DPOC EXACERBADO';
      severity = 'moderate';
      recommendations.push(
        '🫁 EXACERBAÇÃO OBSTRUTIVA:', '• Salbutamol 5 mg + Ipratrópio 0,5 mg nebulização',
        '• Corticoide sistêmico | O₂ 88–92% (DPOC) ou 94–98% (asma)',
        '• VNI se fadiga/acidose/hipercapnia | Gasometria arterial'
      );
    }
    else {
      diagnosis = 'Padrão indeterminado';
      recommendations.push('Rx tórax | Gasometria | ECG + troponina | D-dímero | BNP/NT-proBNP | Considerar TC tórax');
    }

    return { value: diagnosis, category: diagnosis, interpretation: `BLUE Protocol: ${diagnosis}`, severity, recommendations };
  },
  references: [
    'Lichtenstein DA, Mezière GA. Chest 2008;134(1):117-25',
    'Volpicelli G et al. Intensive Care Med 2012;38(4):577-91',
    'Pivetta E et al. Chest 2015;148(1):202-10',
  ],
  howToPerform: `
BLUE PROTOCOL (3 minutos):

PONTOS PADRONIZADOS:
• Superior: 2–3° EIC, linha médio-clavicular
• Inferior: 4–5° EIC, linha axilar anterior
• PLAPS (posterior): linha axilar posterior, base

SINAIS PRINCIPAIS:
• Lung Sliding: "formiguinhas" na pleura. Modo-M = "praia à beira-mar". Ausente = "código de barras"
• Linhas A: horizontais, repetição da pleura. Normal em pulmão aerado
• Linhas B: verticais, nascem na pleura, vão até fundo da tela, apagam linhas A. ≥3/campo = síndrome intersticial
  → UMA ÚNICA linha B EXCLUI PNX naquele ponto!
• Ponto pulmonar: transição sliding presente/ausente. 100% específico para PNX
• Consolidação: área sólida. Broncograma dinâmico = pneumonia | estático = atelectasia

PERFIS DIAGNÓSTICOS:
• Perfil A (linhas A bilateral): DPOC/asma (se sem TVP) | TEP (se TVP +)
• Perfil B (linhas B difusas bilaterais): ICC/edema pulmonar
• Perfil A' (sem sliding + ponto pulmonar): PNX
• Perfil C (consolidação anterior): pneumonia
• PLAPS (consolidação/derrame posterior): pneumonia basal

ARMADILHAS:
• Sliding ausente ≠ PNX sozinho (apneia, intubação seletiva, aderências, consolidação)
• Linhas B: ICC, pneumonia intersticial, fibrose, SDRA
`,
};

// ═══════════════════════════════════════════════════════════════
// 🔊 RUSH PROTOCOL — Choque
// ═══════════════════════════════════════════════════════════════

export const RUSH_PROTOCOL: Calculator = {
  id: 'rush-protocol',
  name: 'RUSH Protocol — Choque',
  specialty: 'POCUS',
  emoji: '🔊',
  description: 'Rapid Ultrasound in Shock (RUSH) para avaliação hemodinâmica à beira do leito em paciente em choque. Avalia Bomba (coração), Tanque (volemia) e Tubos (grandes vasos) para classificar o tipo de choque e guiar ressuscitação.',
  tooltip: 'Bomba: FEVE, VD, pericárdio. Tanque: VCI, FAST. Tubos: Aorta, TVP. Cardiogênico: VE ruim. Obstrutivo: VD dilatado (TEP) ou tamponamento. Hipovolêmico: VCI colapsada. Distributivo: VCI dilatada + VE hipercinético.',
  category: 'assessment',
  fields: [
    { id: 'feve', label: 'BOMBA — Função do VE (FEVE visual)', type: 'radio', required: true,
      options: [{ value: 'hiper', label: 'Hiperdinâmica (FEVE >65%)' }, { value: 'normal', label: 'Normal (50–65%)' }, { value: 'reduzida', label: 'Reduzida (<50%)' }, { value: 'acinesia', label: 'Acinesia / Parada cardíaca' }] },
    { id: 'vd', label: 'BOMBA — Tamanho do VD', type: 'radio', required: true,
      options: [{ value: 'normal', label: 'Normal (VD < VE)' }, { value: 'dilatado', label: 'Dilatado (VD = VE)' }, { value: 'muito_dilatado', label: 'Muito dilatado (VD > VE)' }] },
    { id: 'pericardio', label: 'BOMBA — Derrame pericárdico', type: 'radio', required: true,
      options: [{ value: 'ausente', label: 'Ausente' }, { value: 'pequeno', label: 'Pequeno (<1 cm)' }, { value: 'grande', label: 'Grande (>2 cm) com colapso de câmaras' }] },
    { id: 'vci', label: 'TANQUE — Veia Cava Inferior', type: 'radio', required: true,
      options: [{ value: 'colapsada', label: 'Colapsada (<1 cm, >50% colapso)' }, { value: 'normal', label: 'Normal (1,5–2,5 cm, ~50% colapso)' }, { value: 'dilatada', label: 'Dilatada (>2,5 cm, sem colapso)' }] },
    { id: 'fast_pos', label: 'TANQUE — FAST: líquido livre intraperitoneal?', type: 'checkbox' },
    { id: 'aorta', label: 'TUBOS — Aorta abdominal', type: 'radio', required: true,
      options: [{ value: 'normal', label: 'Normal (<3 cm)' }, { value: 'aneurisma', label: 'Aneurisma (≥3 cm)' }] },
    { id: 'tvp', label: 'TUBOS — TVP (teste de compressão)', type: 'radio', required: true,
      options: [{ value: 'ausente', label: 'Ausente (veia compressível)' }, { value: 'presente', label: 'Presente (veia não compressível)' }, { value: 'nao', label: 'Não avaliado' }] },
  ],
  calculate: (values) => {
    const diagnoses: string[] = [];
    const recommendations: string[] = [];

    if (values.feve === 'reduzida' || values.feve === 'acinesia') {
      diagnoses.push('CHOQUE CARDIOGÊNICO');
      recommendations.push('💔 Cardiogênico:', '• Dobutamina 2–20 mcg/kg/min', '• Noradrenalina se PAM <65', '• Revascularização se IAM | ECO completo urgente');
    }
    if (values.pericardio === 'grande') {
      diagnoses.push('TAMPONAMENTO CARDÍACO');
      recommendations.push('⚠️ TAMPONAMENTO — Pericardiocentese urgente guiada por USG', '• Reposição volêmica enquanto prepara | Cirurgia cardíaca de sobreaviso');
    }
    if (values.vd === 'dilatado' || values.vd === 'muito_dilatado') {
      diagnoses.push('CHOQUE OBSTRUTIVO (TEP provável)');
      recommendations.push('🫁 Sobrecarga VD — TEP:', '• AngioTC urgente se estável', '• Anticoagulação imediata | Trombólise sistêmica se instável');
    }
    if (values.vci === 'colapsada') {
      diagnoses.push('CHOQUE HIPOVOLÊMICO');
      recommendations.push('💧 Hipovolemia:', '• Cristaloides 30 mL/kg em 30 min', '• Hemoderivados se sangramento (1:1:1) | Controlar fonte');
    }
    if (values.aorta === 'aneurisma' && values.fast_pos) {
      diagnoses.push('AAA ROTO');
      recommendations.push('🩸 AAA ROTO — Cirurgia imediata:', '• PA alvo ≤90 mmHg (hipotensão permissiva)', '• Transfusão maciça | Cirurgia vascular de emergência');
    }
    if (diagnoses.length === 0) {
      if (values.feve === 'hiper' || values.vci === 'dilatada') {
        diagnoses.push('CHOQUE DISTRIBUTIVO / SÉPTICO');
        recommendations.push('🦠 Choque Distributivo:', '• Sepsis bundle: lactato + hemoculturas + ATB em 1h', '• Cristaloides 30 mL/kg | Noradrenalina se PAM <65');
      } else {
        diagnoses.push('Etiologia indeterminada');
        recommendations.push('Reavaliação clínica e laboratorial complementar');
      }
    }

    const severity: CalculatorResult['severity'] = 'critical';
    return { value: diagnoses.join(' + '), category: diagnoses[0], interpretation: `Tipo(s) de choque: ${diagnoses.join(', ')}`, severity, recommendations };
  },
  references: [
    'Perera P et al. Crit Care Res Pract 2012;2012:503254',
    'Atkinson PR et al. Emerg Med Clin North Am 2016;34(4):e1-e20',
  ],
  howToPerform: 'BOMBA: janelas subxifóide + paraesternal (eixo longo e curto) — avaliar FEVE visual, tamanho VD, derrame pericárdico. TANQUE: VCI subxifóide (medir calibre e variação respiratória) + FAST (4 janelas). TUBOS: aorta epigástrica (medir diâmetro máximo) + compressão venosa femoral/poplítea.',
};

export const POCUS_PROTOCOLS: Calculator[] = [eFAST_PROTOCOL, BLUE_PROTOCOL, RUSH_PROTOCOL];
