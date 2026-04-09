export interface BODEData {
  imc: number;
  vef1: number;
  mmrc: number;
  tc6min: number;
  pontuacao: number;
  sobrevida: string;
}

function calcBODE(imc: number, vef1: number, mmrc: number, tc6: number): { pontos: number; sobrevida: string } {
  const pB = imc <= 21 ? 1 : 0;
  const pO = vef1 >= 65 ? 0 : vef1 >= 50 ? 1 : vef1 >= 36 ? 2 : 3;
  const pD = mmrc <= 1 ? 0 : mmrc === 2 ? 1 : mmrc === 3 ? 2 : 3;
  const pE = tc6 >= 350 ? 0 : tc6 >= 250 ? 1 : tc6 >= 150 ? 2 : 3;
  const pontos = pB + pO + pD + pE;

  let sobrevida = '';
  if (pontos <= 2) sobrevida = '~80% em 4 anos (Q1)';
  else if (pontos <= 4) sobrevida = '~67% em 4 anos (Q2)';
  else if (pontos <= 6) sobrevida = '~57% em 4 anos (Q3)';
  else sobrevida = '~18% em 4 anos (Q4)';

  return { pontos, sobrevida };
}

function getSobrevida4Cor(pontos: number): string {
  if (pontos <= 2) return 'text-green-600';
  if (pontos <= 4) return 'text-amber-600';
  if (pontos <= 6) return 'text-orange-600';
  return 'text-red-600';
}

interface Props {
  value: BODEData;
  onChange: (data: BODEData) => void;
}

const MMRC_OPCOES = [
  { valor: 0, label: '0 — Só esforço intenso' },
  { valor: 1, label: '1 — Ladeira / apressar passo' },
  { valor: 2, label: '2 — Mais lento que colegas' },
  { valor: 3, label: '3 — Para após 100m' },
  { valor: 4, label: '4 — Falta de ar para sair de casa' },
];

export default function BODEInline({ value, onChange }: Props) {
  function handleChange(campo: keyof Omit<BODEData, 'pontuacao' | 'sobrevida'>, val: number) {
    const novo = { ...value, [campo]: val };
    const { pontos, sobrevida } = calcBODE(novo.imc, novo.vef1, novo.mmrc, novo.tc6min);
    onChange({ ...novo, pontuacao: pontos, sobrevida });
  }

  const temDados = value.vef1 > 0 && value.tc6min > 0 && value.mmrc >= 0;

  return (
    <div className="space-y-4">
      <span className="text-sm font-medium text-gray-700">BODE — Índice Prognóstico DPOC</span>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">IMC (kg/m²)</label>
          <input
            type="number"
            min={10} max={60} step={0.1}
            value={value.imc || ''}
            onChange={e => handleChange('imc', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 28.5"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <span className="text-xs text-gray-400">≤21 = 1 ponto; &gt;21 = 0</span>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">VEF1 (% do previsto)</label>
          <input
            type="number"
            min={10} max={100} step={1}
            value={value.vef1 || ''}
            onChange={e => handleChange('vef1', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 52"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <span className="text-xs text-gray-400">≥65=0 | 50–64=1 | 36–49=2 | ≤35=3</span>
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Dispneia (mMRC)</label>
          <div className="flex flex-wrap gap-1.5">
            {MMRC_OPCOES.map(op => (
              <button
                key={op.valor}
                type="button"
                onClick={() => handleChange('mmrc', op.valor)}
                className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors ${
                  value.mmrc === op.valor
                    ? 'border-teal-500 bg-teal-500 text-white font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">TC6min — Teste de Caminhada 6 min (metros)</label>
          <input
            type="number"
            min={0} max={700} step={1}
            value={value.tc6min || ''}
            onChange={e => handleChange('tc6min', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 320"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <span className="text-xs text-gray-400">≥350=0 | 250–349=1 | 150–249=2 | ≤149=3</span>
        </div>
      </div>

      {temDados && (
        <div className={`flex items-center justify-between pt-2 border-t border-gray-100`}>
          <span className="text-sm font-semibold text-gray-700">BODE: {value.pontuacao}/10</span>
          <span className={`text-sm font-semibold ${getSobrevida4Cor(value.pontuacao)}`}>
            {value.sobrevida}
          </span>
        </div>
      )}
    </div>
  );
}
