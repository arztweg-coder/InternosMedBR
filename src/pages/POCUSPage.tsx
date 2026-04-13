import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Janela { nome: string; desc: string; }
interface Etapa { nome: string; desc: string; }

interface Protocolo {
  id: string;
  nome: string;
  descricao: string;
  emoji: string;
  janelas?: Janela[];
  etapas?: Etapa[];
  perfis?: string[];
  interpretacao?: string[];
  sinais?: string[];
  causas?: string[];
}

export default function POCUSPage() {
  const navigate = useNavigate();
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<string | null>(null);

  const protocolos: Protocolo[] = [
    {
      id: 'efast',
      nome: 'eFAST',
      descricao: 'Extended Focused Assessment with Sonography for Trauma',
      emoji: '🫀',
      janelas: [
        { nome: 'Morrison (Hepatorrenal)', desc: 'Líquido livre peritoneal' },
        { nome: 'Esplenorrenal', desc: 'Espaço esplenorrenal' },
        { nome: 'Pélvica', desc: 'Fundo de saco de Douglas' },
        { nome: 'Pericárdio', desc: 'Derrame pericárdico' },
        { nome: 'Tórax Anterior Bilateral', desc: 'Pneumotórax' },
        { nome: 'Tórax Posterior Bilateral', desc: 'Hemotórax' },
      ],
      interpretacao: [
        '✓ Positivo: Líquido livre = Laparotomia urgente',
        '✓ Derrame pericárdico: Pericardiocentese',
        '✓ Pneumotórax: Drenagem torácica',
        '⚠️ Volume mínimo detectável: 100-200ml',
      ],
    },
    {
      id: 'blue',
      nome: 'BLUE Protocol',
      descricao: 'Bedside Lung Ultrasound in Emergency',
      emoji: '🫁',
      janelas: [
        { nome: 'PLAPS', desc: 'Posterolateral Alveolar and/or Pleural Syndrome' },
        { nome: 'Anterior Superior', desc: '2º EIC linha hemiclavicular' },
        { nome: 'Anterior Inferior', desc: '4º-5º EIC linha axilar anterior' },
      ],
      perfis: [
        'Perfil A: Linhas A bilaterais = Normal ou TEP',
        'Perfil B: Linhas B bilaterais = Edema pulmonar',
        "Perfil A': Abolição sliding + ponto pulmonar = PNX",
        'Perfil C: Consolidação anterior = Pneumonia',
        'Perfil A + TVP = TEP (90-95% especificidade)',
      ],
      sinais: [
        'Lung Sliding: Modo-M "Praia" (normal) vs "Código de barras" (PNX)',
        'Linhas B: ≥3 = Síndrome intersticial',
        'Ponto Pulmonar: 100% específico para PNX',
        'Consolidação: Broncograma dinâmico vs estático',
      ],
    },
    {
      id: 'rush',
      nome: 'RUSH',
      descricao: 'Rapid Ultrasound in SHock',
      emoji: '💉',
      etapas: [
        { nome: 'Bomba (Coração)', desc: 'Função VE, derrame, tamponamento' },
        { nome: 'Tanque (Volemia)', desc: 'VCI, líquido livre, aorta' },
        { nome: 'Tubos (Vasos)', desc: 'TVP, dissecção aórtica' },
      ],
      causas: [
        'Hipovolêmico: VCI colapsada + sem líquido livre',
        'Cardiogênico: Disfunção VE + congestão',
        'Obstrutivo: Cor pulmonale (TEP) ou tamponamento',
        'Distributivo: Hiperdinâmico + VCI dilatada',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/calculadoras')}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">🔊</span>
              POCUS — Point of Care Ultrasound
            </h1>
            <p className="text-gray-600 mt-1">
              Protocolos de ultrassom à beira do leito para emergências
            </p>
          </div>
        </div>

        {/* Cards dos Protocolos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {protocolos.map((protocolo) => (
            <button
              key={protocolo.id}
              onClick={() => setProtocoloSelecionado(protocolo.id === protocoloSelecionado ? null : protocolo.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                protocoloSelecionado === protocolo.id
                  ? 'bg-violet-50 border-violet-500 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-violet-300 hover:shadow-md'
              }`}
            >
              <div className="text-4xl mb-3">{protocolo.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{protocolo.nome}</h3>
              <p className="text-sm text-gray-600">{protocolo.descricao}</p>
            </button>
          ))}
        </div>

        {/* Detalhes do Protocolo Selecionado */}
        {protocoloSelecionado && (() => {
          const p = protocolos.find(x => x.id === protocoloSelecionado)!;
          return (
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-violet-200">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{p.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{p.nome}</h2>
                  <p className="text-gray-600">{p.descricao}</p>
                </div>
              </div>

              {p.janelas && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-violet-900">📍 Janelas de Avaliação</h3>
                  <div className="grid gap-3">
                    {p.janelas.map((janela, i) => (
                      <div key={i} className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                        <p className="font-semibold text-gray-900">{janela.nome}</p>
                        <p className="text-sm text-gray-600">{janela.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {p.etapas && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-violet-900">📋 Etapas do Protocolo</h3>
                  <div className="grid gap-3">
                    {p.etapas.map((etapa, i) => (
                      <div key={i} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-semibold text-gray-900">{etapa.nome}</p>
                        <p className="text-sm text-gray-600">{etapa.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {p.perfis && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-violet-900">🎯 Perfis Diagnósticos</h3>
                  <div className="space-y-2">
                    {p.perfis.map((perfil, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-violet-600 mt-1 flex-shrink-0">•</span>
                        <span>{perfil}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {p.interpretacao && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-violet-900">💡 Interpretação</h3>
                  <div className="space-y-2">
                    {p.interpretacao.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="mt-1 flex-shrink-0">{item.startsWith('✓') ? '✓' : '⚠️'}</span>
                        <span>{item.replace(/^[✓⚠️]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {p.sinais && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-violet-900">🔍 Sinais Ultrassonográficos</h3>
                  <div className="space-y-2">
                    {p.sinais.map((sinal, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                        <span>{sinal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {p.causas && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-violet-900">🩺 Causas de Choque</h3>
                  <div className="space-y-2">
                    {p.causas.map((causa, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 mt-1 flex-shrink-0">•</span>
                        <span>{causa}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Referências */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Referências
                </h3>
                <div className="text-xs text-gray-600 space-y-1">
                  {p.id === 'efast' && (
                    <>
                      <p>• Kirkpatrick AW et al. J Trauma Acute Care Surg 2016</p>
                      <p>• ATLS 10th Edition 2018</p>
                    </>
                  )}
                  {p.id === 'blue' && (
                    <>
                      <p>• Lichtenstein DA et al. Anesthesiology 2004</p>
                      <p>• Volpicelli G et al. Intensive Care Med 2012</p>
                    </>
                  )}
                  {p.id === 'rush' && (
                    <>
                      <p>• Perera P et al. J Emerg Trauma Shock 2010</p>
                      <p>• Seif D et al. West J Emerg Med 2012</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {!protocoloSelecionado && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
            <p className="text-blue-900 font-medium">
              👆 Selecione um protocolo acima para ver os detalhes
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
