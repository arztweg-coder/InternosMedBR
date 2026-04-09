import { ExternalLink } from 'lucide-react';

export interface GINAData {
  sintomasDiurnos: boolean;
  despertarNoturno: boolean;
  medicacaoAlivio: boolean;
  limitacaoAtividade: boolean;
  controle: 'bem_controlada' | 'parcialmente_controlada' | 'nao_controlada' | '';
}

interface Props {
  value: GINAData;
  onChange: (data: GINAData) => void;
}

const CRITERIOS: Array<{ campo: keyof Omit<GINAData, 'controle'>; label: string }> = [
  { campo: 'sintomasDiurnos', label: 'Sintomas diurnos mais de 2×/semana' },
  { campo: 'despertarNoturno', label: 'Despertar noturno por asma' },
  { campo: 'medicacaoAlivio', label: 'Uso de broncodilatador de alívio >2×/semana' },
  { campo: 'limitacaoAtividade', label: 'Limitação de atividade física pela asma' },
];

function calcControle(d: GINAData): GINAData['controle'] {
  const n = [d.sintomasDiurnos, d.despertarNoturno, d.medicacaoAlivio, d.limitacaoAtividade].filter(Boolean).length;
  if (n === 0) return 'bem_controlada';
  if (n <= 2) return 'parcialmente_controlada';
  return 'nao_controlada';
}

const CORES: Record<string, string> = {
  bem_controlada: 'text-green-600',
  parcialmente_controlada: 'text-amber-600',
  nao_controlada: 'text-red-600',
};

const LABELS: Record<string, string> = {
  bem_controlada: 'Bem controlada (0 critérios)',
  parcialmente_controlada: 'Parcialmente controlada (1–2 critérios)',
  nao_controlada: 'Não controlada (3–4 critérios)',
};

export default function GINAInline({ value, onChange }: Props) {
  function toggle(campo: keyof Omit<GINAData, 'controle'>) {
    const novo = { ...value, [campo]: !value[campo] };
    onChange({ ...novo, controle: calcControle(novo) });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">GINA — Controle da Asma (últimas 4 semanas)</span>
        <a href="/calculadoras" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
          Ver calc <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-2">
        {CRITERIOS.map(c => (
          <label key={c.campo} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={value[c.campo]}
              onChange={() => toggle(c.campo)}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">{c.label}</span>
          </label>
        ))}
      </div>

      {value.controle && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Controle:</span>
          <span className={`text-sm font-semibold ${CORES[value.controle]}`}>
            {LABELS[value.controle]}
          </span>
        </div>
      )}
    </div>
  );
}
