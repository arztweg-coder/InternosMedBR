import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import MedicamentoSUSAutocomplete, { MedicamentoItem } from '../MedicamentoSUSAutocomplete';
import ACTInline, { ACTData } from '../ACTInline';
import GINAInline, { GINAData } from '../GINAInline';
import STOPBANGInline, { STOPBANGData } from '../STOPBANGInline';
import GOALInline, { GOALData } from '../GOALInline';
import EspirometriaFields, { EspirometriaData } from '../EspirometriaFields';
import ImunizacaoFields, { ImunizacaoData } from '../ImunizacaoFields';

// ─── Defaults ────────────────────────────────────────────────────────────────

const defaultACT: ACTData = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, total: 0 };
const defaultGINA: GINAData = { sintomasDiurnos: false, despertarNoturno: false, medicacaoAlivio: false, limitacaoAtividade: false, controle: '' };
const defaultSTOP: STOPBANGData = { S: false, T: false, O: false, P: false, B: false, A: false, N: false, G: false, score: 0, risco: '' };
const defaultGOAL: GOALData = { G: false, O: false, A: false, L: false, score: 0 };
const defaultEspi: EspirometriaData = { data: '', cvfPreL: 0, cvfPrePct: 0, vef1PreL: 0, vef1PrePct: 0, vef1CvfPre: 0, cvfPosL: 0, cvfPosPct: 0, vef1PosL: 0, vef1PosPct: 0, vef1CvfPos: 0, fef2575: 0, observacoes: '' };
const defaultImun: ImunizacaoData = {
  influenza: { aplicado: false, data: '' },
  prevenar13: { aplicado: false, data: '' },
  pneumo23: { aplicado: false, data: '' },
  covid: { aplicado: false, dataUltimaDose: '' },
};

const COMORBIDADES_OPCOES = [
  'Obesidade', 'Depressão', 'Ansiedade', 'HAS', 'DAC', 'IC', 'DM',
  'DRGE', 'Osteoporose', 'Alergia a AAS/AINE', 'Disfunção de corda vocal',
  'Bronquiectasias', 'Pólipos nasais', 'Catarata', 'AOS confirmada',
];

const FATORES_RISCO_OPCOES = [
  'Alto uso de SABA', 'Não prescrição de CI', 'Aderência ruim',
  'Técnica inalatória incorreta', 'Obesidade', 'Rinossinusite crônica',
  'Alergia alimentar', 'Gestação', 'DRGE', 'Tabagismo',
  'Exposição a alérgenos', 'Poluição ambiental', 'Problemas psicológicos',
  'Problemas socioeconômicos', 'Baixo VEF1', 'Alta reversibilidade',
  'Eosinofilia', 'FeNO elevado', 'Intubação prévia / UTI',
];

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

// ─── Formulário ──────────────────────────────────────────────────────────────

export default function AsmaFirstVisit() {
  const [saved, setSaved] = useState(false);

  // Identificação
  const [paciente, setPaciente] = useState('');
  const [idadeAtual, setIdadeAtual] = useState('');
  const [corRaca, setCorRaca] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [profissaoAtual, setProfissaoAtual] = useState('');
  const [profissoesPrevas, setProfissoesPrevas] = useState('');

  // Comorbidades
  const [comorbidades, setComorbidades] = useState<string[]>([]);
  const [outrasComorbidades, setOutrasComorbidades] = useState('');

  // Medicamentos
  const [medicamentos, setMedicamentos] = useState<MedicamentoItem[]>([]);

  // Controle
  const [act, setAct] = useState<ACTData>(defaultACT);
  const [gina, setGina] = useState<GINAData>(defaultGINA);

  // Comorbidades avaliação
  const [stopBang, setStopBang] = useState<STOPBANGData>(defaultSTOP);
  const [goal, setGoal] = useState<GOALData>(defaultGOAL);

  // AOS confirmada
  const [aosConfirmada, setAosConfirmada] = useState('');
  const [aosIAH, setAosIAH] = useState('');
  const [eosinofilia, setEosinofilia] = useState('');
  const [feno, setFeno] = useState('');

  // Imunização
  const [imunizacao, setImunizacao] = useState<ImunizacaoData>(defaultImun);

  // Espirometria
  const [espirometria, setEspirometria] = useState<EspirometriaData>(defaultEspi);

  // Fatores de risco para exacerbação
  const [fatoresRisco, setFatoresRisco] = useState<string[]>([]);

  // HDA livre
  const [hdaLivre, setHdaLivre] = useState('');

  function handleSave() {
    const protocolo = `INTERNOSMED-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-ASMA1VEZ-${uuidv4().slice(0,8).toUpperCase()}`;
    const dados = {
      tipo: 'asma_primeira',
      protocolo,
      data: new Date().toISOString(),
      paciente: { nome: paciente },
      identificacao: { idadeAtual, corRaca, escolaridade, profissaoAtual, profissoesPrevas },
      comorbidades, outrasComorbidades,
      medicamentos,
      controle: { act, gina },
      avaliacaoComorbidades: { stopBang, goal, aosConfirmada, aosIAH, eosinofilia, feno },
      imunizacao,
      espirometria,
      fatoresRisco,
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

  const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
    />
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
      <div>
        <Label>Nome do paciente</Label>
        <Input value={paciente} onChange={setPaciente} placeholder="Nome completo" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Idade atual (anos)</Label>
          <input type="number" min={0} max={120} value={idadeAtual}
            onChange={e => setIdadeAtual(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div>
          <Label>Profissão atual</Label>
          <Input value={profissaoAtual} onChange={setProfissaoAtual} placeholder="Ex: Padeiro" />
        </div>
      </div>

      <div>
        <Label>Cor ou raça</Label>
        <RadioGroup
          name="corRaca"
          value={corRaca}
          onChange={setCorRaca}
          opcoes={[
            { valor: 'branco', label: 'Branco(a)' },
            { valor: 'preto', label: 'Preto(a)' },
            { valor: 'pardo', label: 'Pardo(a)' },
            { valor: 'amarelo', label: 'Amarelo(a)' },
            { valor: 'indigena', label: 'Indígena' },
            { valor: 'nao_informado', label: 'Não informado' },
          ]}
        />
      </div>

      <div>
        <Label>Escolaridade</Label>
        <RadioGroup
          name="escolaridade"
          value={escolaridade}
          onChange={setEscolaridade}
          opcoes={[
            { valor: 'fundamental', label: 'Fund. incompleto/completo' },
            { valor: 'medio', label: 'Médio' },
            { valor: 'graduacao', label: 'Graduação' },
            { valor: 'pos_graduacao', label: 'Pós-graduação' },
            { valor: 'outro', label: 'Outro' },
          ]}
        />
      </div>

      <div>
        <Label>Profissões prévias (ocupação e tempo de exposição)</Label>
        <textarea
          value={profissoesPrevas}
          onChange={e => setProfissoesPrevas(e.target.value)}
          rows={2}
          placeholder="Ex: Pintor por 10 anos; trabalhou em padaria por 5 anos"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
        />
      </div>

      <SectionDivider />

      {/* HDA */}
      <div>
        <Label>História da doença atual</Label>
        <textarea
          value={hdaLivre}
          onChange={e => setHdaLivre(e.target.value)}
          rows={4}
          placeholder="Descreva os sintomas, início, evolução, fatores desencadeantes..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
        />
      </div>

      <SectionDivider />

      {/* Comorbidades */}
      <div>
        <Label>Comorbidades</Label>
        <CheckboxGroup opcoes={COMORBIDADES_OPCOES} value={comorbidades} onChange={setComorbidades} />
      </div>

      <div>
        <Label>Outras comorbidades (texto livre)</Label>
        <Input value={outrasComorbidades} onChange={setOutrasComorbidades} placeholder="Outras condições não listadas..." />
      </div>

      <SectionDivider />

      {/* Medicamentos */}
      <div>
        <Label>Medicamentos em uso</Label>
        <MedicamentoSUSAutocomplete value={medicamentos} onChange={setMedicamentos} />
      </div>

      <SectionDivider />

      {/* ACT */}
      <ACTInline value={act} onChange={setAct} />

      <SectionDivider />

      {/* GINA */}
      <GINAInline value={gina} onChange={setGina} />

      <SectionDivider />

      {/* STOP-BANG */}
      <STOPBANGInline value={stopBang} onChange={setStopBang} />

      <SectionDivider />

      {/* GOAL */}
      <GOALInline value={goal} onChange={setGoal} />

      <SectionDivider />

      {/* AOS / Eosinofilia / FeNO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Label>AOS confirmada (diagnóstico prévio)?</Label>
          <RadioGroup name="aos" value={aosConfirmada} onChange={setAosConfirmada}
            opcoes={[{ valor: 'sim', label: 'Sim' }, { valor: 'nao', label: 'Não' }]} />
        </div>
        {aosConfirmada === 'sim' && (
          <div>
            <Label>IAH (eventos/hora)</Label>
            <input type="number" min={0} value={aosIAH} onChange={e => setAosIAH(e.target.value)}
              placeholder="Ex: 18" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
        )}
        <div>
          <Label>Eosinofilia (&gt;300 células/μL)?</Label>
          <RadioGroup name="eos" value={eosinofilia} onChange={setEosinofilia}
            opcoes={[{ valor: 'sim', label: 'Sim' }, { valor: 'nao', label: 'Não' }, { valor: 'nao_dosado', label: 'Não dosado' }]} />
        </div>
        <div>
          <Label>FeNO (ppb)</Label>
          <input type="number" min={0} value={feno} onChange={e => setFeno(e.target.value)}
            placeholder="Ex: 42" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      </div>

      <SectionDivider />

      {/* Imunização */}
      <ImunizacaoFields value={imunizacao} onChange={setImunizacao} />

      <SectionDivider />

      {/* Espirometria */}
      <EspirometriaFields value={espirometria} onChange={setEspirometria} />

      <SectionDivider />

      {/* Fatores de risco para exacerbação */}
      <div>
        <Label>Fatores de risco para exacerbação</Label>
        <CheckboxGroup opcoes={FATORES_RISCO_OPCOES} value={fatoresRisco} onChange={setFatoresRisco} />
      </div>

      <SectionDivider />

      {/* Salvar */}
      <button
        type="button"
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}
      >
        {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Salvo com sucesso!' : 'Salvar formulário'}
      </button>
    </div>
  );
}
