export interface EspirometriaData {
  data: string;
  cvfPreL: number; cvfPrePct: number;
  vef1PreL: number; vef1PrePct: number;
  vef1CvfPre: number;
  cvfPosL: number; cvfPosPct: number;
  vef1PosL: number; vef1PosPct: number;
  vef1CvfPos: number;
  fef2575: number;
  observacoes: string;
}

interface Props {
  value: EspirometriaData;
  onChange: (data: EspirometriaData) => void;
}

function Field({ label, value, onChange, step = 0.01, placeholder }: {
  label: string; value: number; onChange: (v: number) => void;
  step?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        step={step}
        value={value || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
    </div>
  );
}

export default function EspirometriaFields({ value, onChange }: Props) {
  function update(campo: keyof EspirometriaData, val: string | number) {
    onChange({ ...value, [campo]: val });
  }

  return (
    <div className="space-y-4">
      <span className="text-sm font-medium text-gray-700">Espirometria</span>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Data do exame</label>
        <input
          type="date"
          value={value.data}
          onChange={e => update('data', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pré-broncodilatador</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="CVF (L)" value={value.cvfPreL} onChange={v => update('cvfPreL', v)} placeholder="Ex: 3.21" />
          <Field label="CVF (% prev)" value={value.cvfPrePct} onChange={v => update('cvfPrePct', v)} step={0.1} placeholder="Ex: 78" />
          <Field label="VEF1 (L)" value={value.vef1PreL} onChange={v => update('vef1PreL', v)} placeholder="Ex: 2.14" />
          <Field label="VEF1 (% prev)" value={value.vef1PrePct} onChange={v => update('vef1PrePct', v)} step={0.1} placeholder="Ex: 65" />
          <Field label="VEF1/CVF (%)" value={value.vef1CvfPre} onChange={v => update('vef1CvfPre', v)} step={0.1} placeholder="Ex: 66.7" />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pós-broncodilatador</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="CVF (L)" value={value.cvfPosL} onChange={v => update('cvfPosL', v)} placeholder="Ex: 3.40" />
          <Field label="CVF (% prev)" value={value.cvfPosPct} onChange={v => update('cvfPosPct', v)} step={0.1} placeholder="Ex: 82" />
          <Field label="VEF1 (L)" value={value.vef1PosL} onChange={v => update('vef1PosL', v)} placeholder="Ex: 2.50" />
          <Field label="VEF1 (% prev)" value={value.vef1PosPct} onChange={v => update('vef1PosPct', v)} step={0.1} placeholder="Ex: 76" />
          <Field label="VEF1/CVF (%)" value={value.vef1CvfPos} onChange={v => update('vef1CvfPos', v)} step={0.1} placeholder="Ex: 73.5" />
        </div>
      </div>

      <div className="max-w-xs">
        <Field label="FEF25–75% (% prev)" value={value.fef2575} onChange={v => update('fef2575', v)} step={0.1} placeholder="Ex: 48.3" />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Observações / laudo</label>
        <textarea
          value={value.observacoes}
          onChange={e => update('observacoes', e.target.value)}
          rows={2}
          placeholder="Padrão, grau, reversibilidade..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
        />
      </div>
    </div>
  );
}
