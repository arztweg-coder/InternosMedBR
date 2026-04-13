import { useState, lazy, Suspense } from 'react';
import { ChevronDown, ClipboardList, ArrowLeft, Loader2 } from 'lucide-react';

// Lazy load dos formulários de pneumologia
const AsmaFirstVisit    = lazy(() => import('../components/pneumologia/forms/AsmaFirstVisit'));
const DPOCFirstVisit    = lazy(() => import('../components/pneumologia/forms/DPOCFirstVisit'));
const DPOCReturn        = lazy(() => import('../components/pneumologia/forms/DPOCReturn'));
const TabagismoInicial  = lazy(() => import('../components/pneumologia/forms/TabagismoInicial'));
const TabagismoRetorno  = lazy(() => import('../components/pneumologia/forms/TabagismoRetorno'));

const especialidades = [
  { id: 'cardiologia',   nome: 'Cardiologia',             emoji: '❤️',  descricao: 'Anamnese cardiovascular' },
  { id: 'dermatologia',  nome: 'Dermatologia',             emoji: '🩹',  descricao: 'Anamnese dermatológica' },
  { id: 'endocrino',     nome: 'Endocrinologia',           emoji: '🩺',  descricao: 'Anamnese endócrina' },
  { id: 'gastro',        nome: 'Gastroenterologia',        emoji: '🩺',  descricao: 'Anamnese digestiva' },
  { id: 'geriatria',     nome: 'Geriatria',                emoji: '👴',  descricao: 'Anamnese geriátrica' },
  { id: 'gineco',        nome: 'Ginecologia',              emoji: '🩺',  descricao: 'Anamnese ginecológica' },
  { id: 'hematologia',   nome: 'Hematologia',              emoji: '🩸',  descricao: 'Anamnese hematológica' },
  { id: 'infectologia',  nome: 'Infectologia',             emoji: '🦠',  descricao: 'Anamnese infecciosa' },
  { id: 'emergencia',    nome: 'Medicina de Emergência',   emoji: '🚑',  descricao: 'Anamnese de urgência/emergência' },
  { id: 'nefrologia',    nome: 'Nefrologia',               emoji: '🩺',  descricao: 'Anamnese renal' },
  { id: 'neurologia',    nome: 'Neurologia',               emoji: '🧠',  descricao: 'Anamnese neurológica' },
  { id: 'obstetricia',   nome: 'Obstetrícia',              emoji: '🤰',  descricao: 'Anamnese obstétrica' },
  { id: 'oftalmologia',  nome: 'Oftalmologia',             emoji: '👁️', descricao: 'Anamnese oftalmológica' },
  { id: 'ortopedia',     nome: 'Ortopedia',                emoji: '🦴',  descricao: 'Anamnese ortopédica' },
  { id: 'otorrino',      nome: 'Otorrinolaringologia',     emoji: '👂',  descricao: 'Anamnese ORL' },
  { id: 'pediatria',     nome: 'Pediatria',                emoji: '👶',  descricao: 'Anamnese pediátrica' },
  { id: 'pneumologia',   nome: 'Pneumologia',              emoji: '🫁',  descricao: 'Anamnese respiratória' },
  { id: 'psiquiatria',   nome: 'Psiquiatria',              emoji: '🧠',  descricao: 'Anamnese psiquiátrica' },
  { id: 'reumatologia',  nome: 'Reumatologia',             emoji: '🦴',  descricao: 'Anamnese reumatológica' },
  { id: 'urologia',      nome: 'Urologia',                 emoji: '🩺',  descricao: 'Anamnese urológica' },
];

// ─── Tipos de formulário pneumologia ─────────────────────────────────────────

type PneumoFormId = 'asma_primeira' | 'dpoc_primeira' | 'dpoc_retorno' | 'tabagismo_inicial' | 'tabagismo_retorno';

const PNEUMO_FORMS: Array<{
  id: PneumoFormId;
  titulo: string;
  descricao: string;
  cor: string;
  corBg: string;
}> = [
  {
    id: 'asma_primeira',
    titulo: 'Asma — 1ª Consulta',
    descricao: 'Avaliação completa com ACT, GINA, STOP-BANG, espirometria e fatores de risco',
    cor: 'border-blue-400 text-blue-700',
    corBg: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    id: 'dpoc_primeira',
    titulo: 'DPOC — 1ª Consulta',
    descricao: 'Avaliação com mMRC, CAT, BODE, GOLD e espirometria',
    cor: 'border-teal-400 text-teal-700',
    corBg: 'bg-teal-50 hover:bg-teal-100',
  },
  {
    id: 'dpoc_retorno',
    titulo: 'DPOC — Retorno',
    descricao: 'Acompanhamento: sintomas, exacerbações, mMRC, CAT e conduta',
    cor: 'border-teal-400 text-teal-700',
    corBg: 'bg-teal-50 hover:bg-teal-100',
  },
  {
    id: 'tabagismo_inicial',
    titulo: 'Tabagismo — Avaliação Inicial',
    descricao: 'Fagerström, estágio motivacional, histórico tabágico e plano terapêutico',
    cor: 'border-amber-400 text-amber-700',
    corBg: 'bg-amber-50 hover:bg-amber-100',
  },
  {
    id: 'tabagismo_retorno',
    titulo: 'Tabagismo — Retorno',
    descricao: 'Status de cessação, recidivas, lapsos, Glover-Nilsson e ajuste de conduta',
    cor: 'border-amber-400 text-amber-700',
    corBg: 'bg-amber-50 hover:bg-amber-100',
  },
];

// ─── Componente Pneumologia ───────────────────────────────────────────────────

function PneumologiaAnamnese() {
  const [formAtivo, setFormAtivo] = useState<PneumoFormId | null>(null);

  if (formAtivo) {
    const form = PNEUMO_FORMS.find(f => f.id === formAtivo)!;
    return (
      <div>
        <button
          onClick={() => setFormAtivo(null)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos formulários
        </button>

        <p className="text-base font-semibold text-gray-800 mb-5">{form.titulo}</p>

        <Suspense fallback={
          <div className="flex items-center gap-2 text-gray-500 py-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Carregando formulário...</span>
          </div>
        }>
          {formAtivo === 'asma_primeira'       && <AsmaFirstVisit />}
          {formAtivo === 'dpoc_primeira'        && <DPOCFirstVisit />}
          {formAtivo === 'dpoc_retorno'         && <DPOCReturn />}
          {formAtivo === 'tabagismo_inicial'    && <TabagismoInicial />}
          {formAtivo === 'tabagismo_retorno'    && <TabagismoRetorno />}
        </Suspense>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PNEUMO_FORMS.map(f => (
        <button
          key={f.id}
          onClick={() => setFormAtivo(f.id)}
          className={`text-left p-4 rounded-xl border-2 transition-colors ${f.cor} ${f.corBg}`}
        >
          <p className="font-semibold text-sm mb-1">{f.titulo}</p>
          <p className="text-xs opacity-75 leading-snug">{f.descricao}</p>
        </button>
      ))}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AnamnesePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const selected = especialidades.find(e => e.id === expandedId) ?? null;

  function handleSpecialtySelect(id: string) {
    setExpandedId(expandedId === id ? null : id);
    // Scroll automático no mobile (mesma lógica das calculadoras)
    if (expandedId !== id) {
      setTimeout(() => {
        const panel = document.getElementById('anamnese-panel');
        if (panel && window.innerWidth < 1024) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Título */}
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList className="w-6 h-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-gray-800">Anamnese por Especialidade</h1>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        20 especialidades — selecione para iniciar o roteiro de anamnese.
      </p>

      <div className="flex flex-col lg:flex-row gap-5">

        {/* Sidebar de especialidades */}
        <nav className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {especialidades.map(esp => (
              <div key={esp.id} className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => handleSpecialtySelect(esp.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                    expandedId === esp.id
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{esp.emoji}</span>
                    <span>{esp.nome}</span>
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedId === esp.id ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </nav>

        {/* Área de conteúdo */}
        <div id="anamnese-panel" className="flex-1 min-w-0">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <span className="text-4xl leading-none">{selected.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selected.nome}</h2>
                  <p className="text-sm text-gray-500">{selected.descricao}</p>
                </div>
              </div>

              {/* Pneumologia — formulários ativos */}
              {selected.id === 'pneumologia' ? (
                <PneumologiaAnamnese />
              ) : (
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-8 text-center">
                  <ClipboardList className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-700 mb-1">
                    Formulário em desenvolvimento
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    O roteiro específico de anamnese para <strong>{selected.nome}</strong> será implementado conforme o modelo fornecido.
                  </p>
                  <div className="mt-5 rounded-lg bg-teal-50 border border-teal-200 p-4 text-left max-w-sm mx-auto">
                    <p className="text-xs font-semibold text-teal-700 mb-2">Próximos passos:</p>
                    <ul className="text-xs text-teal-600 space-y-1">
                      <li>• A equipe ArztWeg fornecerá o modelo de cada especialidade</li>
                      <li>• Campos personalizados por especialidade</li>
                      <li>• Validação e salvamento local</li>
                      <li>• Impressão formatada em A4</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-1">
                Selecione uma especialidade
              </h3>
              <p className="text-sm text-gray-400">
                Escolha uma das 20 especialidades à esquerda para iniciar o roteiro de anamnese.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
