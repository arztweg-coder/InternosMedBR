import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import BotaoImprimir from '../BotaoImprimir';
import { v4 as uuidv4 } from 'uuid';
import MedicamentoSUSAutocomplete, { MedicamentoItem } from '../MedicamentoSUSAutocomplete';
import FagerstromInline, { FagerstromData } from '../FagerstromInline';
import GloverNilssonInline, { GloverNilssonData } from '../GloverNilssonInline';

const defaultFagerstrom: FagerstromData = { q1: -1, q2: -1, q3: -1, q4: -1, q5: -1, q6: -1, total: 0, nivel: '' };
const defaultGlover: GloverNilssonData = { respostas: Array(11).fill(false), total: 0 };

const FATORES_RECIDIVA = [
  'Café', 'Álcool', 'Estresse/ansiedade', 'Discussão/conflito', 'Festa/evento social',
  'Aborrecimento', 'Companhia de fumantes', 'Depressão', 'Craving intenso', 'Trabalho',
];

export default function TabagismoRetorno() {
  const [saved, setSaved] = useState(false);

  const [paciente, setPaciente] = useState('');

  // Status de cessação
  const [parouFumar, setParouFumar] = useState('');
  const [tempoCessacao, setTempoCessacao] = useState('');
  const [cigarrosDia, setCigarrosDia] = useState('');

  // Recidiva
  const [teveRecidiva, setTeveRecidiva] = useState('');
  const [tempoRecidiva, setTempoRecidiva] = useState('');
  const [fatoresRecidiva, setFatoresRecidiva] = useState<string[]>([]);

  // Lapsos
  const [teveLapso, setTeveLapso] = useState('');
  const [quantosLapsos, setQuantosLapsos] = useState('');
  const [fatoresLapso, setFatoresLapso] = useState<string[]>([]);

  // Sintomas de abstinência
  const [sintomasAbstin, setSintomasAbstin] = useState<string[]>([]);
  const [sintomasAbstinIntens, setSintomasAbstinIntens] = useState('');

  // Estágio motivacional atual
  const [estagioAtual, setEstagioAtual] = useState('');

  // Fagerström (se ainda fuma)
  const [fagerstrom, setFagerstrom] = useState<FagerstromData>(defaultFagerstrom);

  // Glover-Nilsson
  const [gloverNilsson, setGloverNilsson] = useState<GloverNilssonData>(defaultGlover);

  // Medicamentos
  const [medicamentos, setMedicamentos] = useState<MedicamentoItem[]>([]);

  // Conduta
  const [conduta, setConduta] = useState('');
  const [ajuste, setAjuste] = useState<string[]>([]);

  function toggleArr(arr: string[], item: string, set: (v: string[]) => void) {
    set(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
  }

  function handleSave() {
    const protocolo = `INTERNOSMED-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-TABRETORNO-${uuidv4().slice(0,8).toUpperCase()}`;
    const dados = {
      tipo: 'tabagismo_retorno',
      protocolo,
      data: new Date().toISOString(),
      paciente: { nome: paciente },
      status: { parouFumar, tempoCessacao, cigarrosDia },
      recidiva: { teveRecidiva, tempoRecidiva, fatoresRecidiva },
      lapso: { teveLapso, quantosLapsos, fatoresLapso },
      abstinencia: { sintomasAbstin, sintomasAbstinIntens },
      estagioAtual,
      fagerstrom: parouFumar === 'nao' ? fagerstrom : null,
      gloverNilsson,
      medicamentos,
      plano: { conduta, ajuste },
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

      <SectionDivider />

      {/* Status de cessação */}
      <div>
        <Label>Parou de fumar?</Label>
        <RadioGroup name="parou" value={parouFumar} onChange={setParouFumar}
          opcoes={[{ valor: 'sim', label: 'Sim' }, { valor: 'nao', label: 'Não' }, { valor: 'reducao', label: 'Reduziu' }]} />
      </div>

      {parouFumar === 'sim' && (
        <div>
          <Label>Há quanto tempo parou?</Label>
          <input type="text" value={tempoCessacao} onChange={e => setTempoCessacao(e.target.value)}
            placeholder="Ex: 3 semanas / 2 meses" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      )}

      {parouFumar === 'nao' && (
        <div>
          <Label>Cigarros por dia (atual)</Label>
          <input type="number" min={0} value={cigarrosDia} onChange={e => setCigarrosDia(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      )}

      {parouFumar === 'reducao' && (
        <div>
          <Label>Cigarros por dia (atual)</Label>
          <input type="number" min={0} value={cigarrosDia} onChange={e => setCigarrosDia(e.target.value)}
            placeholder="Quantos cigarros/dia agora?" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      )}

      <SectionDivider />

      {/* Recidiva */}
      <div>
        <Label>Teve recidiva (voltou a fumar regularmente)?</Label>
        <RadioGroup name="recidiva" value={teveRecidiva} onChange={setTeveRecidiva}
          opcoes={[{ valor: 'sim', label: 'Sim' }, { valor: 'nao', label: 'Não' }]} />
      </div>

      {teveRecidiva === 'sim' && (
        <>
          <div>
            <Label>Há quanto tempo está em recidiva?</Label>
            <input type="text" value={tempoRecidiva} onChange={e => setTempoRecidiva(e.target.value)}
              placeholder="Ex: 2 semanas / 1 mês" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <div>
            <Label>Fatores associados à recidiva</Label>
            <div className="flex flex-wrap gap-2">
              {FATORES_RECIDIVA.map(f => (
                <label key={f} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  fatoresRecidiva.includes(f) ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}>
                  <input type="checkbox" checked={fatoresRecidiva.includes(f)} onChange={() => toggleArr(fatoresRecidiva, f, setFatoresRecidiva)} className="h-3.5 w-3.5 rounded border-gray-300 text-red-500" />
                  {f}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <SectionDivider />

      {/* Lapsos */}
      <div>
        <Label>Teve lapsos (fumou esporadicamente, sem recidiva)?</Label>
        <RadioGroup name="lapso" value={teveLapso} onChange={setTeveLapso}
          opcoes={[{ valor: 'sim', label: 'Sim' }, { valor: 'nao', label: 'Não' }]} />
      </div>

      {teveLapso === 'sim' && (
        <>
          <div>
            <Label>Quantos lapsos?</Label>
            <input type="number" min={0} value={quantosLapsos} onChange={e => setQuantosLapsos(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 max-w-xs" />
          </div>
          <div>
            <Label>Fatores associados aos lapsos</Label>
            <div className="flex flex-wrap gap-2">
              {FATORES_RECIDIVA.map(f => (
                <label key={f} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  fatoresLapso.includes(f) ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}>
                  <input type="checkbox" checked={fatoresLapso.includes(f)} onChange={() => toggleArr(fatoresLapso, f, setFatoresLapso)} className="h-3.5 w-3.5 rounded border-gray-300 text-amber-500" />
                  {f}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <SectionDivider />

      {/* Sintomas de abstinência */}
      <div>
        <Label>Sintomas de abstinência presentes</Label>
        <div className="flex flex-wrap gap-2">
          {['Irritabilidade', 'Ansiedade', 'Craving intenso', 'Insônia', 'Dificuldade de concentração',
            'Aumento do apetite', 'Cefaleia', 'Tristeza/depressão', 'Constipação'].map(s => (
            <label key={s} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              sintomasAbstin.includes(s) ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}>
              <input type="checkbox" checked={sintomasAbstin.includes(s)} onChange={() => toggleArr(sintomasAbstin, s, setSintomasAbstin)} className="h-3.5 w-3.5 rounded border-gray-300 text-purple-500" />
              {s}
            </label>
          ))}
        </div>
      </div>

      {sintomasAbstin.length > 0 && (
        <div>
          <Label>Intensidade dos sintomas de abstinência</Label>
          <RadioGroup name="intens" value={sintomasAbstinIntens} onChange={setSintomasAbstinIntens}
            opcoes={[{ valor: 'leve', label: 'Leve' }, { valor: 'moderado', label: 'Moderado' }, { valor: 'intenso', label: 'Intenso' }]} />
        </div>
      )}

      <SectionDivider />

      {/* Estágio motivacional */}
      <div>
        <Label>Estágio motivacional atual</Label>
        <RadioGroup name="estagio" value={estagioAtual} onChange={setEstagioAtual}
          opcoes={[
            { valor: 'pre_contemplacao', label: 'Pré-contemplação' },
            { valor: 'contemplacao', label: 'Contemplação' },
            { valor: 'preparacao', label: 'Preparação' },
            { valor: 'acao', label: 'Ação' },
            { valor: 'manutencao', label: 'Manutenção' },
          ]} />
      </div>

      <SectionDivider />

      {/* Fagerström (se ainda fuma) */}
      {(parouFumar === 'nao' || parouFumar === 'reducao') && (
        <>
          <FagerstromInline value={fagerstrom} onChange={setFagerstrom} />
          <SectionDivider />
        </>
      )}

      {/* Glover-Nilsson */}
      <GloverNilssonInline value={gloverNilsson} onChange={setGloverNilsson} />

      <SectionDivider />

      {/* Medicamentos */}
      <div>
        <Label>Medicamentos em uso</Label>
        <MedicamentoSUSAutocomplete value={medicamentos} onChange={setMedicamentos} />
      </div>

      <SectionDivider />

      {/* Conduta */}
      <div>
        <Label>Ajuste de conduta</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {['Manter TRN', 'Aumentar dose TRN', 'Trocar TRN', 'Iniciar Bupropiona', 'Iniciar Vareniclina',
            'Ajustar Vareniclina', 'Encaminhar TCC', 'Encaminhar grupo de suporte', 'Fortalecer vínculo'].map(a => (
            <label key={a} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              ajuste.includes(a) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}>
              <input type="checkbox" checked={ajuste.includes(a)} onChange={() => toggleArr(ajuste, a, setAjuste)} className="h-3.5 w-3.5 rounded border-gray-300 text-teal-600" />
              {a}
            </label>
          ))}
        </div>
        <textarea value={conduta} onChange={e => setConduta(e.target.value)} rows={3}
          placeholder="Detalhar condutas, orientações e próximos passos..."
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
      <BotaoImprimir />
    </div>
  );
}
