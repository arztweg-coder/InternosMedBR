export interface FagerstromData {
  q1: number; q2: number; q3: number; q4: number; q5: number; q6: number;
  total: number;
  nivel: string;
}

const PERGUNTAS = [
  {
    id: 'q1' as const,
    texto: 'Quanto tempo após acordar você fuma o primeiro cigarro?',
    opcoes: [
      { valor: 3, label: 'Nos primeiros 5 min' },
      { valor: 2, label: 'De 6 a 30 minutos' },
      { valor: 1, label: 'De 31 a 60 minutos' },
      { valor: 0, label: 'Após 60 minutos' },
    ],
  },
  {
    id: 'q2' as const,
    texto: 'Você acha difícil não fumar em lugares proibidos (hospital, ônibus)?',
    opcoes: [{ valor: 1, label: 'Sim' }, { valor: 0, label: 'Não' }],
  },
  {
    id: 'q3' as const,
    texto: 'Qual cigarro lhe traz mais satisfação?',
    opcoes: [{ valor: 1, label: 'O primeiro da manhã' }, { valor: 0, label: 'Qualquer outro' }],
  },
  {
    id: 'q4' as const,
    texto: 'Quantos cigarros você fuma por dia?',
    opcoes: [
      { valor: 0, label: '≤ 10' },
      { valor: 1, label: '11 – 20' },
      { valor: 2, label: '21 – 30' },
      { valor: 3, label: '≥ 31' },
    ],
  },
  {
    id: 'q5' as const,
    texto: 'Você fuma mais nas primeiras horas após acordar do que no restante do dia?',
    opcoes: [{ valor: 1, label: 'Sim' }, { valor: 0, label: 'Não' }],
  },
  {
    id: 'q6' as const,
    texto: 'Você fuma mesmo doente, quando precisa ficar na cama a maior parte do dia?',
    opcoes: [{ valor: 1, label: 'Sim' }, { valor: 0, label: 'Não' }],
  },
];

function getNivel(total: number): string {
  if (total <= 2) return 'Dependência muito baixa';
  if (total <= 4) return 'Dependência baixa';
  if (total === 5) return 'Dependência média';
  if (total <= 7) return 'Dependência elevada';
  return 'Dependência muito elevada';
}

function getNivelCor(total: number): string {
  if (total <= 2) return 'text-green-600';
  if (total <= 4) return 'text-blue-600';
  if (total === 5) return 'text-amber-600';
  if (total <= 7) return 'text-orange-600';
  return 'text-red-600';
}

interface Props {
  value: FagerstromData;
  onChange: (data: FagerstromData) => void;
}

function calcTotal(d: Omit<FagerstromData, 'total' | 'nivel'>): number {
  return d.q1 + d.q2 + d.q3 + d.q4 + d.q5 + d.q6;
}

export default function FagerstromInline({ value, onChange }: Props) {
  function handleChange(campo: keyof Omit<FagerstromData, 'total' | 'nivel'>, val: number) {
    const novo = { ...value, [campo]: val };
    const total = calcTotal(novo);
    onChange({ ...novo, total, nivel: getNivel(total) });
  }

  const respondidas = ['q1','q2','q3','q4','q5','q6'].filter(k => (value as Record<string,number>)[k] !== undefined && (value as Record<string,number>)[k] >= 0).length;

  return (
    <div className="space-y-4">
      <span className="text-sm font-medium text-gray-700">Teste de Fagerström — Dependência à Nicotina</span>

      {PERGUNTAS.map((p, idx) => (
        <div key={p.id}>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">{idx + 1}.</span> {p.texto}
          </p>
          <div className="flex flex-wrap gap-2">
            {p.opcoes.map(op => (
              <button
                key={op.valor}
                type="button"
                onClick={() => handleChange(p.id, op.valor)}
                className={`px-3 py-2 text-sm rounded-lg border-2 font-medium transition-colors ${
                  value[p.id] === op.valor
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {op.label}
                <span className="ml-1 text-xs opacity-60">({op.valor})</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {respondidas > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Total: {value.total}/10</span>
          {value.total >= 0 && (
            <span className={`text-sm font-semibold ${getNivelCor(value.total)}`}>
              {getNivel(value.total)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
