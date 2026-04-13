import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import BotaoImprimir from '../BotaoImprimir';
import { v4 as uuidv4 } from 'uuid';
import MedicamentoSUSAutocomplete, { MedicamentoItem } from '../MedicamentoSUSAutocomplete';
import FagerstromInline, { FagerstromData } from '../FagerstromInline';

const defaultFagerstrom: FagerstromData = { q1: -1, q2: -1, q3: -1, q4: -1, q5: -1, q6: -1, total: 0, nivel: '' };

const MOTIVACIONAL_OPCOES = [
  { valor: 'pre_contemplacao', label: 'Pré-contemplação', desc: 'Não pensa em parar nos próximos 6 meses' },
  { valor: 'contemplacao', label: 'Contemplação', desc: 'Pensa em parar nos próximos 6 meses' },
  { valor: 'preparacao', label: 'Preparação', desc: 'Pretende parar no próximo mês / já tomou alguma providência' },
  { valor: 'acao', label: 'Ação', desc: 'Parou de fumar há menos de 6 meses' },
  { valor: 'manutencao', label: 'Manutenção', desc: 'Não fuma há mais de 6 meses' },
];

const GATILHOS = [
  'Café', 'Álcool', 'Refeições', 'Estresse/ansiedade', 'Trabalho',
  'Companhia de fumantes', 'Direção', 'Após sexo', 'Entediado', 'Pausa/intervalo',
];

export default function TabagismoInicial() {
  const [saved, setSaved] = useState(false);

  const [paciente, setPaciente] = useState('');
  const [idadeAtual, setIdadeAtual] = useState('');

  // Histórico tabágico
  const [idadeInicio, setIdadeInicio] = useState('');
  const [cigarrosDia, setCigarrosDia] = useState('');
  const [anoPacigarros, setAnoPacigarros] = useState('');
  const [tipoTabaco, setTipoTabaco] = useState<string[]>([]);
  const [outrosTabaco, setOutrosTabaco] = useState('');
  const [tentativasCessacao, setTentativasCessacao] = useState('');
  const [maiorAbstinencia, setMaiorAbstinencia] = useState('');
  const [motivoCessacaoPrevia, setMotivoCessacaoPrevia] = useState('');
  const [motivoRecidiva, setMotivoRecidiva] = useState('');
  const [gatilhos, setGatilhos] = useState<string[]>([]);

  // Fagerström
  const [fagerstrom, setFagerstrom] = useState<FagerstromData>(defaultFagerstrom);

  // Estágio motivacional
  const [estagioMotivacional, setEstagioMotivacional] = useState('');

  // Motivação para parar
  const [motivacaoParar, setMotivacaoParar] = useState('');
  const [medo, setMedo] = useState('');

  // Comorbidades / contexto
  const [comorbidades, setComorbidades] = useState('');
  const [psicossocial, setPsicossocial] = useState('');

  // Medicamentos
  const [medicamentos, setMedicamentos] = useState<MedicamentoItem[]>([]);

  // Plano terapêutico
  const [abordagem, setAbordagem] = useState<string[]>([]);
  const [dataCessacaoPlano, setDataCessacaoPlano] = useState('');
  const [conduta, setConduta] = useState('');

  function toggleArr(arr: string[], item: string, set: (v: string[]) => void) {
    set(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
  }

  function handleSave() {
    const protocolo = `INTERNOSMED-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-TABINICIAL-${uuidv4().slice(0,8).toUpperCase()}`;
    const dados = {
      tipo: 'tabagismo_inicial',
      protocolo,
      data: new Date().toISOString(),
      paciente: { nome: paciente },
      historico: { idadeInicio, cigarrosDia, anoPacigarros, tipoTabaco, outrosTabaco, tentativasCessacao, maiorAbstinencia, motivoCessacaoPrevia, motivoRecidiva, gatilhos },
      fagerstrom,
      motivacional: { estagioMotivacional, motivacaoParar, medo },
      contexto: { comorbidades, psicossocial },
      medicamentos,
      plano: { abordagem, dataCessacaoPlano, conduta },
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
      </div>

      <SectionDivider />

      {/* Histórico tabágico */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Idade de início</Label>
          <input type="number" min={0} value={idadeInicio} onChange={e => setIdadeInicio(e.target.value)}
            placeholder="Ex: 15" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Cigarros por dia</Label>
          <input type="number" min={0} value={cigarrosDia} onChange={e => setCigarrosDia(e.target.value)}
            placeholder="Ex: 20" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Anos-maço</Label>
          <input type="number" step={0.5} value={anoPacigarros} onChange={e => setAnoPacigarros(e.target.value)}
            placeholder="Ex: 30" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      </div>

      <div>
        <Label>Tipo de tabaco</Label>
        <div className="flex flex-wrap gap-2">
          {['Cigarro industrializado', 'Cigarro de palha', 'Charuto', 'Cachimbo', 'Cigarro eletrônico', 'Narguilé'].map(t => (
            <label key={t} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              tipoTabaco.includes(t) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}>
              <input type="checkbox" checked={tipoTabaco.includes(t)} onChange={() => toggleArr(tipoTabaco, t, setTipoTabaco)} className="h-3.5 w-3.5 rounded border-gray-300 text-teal-600" />
              {t}
            </label>
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* Histórico de tentativas */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Tentativas de cessação prévias</Label>
          <input type="number" min={0} value={tentativasCessacao} onChange={e => setTentativasCessacao(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div>
          <Label>Maior período de abstinência</Label>
          <input type="text" value={maiorAbstinencia} onChange={e => setMaiorAbstinencia(e.target.value)}
            placeholder="Ex: 3 meses" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      </div>

      {Number(tentativasCessacao) > 0 && (
        <>
          <div>
            <Label>Motivação para cessação anterior</Label>
            <input type="text" value={motivoCessacaoPrevia} onChange={e => setMotivoCessacaoPrevia(e.target.value)}
              placeholder="Ex: Doença / gravidez / pressão familiar" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <div>
            <Label>Motivo da recidiva</Label>
            <input type="text" value={motivoRecidiva} onChange={e => setMotivoRecidiva(e.target.value)}
              placeholder="Ex: Estresse / abstinência / amigos fumantes" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
        </>
      )}

      <div>
        <Label>Gatilhos para fumar</Label>
        <div className="flex flex-wrap gap-2">
          {GATILHOS.map(g => (
            <label key={g} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              gatilhos.includes(g) ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}>
              <input type="checkbox" checked={gatilhos.includes(g)} onChange={() => toggleArr(gatilhos, g, setGatilhos)} className="h-3.5 w-3.5 rounded border-gray-300 text-amber-500" />
              {g}
            </label>
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* Fagerström */}
      <FagerstromInline value={fagerstrom} onChange={setFagerstrom} />

      <SectionDivider />

      {/* Estágio motivacional */}
      <div>
        <Label>Estágio motivacional</Label>
        <div className="space-y-2">
          {MOTIVACIONAL_OPCOES.map(op => (
            <label key={op.valor} className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border transition-colors ${
              estagioMotivacional === op.valor ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input type="radio" name="estagio" value={op.valor} checked={estagioMotivacional === op.valor} onChange={() => setEstagioMotivacional(op.valor)}
                className="mt-0.5 h-4 w-4 text-teal-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">{op.label}</p>
                <p className="text-xs text-gray-500">{op.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Motivação principal para parar de fumar</Label>
        <input type="text" value={motivacaoParar} onChange={e => setMotivacaoParar(e.target.value)}
          placeholder="Ex: Saúde / família / dinheiro / doença diagnosticada" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>

      <div>
        <Label>Medos / barreiras para cessar</Label>
        <input type="text" value={medo} onChange={e => setMedo(e.target.value)}
          placeholder="Ex: Ganho de peso / irritabilidade / abstinência" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>

      <SectionDivider />

      {/* Contexto clínico */}
      <div>
        <Label>Comorbidades relevantes</Label>
        <input type="text" value={comorbidades} onChange={e => setComorbidades(e.target.value)}
          placeholder="DPOC, asma, doença cardiovascular, neoplasia..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>

      <div>
        <Label>Contexto psicossocial</Label>
        <textarea value={psicossocial} onChange={e => setPsicossocial(e.target.value)} rows={2}
          placeholder="Depressão, ansiedade, situação familiar, trabalho, suporte social..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
      </div>

      <SectionDivider />

      {/* Medicamentos */}
      <div>
        <Label>Medicamentos em uso</Label>
        <MedicamentoSUSAutocomplete value={medicamentos} onChange={setMedicamentos} />
      </div>

      <SectionDivider />

      {/* Plano */}
      <div>
        <Label>Abordagem terapêutica</Label>
        <div className="flex flex-wrap gap-2">
          {['Intervenção breve (5As)', 'TRN — adesivo', 'TRN — goma', 'TRN — inalador', 'Bupropiona', 'Vareniclina', 'Apoio em grupo', 'TCC individual'].map(a => (
            <label key={a} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              abordagem.includes(a) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}>
              <input type="checkbox" checked={abordagem.includes(a)} onChange={() => toggleArr(abordagem, a, setAbordagem)} className="h-3.5 w-3.5 rounded border-gray-300 text-teal-600" />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Data planejada para cessação</Label>
        <input type="date" value={dataCessacaoPlano} onChange={e => setDataCessacaoPlano(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>

      <div>
        <Label>Conduta e orientações</Label>
        <textarea value={conduta} onChange={e => setConduta(e.target.value)} rows={3}
          placeholder="Prescrições, encaminhamentos, orientações comportamentais..."
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
