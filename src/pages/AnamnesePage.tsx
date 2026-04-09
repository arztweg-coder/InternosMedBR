import { useState } from 'react';
import { ChevronDown, ClipboardList } from 'lucide-react';

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

export default function AnamnesePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const selected = especialidades.find(e => e.id === expandedId) ?? null;

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
                  onClick={() => setExpandedId(expandedId === esp.id ? null : esp.id)}
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
        <div className="flex-1 min-w-0">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <span className="text-4xl leading-none">{selected.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selected.nome}</h2>
                  <p className="text-sm text-gray-500">{selected.descricao}</p>
                </div>
              </div>

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
                    <li>• Dr. Frank fornecerá o modelo de cada especialidade</li>
                    <li>• Campos personalizados por especialidade</li>
                    <li>• Validação e salvamento local</li>
                    <li>• Impressão formatada em A4</li>
                  </ul>
                </div>
              </div>
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
