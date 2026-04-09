import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import MedicamentoSUSAutocomplete, { MedicamentoItem } from '../MedicamentoSUSAutocomplete';
import mMRCInline from '../mMRCInline';
import CATInline, { CATData } from '../CATInline';

const defaultCAT: CATData = { tosse: 0, catarro: 0, peito: 0, dispneia: 0, atividades: 0, sair: 0, sono: 0, energia: 0, total: 0 };

const SINAIS_DESCOMPENSACAO = [
  'Aumento da dispneia', 'Aumento da produção de escarro', 'Mudança na cor do escarro',
  'Sibilância', 'Uso de musculatura acessória', 'Cianose', 'Edema de MMII',
];

export default function DPOCReturn() {
  const [saved, setSaved] = useState(false);

  const [paciente, setPaciente] = useState('');
  const [hdaAtual, setHdaAtual] = useState('');
  const [sinais, setSinais] = useState<string[]>([]);
  const [mmrc, setMmrc] = useState<number | null>(null);
  const [cat, setCat] = useState<CATData>(defaultCAT);
  const [exacerb, setExacerb] = useState('');
  const [hospitalizacao, setHospitalizacao] = useState('');
  const [oxigenoterapia, setOxigenoterapia] = useState('');
  const [pesoAtual, setPesoAtual] = useState('');
  const [saturacao, setSaturacao] = useState('');
  const [novosExames, setNovosExames] = useState('');
  const [medicamentos, setMedicamentos] = useState<MedicamentoItem[]>([]);
  const [conduta, setConduta] = useState('');
  const [plano, setPlano] = useState('');

  function toggle(arr: string[], item: string, set: (v: string[]) => void) {
    set(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
  }

  function handleSave() {
    const protocolo = `INTERNOSMED-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-DPOCRET-${uuidv4().slice(0,8).toUpperCase()}`;
    const dados = {
      tipo: 'dpoc_retorno',
      protocolo,
      data: new Date().toISOString(),
      paciente: { nome: paciente },
      hdaAtual, sinais, mmrc, cat,
      exacerb, hospitalizacao, oxigenoterapia,
      antropometria: { pesoAtual, saturacao },
      novosExames, medicamentos, conduta, plano,
    };
    localStorage.setItem(protocolo, JSON.stringify(dados));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const SectionDivider = () => <hr className="border-gray-100 my-5" />;
  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>
  );
  const RadioGroup = ({ opcoes, value, onChange, name }: {
    opcoes: Array<{ valor: string; label: string }>; value: string; onChange: (v: string) => void; name: string;
  }) => (
    <div className="flex flex-wrap gap-2">
      {opcoes.map(op => (
        <label key={op.valor} className={`flex items-center gap-1.5 cursor-pointer px-3 py-2 rounded-lg border text-sm transition-colors ${
          value === op.valor ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
        }`}>
          <input type="radio" name={name} value={op.valor} checked={value === op.valor} onChange={() => onChange(op.valor)} className="h-3.5 w-3.5 text-teal-600" />
          {op.label}
        </label>
      ))}
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl">

      <div>
        <Label>Nome do paciente</Label>
        <input type="text" value={paciente} onChange={e => setPaciente(e.target.value)} placeholder="Nome completo"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>

      <div>
        <Label>HDA — evolução desde a última consulta</Label>
        <textarea value={hdaAtual} onChange={e => setHdaAtual(e.target.value)} rows={4}
          placeholder="Descreva a evolução dos sintomas, intercorrências, exacerbações..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
      </div>

      <SectionDivider />

      {/* Sinais de descompensação */}
      <div>
        <Label>Sinais / sintomas de descompensação</Label>
        <div className="flex flex-wrap gap-2">
          {SINAIS_DESCOMPENSACAO.map(s => (
            <label key={s} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              sinais.includes(s) ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}>
              <input type="checkbox" checked={sinais.includes(s)} onChange={() => toggle(sinais, s, setSinais)} className="h-3.5 w-3.5 rounded border-gray-300 text-red-500" />
              {s}
            </label>
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* Dados clínicos */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Exacerbações desde última consulta</Label>
          <input type="number" min={0} value={exacerb} onChange={e => setExacerb(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Hospitalizações</Label>
          <input type="number" min={0} value={hospitalizacao} onChange={e => setHospitalizacao(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Oxigenoterapia domiciliar?</Label>
          <RadioGroup name="o2" value={oxigenoterapia} onChange={setOxigenoterapia}
            opcoes={[{ valor: 'sim', label: 'Sim' }, { valor: 'nao', label: 'Não' }]} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Peso atual (kg)</Label>
          <input type="number" step={0.1} value={pesoAtual} onChange={e => setPesoAtual(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Saturação de O₂ (%)</Label>
          <input type="number" min={70} max={100} value={saturacao} onChange={e => setSaturacao(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      </div>

      <SectionDivider />

      <mMRCInline value={mmrc} onChange={setMmrc} />

      <SectionDivider />

      <CATInline value={cat} onChange={setCat} />

      <SectionDivider />

      {/* Novos exames */}
      <div>
        <Label>Novos exames / resultados</Label>
        <textarea value={novosExames} onChange={e => setNovosExames(e.target.value)} rows={3}
          placeholder="Gasometria, hemograma, espirometria de controle, TC de tórax..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
      </div>

      <SectionDivider />

      <div>
        <Label>Medicamentos em uso (atualizar se necessário)</Label>
        <MedicamentoSUSAutocomplete value={medicamentos} onChange={setMedicamentos} />
      </div>

      <SectionDivider />

      <div>
        <Label>Conduta</Label>
        <textarea value={conduta} onChange={e => setConduta(e.target.value)} rows={3}
          placeholder="Ajustes terapêuticos, encaminhamentos, solicitações..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
      </div>

      <div>
        <Label>Plano / orientações</Label>
        <textarea value={plano} onChange={e => setPlano(e.target.value)} rows={3}
          placeholder="Próxima consulta, metas, fisioterapia respiratória, reabilitação pulmonar..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
      </div>

      <SectionDivider />

      <button type="button" onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${
          saved ? 'bg-green-500 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}>
        {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Salvo com sucesso!' : 'Salvar formulário'}
      </button>
    </div>
  );
}
