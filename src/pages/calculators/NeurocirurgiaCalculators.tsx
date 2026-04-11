import { useState } from 'react';
import { ArrowLeft, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NeurocirurgiaCalculators() {
  const navigate = useNavigate();
  const [activeCalc, setActiveCalc] = useState<string>('');

  // Glasgow Coma Scale
  const [gcsEye, setGcsEye] = useState(0);
  const [gcsVerbal, setGcsVerbal] = useState(0);
  const [gcsMotor, setGcsMotor] = useState(0);

  const calculateGCS = () => {
    const total = gcsEye + gcsVerbal + gcsMotor;
    let interpretation = '';
    
    if (total === 15) interpretation = 'Normal';
    else if (total >= 13) interpretation = 'TCE leve';
    else if (total >= 9) interpretation = 'TCE moderado';
    else if (total >= 3) interpretation = 'TCE grave';
    
    return { total, interpretation };
  };

  // Hunt-Hess Score
  const [huntHess, setHuntHess] = useState(0);
  
  const getHuntHessInterpretation = (score: number) => {
    const interpretations = [
      '',
      'Grau I: Assintomático ou cefaleia mínima',
      'Grau II: Cefaleia moderada/grave, rigidez de nuca, sem déficit neurológico',
      'Grau III: Sonolência, confusão mental, déficit neurológico leve',
      'Grau IV: Estupor, hemiparesia moderada/grave',
      'Grau V: Coma profundo, rigidez de descerebração'
    ];
    return interpretations[score] || '';
  };

  // Fisher Grade
  const [fisherGrade, setFisherGrade] = useState(0);
  
  const getFisherInterpretation = (grade: number) => {
    const interpretations = [
      '',
      'Grau 1: Sem sangue visível (risco vasoespasmo: 21%)',
      'Grau 2: Camada difusa <1mm (risco: 25%)',
      'Grau 3: Coágulo localizado >1mm (risco: 37%)',
      'Grau 4: Sangue intraventricular/intraparenquimatoso (risco: 31%)'
    ];
    return interpretations[grade] || '';
  };

  // Modified Rankin Scale
  const [rankin, setRankin] = useState(-1);
  
  const getRankinInterpretation = (score: number) => {
    const interpretations = [
      'Sem sintomas',
      'Sem incapacidade significativa (atividades habituais)',
      'Incapacidade leve (não consegue todas atividades prévias)',
      'Incapacidade moderada (requer ajuda, mas caminha sem assistência)',
      'Incapacidade moderada-grave (não caminha sem ajuda)',
      'Incapacidade grave (acamado, requer cuidados constantes)',
      'Óbito'
    ];
    return interpretations[score] || '';
  };

  const gcsResult = calculateGCS();

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
            <Brain className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Neurocirurgia</h1>
              <p className="text-sm text-gray-600">Calculadoras e escores neurológicos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cards de Calculadoras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveCalc('gcs')}
            className={`p-6 bg-white rounded-lg shadow-sm border-2 transition-all text-left hover:shadow-md ${
              activeCalc === 'gcs' ? 'border-purple-600' : 'border-gray-200'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">Glasgow Coma Scale</h3>
            <p className="text-sm text-gray-600">Avaliação do nível de consciência</p>
          </button>

          <button
            onClick={() => setActiveCalc('hunt-hess')}
            className={`p-6 bg-white rounded-lg shadow-sm border-2 transition-all text-left hover:shadow-md ${
              activeCalc === 'hunt-hess' ? 'border-purple-600' : 'border-gray-200'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">Hunt-Hess Score</h3>
            <p className="text-sm text-gray-600">Hemorragia subaracnóidea</p>
          </button>

          <button
            onClick={() => setActiveCalc('fisher')}
            className={`p-6 bg-white rounded-lg shadow-sm border-2 transition-all text-left hover:shadow-md ${
              activeCalc === 'fisher' ? 'border-purple-600' : 'border-gray-200'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">Fisher Grade</h3>
            <p className="text-sm text-gray-600">Risco de vasoespasmo em HSA</p>
          </button>

          <button
            onClick={() => setActiveCalc('rankin')}
            className={`p-6 bg-white rounded-lg shadow-sm border-2 transition-all text-left hover:shadow-md ${
              activeCalc === 'rankin' ? 'border-purple-600' : 'border-gray-200'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">Modified Rankin Scale</h3>
            <p className="text-sm text-gray-600">Grau de incapacidade pós-AVC</p>
          </button>
        </div>

        {/* Calculadora Ativa */}
        {activeCalc === 'gcs' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Glasgow Coma Scale (GCS)</h2>
            
            <div className="space-y-6">
              {/* Abertura Ocular */}
              <div>
                <label className="block font-semibold mb-3">Abertura Ocular</label>
                <div className="space-y-2">
                  {[
                    { value: 4, label: 'Espontânea' },
                    { value: 3, label: 'Ao comando verbal' },
                    { value: 2, label: 'À dor' },
                    { value: 1, label: 'Nenhuma' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gcs-eye"
                        value={option.value}
                        checked={gcsEye === option.value}
                        onChange={(e) => setGcsEye(Number(e.target.value))}
                        className="w-4 h-4"
                      />
                      <span>{option.value} - {option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resposta Verbal */}
              <div>
                <label className="block font-semibold mb-3">Resposta Verbal</label>
                <div className="space-y-2">
                  {[
                    { value: 5, label: 'Orientado' },
                    { value: 4, label: 'Confuso' },
                    { value: 3, label: 'Palavras inapropriadas' },
                    { value: 2, label: 'Sons incompreensíveis' },
                    { value: 1, label: 'Nenhuma' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gcs-verbal"
                        value={option.value}
                        checked={gcsVerbal === option.value}
                        onChange={(e) => setGcsVerbal(Number(e.target.value))}
                        className="w-4 h-4"
                      />
                      <span>{option.value} - {option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resposta Motora */}
              <div>
                <label className="block font-semibold mb-3">Resposta Motora</label>
                <div className="space-y-2">
                  {[
                    { value: 6, label: 'Obedece comandos' },
                    { value: 5, label: 'Localiza dor' },
                    { value: 4, label: 'Retirada à dor' },
                    { value: 3, label: 'Flexão anormal (decorticação)' },
                    { value: 2, label: 'Extensão anormal (descerebração)' },
                    { value: 1, label: 'Nenhuma' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gcs-motor"
                        value={option.value}
                        checked={gcsMotor === option.value}
                        onChange={(e) => setGcsMotor(Number(e.target.value))}
                        className="w-4 h-4"
                      />
                      <span>{option.value} - {option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resultado */}
              {gcsResult.total > 0 && (
                <div className="bg-purple-50 border-2 border-purple-600 rounded-lg p-6 mt-6">
                  <h3 className="font-bold text-xl mb-2">Resultado</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-2">
                    GCS: {gcsResult.total}/15
                  </p>
                  <p className="text-lg">{gcsResult.interpretation}</p>
                  
                  <div className="mt-4 text-sm text-gray-700">
                    <p className="font-semibold mb-1">Interpretação:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>15: Normal</li>
                      <li>13-14: TCE leve</li>
                      <li>9-12: TCE moderado</li>
                      <li>3-8: TCE grave</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeCalc === 'hunt-hess' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Hunt-Hess Score</h2>
            <p className="text-gray-600 mb-6">Classificação de hemorragia subaracnóidea</p>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((grade) => (
                <label key={grade} className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="hunt-hess"
                    value={grade}
                    checked={huntHess === grade}
                    onChange={(e) => setHuntHess(Number(e.target.value))}
                    className="w-5 h-5 mt-1"
                  />
                  <span className="flex-1">{getHuntHessInterpretation(grade)}</span>
                </label>
              ))}

              {huntHess > 0 && (
                <div className="bg-purple-50 border-2 border-purple-600 rounded-lg p-6 mt-6">
                  <h3 className="font-bold text-xl mb-2">Hunt-Hess Grau {huntHess}</h3>
                  <p className="text-gray-700">{getHuntHessInterpretation(huntHess)}</p>
                  <p className="text-sm text-gray-600 mt-3">
                    Mortalidade estimada: {[0, 30, 40, 50, 80, 90][huntHess]}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeCalc === 'fisher' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Fisher Grade</h2>
            <p className="text-gray-600 mb-6">Risco de vasoespasmo em HSA (TC de crânio)</p>
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((grade) => (
                <label key={grade} className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="fisher"
                    value={grade}
                    checked={fisherGrade === grade}
                    onChange={(e) => setFisherGrade(Number(e.target.value))}
                    className="w-5 h-5 mt-1"
                  />
                  <span className="flex-1">{getFisherInterpretation(grade)}</span>
                </label>
              ))}

              {fisherGrade > 0 && (
                <div className="bg-purple-50 border-2 border-purple-600 rounded-lg p-6 mt-6">
                  <h3 className="font-bold text-xl mb-2">Fisher Grau {fisherGrade}</h3>
                  <p className="text-gray-700">{getFisherInterpretation(fisherGrade)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeCalc === 'rankin' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Modified Rankin Scale</h2>
            <p className="text-gray-600 mb-6">Grau de incapacidade funcional pós-AVC</p>
            
            <div className="space-y-4">
              {[0, 1, 2, 3, 4, 5, 6].map((score) => (
                <label key={score} className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="rankin"
                    value={score}
                    checked={rankin === score}
                    onChange={(e) => setRankin(Number(e.target.value))}
                    className="w-5 h-5 mt-1"
                  />
                  <div className="flex-1">
                    <span className="font-semibold">Grau {score}:</span> {getRankinInterpretation(score)}
                  </div>
                </label>
              ))}

              {rankin >= 0 && (
                <div className="bg-purple-50 border-2 border-purple-600 rounded-lg p-6 mt-6">
                  <h3 className="font-bold text-xl mb-2">Modified Rankin: {rankin}</h3>
                  <p className="text-gray-700">{getRankinInterpretation(rankin)}</p>
                </div>
              )}
            </div>
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
