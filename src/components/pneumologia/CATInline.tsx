import { ExternalLink } from 'lucide-react';

export interface CATData {
  tosse: number; catarro: number; peito: number; dispneia: number;
  atividades: number; sair: number; sono: number; energia: number;
  total: number;
}

const PERGUNTAS = [
  { campo: 'tosse' as const, inicio: 'Nunca tusso', fim: 'Tusso o tempo todo' },
  { campo: 'catarro' as const, inicio: 'Sem catarro', fim: 'Cheio de catarro' },
  { campo: 'peito' as const, inicio: 'Sem aperto no peito', fim: 'Aperto muito forte' },
  { campo: 'dispneia' as const, inicio: 'Sem falta de ar subindo escadas', fim: 'Muito ofegante' },
  { campo: 'atividades' as const, inicio: 'Sem limitação em casa', fim: 'Muito limitado' },
  { campo: 'sair' as const, inicio: 'Muita confiança para sair', fim: 'Sem confiança' },
  { campo: 'sono' as const, inicio: 'Durmo bem', fim: 'Durmo muito mal' },
  { campo: 'energia' as const, inicio: 'Muita energia', fim: 'Sem energia' },
];

interface Props {
  value: CATData;
  onChange: (data: CATData) => void;
}

function getImpacto(total: number) {
  if (total < 10) return { texto: 'Baixo impacto', cor: 'text-green-600' };
  if (total <= 20) return { texto: 'Médio impacto', cor: 'text-amber-600' };
  if (total <= 30) return { texto: 'Alto impacto', cor: 'text-orange-600' };
  return { texto: 'Impacto muito alto', cor: 'text-red-600' };
}

export default function CATInline({ value, onChange }: Props) {
  function handleChange(campo: keyof Omit<CATData, 'total'>, val: number) {
    const novo = { ...value, [campo]: val };
    const total = Object.entries(novo).filter(([k]) => k !== 'total').reduce((s, [, v]) => s + Number(v), 0);
    onChange({ ...novo, total });
  }

  const { texto, cor } = getImpacto(value.total);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">CAT — COPD Assessment Test</span>
        <a href="/calculadoras" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
          Ver calc <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {PERGUNTAS.map((p, idx) => (
        <div key={p.campo}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">{idx + 1}. {p.inicio}</span>
            <span className="text-xs text-gray-500">{p.fim}</span>
          </div>
          <div className="flex gap-1 justify-center">
            {[0,1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => handleChange(p.campo, n)}
                className={`w-9 h-9 rounded-lg border-2 text-sm font-bold transition-colors ${
                  value[p.campo] === n
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}

      {value.total > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Total: {value.total}/40</span>
          <span className={`text-sm font-semibold ${cor}`}>{texto}</span>
        </div>
      )}
    </div>
  );
}
