import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import BotaoImprimir from '../BotaoImprimir';
import { v4 as uuidv4 } from 'uuid';
import MedicamentoSUSAutocomplete, { MedicamentoItem } from '../MedicamentoSUSAutocomplete';
import mMRCInline from '../mMRCInline';
import CATInline, { CATData } from '../CATInline';
import BODEInline, { BODEData } from '../BODEInline';
import STOPBANGInline, { STOPBANGData } from '../STOPBANGInline';
import EspirometriaFields, { EspirometriaData } from '../EspirometriaFields';
import ImunizacaoFields, { ImunizacaoData } from '../ImunizacaoFields';

const defaultCAT: CATData = { tosse: 0, catarro: 0, peito: 0, dispneia: 0, atividades: 0, sair: 0, sono: 0, energia: 0, total: 0 };
const defaultBODE: BODEData = { imc: 0, vef1: 0, mmrc: 0, tc6min: 0, pontuacao: 0, sobrevida: '' };
const defaultSTOP: STOPBANGData = { S: false, T: false, O: false, P: false, B: false, A: false, N: false, G: false, score: 0, risco: '' };
const defaultEspi: EspirometriaData = { data: '', cvfPreL: 0, cvfPrePct: 0, vef1PreL: 0, vef1PrePct: 0, vef1CvfPre: 0, cvfPosL: 0, cvfPosPct: 0, vef1PosL: 0, vef1PosPct: 0, vef1CvfPos: 0, fef2575: 0, observacoes: '' };
const defaultImun: ImunizacaoData = {
  influenza: { aplicado: false, data: '' },
  prevenar13: { aplicado: false, data: '' },
  pneumo23: { aplicado: false, data: '' },
  covid: { aplicado: false, dataUltimaDose: '' },
};

const COMORBIDADES = [
  'Obesidade', 'HAS', 'DAC', 'IC', 'DM', 'Fibrilação atrial',
  'Osteoporose', 'Anemia', 'AOS', 'Depressão', 'Ansiedade', 'DRGE',
];

const EXPOSICOES = [
  'Tabagismo ativo', 'Tabagismo prévio', 'Biomassa (fogão a lenha)',
  'Poeira ocupacional', 'Fumaça industrial', 'Poluição ambiental',
];

const GOLD_LABELS: Record<string, string> = {
  A: 'A — Baixo risco, poucos sintomas (CAT<10 / mMRC 0-1, 0 exacerbações)',
  B: 'B — Baixo risco, mais sintomas (CAT≥10 / mMRC≥2, 0-1 exacerbação)',
  E: 'E — Alto risco, qualquer sintoma (≥2 exacerbações ou ≥1 com hospitalização)',
};

function CheckboxGroup({ opcoes, value, onChange }: {
  opcoes: string[]; value: string[]; onChange: (v: string[]) => void;
}) {
  function toggle(item: string) {
    onChange(value.includes(item) ? value.filter(x => x !== item) : [...value, item]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {opcoes.map(op => (
        <label key={op} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-colors ${
          value.includes(op) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
        }`}>
          <input type="checkbox" checked={value.includes(op)} onChange={() => toggle(op)} className="h-3.5 w-3.5 rounded border-gray-300 text-teal-600" />
          {op}
        </label>
      ))}
    </div>
  );
}

export default function DPOCFirstVisit() {
  const [saved, setSaved] = useState(false);

  // Identificação
  const [paciente, setPaciente] = useState('');
  const [idadeAtual, setIdadeAtual] = useState('');
  const [corRaca, setCorRaca] = useState('');
  const [profissaoAtual, setProfissaoAtual] = useState('');

  // Exposição / tabagismo
  const [exposicoes, setExposicoes] = useState<string[]>([]);
  const [anoPacigarros, setAnoPacigarros] = useState('');
  const [idadeInicio, setIdadeInicio] = useState('');
  const [idadeCessacao, setIdadeCessacao] = useState('');

  // Sintomas
  const [sintomas, setSintomas] = useState<string[]>([]);

  // mMRC
  const [mmrc, setMmrc] = useState<number | null>(null);

  // CAT
  const [cat, setCat] = useState<CATData>(defaultCAT);

  // GOLD
  const [goldGrupo, setGoldGrupo] = useState('');
  const [exacerbacoesAno, setExacerbacoesAno] = useState('');
  const [hospitalizacoes, setHospitalizacoes] = useState('');

  // Comorbidades
  const [comorbidades, setComorbidades] = useState<string[]>([]);
  const [outrasComorbidades, setOutrasComorbidades] = useState('');

  // STOP-BANG
  const [stopBang, setStopBang] = useState<STOPBANGData>(defaultSTOP);

  // Medicamentos
  const [medicamentos, setMedicamentos] = useState<MedicamentoItem[]>([]);

  // Imunização
  const [imunizacao, setImunizacao] = useState<ImunizacaoData>(defaultImun);

  // Espirometria
  const [espirometria, setEspirometria] = useState<EspirometriaData>(defaultEspi);

  // BODE
  const [bode, setBode] = useState<BODEData>(defaultBODE);

  // HDA
  const [hdaLivre, setHdaLivre] = useState('');

  function handleSave() {
    const protocolo = `INTERNOSMED-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-DPOC1VEZ-${uuidv4().slice(0,8).toUpperCase()}`;
    const dados = {
      tipo: 'dpoc_primeira',
      protocolo,
      data: new Date().toISOString(),
      paciente: { nome: paciente },
      identificacao: { idadeAtual, corRaca, profissaoAtual },
      tabagismo: { exposicoes, anoPacigarros, idadeInicio, idadeCessacao },
      sintomas,
      mmrc, cat,
      gold: { goldGrupo, exacerbacoesAno, hospitalizacoes },
      comorbidades, outrasComorbidades,
      stopBang,
      medicamentos,
      imunizacao,
      espirometria,
      bode,
      hdaLivre,
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

      {/* Identificação */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>Nome do paciente</Label>
          <input type="text" value={paciente} onChange={e => setPaciente(e.target.value)} placeholder="Nome completo"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Idade atual (anos)</Label>
          <input type="number" min={0} value={idadeAtual} onChange={e => setIdadeAtual(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Profissão atual</Label>
          <input type="text" value={profissaoAtual} onChange={e => setProfissaoAtual(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      </div>

      <div>
        <Label>Cor ou raça</Label>
        <RadioGroup name="corRaca" value={corRaca} onChange={setCorRaca}
          opcoes={[
            { valor: 'branco', label: 'Branco(a)' }, { valor: 'preto', label: 'Preto(a)' },
            { valor: 'pardo', label: 'Pardo(a)' }, { valor: 'amarelo', label: 'Amarelo(a)' },
            { valor: 'indigena', label: 'Indígena' }, { valor: 'nao_informado', label: 'Não informado' },
          ]}
        />
      </div>

      <SectionDivider />

      {/* HDA */}
      <div>
        <Label>História da doença atual</Label>
        <textarea value={hdaLivre} onChange={e => setHdaLivre(e.target.value)} rows={4}
          placeholder="Sintomas, início, evolução, internações prévias, oxigenoterapia..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
      </div>

      <SectionDivider />

      {/* Exposições */}
      <div>
        <Label>Exposições / fatores de risco</Label>
        <CheckboxGroup opcoes={EXPOSICOES} value={exposicoes} onChange={setExposicoes} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Anos-maço</Label>
          <input type="number" min={0} step={0.5} value={anoPacigarros} onChange={e => setAnoPacigarros(e.target.value)}
            placeholder="Ex: 40" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Idade de início</Label>
          <input type="number" min={0} value={idadeInicio} onChange={e => setIdadeInicio(e.target.value)}
            placeholder="Ex: 15" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Idade de cessação (se parou)</Label>
          <input type="number" min={0} value={idadeCessacao} onChange={e => setIdadeCessacao(e.target.value)}
            placeholder="Ex: 55" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      </div>

      <SectionDivider />

      {/* Sintomas */}
      <div>
        <Label>Sintomas presentes</Label>
        <CheckboxGroup
          opcoes={['Tosse', 'Expectoração', 'Sibilos', 'Dor no peito', 'Dispneia', 'Hemoptise', 'Cianose', 'Edema de MMII']}
          value={sintomas}
          onChange={setSintomas}
        />
      </div>

      <SectionDivider />

      {/* mMRC */}
      <mMRCInline value={mmrc} onChange={setMmrc} />

      <SectionDivider />

      {/* CAT */}
      <CATInline value={cat} onChange={setCat} />

      <SectionDivider />

      {/* GOLD */}
      <div>
        <Label>Classificação GOLD (grupo)</Label>
        <div className="space-y-2">
          {Object.entries(GOLD_LABELS).map(([k, v]) => (
            <label key={k} className={`flex items-start gap-2 cursor-pointer p-3 rounded-lg border transition-colors ${
              goldGrupo === k ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input type="radio" name="goldGrupo" value={k} checked={goldGrupo === k} onChange={() => setGoldGrupo(k)}
                className="mt-0.5 h-4 w-4 text-teal-600" />
              <span className="text-sm text-gray-700">{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Exacerbações no último ano</Label>
          <input type="number" min={0} value={exacerbacoesAno} onChange={e => setExacerbacoesAno(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Hospitalizações no último ano</Label>
          <input type="number" min={0} value={hospitalizacoes} onChange={e => setHospitalizacoes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      </div>

      <SectionDivider />

      {/* Comorbidades */}
      <div>
        <Label>Comorbidades</Label>
        <CheckboxGroup opcoes={COMORBIDADES} value={comorbidades} onChange={setComorbidades} />
      </div>

      <div>
        <Label>Outras comorbidades</Label>
        <input type="text" value={outrasComorbidades} onChange={e => setOutrasComorbidades(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>

      <SectionDivider />

      {/* STOP-BANG */}
      <STOPBANGInline value={stopBang} onChange={setStopBang} />

      <SectionDivider />

      {/* Medicamentos */}
      <div>
        <Label>Medicamentos em uso</Label>
        <MedicamentoSUSAutocomplete value={medicamentos} onChange={setMedicamentos} />
      </div>

      <SectionDivider />

      {/* Imunização */}
      <ImunizacaoFields value={imunizacao} onChange={setImunizacao} />

      <SectionDivider />

      {/* Espirometria */}
      <EspirometriaFields value={espirometria} onChange={setEspirometria} />

      <SectionDivider />

      {/* BODE */}
      <BODEInline value={bode} onChange={setBode} />

      <SectionDivider />

      <button type="button" onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${
          saved ? 'bg-green-500 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}>
        {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Salvo com sucesso!' : 'Salvar formulário'}
      </button>
      <BotaoImprimir />
    </div>
  );
}
