import { useState } from 'react';
import { ArrowLeft, Bone, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReumatologiaCalculators() {
  const navigate = useNavigate();
  const [activeTest, setActiveTest] = useState<string>('');

  const tests = [
    {
      id: 'phalen',
      name: 'Manobra de Phalen',
      description: 'Síndrome do Túnel do Carpo',
      procedure: 'Flexionar completamente os punhos e mantê-los unidos por 60 segundos',
      positive: 'Parestesias em território do nervo mediano (polegar, indicador, médio)',
      indication: 'Síndrome do túnel do carpo',
    },
    {
      id: 'tinel',
      name: 'Sinal de Tinel',
      description: 'Compressão de nervo periférico',
      procedure: 'Percussão leve sobre o trajeto do nervo (ex: punho, cotovelo)',
      positive: 'Parestesias/formigamento no território do nervo',
      indication: 'Compressão nervosa (túnel do carpo, cubital)',
    },
    {
      id: 'finkelstein',
      name: 'Teste de Finkelstein',
      description: 'Tenossinovite de De Quervain',
      procedure: 'Flexão do polegar dentro da mão fechada + desvio ulnar do punho',
      positive: 'Dor intensa na face radial do punho',
      indication: 'Tenossinovite de De Quervain',
    },
    {
      id: 'apley',
      name: 'Teste de Apley',
      description: 'Lesão de menisco',
      procedure: 'Paciente em prono, joelho fletido 90°. Rotação interna/externa com compressão',
      positive: 'Dor e/ou estalido na linha articular',
      indication: 'Lesão meniscal (medial ou lateral)',
    },
    {
      id: 'gaveta-anterior',
      name: 'Gaveta Anterior',
      description: 'Lesão do LCA',
      procedure: 'Joelho fletido 90°, puxar tíbia anteriormente',
      positive: 'Deslocamento anterior excessivo da tíbia',
      indication: 'Ruptura do ligamento cruzado anterior (LCA)',
    },
    {
      id: 'lachman',
      name: 'Teste de Lachman',
      description: 'Lesão do LCA (mais sensível que gaveta)',
      procedure: 'Joelho fletido 20-30°, tração anterior da tíbia',
      positive: 'Deslocamento anterior aumentado + ausência de stop firme',
      indication: 'Ruptura do LCA (sensibilidade >90%)',
    },
    {
      id: 'mcmurray',
      name: 'Teste de McMurray',
      description: 'Lesão de menisco',
      procedure: 'Rotação interna (menisco lateral) ou externa (medial) com extensão do joelho',
      positive: 'Estalido palpável/audível + dor',
      indication: 'Lesão meniscal',
    },
    {
      id: 'fabere',
      name: 'Teste FABERE (Patrick)',
      description: 'Patologia de quadril ou sacroilíaca',
      procedure: 'Flexão, Abdução, Rotação Externa do quadril (calcanhar no joelho contralateral)',
      positive: 'Dor em região inguinal (quadril) ou sacroilíaca',
      indication: 'Artropatia de quadril, sacroileíte',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/calculadoras')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Bone className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reumatologia</h1>
              <p className="text-sm text-gray-600">Manobras e testes clínicos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cards de Testes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tests.map((test) => (
            <button
              key={test.id}
              onClick={() => setActiveTest(test.id)}
              className={`p-6 bg-white rounded-lg shadow-sm border-2 transition-all text-left hover:shadow-md ${
                activeTest === test.id ? 'border-orange-600' : 'border-gray-200'
              }`}
            >
              <h3 className="font-bold text-lg mb-2">{test.name}</h3>
              <p className="text-sm text-gray-600">{test.description}</p>
            </button>
          ))}
        </div>

        {/* Detalhes do Teste Ativo */}
        {activeTest && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {tests
              .filter((t) => t.id === activeTest)
              .map((test) => (
                <div key={test.id}>
                  <h2 className="text-2xl font-bold mb-6">{test.name}</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                          Indicação
                        </span>
                      </h3>
                      <p className="text-gray-700">{test.indication}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                          Procedimento
                        </span>
                      </h3>
                      <p className="text-gray-700">{test.procedure}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                          Teste Positivo
                        </span>
                      </h3>
                      <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{test.positive}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
                          Teste Negativo
                        </span>
                      </h3>
                      <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4 flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">Ausência dos sinais descritos acima</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 text-center">
            ⚠️ Ferramenta de apoio à decisão clínica. Não substitui o julgamento do profissional de saúde.
          </p>
        </div>
      </main>
    </div>
  );
}
