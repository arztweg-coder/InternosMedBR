import { ExternalLink } from 'lucide-react';

export interface ACTData {
  q1: number; q2: number; q3: number; q4: number; q5: number;
  total: number;
}

const PERGUNTAS = [
  {
    id: 'q1' as const,
    texto: 'Com que frequência a asma impediu suas atividades (trabalho/escola/casa) nas últimas 4 semanas?',
    opcoes: [
      { valor: 1, label: 'Sempre' },
      { valor: 2, label: 'Quase sempre' },
      { valor: 3, label: 'Às vezes' },
      { valor: 4, label: 'Raramente' },
      { valor: 5, label: 'Nunca' },
    ],
  },
  {
    id: 'q2' as const,
    texto: 'Com que frequência você teve falta de ar nas últimas 4 semanas?',
    opcoes: [
      { valor: 1, label: '>1×/dia' },
      { valor: 2, label: '1×/dia' },
      { valor: 3, label: '3–6×/sem' },
      { valor: 4, label: '1–2×/sem' },
      { valor: 5, label: 'Nenhuma' },
    ],
  },
  {
    id: 'q3' as const,
    texto: 'Com que frequência sintomas de asma acordaram você à noite/madrugada nas últimas 4 semanas?',
    opcoes: [
      { valor: 1, label: '4+ noites/sem' },
      { valor: 2, label: '2–3 noites/sem' },
      { valor: 3, label: '1×/sem' },
      { valor: 4, label: '1–2×/mês' },
      { valor: 5, label: 'Nenhuma' },
    ],
  },
  {
    id: 'q4' as const,
    texto: 'Com que frequência usou inalador de alívio (salbutamol) nas últimas 4 semanas?',
    opcoes: [
      { valor: 1, label: '3+ vezes/dia' },
      { valor: 2, label: '1–2×/dia' },
      { valor: 3, label: '2–3×/sem' },
      { valor: 4, label: '≤1×/sem' },
      { valor: 5, label: 'Nenhuma' },
    ],
  },
  {
    id: 'q5' as const,
    texto: 'Como você avalia o controle da sua asma nas últimas 4 semanas?',
    opcoes: [
      { valor: 1, label: 'Sem controle' },
      { valor: 2, label: 'Pouco' },
      { valor: 3, label: 'Parcialmente' },
      { valor: 4, label: 'Bem' },
      { valor: 5, label: 'Completo' },
    ],
  },
];

interface Props {
  value: ACTData;
  onChange: (data: ACTData) => void;
}

function calcTotal(d: Omit<ACTData, 'total'>): number {
  return d.q1 + d.q2 + d.q3 + d.q4 + d.q5;
}

function getInterpretacao(total: number): { texto: string; cor: string } {
  if (!total) return { texto: '', cor: '' };
  if (total <= 19) return { texto: 'Asma não bem controlada', cor: 'text-red-600' };
  if (total <= 24) return { texto: 'Asma bem controlada', cor: 'text-amber-600' };
  return { texto: 'Controle total', cor: 'text-green-600' };
}

export default function ACTInline({ value, onChange }: Props) {
  function handleChange(campo: keyof Omit<ACTData, 'total'>, val: number) {
    const novo = { ...value, [campo]: val };
    onChange({ ...novo, total: calcTotal(novo) });
  }

  const { texto, cor } = getInterpretacao(value.total);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">ACT — Controle da Asma (últimas 4 semanas)</span>
        <a
          href="/calculadoras"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          Calculadora completa <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {PERGUNTAS.map((p, idx) => (
        <div key={p.id}>
          <p className="text-xs text-gray-600 mb-1.5">
            <span className="font-medium text-gray-800">{idx + 1}.</span> {p.texto}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {p.opcoes.map(op => (
              <button
                key={op.valor}
                type="button"
                onClick={() => handleChange(p.id, op.valor)}
                className={`px-3 py-1.5 text-xs rounded-lg border-2 font-medium transition-colors ${
                  value[p.id] === op.valor
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {op.valor} — {op.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {value.total > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Total: {value.total}/25</span>
          {texto && <span className={`text-sm font-semibold ${cor}`}>{texto}</span>}
        </div>
      )}
    </div>
  );
}
