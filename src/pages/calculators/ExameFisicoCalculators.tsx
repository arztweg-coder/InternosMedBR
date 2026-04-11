import { useState } from 'react';
import { ArrowLeft, Stethoscope, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExameFisicoCalculators() {
  const navigate = useNavigate();
  const [activeSystem, setActiveSystem] = useState<string>('');

  const systems = [
    {
      id: 'geral',
      name: 'Exame Geral (ECTOSCOPIA)',
      icon: '👤',
      items: [
        { exam: 'Estado geral', normal: 'Bom' },
        { exam: 'Nível de consciência', normal: 'Lúcido e orientado em tempo e espaço' },
        { exam: 'Hidratação', normal: 'Hidratado' },
        { exam: 'Nutrição', normal: 'Eutrófico' },
        { exam: 'Fácies', normal: 'Atípica, não dismórfica' },
        { exam: 'Coloração de mucosas', normal: 'Coradas' },
        { exam: 'Icterícia', normal: 'Ausente (anictérico)' },
        { exam: 'Cianose', normal: 'Ausente (acianótico)' },
        { exam: 'Linfonodos palpáveis', normal: 'Ausentes (sem adenomegalia)' },
        { exam: 'Edema', normal: 'Ausente' },
      ],
    },
    {
      id: 'cardio',
      name: 'Cardiovascular',
      icon: '❤️',
      items: [
        { exam: 'Inspeção do tórax', normal: 'Sem abaulamentos ou retrações' },
        { exam: 'Ictus cordis', normal: 'Visível/palpável no 5º EIC linha hemiclavicular esquerda' },
        { exam: 'Ausculta cardíaca', normal: 'Bulhas rítmicas normofonéticas em 2 tempos, sem sopros' },
        { exam: 'Frequência cardíaca', normal: '60-100 bpm (adulto)' },
        { exam: 'Pulsos periféricos', normal: 'Palpáveis, simétricos, amplitude normal' },
        { exam: 'Pressão arterial', normal: '<120/80 mmHg (adulto)' },
        { exam: 'Turgência jugular', normal: 'Ausente (sem estase jugular)' },
      ],
    },
    {
      id: 'respiratorio',
      name: 'Respiratório',
      icon: '🫁',
      items: [
        { exam: 'Inspeção do tórax', normal: 'Simétrico, expansibilidade preservada' },
        { exam: 'Tipo respiratório', normal: 'Costoabdominal (homem), toracoabdominal (mulher)' },
        { exam: 'Frequência respiratória', normal: '12-20 irpm (adulto)' },
        { exam: 'Palpação', normal: 'Expansibilidade simétrica, FTV preservado' },
        { exam: 'Percussão', normal: 'Som claro pulmonar em todos os campos' },
        { exam: 'Ausculta pulmonar', normal: 'Murmúrio vesicular presente bilateralmente, sem ruídos adventícios' },
      ],
    },
    {
      id: 'abdome',
      name: 'Abdome',
      icon: '🫃',
      items: [
        { exam: 'Inspeção', normal: 'Plano, sem cicatrizes, sem lesões de pele' },
        { exam: 'Ausculta', normal: 'Ruídos hidroaéreos presentes e normais' },
        { exam: 'Percussão', normal: 'Timpânico difuso' },
        { exam: 'Palpação superficial', normal: 'Indolor, sem massas palpáveis' },
        { exam: 'Palpação profunda', normal: 'Indolor, sem visceromegalias' },
        { exam: 'Fígado', normal: 'Não palpável (ou borda hepática a 1cm do RCD)' },
        { exam: 'Baço', normal: 'Não palpável (Traube livre)' },
        { exam: 'Sinal de Murphy', normal: 'Negativo' },
        { exam: 'Sinal de Blumberg', normal: 'Negativo' },
        { exam: 'Sinal de Giordano', normal: 'Negativo bilateralmente' },
      ],
    },
    {
      id: 'neurologico',
      name: 'Neurológico',
      icon: '🧠',
      items: [
        { exam: 'Consciência', normal: 'Lúcido e orientado (GCS 15)' },
        { exam: 'Marcha', normal: 'Normal, sem ataxia' },
        { exam: 'Força muscular', normal: 'Grau 5/5 em todos os grupos musculares' },
        { exam: 'Tônus muscular', normal: 'Normal (normotônico)' },
        { exam: 'Sensibilidade', normal: 'Tátil, dolorosa e térmica preservadas' },
        { exam: 'Reflexos profundos', normal: '++/4+ simétricos' },
        { exam: 'Reflexo cutaneoplantar', normal: 'Flexor bilateral' },
        { exam: 'Sinal de Babinski', normal: 'Ausente' },
        { exam: 'Nervos cranianos', normal: 'I a XII sem alterações' },
        { exam: 'Coordenação', normal: 'Prova índex-nariz e calcanhar-joelho normais' },
        { exam: 'Sinais meníngeos', normal: 'Ausentes (Brudzinski e Kernig negativos)' },
      ],
    },
    {
      id: 'musculo',
      name: 'Musculoesquelético',
      icon: '🦴',
      items: [
        { exam: 'Inspeção geral', normal: 'Sem deformidades, sem edema' },
        { exam: 'Marcha', normal: 'Simétrica, sem claudicação' },
        { exam: 'Coluna vertebral', normal: 'Sem escoliose, lordose ou cifose patológicas' },
        { exam: 'Amplitude de movimento', normal: 'Completa em todas as articulações' },
        { exam: 'Força muscular', normal: 'Grau 5/5 globalmente' },
        { exam: 'Tônus muscular', normal: 'Normal' },
        { exam: 'Palpação articular', normal: 'Indolor, sem derrame articular' },
        { exam: 'Sinais flogísticos', normal: 'Ausentes' },
      ],
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
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Exame Físico Padrão</h1>
              <p className="text-sm text-gray-600">Achados normais esperados por sistema</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cards de Sistemas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {systems.map((system) => (
            <button
              key={system.id}
              onClick={() => setActiveSystem(system.id)}
              className={`p-6 bg-white rounded-lg shadow-sm border-2 transition-all text-left hover:shadow-md ${
                activeSystem === system.id ? 'border-blue-600' : 'border-gray-200'
              }`}
            >
              <div className="text-4xl mb-3">{system.icon}</div>
              <h3 className="font-bold text-lg">{system.name}</h3>
            </button>
          ))}
        </div>

        {/* Detalhes do Sistema Ativo */}
        {activeSystem && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {systems
              .filter((s) => s.id === activeSystem)
              .map((system) => (
                <div key={system.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-5xl">{system.icon}</span>
                    <h2 className="text-2xl font-bold">{system.name}</h2>
                  </div>

                  <div className="space-y-4">
                    {system.items.map((item, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{item.exam}</h4>
                            <p className="text-gray-700">
                              <span className="text-green-700 font-medium">Normal: </span>
                              {item.normal}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>💡 Dica:</strong> Esta lista apresenta os achados esperados em um exame físico normal. 
                      Qualquer desvio destes padrões deve ser documentado e investigado conforme indicação clínica.
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 text-center">
            ⚠️ Referência para achados normais. Variações individuais devem ser consideradas no contexto clínico.
          </p>
        </div>
      </main>
    </div>
  );
}
