export interface ImunizacaoData {
  influenza: { aplicado: boolean; data: string };
  prevenar13: { aplicado: boolean; data: string };
  pneumo23: { aplicado: boolean; data: string };
  covid: { aplicado: boolean; dataUltimaDose: string };
}

const VACINAS: Array<{ campo: keyof ImunizacaoData; label: string; campoData: string }> = [
  { campo: 'influenza', label: 'Influenza (anual)', campoData: 'data' },
  { campo: 'prevenar13', label: 'Pneumocócica 13-valente (PCV13)', campoData: 'data' },
  { campo: 'pneumo23', label: 'Pneumocócica 23-valente (PPV23)', campoData: 'data' },
  { campo: 'covid', label: 'COVID-19 (última dose)', campoData: 'dataUltimaDose' },
];

interface Props {
  value: ImunizacaoData;
  onChange: (data: ImunizacaoData) => void;
}

export default function ImunizacaoFields({ value, onChange }: Props) {
  function toggleAplicado(campo: keyof ImunizacaoData) {
    onChange({ ...value, [campo]: { ...value[campo], aplicado: !value[campo].aplicado } });
  }

  function setData(campo: keyof ImunizacaoData, campoData: string, date: string) {
    onChange({ ...value, [campo]: { ...value[campo], [campoData]: date } });
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">Imunização</span>
      <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
        {VACINAS.map(v => (
          <div key={v.campo} className="flex items-center gap-3 px-4 py-3 bg-white">
            <input
              type="checkbox"
              checked={value[v.campo].aplicado}
              onChange={() => toggleAplicado(v.campo)}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 flex-shrink-0"
            />
            <span className="text-sm text-gray-700 flex-1">{v.label}</span>
            {value[v.campo].aplicado && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 whitespace-nowrap">Data:</label>
                <input
                  type="date"
                  value={(value[v.campo] as Record<string, string>)[v.campoData] || ''}
                  onChange={e => setData(v.campo, v.campoData, e.target.value)}
                  className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
