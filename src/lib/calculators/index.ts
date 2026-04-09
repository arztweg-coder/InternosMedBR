/**
 * calculators/index.ts
 * Biblioteca de Calculadoras Clínicas — InterNACIONAL HC-UFG
 * 11 calculadoras organizadas por especialidade
 */

// ─── TIPOS ───────────────────────────────────────────────────────────────────

export interface CalcResult {
  value: number | string;
  label: string;
  interpretation: string;
  risk?: "baixo" | "moderado" | "alto" | "muito-alto" | "normal";
  recommendation?: string;
}

export interface CalculatorDef {
  id: string;
  name: string;
  specialty: string;
  emoji: string;
  description: string;
  reference: string;
}

// ─── CATÁLOGO ────────────────────────────────────────────────────────────────

export const CALCULATORS: CalculatorDef[] = [
  { id: "imc", name: "IMC", specialty: "Geral", emoji: "⚖️", description: "Índice de Massa Corporal", reference: "WHO 2000" },
  { id: "superficie-corporal", name: "Superfície Corporal", specialty: "Geral", emoji: "📐", description: "Fórmula de Mosteller", reference: "Mosteller 1987" },
  { id: "cockcroft-gault", name: "Clearance de Creatinina", specialty: "Nefrologia", emoji: "🫘", description: "Fórmula de Cockcroft-Gault", reference: "Cockcroft & Gault 1976" },
  { id: "glasgow", name: "Escala de Glasgow", specialty: "Neurologia", emoji: "🧠", description: "Escala de Coma de Glasgow", reference: "Teasdale & Jennett 1974" },
  { id: "qsofa", name: "qSOFA", specialty: "UTI / Sepse", emoji: "🚨", description: "Quick SOFA — triagem de sepse", reference: "Singer et al. JAMA 2016" },
  { id: "sofa", name: "SOFA", specialty: "UTI / Sepse", emoji: "🏥", description: "Sequential Organ Failure Assessment", reference: "Vincent et al. 1996" },
  { id: "curb65", name: "CURB-65", specialty: "Infectologia", emoji: "🫁", description: "Gravidade da Pneumonia Comunitária", reference: "Lim et al. Thorax 2003" },
  { id: "wells-tep", name: "Wells TEP", specialty: "Vascular", emoji: "🩸", description: "Probabilidade de Tromboembolismo Pulmonar", reference: "Wells et al. 2000" },
  { id: "wells-dvt", name: "Wells DVT", specialty: "Vascular", emoji: "🦵", description: "Probabilidade de Trombose Venosa Profunda", reference: "Wells et al. 1997" },
  { id: "chads-vasc", name: "CHA₂DS₂-VASc", specialty: "Cardiologia", emoji: "❤️", description: "Risco de AVC na Fibrilação Atrial", reference: "Lip et al. Chest 2010" },
  { id: "framingham", name: "Framingham", specialty: "Cardiologia", emoji: "💊", description: "Risco Cardiovascular em 10 anos", reference: "D'Agostino et al. Circulation 2008" },
];

// ─── 1. IMC ──────────────────────────────────────────────────────────────────

export function calcIMC(pesoKg: number, alturaM: number): CalcResult {
  const imc = pesoKg / (alturaM * alturaM);
  const v = parseFloat(imc.toFixed(1));

  let label: string;
  let risk: CalcResult["risk"];
  let recommendation: string;

  if (v < 18.5) {
    label = "Abaixo do peso"; risk = "moderado";
    recommendation = "Avaliação nutricional recomendada.";
  } else if (v < 25) {
    label = "Peso normal"; risk = "baixo";
    recommendation = "Manter hábitos saudáveis.";
  } else if (v < 30) {
    label = "Sobrepeso"; risk = "moderado";
    recommendation = "Orientação nutricional e atividade física.";
  } else if (v < 35) {
    label = "Obesidade Grau I"; risk = "alto";
    recommendation = "Tratamento multidisciplinar indicado.";
  } else if (v < 40) {
    label = "Obesidade Grau II"; risk = "alto";
    recommendation = "Avaliação para tratamento intensivo.";
  } else {
    label = "Obesidade Grau III (Mórbida)"; risk = "muito-alto";
    recommendation = "Avaliação cirúrgica pode ser indicada.";
  }

  return { value: v, label, interpretation: `IMC: ${v} kg/m²`, risk, recommendation };
}

// ─── 2. SUPERFÍCIE CORPORAL (Mosteller) ─────────────────────────────────────

export function calcSuperficieCorporal(pesoKg: number, alturaCm: number): CalcResult {
  const sc = Math.sqrt((pesoKg * alturaCm) / 3600);
  const v = parseFloat(sc.toFixed(2));
  return {
    value: v,
    label: `${v} m²`,
    interpretation: "Superfície Corporal (Mosteller)",
    risk: "normal",
    recommendation: "Utilizado para cálculo de doses de quimioterapia e pediatria.",
  };
}

// ─── 3. CLEARANCE DE CREATININA (Cockcroft-Gault) ────────────────────────────

export function calcCockcroftGault(
  idadeAnos: number,
  pesoKg: number,
  creatininaSerica: number, // mg/dL
  sexo: "M" | "F"
): CalcResult {
  let clcr = ((140 - idadeAnos) * pesoKg) / (72 * creatininaSerica);
  if (sexo === "F") clcr *= 0.85;
  const v = parseFloat(clcr.toFixed(1));

  let label: string;
  let risk: CalcResult["risk"];
  let recommendation: string;

  if (v >= 90) {
    label = "Normal (G1)"; risk = "baixo";
    recommendation = "Sem restrição de doses na maioria dos medicamentos.";
  } else if (v >= 60) {
    label = "Levemente reduzido (G2)"; risk = "baixo";
    recommendation = "Ajuste de dose para alguns medicamentos.";
  } else if (v >= 45) {
    label = "Moderadamente reduzido (G3a)"; risk = "moderado";
    recommendation = "Ajuste de dose necessário para vários medicamentos.";
  } else if (v >= 30) {
    label = "Moderadamente reduzido (G3b)"; risk = "moderado";
    recommendation = "Ajuste de dose obrigatório. Evitar nefrotóxicos.";
  } else if (v >= 15) {
    label = "Gravemente reduzido (G4)"; risk = "alto";
    recommendation = "Restrição severa de doses. Preparação para TRS.";
  } else {
    label = "Falência Renal (G5)"; risk = "muito-alto";
    recommendation = "Diálise ou transplante indicado.";
  }

  return { value: v, label, interpretation: `ClCr: ${v} mL/min`, risk, recommendation };
}

// ─── 4. GLASGOW ───────────────────────────────────────────────────────────────

export function calcGlasgow(ocular: number, verbal: number, motor: number): CalcResult {
  const total = ocular + verbal + motor;

  let label: string;
  let risk: CalcResult["risk"];
  let recommendation: string;

  if (total >= 13) {
    label = "Leve"; risk = "baixo";
    recommendation = "Monitorização clínica. Avaliar indicação de TC de crânio.";
  } else if (total >= 9) {
    label = "Moderado"; risk = "moderado";
    recommendation = "Internação hospitalar. Neuroimagem e avaliação neurológica.";
  } else {
    label = "Grave (≤8: intubação indicada)"; risk = "muito-alto";
    recommendation = "Intubação orotraqueal e UTI. Tomografia urgente.";
  }

  return {
    value: total,
    label,
    interpretation: `Glasgow: ${total}/15 (O${ocular} V${verbal} M${motor})`,
    risk,
    recommendation,
  };
}

// ─── 5. qSOFA ────────────────────────────────────────────────────────────────

export function calcQSOFA(
  fr: boolean,       // FR ≥ 22 irpm
  consciencia: boolean, // Alteração de consciência
  pas: boolean       // PAS ≤ 100 mmHg
): CalcResult {
  const total = [fr, consciencia, pas].filter(Boolean).length;

  const positivo = total >= 2;
  return {
    value: `${total}/3`,
    label: positivo ? "qSOFA POSITIVO" : "qSOFA Negativo",
    interpretation: positivo
      ? "Alta probabilidade de disfunção orgânica"
      : "Baixo risco de disfunção orgânica",
    risk: positivo ? "muito-alto" : "baixo",
    recommendation: positivo
      ? "Investigar sepse. Coletar lactato e culturas. Acionar UTI."
      : "Monitorizar. Reavaliar se deterioração clínica.",
  };
}

// ─── 6. SOFA ─────────────────────────────────────────────────────────────────

export function calcSOFA(
  respiratorio: number,  // PaO2/FiO2: 0-4
  coagulacao: number,    // Plaquetas: 0-4
  hepatico: number,      // Bilirrubinas: 0-4
  cardiovascular: number,// PAM/vasopressor: 0-4
  neurologico: number,   // Glasgow: 0-4
  renal: number          // Creatinina/débito: 0-4
): CalcResult {
  const total = respiratorio + coagulacao + hepatico + cardiovascular + neurologico + renal;

  let mortalidade: string;
  let risk: CalcResult["risk"];

  if (total < 2) {
    mortalidade = "< 10%"; risk = "baixo";
  } else if (total < 6) {
    mortalidade = "10 – 20%"; risk = "moderado";
  } else if (total < 10) {
    mortalidade = "20 – 40%"; risk = "alto";
  } else if (total < 13) {
    mortalidade = "40 – 50%"; risk = "muito-alto";
  } else {
    mortalidade = "> 50%"; risk = "muito-alto";
  }

  return {
    value: total,
    label: `Mortalidade estimada: ${mortalidade}`,
    interpretation: `SOFA: ${total}/24`,
    risk,
    recommendation: total >= 2
      ? "Critério de disfunção orgânica por sepse. Internação em UTI indicada."
      : "Sem critério de disfunção orgânica no momento.",
  };
}

// ─── 7. CURB-65 ──────────────────────────────────────────────────────────────

export function calcCURB65(
  confusao: boolean,   // Confusão mental aguda
  ureia: boolean,      // Ureia > 7 mmol/L (> 42 mg/dL)
  fr: boolean,         // FR ≥ 30 irpm
  pa: boolean,         // PAS < 90 ou PAD ≤ 60
  idade: boolean       // Idade ≥ 65 anos
): CalcResult {
  const total = [confusao, ureia, fr, pa, idade].filter(Boolean).length;

  let label: string;
  let mortalidade: string;
  let risk: CalcResult["risk"];
  let recommendation: string;

  if (total <= 1) {
    label = "Baixo risco"; mortalidade = "< 3%"; risk = "baixo";
    recommendation = "Tratamento ambulatorial pode ser considerado.";
  } else if (total === 2) {
    label = "Risco moderado"; mortalidade = "3 – 15%"; risk = "moderado";
    recommendation = "Internação hospitalar recomendada.";
  } else if (total === 3) {
    label = "Alto risco"; mortalidade = "15 – 30%"; risk = "alto";
    recommendation = "Internação hospitalar. Avaliar necessidade de UTI.";
  } else {
    label = "Muito alto risco"; mortalidade = "> 30%"; risk = "muito-alto";
    recommendation = "UTI obrigatória. Monitorização intensiva.";
  }

  return {
    value: `${total}/5`,
    label,
    interpretation: `CURB-65: ${total} — Mortalidade: ${mortalidade}`,
    risk,
    recommendation,
  };
}

// ─── 8. WELLS TEP ────────────────────────────────────────────────────────────

export function calcWellsTEP(
  sinaisTVP: boolean,         // +3
  diagnosticoAlternativo: boolean, // -2 se alternativo mais provável
  fcAcima100: boolean,        // +1.5
  imobilizacao: boolean,      // +1.5
  tvePrevia: boolean,         // +1.5
  hemoptise: boolean,         // +1
  malignidade: boolean        // +1
): CalcResult {
  let total = 0;
  if (sinaisTVP) total += 3;
  if (!diagnosticoAlternativo) total += 3; // TEP mais provável que alternativo
  if (fcAcima100) total += 1.5;
  if (imobilizacao) total += 1.5;
  if (tvePrevia) total += 1.5;
  if (hemoptise) total += 1;
  if (malignidade) total += 1;

  let label: string;
  let risk: CalcResult["risk"];
  let recommendation: string;

  if (total <= 1) {
    label = "Probabilidade Baixa (~10%)"; risk = "baixo";
    recommendation = "D-dímero negativo exclui TEP. Investigar diagnóstico alternativo.";
  } else if (total <= 6) {
    label = "Probabilidade Moderada (~30%)"; risk = "moderado";
    recommendation = "D-dímero + AngioTC se positivo.";
  } else {
    label = "Probabilidade Alta (~65%)"; risk = "muito-alto";
    recommendation = "AngioTC imediata. Iniciar anticoagulação se sem contraindicação.";
  }

  return {
    value: total.toFixed(1),
    label,
    interpretation: `Wells TEP: ${total.toFixed(1)} pontos`,
    risk,
    recommendation,
  };
}

// ─── 9. WELLS DVT ────────────────────────────────────────────────────────────

export function calcWellsDVT(
  cancerAtivo: boolean,         // +1
  paralisiaMembro: boolean,     // +1
  acamado3dias: boolean,        // +1
  dolorVeiasProfundas: boolean, // +1
  panturrilhaEdema: boolean,    // +1
  edemaColateral: boolean,      // +1
  tvePrevia: boolean,           // +1
  diagAlternativo: boolean      // -2 se alternativo mais provável
): CalcResult {
  let total = 0;
  if (cancerAtivo) total += 1;
  if (paralisiaMembro) total += 1;
  if (acamado3dias) total += 1;
  if (dolorVeiasProfundas) total += 1;
  if (panturrilhaEdema) total += 1;
  if (edemaColateral) total += 1;
  if (tvePrevia) total += 1;
  if (diagAlternativo) total -= 2;

  let label: string;
  let risk: CalcResult["risk"];
  let recommendation: string;

  if (total <= 0) {
    label = "Probabilidade Baixa (~5%)"; risk = "baixo";
    recommendation = "D-dímero negativo exclui TVP.";
  } else if (total <= 2) {
    label = "Probabilidade Moderada (~17%)"; risk = "moderado";
    recommendation = "D-dímero positivo → US Doppler venoso.";
  } else {
    label = "Probabilidade Alta (~53%)"; risk = "alto";
    recommendation = "US Doppler venoso imediato. Iniciar anticoagulação.";
  }

  return {
    value: total,
    label,
    interpretation: `Wells DVT: ${total} pontos`,
    risk,
    recommendation,
  };
}

// ─── 10. CHA₂DS₂-VASc ───────────────────────────────────────────────────────

export function calcCHADS2VASc(
  icc: boolean,          // +1
  hipertensao: boolean,  // +1
  idade75: boolean,      // +2
  diabetes: boolean,     // +1
  avcPrevio: boolean,    // +2
  doencaVascular: boolean, // +1
  idade65_74: boolean,   // +1
  sexoFeminino: boolean  // +1
): CalcResult {
  let total = 0;
  if (icc) total += 1;
  if (hipertensao) total += 1;
  if (idade75) total += 2;
  if (diabetes) total += 1;
  if (avcPrevio) total += 2;
  if (doencaVascular) total += 1;
  if (idade65_74) total += 1;
  if (sexoFeminino) total += 1;

  let avcAnual: string;
  let label: string;
  let risk: CalcResult["risk"];
  let recommendation: string;

  if (total === 0) {
    avcAnual = "0%"; label = "Risco muito baixo"; risk = "baixo";
    recommendation = "Anticoagulação não indicada rotineiramente.";
  } else if (total === 1) {
    avcAnual = "~1.3%"; label = "Risco baixo"; risk = "baixo";
    recommendation = "Considerar anticoagulação (avaliação individual).";
  } else if (total === 2) {
    avcAnual = "~2.2%"; label = "Risco moderado"; risk = "moderado";
    recommendation = "Anticoagulação oral indicada (NOAC preferencial).";
  } else {
    avcAnual = `~${(total * 1.5).toFixed(1)}%`; label = "Risco alto"; risk = "alto";
    recommendation = "Anticoagulação oral obrigatória. NOAC preferencial.";
  }

  return {
    value: `${total}/9`,
    label,
    interpretation: `CHA₂DS₂-VASc: ${total} — AVC anual: ${avcAnual}`,
    risk,
    recommendation,
  };
}

// ─── 11. FRAMINGHAM (Simplificado) ───────────────────────────────────────────

export function calcFramingham(
  idade: number,
  sexo: "M" | "F",
  colesterolTotal: number, // mg/dL
  hdl: number,             // mg/dL
  pas: number,             // mmHg
  hipertensaoTratada: boolean,
  fumante: boolean,
  diabetes: boolean
): CalcResult {
  // Cálculo simplificado baseado no Framingham Risk Score (ATP III)
  let pontos = 0;

  // Idade
  if (sexo === "M") {
    if (idade < 35) pontos -= 1;
    else if (idade <= 39) pontos += 0;
    else if (idade <= 44) pontos += 1;
    else if (idade <= 49) pontos += 2;
    else if (idade <= 54) pontos += 3;
    else if (idade <= 59) pontos += 4;
    else if (idade <= 64) pontos += 5;
    else if (idade <= 69) pontos += 6;
    else pontos += 7;
  } else {
    if (idade < 35) pontos -= 9;
    else if (idade <= 39) pontos -= 4;
    else if (idade <= 44) pontos += 0;
    else if (idade <= 49) pontos += 3;
    else if (idade <= 54) pontos += 6;
    else if (idade <= 59) pontos += 8;
    else if (idade <= 64) pontos += 10;
    else if (idade <= 69) pontos += 11;
    else pontos += 13;
  }

  // Colesterol total
  if (colesterolTotal < 160) pontos -= 3;
  else if (colesterolTotal < 200) pontos += 0;
  else if (colesterolTotal < 240) pontos += 1;
  else if (colesterolTotal < 280) pontos += 2;
  else pontos += 3;

  // HDL
  if (hdl >= 60) pontos -= 2;
  else if (hdl >= 50) pontos -= 1;
  else if (hdl >= 40) pontos += 0;
  else pontos += 2;

  // PAS
  if (!hipertensaoTratada) {
    if (pas < 120) pontos += 0;
    else if (pas < 130) pontos += 0;
    else if (pas < 140) pontos += 1;
    else if (pas < 160) pontos += 2;
    else pontos += 3;
  } else {
    if (pas < 120) pontos += 0;
    else if (pas < 130) pontos += 2;
    else if (pas < 140) pontos += 3;
    else if (pas < 160) pontos += 4;
    else pontos += 5;
  }

  // Fatores
  if (fumante) pontos += 2;
  if (diabetes) pontos += 2;

  // Converter pontos → risco (% 10 anos) — tabela simplificada
  const tabelaM: Record<number, number> = {
    "-3": 1, "-2": 1, "-1": 2, "0": 3, "1": 4, "2": 5, "3": 6, "4": 7, "5": 8,
    "6": 10, "7": 13, "8": 16, "9": 20, "10": 25, "11": 31, "12": 37, "13": 45,
  };
  const tabelaF: Record<number, number> = {
    "-3": 1, "-2": 1, "-1": 1, "0": 2, "1": 2, "2": 3, "3": 3, "4": 4, "5": 5,
    "6": 6, "7": 7, "8": 8, "9": 9, "10": 11, "11": 13, "12": 15, "13": 17,
  };

  const tabela = sexo === "M" ? tabelaM : tabelaF;
  const clampedPts = Math.max(-3, Math.min(13, pontos));
  const risco10 = tabela[String(clampedPts)] ?? (clampedPts >= 13 ? (sexo === "M" ? 45 : 17) : 1);

  let label: string;
  let risk: CalcResult["risk"];
  let recommendation: string;

  if (risco10 < 10) {
    label = "Risco baixo"; risk = "baixo";
    recommendation = "Modificações de estilo de vida. Reavaliação em 1 ano.";
  } else if (risco10 < 20) {
    label = "Risco intermediário"; risk = "moderado";
    recommendation = "Modificações de estilo de vida e possível farmacoterapia.";
  } else {
    label = "Risco alto"; risk = "alto";
    recommendation = "Tratamento agressivo de fatores de risco. Estatina indicada.";
  }

  return {
    value: `${risco10}%`,
    label,
    interpretation: `Framingham: ${risco10}% de evento cardiovascular em 10 anos`,
    risk,
    recommendation,
  };
}
