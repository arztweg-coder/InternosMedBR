const GRAUS = [
  { grau: 0, descricao: 'Só tenho falta de ar em exercícios muito intensos.' },
  { grau: 1, descricao: 'Fico sem fôlego ao apressar o passo no plano ou subir ladeira suave.' },
  { grau: 2, descricao: 'Ando mais devagar que pessoas da minha idade no plano por falta de ar, ou preciso parar para respirar andando no meu ritmo.' },
  { grau: 3, descricao: 'Paro para descansar após caminhar ~100 metros ou poucos minutos no plano.' },
  { grau: 4, descricao: 'Tenho falta de ar intensa para sair de casa, ou ao me vestir/despir.' },
];

interface Props {
  value: number | null;
  onChange: (grau: number) => void;
}

export default function mMRCInline({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">Escala de Dispneia (mMRC)</span>
      <div className="space-y-1.5">
        {GRAUS.map(g => (
          <button
            key={g.grau}
            type="button"
            onClick={() => onChange(g.grau)}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors flex items-start gap-3 ${
              value === g.grau
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className={`font-bold text-lg leading-none flex-shrink-0 ${value === g.grau ? 'text-teal-600' : 'text-gray-400'}`}>
              {g.grau}
            </span>
            <span className="text-sm text-gray-700 leading-snug">{g.descricao}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
