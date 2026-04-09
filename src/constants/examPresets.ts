export interface ExamPreset {
  id: string;
  label: string;
  exams: string[];
}

export const ROUTINE_PRESETS: ExamPreset[] = [
  {
    id: "basico",
    label: "Perfil Básico",
    exams: [
      "Hemograma completo",
      "Glicemia de jejum",
      "Ureia",
      "Creatinina",
      "Colesterol total e frações",
      "Triglicerídeos",
    ],
  },
  {
    id: "hepatico",
    label: "Função Hepática",
    exams: [
      "TGO (AST)",
      "TGP (ALT)",
      "Fosfatase Alcalina",
      "Gama-GT",
      "Bilirrubinas (Totais/Direta/Indireta)",
      "Albumina",
    ],
  },
  {
    id: "renal",
    label: "Função Renal",
    exams: [
      "Ureia",
      "Creatinina",
      "Sódio",
      "Potássio",
      "Exame de urina tipo I (EAS)",
    ],
  },
  {
    id: "urina",
    label: "Urina I",
    exams: [
      "Exame de urina tipo I (EAS)",
      "Urocultura c/ Antibiograma",
    ],
  },
  {
    id: "tireoide",
    label: "Tireoide",
    exams: ["TSH", "T4 Livre", "T3 Total"],
  },
  {
    id: "coagulacao",
    label: "Coagulação",
    exams: [
      "Tempo de Protrombina (TP/INR)",
      "Tempo de Tromboplastina Parcial Ativada (TTPA)",
    ],
  },
];

export const SURGICAL_PRESETS: ExamPreset[] = [
  {
    id: "risco_cirurgico",
    label: "Risco Cirúrgico Básico",
    exams: [
      "Hemograma completo",
      "Coagulograma (TP/INR, TTPA)",
      "Glicemia de jejum",
      "Ureia",
      "Creatinina",
      "Sódio",
      "Potássio",
      "ECG (Eletrocardiograma)",
      "Radiografia de tórax PA",
    ],
  },
  {
    id: "preop_expandido",
    label: "Pré-op Expandido",
    exams: [
      "Hemograma completo",
      "Coagulograma (TP/INR, TTPA)",
      "Glicemia de jejum",
      "HbA1c",
      "Ureia",
      "Creatinina",
      "Sódio",
      "Potássio",
      "TGO (AST)",
      "TGP (ALT)",
      "ECG (Eletrocardiograma)",
      "Radiografia de tórax PA",
      "Tipagem sanguínea ABO/Rh",
    ],
  },
  {
    id: "cardio",
    label: "Avaliação Cardiológica",
    exams: [
      "ECG (Eletrocardiograma)",
      "Ecocardiograma transtorácico",
      "Holter 24h",
      "Teste ergométrico",
    ],
  },
  {
    id: "hemostasia",
    label: "Hemostasia Completa",
    exams: [
      "Tempo de Protrombina (TP/INR)",
      "Tempo de Tromboplastina Parcial Ativada (TTPA)",
      "Fibrinogênio",
      "D-Dímero",
      "Plaquetas",
    ],
  },
];

export const VIA_OPTIONS = ["Oral", "IV", "IM", "SC", "Tópico", "Inalatório", "Retal", "SL", "Nasal", "Ocular"];
