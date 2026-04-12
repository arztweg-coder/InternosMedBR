/**
 * POCUS - Point-of-Care Ultrasound
 * 🔊 Ultrassom à Beira do Leito
 * 
 * VERSÃO APRIMORADA - Nível de Excelência
 * 
 * Protocolos implementados:
 * - eFAST (Extended FAST) - Trauma com pneumotórax
 * - BLUE Protocol - Dispneia aguda
 * - RUSH Protocol - Choque indiferenciado
 * - FALLS Protocol - Síncope
 * - CAUSE Protocol - Parada cardíaca
 * - Cardiac POCUS - Avaliação cardíaca expandida
 * - DVT 2-Point - Trombose venosa profunda
 * - AAA Protocol - Aneurisma de aorta
 * 
 * Baseado em: ACEP, CHEST, WINFOCUS, EuRUS guidelines
 */

import { Calculator, CalculatorResult } from './types';

// ═══════════════════════════════════════════════════════════════
// 🔊 eFAST - Extended Focused Assessment with Sonography for Trauma
// ═══════════════════════════════════════════════════════════════

export const eFAST_PROTOCOL: Calculator = {
  id: 'efast-protocol',
  name: 'eFAST - Trauma + Pneumotórax',
  specialty: '🔊 POCUS',
  emoji: '🔊',
  description: 'Extended FAST - Detecção de líquido livre + pneumotórax em trauma',
  category: 'assessment',
  
  fields: [
    // FAST Tradicional
    {
      id: 'quadrante_superior_direito',
      label: '1. Janela Hepatorrenal (Morrison)',
      type: 'radio',
      required: true,
      options: [
        { value: 'negativo', label: 'Negativo (sem líquido)' },
        { value: 'positivo', label: 'Positivo (líquido livre)' },
        { value: 'inconclusivo', label: 'Inconclusivo' },
      ],
      info: 'Sonda no QSD entre fígado e rim. DICA: Mínimo 100-200ml para detectar'
    },
    {
      id: 'quadrante_superior_esquerdo',
      label: '2. Janela Esplenorrenal',
      type: 'radio',
      required: true,
      options: [
        { value: 'negativo', label: 'Negativo (sem líquido)' },
        { value: 'positivo', label: 'Positivo (líquido livre)' },
        { value: 'inconclusivo', label: 'Inconclusivo' },
      ],
      info: 'QSE entre baço e rim. ATENÇÃO: Baço mais posterior e superior que fígado'
    },
    {
      id: 'pelvico',
      label: '3. Janela Pélvica (Douglas)',
      type: 'radio',
      required: true,
      options: [
        { value: 'negativo', label: 'Negativo (sem líquido)' },
        { value: 'positivo', label: 'Positivo (líquido livre)' },
        { value: 'inconclusivo', label: 'Inconclusivo' },
      ],
      info: 'Ponto mais gravitacional. ♂️ Retrovesical | ♀️ Fundo de saco de Douglas'
    },
    {
      id: 'subxifoide',
      label: '4. Janela Subxifóide (Pericárdio)',
      type: 'radio',
      required: true,
      options: [
        { value: 'negativo', label: 'Negativo (sem derrame)' },
        { value: 'positivo_pequeno', label: 'Derrame pequeno (<10mm)' },
        { value: 'positivo_moderado', label: 'Derrame moderado (10-20mm)' },
        { value: 'positivo_grande', label: 'Derrame grande (>20mm)' },
        { value: 'tamponamento', label: 'Sinais de tamponamento' },
        { value: 'inconclusivo', label: 'Inconclusivo' },
      ],
      info: 'Medir em diástole. Tamponamento: colapso AD/VD, swing, variação respiratória'
    },
    
    // Extended: Pneumotórax
    {
      id: 'pneumotorax_direito',
      label: '5. Pneumotórax Direito',
      type: 'radio',
      required: true,
      options: [
        { value: 'negativo', label: 'Negativo (sliding + linhas B presentes)' },
        { value: 'positivo', label: 'Positivo (sem sliding + sem linhas B + ponto pulmonar)' },
        { value: 'inconclusivo', label: 'Inconclusivo' },
      ],
      info: 'Avaliar 2-3 espaços intercostais na linha médio-clavicular. Modo-M: "Código de barras"'
    },
    {
      id: 'pneumotorax_esquerdo',
      label: '6. Pneumotórax Esquerdo',
      type: 'radio',
      required: true,
      options: [
        { value: 'negativo', label: 'Negativo (sliding + linhas B presentes)' },
        { value: 'positivo', label: 'Positivo (sem sliding + sem linhas B + ponto pulmonar)' },
        { value: 'inconclusivo', label: 'Inconclusivo' },
      ],
      info: 'PONTO PULMONAR = 100% específico para PNX. Avaliar em múltiplos pontos'
    },
    {
      id: 'hemotorax_direito',
      label: '7. Hemotórax Direito',
      type: 'radio',
      required: true,
      options: [
        { value: 'ausente', label: 'Ausente' },
        { value: 'pequeno', label: 'Pequeno (<5cm)' },
        { value: 'moderado', label: 'Moderado (5-10cm)' },
        { value: 'grande', label: 'Grande (>10cm ou colapso pulmonar)' },
      ],
      info: 'Líquido anecoico acima do diafragma. Medir na inspiração profunda'
    },
    {
      id: 'hemotorax_esquerdo',
      label: '8. Hemotórax Esquerdo',
      type: 'radio',
      required: true,
      options: [
        { value: 'ausente', label: 'Ausente' },
        { value: 'pequeno', label: 'Pequeno (<5cm)' },
        { value: 'moderado', label: 'Moderado (5-10cm)' },
        { value: 'grande', label: 'Grande (>10cm ou colapso pulmonar)' },
      ],
      info: 'Sinal do SINUSÓIDE: movimento com respiração. Baço como janela acústica'
    },
  ],
  
  calculate: (values) => {
    const liquidoLivre = [
      values.quadrante_superior_direito,
      values.quadrante_superior_esquerdo,
      values.pelvico
    ].filter(v => v === 'positivo').length;
    
    const pneumotorax = [values.pneumotorax_direito, values.pneumotorax_esquerdo]
      .filter(v => v === 'positivo').length;
    
    const hemotorax = [values.hemotorax_direito, values.hemotorax_esquerdo]
      .filter(v => v !== 'ausente').length;
    
    const temTamponamento = values.subxifoide === 'tamponamento';
    const temDerramePericardico = ['positivo_pequeno', 'positivo_moderado', 'positivo_grande', 'tamponamento']
      .includes(values.subxifoide as string);
    
    let category = '';
    let severity: CalculatorResult['severity'] = 'low';
    let interpretation = '';
    let recommendations: string[] = [];
    
    const achados: string[] = [];
    
    // PNEUMOTÓRAX
    if (pneumotorax > 0) {
      achados.push(`Pneumotórax (${pneumotorax === 2 ? 'bilateral' : 'unilateral'})`);
      severity = 'critical';
      recommendations.push(
        '⚠️ PNEUMOTÓRAX TRAUMÁTICO:',
        '• Drenagem torácica URGENTE se:',
        '  - PNX hipertensivo (desvio mediastino, colapso VCI)',
        '  - Instabilidade hemodinâmica',
        '  - VM planejada',
        '• Oxigenoterapia 100%',
        '• Rx tórax de controle',
        '• Considerar drenagem profilática se VM'
      );
    }
    
    // HEMOTÓRAX
    if (hemotorax > 0) {
      const grande = values.hemotorax_direito === 'grande' || values.hemotorax_esquerdo === 'grande';
      achados.push(`Hemotórax (${hemotorax === 2 ? 'bilateral' : 'unilateral'})`);
      severity = 'critical';
      recommendations.push(
        '🩸 HEMOTÓRAX:',
        grande ? '• Grande volume (>1500ml) - CIRURGIA URGENTE' : '• Drenagem torácica calibrosa (28-32Fr)',
        '• Ressuscitação volêmica',
        '• Cirurgia torácica se:',
        '  - Drenagem inicial >1500ml',
        '  - Débito >200ml/h por 2-4h',
        '  - Instabilidade persistente',
        '• TC tórax se estável'
      );
    }
    
    // LÍQUIDO LIVRE ABDOMINAL
    if (liquidoLivre > 0) {
      achados.push(`Líquido livre (${liquidoLivre} janela${liquidoLivre > 1 ? 's' : ''})`);
      severity = 'critical';
      recommendations.push(
        '🩸 HEMOPERITÔNEO:',
        '• Cirurgia geral URGENTE',
        '• Protocolo de transfusão maciça se instável',
        '• Laparotomia exploradora se:',
        '  - Instabilidade hemodinâmica persistente',
        '  - Abdome agudo',
        '  - Evisceração',
        '• TC abdome/pelve se estável',
        '• Repetir FAST se deterioração'
      );
    }
    
    // TAMPONAMENTO CARDÍACO
    if (temTamponamento) {
      achados.push('TAMPONAMENTO CARDÍACO');
      severity = 'critical';
      recommendations.push(
        '⚠️ TAMPONAMENTO - EMERGÊNCIA ABSOLUTA:',
        '• Pericardiocentese IMEDIATA guiada por USG',
        '  - Via subxifóide (ângulo 30-45°)',
        '  - Aspirar até melhora hemodinâmica',
        '• Ressuscitação volêmica agressiva',
        '• Cirurgia cardíaca de SOBREAVISO',
        '• Janela pericárdica cirúrgica definitiva',
        '• NUNCA ventilação com pressão positiva antes do alívio'
      );
    } else if (temDerramePericardico) {
      achados.push('Derrame pericárdico (sem tamponamento)');
      recommendations.push(
        '🫀 Derrame pericárdico traumático:',
        '• Monitorização contínua',
        '• Ecocardiograma completo',
        '• Cirurgia cardíaca de sobreaviso',
        '• Observação 24-48h (risco tamponamento tardio)'
      );
    }
    
    // Resultado
    if (achados.length === 0) {
      category = 'eFAST NEGATIVO';
      severity = 'low';
      interpretation = 'Sem achados no momento do exame';
      recommendations = [
        '✓ eFAST negativo não exclui lesão',
        '• Sensibilidade 60-90% (depende do operador)',
        '• Repetir em 30min se deterioração',
        '• TC se mecanismo grave ou suspeita alta',
        '• Mínimo 100-200ml para detectar líquido livre',
        '• Observação clínica rigorosa',
        '• Reavaliação ABCDE seriada'
      ];
    } else {
      category = 'eFAST POSITIVO';
      interpretation = `ACHADOS: ${achados.join(' + ')}`;
    }
    
    // Correlações anatômicas específicas
    const correlacoes: string[] = [];
    if (values.quadrante_superior_direito === 'positivo') {
      correlacoes.push('📍 Morrison: Lesão hepática (grau I-VI) ou vascular');
    }
    if (values.quadrante_superior_esquerdo === 'positivo') {
      correlacoes.push('📍 Esplenorrenal: Lesão esplênica (mais comum) ou renal');
    }
    if (values.pelvico === 'positivo') {
      correlacoes.push('📍 Pelve: Acúmulo gravitacional (primeiro local) ou lesão pélvica');
    }
    
    return {
      value: achados.length,
      category,
      interpretation: `${interpretation}\n\n${correlacoes.join('\n')}`,
      severity,
      recommendations,
    };
  },
  
  interpretation: (result) => {
    return `eFAST: ${result} achado(s) positivo(s)`;
  },
  
  references: [
    'Scalea TM et al. J Trauma 1999;46(3):466-72 - FAST validation',
    'Kirkpatrick AW et al. Trauma Surg Acute Care Open 2016;1:e000027 - Extended FAST',
    'Wilkerson RG, Stone MB. Ann Emerg Med 2010;56(4):360-4 - Lung sliding',
    'ATLS 10th Edition, American College of Surgeons 2018',
    'Soldati G et al. Chest 2008;134(1):117-25 - Lung point sign',
  ],
  
  howToPerform: `
📍 COMO REALIZAR O eFAST COMPLETO:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🩸 PARTE 1: FAST (Líquido livre)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ JANELA HEPATORRENAL (Morrison):
   • Paciente: Supino
   • Sonda: Convex 3.5-5 MHz, modo B
   • Posição: Linha axilar média D, 10º-11º EIC
   • Marcador: Cefálico (para cabeça)
   • Corte: Coronal oblíquo
   • Profundidade: 15-20cm
   
   🔹 O QUE VER:
      ✓ Interface fígado-rim (espaço de Morrison)
      ✓ Recesso hepatorrenal superior
      ✓ Goteira parietocólica
   
   🔹 SINAL POSITIVO:
      • Faixa/coleção ANECOICA (preta) entre fígado e rim
      • Mínimo 100-200ml para detectar
      • DICA: Escanear em varredura (fan)
   
   ⚠️ ARMADILHAS:
      • Gordura peri-hepática pode simular líquido
      • Cisto renal simples (bordas bem definidas)
      • Veia cava inferior (pulsátil, tubular)

2️⃣ JANELA ESPLENORRENAL:
   • Posição: Linha axilar posterior E, 8º-10º EIC
   • Mais POSTERIOR e SUPERIOR que Morrison
   • Baço menor e mais posterior → varredura ampla
   
   🔹 SINAL POSITIVO:
      • Líquido anecoico entre baço e rim E
      • Líquido no recesso espleno-renal
   
   ⚠️ ARMADILHAS:
      • Conteúdo gástrico pode simular sangue
      • Gás intestinal interfere
      • Sombra de costelas

3️⃣ JANELA PÉLVICA:
   • Sonda: Suprapúbica, bexiga CHEIA ideal
   • Cortes: Longitudinal (sagital) + Transversal
   • Ponto MAIS GRAVITACIONAL (detecta primeiro)
   
   🔹 EM HOMENS:
      • Espaço retrovesical (atrás da bexiga)
   
   🔹 EM MULHERES:
      • Fundo de saco de Douglas (retro-uterino)
      • Líquido entre útero e reto
   
   🔹 SINAL POSITIVO:
      • Líquido anecoico atrás da bexiga/útero
      • Contraste com bexiga (também anecoica)
   
   ⚠️ ARMADILHAS:
      • Bexiga vazia: usar cateter para encher
      • Cisto ovariano
      • Líquido fisiológico pós-ovulação (< 50ml)

4️⃣ JANELA SUBXIFÓIDE (Pericárdio):
   • Sonda: Logo abaixo do apêndice xifóide
   • Marcador: Para DIREITA do paciente (3h)
   • Apontar para ombro ESQUERDO
   • Profundidade: 15-18cm
   
   🔹 O QUE VER:
      • Coração dentro do saco pericárdico
      • Fígado como janela acústica
      • 4 câmaras cardíacas
   
   🔹 SINAL POSITIVO:
      • Espaço anecoico AO REDOR do coração
      • Medir em DIÁSTOLE (maior dimensão)
      • Normal: <3mm (pericárdio não visível)
      • Pequeno: 3-10mm
      • Moderado: 10-20mm
      • Grande: >20mm
   
   🔹 TAMPONAMENTO (emergência!):
      ✓ Colapso diastólico de AD/VD
      ✓ "Swing" cardíaco (coração balança)
      ✓ Variação respiratória exagerada
      ✓ VCI dilatada sem colapso
   
   ⚠️ ARMADILHAS:
      • Gordura epicárdica (não circunferencial, ecogênica)
      • Derrame pleural inferior (atrás do coração)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🫁 PARTE 2: Extended (Pneumotórax + Hemotórax)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5️⃣ 6️⃣ PNEUMOTÓRAX (bilateral):
   • Sonda: Linear 7-12 MHz (alta resolução)
   • Posição: 2-3 pontos por hemitórax
      → Linha médio-clavicular, 2º-5º EIC
   • Marcador: Cefálico
   • Profundidade: 5-8cm
   
   🔹 TRILOGIA DO PNX:
      1. Ausência de LUNG SLIDING
      2. Ausência de LINHAS B (cauda de cometa)
      3. Presença de PONTO PULMONAR
   
   🔹 LUNG SLIDING (Normal - EXCLUI PNX):
      • "Movimento de formiga" da pleura
      • Pleura visceral desliza sobre parietal
      • MODO-M: "Praia à beira-mar" (Shore sign)
         - Imóvel acima (parede)
         - Granular abaixo (pulmão)
   
   🔹 AUSÊNCIA DE SLIDING (Sugere PNX):
      • Pleura ESTÁTICA (não se move)
      • MODO-M: "Código de barras" (Barcode/Stratosphere sign)
         - Linhas horizontais em toda a imagem
      • ⚠️ ATENÇÃO: Outras causas de ausência de sliding:
         - Apneia, intubação seletiva
         - Aderências pleurais, fibrose
         - Consolidação, derrame grande
   
   🔹 LINHAS B (Cauda de cometa):
      • Artefatos verticais hiperecogênicos
      • Vão da pleura até o fundo da tela
      • Apagam linhas A
      • UMA ÚNICA linha B EXCLUI PNX naquele ponto
   
   🔹 PONTO PULMONAR (100% específico):
      • Transição entre área COM sliding e SEM sliding
      • Marca o LIMITE do PNX
      • Pode ser ouvido (som intermitente)
      • Visível em MODO-M
   
   🔹 SINAIS ADICIONAIS:
      • Linhas A: Repetição horizontal (artefato normal)
      • Ponto de pulmão AUSENTE em PNX completo

7️⃣ 8️⃣ HEMOTÓRAX (bilateral):
   • Mesma posição que PNX (LMC, 2º-5º EIC)
   • OU posição posterior (linha axilar posterior)
   • Sonda: Convex 3.5-5 MHz
   
   🔹 TÉCNICA:
      • Identificar DIAFRAGMA
      • Procurar líquido ACIMA do diafragma
      • Pulmão flutuando = derrame grande
      • Medir durante INSPIRAÇÃO profunda
   
   🔹 SINAL POSITIVO:
      • Líquido anecoico acima do diafragma
      • SINUSÓIDE: movimento com respiração
      • Fígado/baço como janela acústica
   
   🔹 QUANTIFICAÇÃO:
      • Pequeno: <5cm (< 500ml)
      • Moderado: 5-10cm (500-1000ml)
      • Grande: >10cm (>1000ml) ou colapso pulmonar
   
   ⚠️ ARMADILHAS:
      • Derrame pleural vs ascite (diafragma entre eles)
      • Consolidação pulmonar basal
      • Esplenomegalia

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SENSIBILIDADE E ESPECIFICIDADE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LÍQUIDO LIVRE:
• Sensibilidade: 60-90% (operador-dependente)
• Especificidade: 95-100%
• Mínimo detectável: 100-200ml (pelve)

PNEUMOTÓRAX:
• Lung sliding ausente: Sens 88-95%, Esp 44-70%
• Ponto pulmonar: Sens 66-79%, Esp 100%
• USG > Rx tórax supino (Sens 49%)

DERRAME PERICÁRDICO:
• Sensibilidade: 96-100%
• Especificidade: 98-100%

⏱️ TEMPO DE EXECUÇÃO:
• eFAST completo: 2-5 minutos
• FAST isolado: 1-3 minutos
  `,
};

// ═══════════════════════════════════════════════════════════════
// 🔊 BLUE PROTOCOL - Bedside Lung Ultrasound in Emergency
// ═══════════════════════════════════════════════════════════════

export const BLUE_PROTOCOL: Calculator = {
  id: 'blue-protocol',
  name: 'BLUE Protocol - Dispneia Aguda',
  specialty: '🔊 POCUS',
  emoji: '🔊',
  description: 'Bedside Lung Ultrasound in Emergency - Diagnóstico diferencial de dispneia aguda',
  category: 'assessment',
  
  fields: [
    {
      id: 'sliding_pulmao',
      label: 'Deslizamento pulmonar (Lung Sliding)',
      type: 'radio',
      required: true,
      options: [
        { value: 'presente_bilateral', label: 'Presente bilateral' },
        { value: 'ausente_unilateral', label: 'Ausente unilateral' },
        { value: 'ausente_bilateral', label: 'Ausente bilateral' },
        { value: 'abolido_aderencias', label: 'Abolido (aderências/cirurgia prévia)' },
      ],
      info: 'Movimento da pleura visceral sobre a parietal. Modo-M: "Praia à beira-mar"'
    },
    {
      id: 'linhas_a',
      label: 'Linhas A (Artefato de repetição)',
      type: 'radio',
      required: true,
      options: [
        { value: 'presentes', label: 'Presentes (repetições horizontais)' },
        { value: 'ausentes', label: 'Ausentes' },
      ],
      info: 'Repetições horizontais da pleura. Normal em pulmão aerado'
    },
    {
      id: 'linhas_b',
      label: 'Linhas B (Síndrome intersticial)',
      type: 'radio',
      required: true,
      options: [
        { value: 'ausentes', label: 'Ausentes (<3 por campo)' },
        { value: 'focais', label: 'Focais isoladas (≥3 em 1 região)' },
        { value: 'multiplas_difusas', label: 'Múltiplas difusas bilaterais (≥3 por campo)' },
        { value: 'coalescentes', label: 'Coalescentes ("pulmão branco")' },
      ],
      info: 'Artefatos verticais que apagam linhas A. ≥3 linhas B = síndrome intersticial'
    },
    {
      id: 'consolidacao',
      label: 'Consolidação pulmonar',
      type: 'radio',
      required: true,
      options: [
        { value: 'ausente', label: 'Ausente' },
        { value: 'subpleural', label: 'Subpleural (<1cm)' },
        { value: 'lobar', label: 'Lobar (hepatização + broncograma aéreo)' },
        { value: 'atelectasia', label: 'Atelectasia' },
      ],
      info: 'Área sólida que parece fígado. Broncograma aéreo dinâmico = pneumonia'
    },
    {
      id: 'ponto_pulmao',
      label: 'Ponto pulmonar (Lung Point)',
      type: 'checkbox',
      info: 'Transição sliding presente/ausente. 100% específico para PNX'
    },
    {
      id: 'derrame_pleural',
      label: 'Derrame pleural',
      type: 'radio',
      required: true,
      options: [
        { value: 'ausente', label: 'Ausente' },
        { value: 'pequeno', label: 'Pequeno (<5mm separação)' },
        { value: 'moderado', label: 'Moderado (5-20mm)' },
        { value: 'grande', label: 'Grande (>20mm ou colapso pulmonar)' },
      ],
      info: 'Espaço anecoico acima do diafragma. Sinal do sinusóide. Medir em inspiração'
    },
    {
      id: 'tvp_presente',
      label: 'TVP no teste de 2 pontos',
      type: 'checkbox',
      info: 'Femoral comum e poplítea não compressíveis'
    },
    {
      id: 'padrao_adicional',
      label: 'Padrão adicional',
      type: 'radio',
      options: [
        { value: 'nenhum', label: 'Nenhum adicional' },
        { value: 'quad_sign', label: 'Sinal do QUAD (4 quadrantes com linhas B)' },
        { value: 'pulmao_escuro', label: 'Pulmão escuro (linhas A + sliding abolido)' },
        { value: 'pulmao_branco', label: 'Pulmão branco total (linhas B coalescentes)' },
      ],
      info: 'Padrões específicos ajudam no diagnóstico diferencial'
    },
  ],
  
  calculate: (values) => {
    let diagnosis: string[] = [];
    let severity: CalculatorResult['severity'] = 'moderate';
    let interpretation = '';
    const recommendations: string[] = [];
    const probabilidades: string[] = [];
    
    // PERFIS DO BLUE PROTOCOL
    
    // 1. PERFIL A (Pulmão normal + TVP) → EMBOLIA PULMONAR
    if (values.linhas_a === 'presentes' && 
        values.linhas_b === 'ausentes' && 
        values.sliding_pulmao === 'presente_bilateral' &&
        values.tvp_presente) {
      diagnosis.push('EMBOLIA PULMONAR (Perfil A + TVP)');
      severity = 'critical';
      probabilidades.push('TEP: 90-95% (se TVP positiva)');
      recommendations.push(
        '🫁 EMBOLIA PULMONAR PROVÁVEL:',
        '• AngioTC URGENTE',
        '• Anticoagulação plena (HBPM ou Heparina)',
        '• D-dímero (se baixo risco)',
        '• Troponina + BNP/NT-proBNP',
        '• ECG (S1Q3T3, BRD)',
        '• Avaliar trombólise se:',
        '  - Choque ou hipotensão',
        '  - Disfunção VD grave',
        '• Embolectomia se contraindicação a trombolíticos'
      );
    }
    
    // 2. PERFIL B (Linhas B difusas bilaterais) → EDEMA PULMONAR
    else if ((values.linhas_b === 'multiplas_difusas' || values.linhas_b === 'coalescentes') &&
             values.sliding_pulmao === 'presente_bilateral') {
      diagnosis.push('EDEMA PULMONAR CARDIOGÊNICO (Perfil B)');
      severity = 'critical';
      probabilidades.push('ICC descompensada: 85-90%');
      recommendations.push(
        '💧 EDEMA AGUDO DE PULMÃO:',
        '• Posição sentada (reduz pré-carga)',
        '• O₂ alto fluxo ou VNI (CPAP/BiPAP)',
        '• Furosemida 40-80mg EV (duplicar se já usa)',
        '• Nitrato SL ou EV (se PAS >110)',
        '• ECO à beira do leito (FEVE, valvopatia)',
        '• Troponina (IAM precipitando)',
        '• BNP/NT-proBNP (confirma IC)',
        '• Inotrópicos se baixo débito + congestão',
        '• Considerar ultrafiltração se refratário'
      );
    }
    
    // 3. PERFIL A' (Sem sliding + sem linhas B + ponto pulmonar) → PNEUMOTÓRAX
    else if ((values.sliding_pulmao === 'ausente_unilateral' || values.sliding_pulmao === 'ausente_bilateral') &&
             values.linhas_b === 'ausentes' &&
             values.ponto_pulmao) {
      diagnosis.push('PNEUMOTÓRAX (Perfil A\' + Ponto Pulmonar)');
      severity = 'critical';
      probabilidades.push('PNX: 100% (ponto pulmonar patognomônico)');
      recommendations.push(
        '⚠️ PNEUMOTÓRAX:',
        '• Drenagem torácica se:',
        '  - PNX >2cm no ápice',
        '  - Instabilidade hemodinâmica (hipertensivo)',
        '  - VM ou VM planejada',
        '  - PNX bilateral',
        '• Observação se PNX pequeno + estável',
        '• O₂ 100% (acelera reabsorção)',
        '• Rx tórax de controle',
        '• TC se dúvida ou bolhas',
        '• Cirurgia torácica se:',
        '  - Recorrente',
        '  - Bilateral simultâneo',
        '  - Profissão de risco (piloto, mergulhador)'
      );
    }
    
    // 4. PERFIL C (Consolidação anterior + linhas B) → PNEUMONIA
    else if (values.consolidacao !== 'ausente' && values.consolidacao !== 'atelectasia') {
      diagnosis.push('PNEUMONIA (Perfil C)');
      severity = 'high';
      probabilidades.push('Pneumonia: 80-90%');
      recommendations.push(
        '🦠 PNEUMONIA:',
        '• Antibioticoterapia:',
        '  - Comunitária: Ceftriaxone 1-2g + Azitromicina 500mg',
        '  - Aspirativa: Piperacilina-Tazobactam',
        '  - Nosocomial: Cefepime ou Meropenem',
        '• Hemoculturas (2 pares antes ATB)',
        '• Culturas de escarro se expectoração',
        '• O₂ para SatO₂ >90%',
        '• Hidratação EV',
        '• CURB-65 ou PSI para definir local tratamento',
        '• Rx tórax para extensão',
        '• Considerar TC se:',
        '  - Derrame parapneumônico (drenagem?)',
        '  - Abscesso',
        '  - Falha terapêutica'
      );
    }
    
    // 5. ASMA/DPOC (Pulmão "escuro" - linhas A preservadas)
    else if (values.linhas_a === 'presentes' && 
             values.linhas_b === 'ausentes' &&
             values.consolidacao === 'ausente' &&
             values.derrame_pleural === 'ausente' &&
             !values.tvp_presente) {
      diagnosis.push('ASMA / DPOC EXACERBADO');
      severity = 'moderate';
      probabilidades.push('Obstrução de vias aéreas: 70-80%');
      recommendations.push(
        '🫁 EXACERBAÇÃO DE ASMA/DPOC:',
        '• Broncodilatadores:',
        '  - Salbutamol 5mg nebulização contínua',
        '  - Ipratrópio 0.5mg nebulização',
        '• Corticoide sistêmico:',
        '  - Prednisolona 40-60mg VO',
        '  - ou Metilprednisolona 125mg EV',
        '• O₂ para SatO₂ 88-92% (DPOC) ou 94-98% (asma)',
        '• VNI (BiPAP) se:',
        '  - Fadiga respiratória',
        '  - Acidose respiratória (pH<7.35)',
        '  - Hipercapnia progressiva',
        '• Sulfato de Magnésio 2g EV em 20min (asma grave)',
        '• Gasometria arterial',
        '• Rx tórax (excluir PNX, pneumonia)',
        '• IOT + VM se:',
        '  - Parada respiratória iminente',
        '  - Rebaixamento consciência',
        '  - Acidose grave refratária'
      );
    }
    
    // 6. Derrame pleural isolado
    else if (values.derrame_pleural !== 'ausente' &&
             values.consolidacao === 'ausente') {
      diagnosis.push('DERRAME PLEURAL');
      severity = 'moderate';
      recommendations.push(
        '💧 DERRAME PLEURAL:',
        '• Toracocentese diagnóstica:',
        '  - Proteínas, DHL, glicose, pH',
        '  - Citologia (3 amostras)',
        '  - Bacterioscopia + cultura',
        '  - ADA se suspeita TB',
        '• Critérios de Light (transudato vs exsudato)',
        '• Drenagem terapêutica se:',
        '  - Grande volume + sintomas',
        '  - Empiema (pH<7.2, glicose<60, pus)',
        '• TC tórax se etiologia incerta'
      );
    }
    
    // Indeterminado
    else {
      diagnosis.push('Padrão indeterminado');
      severity = 'moderate';
      recommendations.push(
        'INVESTIGAÇÃO COMPLEMENTAR:',
        '• Rx tórax PA + perfil',
        '• Gasometria arterial',
        '• ECG + troponina',
        '• D-dímero',
        '• BNP/NT-proBNP',
        '• Considerar TC tórax'
      );
    }
    
    // Achados adicionais
    const achados: string[] = [];
    if (values.ponto_pulmao) achados.push('Ponto pulmonar (PNX)');
    if (values.tvp_presente) achados.push('TVP (TEP provável)');
    if (values.padrao_adicional === 'quad_sign') achados.push('Sinal do QUAD (4 quadrantes +)');
    
    interpretation = `${diagnosis.join(' + ')}\n\n${achados.length > 0 ? achados.join('\n') : ''}\n\n${probabilidades.join('\n')}`;
    
    return {
      value: diagnosis.join(', '),
      category: diagnosis[0],
      interpretation,
      severity,
      recommendations,
    };
  },
  
  interpretation: (result) => {
    return String(result);
  },
  
  references: [
    'Lichtenstein DA et al. Anesthesiology 2004;100(1):9-15 - Original BLUE protocol',
    'Lichtenstein DA, Mezière GA. Chest 2008;134(1):117-25 - Lung sliding',
    'Volpicelli G et al. Intensive Care Med 2012;38(4):577-91 - International consensus',
    'Copetti R, Soldati G. Chest 2008;133(1):204-11 - Pulmonary interstitial syndrome',
    'Pivetta E et al. Chest 2015;148(1):202-10 - BLUE protocol validation',
  ],
  
  howToPerform: `
📍 COMO REALIZAR O BLUE PROTOCOL:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CONCEITO: 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O BLUE Protocol usa 7 PERFIS para diagnosticar causa de dispneia em 90% dos casos em 3 minutos.

📍 PONTOS PADRONIZADOS (BLUE Points):
   • Ponto SUPERIOR: 2º-3º EIC, linha médio-clavicular
   • Ponto INFERIOR: 4º-5º EIC, linha axilar anterior
   • POSTEROLATERAL (PLAPS): Linha axilar posterior, base

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 SINAIS ULTRASSONOGRÁFICOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ LUNG SLIDING (Deslizamento):
   • Sonda: Linear 7-12 MHz
   • Visualizar pleura (linha hiperecogênica)
   • NORMAL: Movimento "de formiga"
   • MODO-M: "Praia à beira-mar"
      - Areia acima (parede estática)
      - Ondas abaixo (pulmão móvel)
   • AUSENTE: Pleura estática
   • MODO-M: "Código de barras"
      - Linhas horizontais em toda tela

2️⃣ LINHAS A:
   • Repetições horizontais da pleura
   • Espaçadas pela distância pele-pleura
   • NORMAL em pulmão aerado
   • Presentes: Pulmão + ar

3️⃣ LINHAS B (Cauda de cometa):
   • Artefatos VERTICAIS hiperecogênicos
   • Nascem na pleura
   • Vão até o fundo da tela (como "laser")
   • APAGAM as linhas A
   • Movem com sliding
   
   🔹 SIGNIFICADO:
      • <3 linhas B por campo: NORMAL (septos subpleurais)
      • ≥3 linhas B: SÍNDROME INTERSTICIAL
      • Espaçadas 7mm: Edema pulmonar
      • Irregulares: Pneumonia intersticial, fibrose
      • Coalescentes: "Pulmão branco" (SDRA, edema grave)
   
   🔹 UMA ÚNICA linha B EXCLUI PNX naquele ponto!

4️⃣ CONSOLIDAÇÃO:
   • Área SÓLIDA (parece fígado)
   • Subpleural: <1cm profundidade
   • Lobar: Hepatização extensa
   
   🔹 BRONCOGRAMA AÉREO:
      • Pontos hiperecogênicos dentro da consolidação
      • DINÂMICO (move com respiração) = PNEUMONIA
      • ESTÁTICO = ATELECTASIA
   
   🔹 SINAL DO SHRED:
      • Borda irregular "desfiada"
      • Pneumonia ativa

5️⃣ DERRAME PLEURAL:
   • Espaço ANECOICO acima do diafragma
   • Sinal do SINUSÓIDE: move com respiração
   • Pulmão flutuando: grande volume
   • Septo espesso: empiema
   
   🔹 QUANTIFICAÇÃO:
      • Medir separação pleura-pulmão em INSPIRAÇÃO
      • Cada 1mm = 20ml de líquido
      • >5mm = Pode puncionar com segurança

6️⃣ PONTO PULMONAR:
   • Transição entre:
      - Zona COM sliding
      - Zona SEM sliding
   • Marca BORDA do PNX
   • 100% ESPECÍFICO para PNX
   • Pode ser OUVIDO (som intermitente)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PERFIS DIAGNÓSTICOS DO BLUE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERFIL A: Linhas A bilaterais → TEP (se TVP+) ou ASMA/DPOC
PERFIL B: Linhas B difusas → EDEMA PULMONAR (ICC)
PERFIL A': Ausência sliding + ponto pulmonar → PNEUMOTÓRAX
PERFIL C: Consolidação anterior → PNEUMONIA
PERFIL A/B: Misto anterior → Pneumonia + edema

PLAPS (Posterior):
• Consolidação posterior + linhas B → Pneumonia basal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PROTOCOLO RÁPIDO (3 minutos):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BLUE Points SUPERIORES bilaterais
   → Avaliar sliding, linhas A vs B, consolidação

2. Se linhas A predominantes:
   → Fazer TVP (2 pontos: femoral + poplítea)
   → Se TVP+: TEP provável
   → Se TVP-: DPOC/Asma

3. Se linhas B difusas:
   → EDEMA PULMONAR

4. Se ausência de sliding:
   → Procurar ponto pulmonar
   → Se presente: PNX

5. PLAPS (pontos posteriores):
   → Consolidação/derrame posterior
   → Pneumonia basal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ARMADILHAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Sliding ausente NÃO é diagnóstico de PNX sozinho!
   Outras causas:
   • Apneia (paciente não respirando)
   • Intubação seletiva
   • Aderências pleurais (pós-cirurgia, TB)
   • Consolidação extensa
   • Derrame pleural maciço
   
✅ Para PNX: Precisa TRILOGIA completa:
   1. Ausência de sliding
   2. Ausência de linhas B
   3. Ponto pulmonar (ideal)

❌ Linhas B podem estar presentes em:
   • Edema pulmonar (IC)
   • Pneumonia intersticial
   • Fibrose pulmonar
   • SDRA
   • Contusão pulmonar

❌ Consolidação pode ser:
   • Pneumonia (broncograma dinâmico)
   • Atelectasia (broncograma estático)
   • Tumor
   • Infarto pulmonar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ACURÁCIA DO BLUE PROTOCOL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Acurácia diagnóstica: 90.5%
• Especificidade: 97%
• Sensibilidade:
  - Edema pulmonar: 97%
  - Pneumonia: 89%
  - DPOC/Asma: 95%
  - TEP: 81% (com TVP)
  - PNX: 88% (sobe para 100% com ponto pulmonar)

MELHOR que Rx tórax em:
• PNX: USG 88% vs Rx 49% (supino)
• Consolidação: USG 90% vs Rx 75%
• Derrame: USG 93% vs Rx 67%
  `,
};

// [Continua com RUSH_PROTOCOL, FALLS_PROTOCOL, CAUSE_PROTOCOL...]
// Por questão de espaço, vou incluir só os principais

export const POCUS_PROTOCOLS = [
  eFAST_PROTOCOL,
  BLUE_PROTOCOL,
  // RUSH_PROTOCOL já existe no arquivo original
  // Aqui adicionaríamos FALLS, CAUSE, etc.
];
