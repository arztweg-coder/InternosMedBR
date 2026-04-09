export interface GOALData {
  G: boolean; O: boolean; A: boolean; L: boolean;
  score: number;
}

const ITENS = [
  { campo: 'G' as const, label: 'G — Gender: Sexo masculino?' },
  { campo: 'O' as const, label: 'O — Obesity: IMC ≥ 30 kg/m²?' },
  { campo: 'A' as const, label: 'A — Age: Idade ≥ 50 anos?' },
  { campo: 'L' as const, label: 'L — Loud snoring: Ronco audível em outro cômodo?' },
];

interface Props {
  value: GOALData;
  onChange: (data: GOALData) => void;
}

function getRisco(score: number) {
  if (score <= 1) return { texto: 'Baixo risco', cor: 'text-green-600' };
  if (score === 2) return { texto: 'Risco intermediário', cor: 'text-amber-600' };
  return { texto: 'Alto risco', cor: 'text-red-600' };
}

export default function GOALInline({ value, onChange }: Props) {
  function toggle(campo: keyof Omit<GOALData, 'score'>) {
    const novo = { ...value, [campo]: !value[campo] };
    const score = (['G','O','A','L'] as const).filter(k => novo[k]).length;
    onChange({ ...novo, score });
  }

  const risco = getRisco(value.score);

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">GOAL — Triagem de Apneia</span>

      <div className="space-y-1">
        {ITENS.map(item => (
          <label key={item.campo} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={value[item.campo]}
              onChange={() => toggle(item.campo)}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>

      {value.score > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Score: {value.score}/4</span>
          <span className={`text-sm font-semibold ${risco.cor}`}>{risco.texto}</span>
        </div>
      )}
    </div>
  );
}
