import { ExternalLink } from 'lucide-react';

export interface STOPBANGData {
  S: boolean; T: boolean; O: boolean; P: boolean;
  B: boolean; A: boolean; N: boolean; G: boolean;
  score: number;
  risco: 'baixo' | 'intermediario' | 'alto' | '';
}

const ITENS = [
  { campo: 'S' as const, label: 'S — Snoring: Ronco alto (audível através de portas fechadas)?' },
  { campo: 'T' as const, label: 'T — Tired: Cansado ou sonolento durante o dia com frequência?' },
  { campo: 'O' as const, label: 'O — Observed: Alguém já observou você parar de respirar no sono?' },
  { campo: 'P' as const, label: 'P — Pressure: Tem ou é tratado para hipertensão arterial?' },
  { campo: 'B' as const, label: 'B — BMI: IMC > 35 kg/m²?' },
  { campo: 'A' as const, label: 'A — Age: Idade > 50 anos?' },
  { campo: 'N' as const, label: 'N — Neck: Circunferência do pescoço > 40 cm?' },
  { campo: 'G' as const, label: 'G — Gender: Sexo masculino?' },
];

interface Props {
  value: STOPBANGData;
  onChange: (data: STOPBANGData) => void;
}

function calcRisco(score: number): STOPBANGData['risco'] {
  if (score <= 2) return 'baixo';
  if (score <= 4) return 'intermediario';
  return 'alto';
}

const RISCO_LABELS = {
  baixo: 'Baixo risco (0–2)',
  intermediario: 'Risco intermediário (3–4)',
  alto: 'Alto risco (5–8)',
};

const RISCO_CORES = {
  baixo: 'text-green-600',
  intermediario: 'text-amber-600',
  alto: 'text-red-600',
};

export default function STOPBANGInline({ value, onChange }: Props) {
  function toggle(campo: keyof Omit<STOPBANGData, 'score' | 'risco'>) {
    const novo = { ...value, [campo]: !value[campo] };
    const score = (['S','T','O','P','B','A','N','G'] as const).filter(k => novo[k]).length;
    onChange({ ...novo, score, risco: calcRisco(score) });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">STOP-BANG — Apneia do Sono</span>
        <a href="/calculadoras" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
          Ver calc <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {ITENS.map(item => (
          <label key={item.campo} className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={value[item.campo]}
              onChange={() => toggle(item.campo)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 flex-shrink-0"
            />
            <span className="text-xs text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>

      {value.risco && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Score: {value.score}/8</span>
          <span className={`text-sm font-semibold ${RISCO_CORES[value.risco]}`}>
            {RISCO_LABELS[value.risco]}
          </span>
        </div>
      )}
    </div>
  );
}
