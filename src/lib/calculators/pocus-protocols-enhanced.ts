/**
 * pocus-protocols-enhanced.ts — POCUS Aprimorado
 * 🔊 eFAST + BLUE Protocol — Versão de Excelência
 *
 * Baseado em: ACEP, CHEST, WINFOCUS, EuRUS guidelines
 */

import { Calculator, CalculatorResult } from './types';

// ═══════════════════════════════════════════════════════════════
// 🔊 eFAST — Extended FAST (Trauma + Pneumotórax)
// ═══════════════════════════════════════════════════════════════

export const eFAST_ENHANCED: Calculator = {
  id: 'efast-enhanced',
  name: 'eFAST Completo — Trauma + PNX',
  specialty: 'POCUS',
  emoji: '🔊',
  description: 'Extended FAST aprimorado — detecção de líquido livre, tamponamento, pneumotórax e hemotórax em trauma. 8 janelas completas com correlações anatômicas e técnica detalhada.',
  tooltip: 'Morrison + esplenorrenal + pélvica = hemoperitônio. Subxifóide = pericárdio/tamponamento. Sem sliding + sem linhas B + ponto pulmonar = PNX. Anecoico acima do diafragma = hemotórax.',
  category: 'assessment',
  fields: [
    { id: 'morrison', label: '1. Janela Hepatorrenal (Morrison)', type: 'radio', required: true,
      options: [{ value: 'negativo', label: 'Negativo (sem líquido)' }, { value: 'positivo', label: 'Positivo (líquido livre)' }, { value: 'inconclusivo', label: 'Inconclusivo' }],
      info: 'QSD entre fígado e rim. DICA: mínimo 100–200 mL para detectar' },
    { id: 'esplenorrenal', label: '2. Janela Esplenorrenal', type: 'radio', required: true,
      options: [{ value: 'negativo', label: 'Negativo (sem líquido)' }, { value: 'positivo', label: 'Positivo (líquido livre)' }, { value: 'inconclusivo', label: 'Inconclusivo' }],
      info: 'QSE entre baço e rim. ATENÇÃO: mais posterior e superior que Morrison' },
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
      info: 'Medir em diástole. Tamponamento: colapso AD/VD + swing cardíaco + VCI dilatada sem colapso' },
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
      recommendations.push(
        '⚠️ PNEUMOTÓRAX TRAUMÁTICO:',
        '• Drenagem torácica URGENTE se: instabilidade hemodinâmica / VM / PNX hipertensivo / bilateral',
        '• Oxigenoterapia 100% | Rx tórax controle',
        '• Considerar drenagem profilática se VM planejada'
      );
    }
    if (hemotorax > 0) {
      const grande = values.hemotorax_d === 'grande' || values.hemotorax_e === 'grande';
      achados.push(`Hemotórax (${hemotorax === 2 ? 'bilateral' : 'unilateral'})`);
      severity = 'critical';
      recommendations.push(
        grande ? '🩸 HEMOTÓRAX GRANDE (>1500 mL): CIRURGIA TORÁCICA URGENTE' : '🩸 HEMOTÓRAX: Drenagem torácica calibrosa (28–32 Fr)',
        '• Ressuscitação volêmica | Cirurgia se: drenagem inicial >1500 mL ou débito >200 mL/h por 2–4h'
      );
    }
    if (liquidoLivre > 0) {
      achados.push(`Líquido livre (${liquidoLivre} janela${liquidoLivre > 1 ? 's' : ''})`);
      severity = 'critical';
      const correlacoes: string[] = [];
      if (values.morrison === 'positivo') correlacoes.push('Morrison → lesão hepática ou vascular D');
      if (values.esplenorrenal === 'positivo') correlacoes.push('Esplenorrenal → lesão esplênica (mais comum) ou renal');
      if (values.pelvico === 'positivo') correlacoes.push('Pelve → acúmulo gravitacional ou lesão pélvica');
      recommendations.push(
        '🩸 HEMOPERITÔNIO:',
        '• Cirurgia geral URGENTE se instável',
        '• Protocolo de transfusão maciça (1:1:1)',
        '• TC abdome/pelve se estável | Repetir FAST se deterioração',
        ...correlacoes.map(c => `  📍 ${c}`)
      );
    }
    if (tamponamento) {
      achados.push('TAMPONAMENTO CARDÍACO');
      severity = 'critical';
      recommendations.push(
        '⚠️ TAMPONAMENTO — EMERGÊNCIA ABSOLUTA:',
        '• Pericardiocentese IMEDIATA guiada por USG (via subxifóide 30–45°)',
        '• Reposição volêmica agressiva | Cirurgia cardíaca de sobreaviso',
        '• NUNCA ventilação com pressão positiva antes do alívio'
      );
    } else if (derrPeric) {
      achados.push('Derrame pericárdico (sem tamponamento)');
      recommendations.push('🫀 Derrame pericárdico traumático: monitorização contínua + ECO completo + cirurgia cardíaca de sobreaviso + obs. 24–48h (risco tamponamento tardio)');
    }

    if (achados.length === 0) {
      return {
        value: 0,
        category: 'eFAST NEGATIVO',
        severity: 'low',
        interpretation: 'Sem achados no momento do exame. eFAST negativo NÃO exclui lesão (sens. 60–90%).',
        recommendations: [
          '• Repetir em 30 min se deterioração clínica',
          '• TC se mecanismo grave ou suspeita alta',
          '• Mínimo 100–200 mL para detectar líquido livre',
          '• Observação clínica rigorosa | Reavaliação ABCDE seriada',
        ],
      };
    }

    return { value: achados.length, category: 'eFAST POSITIVO', interpretation: `ACHADOS: ${achados.join(' + ')}`, severity, recommendations };
  },
  references: [
    'Scalea TM et al. J Trauma 1999;46(3):466-72',
    'Kirkpatrick AW et al. Trauma Surg Acute Care Open 2016;1:e000027',
    'Wilkerson RG, Stone MB. Ann Emerg Med 2010;56(4):360-4',
    'ATLS 10th Edition. American College of Surgeons 2018',
    'Soldati G et al. Chest 2008;134(1):117-25',
  ],
  howToPerform: `
eFAST COMPLETO (2–5 minutos):

━━ PARTE 1: FAST (Líquido livre) ━━

1. MORRISON (Hepatorrenal):
   Sonda convex 3.5–5 MHz. QSD, LAM D, 10–11° EIC. Marcador cefálico.
   Profundidade 15–20 cm. Varredura (fan) para não perder líquido.
   POSITIVO: faixa anecoica entre fígado e rim.
   ARMADILHA: gordura peri-hepática ecogênica ≠ líquido.

2. ESPLENORRENAL:
   Mais posterior e SUPERIOR que Morrison. Baço menor → varredura ampla.
   POSITIVO: líquido anecoico entre baço e rim E.
   ARMADILHA: conteúdo gástrico pode simular sangue.

3. PÉLVICA (Douglas):
   Suprapúbica. Bexiga CHEIA (ideal). 2 cortes: longitudinal + transversal.
   ♂ Retrovesical | ♀ Fundo de saco de Douglas.
   ARMADILHA: bexiga vazia → usar cateter para encher.

4. SUBXIFÓIDE (Pericárdio):
   Logo abaixo do xifóide. Marcador à DIREITA. Apontar para ombro E.
   Profundidade 15–18 cm. Fígado como janela acústica.
   Medir derrame em DIÁSTOLE.
   TAMPONAMENTO: colapso diastólico AD/VD + "swing" cardíaco + VCI dilatada sem colapso.
   ARMADILHA: gordura epicárdica não é circunferencial (ecogênica, não anecoica).

━━ PARTE 2: Extended (Pulmão) ━━

5/6. PNEUMOTÓRAX (bilateral):
   Sonda linear 7–12 MHz. 2–3 EIC, linha médio-clavicular. Profundidade 5–8 cm.
   TRILOGIA DO PNX:
   1. Ausência de lung sliding
   2. Ausência de linhas B
   3. Ponto pulmonar (100% específico)

   NORMAL: "formiguinhas marchando" (sliding). Modo-M = "praia à beira-mar".
   PNX: pleura estática. Modo-M = "código de barras".
   UMA ÚNICA linha B EXCLUI PNX naquele ponto!

   ARMADILHA: sliding ausente ≠ PNX sozinho (apneia, intubação seletiva, aderências, consolidação).

7/8. HEMOTÓRAX (bilateral):
   Sonda convex. Linha axilar posterior. Identificar diafragma.
   Procurar anecoico ACIMA do diafragma.
   Medir em INSPIRAÇÃO profunda.
   Sinal do SINUSÓIDE: líquido se move com respiração = derrame confirmado.
   Grande (>10 cm) = colapso pulmonar = cirurgia urgente.

━━ SENSIBILIDADE / ESPECIFICIDADE ━━
• Líquido livre: sens 60–90%, esp 95–100% (mínimo 100–200 mL)
• PNX: ponto pulmonar = esp 100%; sliding ausente = sens 88–95%
• Derrame pericárdico: sens/esp >96%
`,
};

// ═══════════════════════════════════════════════════════════════
// 🔊 BLUE PROTOCOL — Dispneia Aguda (Versão Aprimorada)
// ═══════════════════════════════════════════════════════════════

export const BLUE_ENHANCED: Calculator = {
  id: 'blue-enhanced',
  name: 'BLUE Protocol Completo — Dispneia',
  specialty: 'POCUS',
  emoji: '🔊',
  description: 'BLUE Protocol aprimorado com 6 campos, 6 perfis diagnósticos completos e recomendações detalhadas. Acurácia 90,5% para diagnóstico diferencial de dispneia aguda (pneumotórax, ICC, TEP, pneumonia, DPOC/asma, derrame pleural).',
  tooltip: 'Perfil A + TVP = TEP. Perfil B (linhas B difusas) = ICC. Perfil A\' + ponto pulmonar = PNX. Perfil C (consolidação) = pneumonia. Linhas A bilateral sem TVP = DPOC/asma.',
  category: 'assessment',
  fields: [
    { id: 'sliding_pulmao', label: 'Deslizamento pulmonar (Lung Sliding)', type: 'radio', required: true,
      options: [
        { value: 'presente_bilateral', label: 'Presente bilateral' },
        { value: 'ausente_unilateral', label: 'Ausente unilateral' },
        { value: 'ausente_bilateral', label: 'Ausente bilateral' },
        { value: 'abolido', label: 'Abolido (aderências/cirurgia prévia)' },
      ],
      info: 'Movimento da pleura visceral sobre a parietal. Modo-M: "praia à beira-mar" = normal' },
    { id: 'linhas_b', label: 'Linhas B (Síndrome intersticial)', type: 'radio', required: true,
      options: [
        { value: 'ausentes', label: 'Ausentes (<3 por campo)' },
        { value: 'focais', label: 'Focais isoladas (≥3 em 1 região)' },
        { value: 'multiplas_difusas', label: 'Múltiplas difusas bilaterais' },
        { value: 'coalescentes', label: 'Coalescentes ("pulmão branco")' },
      ],
      info: 'Verticais, nascem na pleura, vão até o fundo da tela, apagam linhas A. ≥3/campo = síndrome intersticial' },
    { id: 'consolidacao', label: 'Consolidação pulmonar', type: 'radio', required: true,
      options: [
        { value: 'ausente', label: 'Ausente' },
        { value: 'subpleural', label: 'Subpleural (<1 cm)' },
        { value: 'lobar', label: 'Lobar (hepatização + broncograma aéreo)' },
        { value: 'atelectasia', label: 'Atelectasia' },
      ],
      info: 'Broncograma dinâmico (move com resp.) = pneumonia | estático = atelectasia' },
    { id: 'ponto_pulmao', label: 'Ponto pulmonar (Lung Point)', type: 'checkbox',
      info: 'Transição sliding presente/ausente — 100% específico para pneumotórax' },
    { id: 'derrame_pleural', label: 'Derrame pleural', type: 'radio', required: true,
      options: [
        { value: 'ausente', label: 'Ausente' },
        { value: 'pequeno', label: 'Pequeno (<5 mm)' },
        { value: 'moderado', label: 'Moderado (5–20 mm)' },
        { value: 'grande', label: 'Grande (>20 mm ou colapso pulmonar)' },
      ],
      info: 'Anecoico acima do diafragma. Sinal do sinusóide = confirma líquido. Medir em inspiração' },
    { id: 'tvp_presente', label: 'TVP no teste de 2 pontos (femoral + poplítea)', type: 'checkbox',
      info: 'Veia não compressível = TVP positiva → TEP provável' },
  ],
  calculate: (values) => {
    let diagnosis = ''; let severity: CalculatorResult['severity'] = 'moderate';
    const recommendations: string[] = [];

    // PNX (Perfil A')
    if ((values.sliding_pulmao === 'ausente_unilateral' || values.sliding_pulmao === 'ausente_bilateral') &&
        values.linhas_b === 'ausentes' && values.ponto_pulmao) {
      diagnosis = 'PNEUMOTÓRAX (Perfil A\' + Ponto Pulmonar)';
      severity = 'critical';
      recommendations.push(
        '⚠️ PNEUMOTÓRAX:',
        '• Drenagem torácica se: >2 cm / instável / VM / bilateral',
        '• O₂ 100% (acelera reabsorção)',
        '• Rx tórax de controle | TC se dúvida ou bolhas',
        '• Ponto pulmonar = 100% específico — diagnóstico definitivo'
      );
    }
    // Edema pulmonar (Perfil B)
    else if ((values.linhas_b === 'multiplas_difusas' || values.linhas_b === 'coalescentes') &&
             values.sliding_pulmao === 'presente_bilateral') {
      diagnosis = 'EDEMA PULMONAR CARDIOGÊNICO (Perfil B)';
      severity = 'critical';
      recommendations.push(
        '💧 EDEMA AGUDO DE PULMÃO:',
        '• Posição sentada (reduz pré-carga) | O₂ alto fluxo ou VNI (CPAP/BiPAP)',
        '• Furosemida 40–80 mg EV (duplicar se já usa)',
        '• Nitrato SL ou EV se PAS >110 mmHg',
        '• ECO à beira do leito (FEVE, valvopatia)',
        '• Troponina (IAM precipitando) | BNP/NT-proBNP',
        '• Inotrópicos se baixo débito + congestão'
      );
    }
    // TEP (Perfil A + TVP)
    else if (values.linhas_b === 'ausentes' && values.sliding_pulmao === 'presente_bilateral' &&
             values.tvp_presente && values.consolidacao === 'ausente') {
      diagnosis = 'EMBOLIA PULMONAR (Perfil A + TVP)';
      severity = 'critical';
      recommendations.push(
        '🫁 EMBOLIA PULMONAR — TEP: 90–95% de probabilidade:',
        '• AngioTC URGENTE | Anticoagulação plena imediata (HBPM ou Heparina)',
        '• D-dímero (se baixo risco pré-teste)',
        '• Troponina + BNP/NT-proBNP | ECG (S1Q3T3, BRD)',
        '• Trombólise sistêmica se: choque / hipotensão / disfunção VD grave',
        '• Embolectomia se contraindicação a trombolíticos'
      );
    }
    // Pneumonia (Perfil C)
    else if (values.consolidacao === 'lobar' || (values.consolidacao === 'subpleural' && values.linhas_b === 'focais')) {
      diagnosis = 'PNEUMONIA (Perfil C)';
      severity = 'high';
      recommendations.push(
        '🦠 PNEUMONIA:',
        '• ATB: Ceftriaxone 1–2 g + Azitromicina 500 mg (comunitária)',
        '• Aspiração: Piperacilina-Tazobactam | Nosocomial: Cefepime/Meropenem',
        '• Hemoculturas (2 pares antes ATB) | CURB-65 ou PSI (definir internação)',
        '• O₂ para SatO₂ >90% | Hidratação EV',
        '• TC se derrame parapneumônico (drenagem?) ou abscesso'
      );
    }
    // Derrame pleural
    else if (values.derrame_pleural !== 'ausente' && values.consolidacao === 'ausente') {
      diagnosis = 'DERRAME PLEURAL';
      severity = 'moderate';
      recommendations.push(
        '💧 DERRAME PLEURAL:',
        '• Toracocentese diagnóstica: proteínas, DHL, glicose, pH, citologia, ADA',
        '• Critérios de Light (transudato vs exsudato)',
        '• Drenagem terapêutica se: grande volume sintomático / empiema (pH<7.2, glicose<60, pus)',
        '• TC tórax se etiologia incerta'
      );
    }
    // DPOC/Asma
    else if (values.linhas_b === 'ausentes' && values.sliding_pulmao === 'presente_bilateral' &&
             values.consolidacao === 'ausente' && values.derrame_pleural === 'ausente') {
      diagnosis = 'ASMA / DPOC EXACERBADO';
      severity = 'moderate';
      recommendations.push(
        '🫁 EXACERBAÇÃO OBSTRUTIVA:',
        '• Salbutamol 5 mg + Ipratrópio 0,5 mg nebulização',
        '• Corticoide: Prednisolona 40–60 mg VO ou Metilprednisolona 125 mg EV',
        '• O₂: 88–92% (DPOC) ou 94–98% (asma)',
        '• VNI (BiPAP) se fadiga / pH<7.35 / hipercapnia progressiva',
        '• Sulfato de Magnésio 2 g EV em 20 min (asma grave)',
        '• Gasometria arterial | Rx tórax (excluir PNX, pneumonia)'
      );
    }
    else {
      diagnosis = 'Padrão indeterminado';
      recommendations.push('Rx tórax | Gasometria arterial | ECG + troponina | D-dímero | BNP/NT-proBNP | Considerar TC tórax');
    }

    return { value: diagnosis, category: diagnosis, interpretation: `BLUE Protocol: ${diagnosis}`, severity, recommendations };
  },
  references: [
    'Lichtenstein DA, Mezière GA. Chest 2008;134(1):117-25',
    'Lichtenstein DA et al. Anesthesiology 2004;100(1):9-15',
    'Volpicelli G et al. Intensive Care Med 2012;38(4):577-91',
    'Pivetta E et al. Chest 2015;148(1):202-10',
    'Copetti R, Soldati G. Chest 2008;133(1):204-11',
  ],
  howToPerform: `
BLUE PROTOCOL (3 minutos):

━━ PONTOS PADRONIZADOS ━━
• Superior: 2–3° EIC, linha médio-clavicular
• Inferior: 4–5° EIC, linha axilar anterior
• PLAPS (posterior): linha axilar posterior, base pulmonar

━━ SINAIS ULTRASSONOGRÁFICOS ━━

LUNG SLIDING:
• Normal: "formiguinhas marchando" na pleura. Modo-M = "praia" (Shore sign)
• Ausente: pleura estática. Modo-M = "código de barras"
• Sliding ausente ≠ PNX sozinho (apneia, intubação seletiva, aderências, consolidação)

LINHAS A:
• Repetições horizontais da pleura, espaçadas regularmente
• Normal em pulmão aerado

LINHAS B (Cauda de cometa):
• Artefatos VERTICAIS hiperecogênicos, partem da pleura, vão até fundo da tela
• Apagam as linhas A | Movem com lung sliding
• <3 linhas B/campo: NORMAL (septos subpleurais)
• ≥3 linhas B: SÍNDROME INTERSTICIAL (ICC, pneumonia, fibrose, SDRA)
• UMA ÚNICA linha B EXCLUI PNX naquele ponto!

CONSOLIDAÇÃO:
• Área sólida (parece fígado = "hepatização")
• Broncograma aéreo DINÂMICO = pneumonia | ESTÁTICO = atelectasia

PONTO PULMONAR:
• Transição entre zona COM sliding e zona SEM sliding
• 100% ESPECÍFICO para PNX
• Marca o LIMITE do PNX

DERRAME PLEURAL:
• Anecoico acima do diafragma
• Sinal do sinusóide: move com respiração
• Cada 1 mm de separação ≈ 20 mL

━━ PERFIS DIAGNÓSTICOS ━━
• Perfil A (linhas A bilateral): DPOC/asma (se TVP–) | TEP (se TVP+)
• Perfil B (linhas B difusas bilaterais): ICC/Edema pulmonar
• Perfil A' (ausência sliding + ponto pulmonar): PNX
• Perfil C (consolidação anterior): Pneumonia
• PLAPS (consolidação/derrame posterior): Pneumonia basal

━━ ACURÁCIA ━━
• Global: 90.5% | Especificidade: 97%
• Edema pulmonar: 97% | Pneumonia: 89% | DPOC/Asma: 95%
• TEP (com TVP): 81% | PNX com ponto pulmonar: 100%
• USG > Rx tórax supino: PNX (88 vs 49%), consolidação (90 vs 75%)
`,
};

export const POCUS_ENHANCED: Calculator[] = [eFAST_ENHANCED, BLUE_ENHANCED];
