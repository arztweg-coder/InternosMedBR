export interface GloverNilssonData {
  respostas: boolean[];
  total: number;
}

const PERGUNTAS = [
  'Você fuma para sentir-se mais confortável em situações sociais?',
  'Acender um cigarro ajuda você a relaxar quando está tenso ou ansioso?',
  'Você fuma quando está irritado ou com raiva?',
  'Você tem vontade de fumar quando está feliz ou animado?',
  'Parece que falta algo quando você está sem um cigarro na mão?',
  'Você usa o cigarro como um "apoio psicológico" para enfrentar situações?',
  'Às vezes você acende um cigarro sem perceber que já está fumando?',
  'Fumar é uma forma de recompensa ou conforto em certas situações?',
  'Você às vezes fuma só porque as pessoas ao redor estão fumando?',
  'Você se sente desconfortável quando não pode fumar em situações sociais?',
  'Em momentos importantes, você inconscientemente estende a mão para o cigarro?',
];

function getNivel(total: number) {
  if (total <= 3) return { texto: 'Dependência comportamental baixa', cor: 'text-green-600' };
  if (total <= 6) return { texto: 'Dependência comportamental moderada', cor: 'text-amber-600' };
  return { texto: 'Dependência comportamental alta', cor: 'text-red-600' };
}

interface Props {
  value: GloverNilssonData;
  onChange: (data: GloverNilssonData) => void;
}

export default function GloverNilssonInline({ value, onChange }: Props) {
  function toggle(idx: number) {
    const novas = [...value.respostas];
    novas[idx] = !novas[idx];
    onChange({ respostas: novas, total: novas.filter(Boolean).length });
  }

  const { texto, cor } = getNivel(value.total);

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">Escala de Glover-Nilsson — Dependência Comportamental</span>

      <div className="space-y-1.5">
        {PERGUNTAS.map((pergunta, idx) => (
          <label key={idx} className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={value.respostas[idx] ?? false}
              onChange={() => toggle(idx)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 flex-shrink-0"
            />
            <span className="text-sm text-gray-700">
              <span className="font-medium text-gray-500 mr-1">{idx + 1}.</span>
              {pergunta}
            </span>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-700">
          Total "Sim": {value.total}/11
        </span>
        <span className={`text-sm font-semibold ${cor}`}>{texto}</span>
      </div>
    </div>
  );
}
