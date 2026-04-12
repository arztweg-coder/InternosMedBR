import { useState } from "react";
import { Stethoscope, ArrowLeft, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Manobra {
  id: string;
  nome: string;
  especialidade: "Ortopedia" | "Neurologia" | "Reumatologia";
  indicacao: string;
  tecnica: string[];
  positivo: string;
  negativo: string;
  sensibilidade: string;
  especificidade: string;
  referencias: string[];
}

const MANOBRAS: Manobra[] = [
  // ═══ ORTOPEDIA ════════════════════════════════════════════════════════
  {
    id: "phalen",
    nome: "Sinal de Phalen",
    especialidade: "Ortopedia",
    indicacao: "Síndrome do Túnel do Carpo",
    tecnica: [
      "Solicitar ao paciente que flexione completamente os punhos",
      "Manter os dorsos das mãos encostados (posição de oração reversa)",
      "Manter a posição por 60 segundos",
      "Avaliar sintomas durante o teste"
    ],
    positivo: "Parestesia ou formigamento nos dedos (território do n. mediano: polegar, indicador, médio e metade radial do anelar) em até 60s",
    negativo: "Ausência de sintomas após 60 segundos",
    sensibilidade: "75%",
    especificidade: "47%",
    referencias: [
      "Phalen GS. The carpal-tunnel syndrome. J Bone Joint Surg Am 1966;48:211-28",
      "D'Arcy CA, McGee S. Does this patient have carpal tunnel syndrome? JAMA 2000;283:3110-7",
      "MacDermid JC, Wessel J. Clinical diagnosis of carpal tunnel syndrome. J Hand Ther 2004;17:309-19"
    ]
  },
  {
    id: "tinel",
    nome: "Sinal de Tinel",
    especialidade: "Ortopedia",
    indicacao: "Síndrome do Túnel do Carpo",
    tecnica: [
      "Paciente com antebraço em supinação e punho em posição neutra",
      "Percutir levemente com o dedo sobre o túnel do carpo (região volar do punho)",
      "Repetir a percussão 3-4 vezes",
      "Observar resposta do paciente"
    ],
    positivo: "Parestesia irradiando para os dedos inervados pelo n. mediano (polegar, indicador, médio)",
    negativo: "Ausência de parestesia ou formigamento",
    sensibilidade: "50%",
    especificidade: "77%",
    referencias: [
      "Tinel J. Le signe du fourmillement dans les lésions des nerfs périphériques. Presse Med 1915;47:388-9",
      "Kuschner SH et al. Tinel's sign and Phalen's test in carpal tunnel syndrome. Orthopedics 1992;15:1297-302"
    ]
  },
  {
    id: "lachman",
    nome: "Teste de Lachman",
    especialidade: "Ortopedia",
    indicacao: "Ruptura do Ligamento Cruzado Anterior (LCA)",
    tecnica: [
      "Paciente em decúbito dorsal com joelho flexionado a 20-30°",
      "Examinador fixa o fêmur distal com uma mão",
      "Com a outra mão, traciona anteriormente a tíbia proximal",
      "Avaliar translação anterior e sensação de parada (end-point)"
    ],
    positivo: "Translação anterior aumentada da tíbia (> 5mm) e ausência de parada firme (end-point mole ou ausente)",
    negativo: "Translação mínima com parada firme",
    sensibilidade: "85%",
    especificidade: "94%",
    referencias: [
      "Benjaminse A et al. Clinical diagnosis of an anterior cruciate ligament rupture. Am J Sports Med 2006;34:1680-5",
      "Katz JW, Fingeroth RJ. The diagnostic accuracy of ruptures of the ACL. J Bone Joint Surg Am 1986;68:26-32",
      "Scholten RJ et al. Accuracy of physical diagnostic tests for ACL rupture. BMJ 2003;327:806"
    ]
  },
  {
    id: "gaveta_anterior",
    nome: "Teste da Gaveta Anterior",
    especialidade: "Ortopedia",
    indicacao: "Ruptura do Ligamento Cruzado Anterior (LCA)",
    tecnica: [
      "Paciente em decúbito dorsal, joelho flexionado a 90°",
      "Pé apoiado na maca (examinador pode sentar sobre o pé para estabilizar)",
      "Examinador posiciona as mãos na tíbia proximal posterior",
      "Tracionar anteriormente a tíbia com força moderada",
      "Comparar com o lado contralateral"
    ],
    positivo: "Deslocamento anterior excessivo da tíbia em relação ao fêmur (> 5mm comparado ao lado normal)",
    negativo: "Deslocamento mínimo ou igual ao lado contralateral",
    sensibilidade: "62%",
    especificidade: "67%",
    referencias: [
      "Matsumoto H. Mechanism of anterior cruciate ligament injury. Sports Med Arthrosc Rev 1999;7:11-5",
      "Rubinstein RA et al. The accuracy of the clinical exam in ACL injury. Am J Sports Med 1994;22:550-7"
    ]
  },
  {
    id: "mcmurray",
    nome: "Teste de McMurray",
    especialidade: "Ortopedia",
    indicacao: "Lesão de Menisco (medial ou lateral)",
    tecnica: [
      "Paciente em decúbito dorsal",
      "Examinador flexiona completamente o joelho do paciente",
      "Uma mão palpa a linha articular, outra segura o pé",
      "Rodar externamente a perna (testa menisco medial) enquanto estende o joelho",
      "Rotar internamente a perna (testa menisco lateral) enquanto estende o joelho",
      "Repetir o movimento de extensão-rotação algumas vezes"
    ],
    positivo: "Estalido palpável ou audível na linha articular + dor durante o movimento",
    negativo: "Ausência de estalido e dor",
    sensibilidade: "61% (menisco medial), 45% (lateral)",
    especificidade: "84%",
    referencias: [
      "McMurray TP. The semilunar cartilages. Br J Surg 1942;29:407-14",
      "Hing W et al. Accuracy of the McMurray's test. Sports Med Arthrosc Rehabil Ther Technol 2009;1:20",
      "Hegedus EJ et al. Physical examination tests of the shoulder. Br J Sports Med 2008;42:80-92"
    ]
  },
  {
    id: "neer",
    nome: "Teste de Neer",
    especialidade: "Ortopedia",
    indicacao: "Síndrome do Impacto Subacromial",
    tecnica: [
      "Paciente sentado ou em pé",
      "Examinador estabiliza a escápula com uma mão",
      "Com a outra mão, eleva passivamente o braço do paciente em flexão anterior completa",
      "Manter o braço em rotação interna durante a elevação",
      "Observar dor durante o movimento"
    ],
    positivo: "Dor anterior no ombro durante a elevação (especialmente acima de 90°)",
    negativo: "Ausência de dor durante o movimento completo",
    sensibilidade: "79%",
    especificidade: "53%",
    referencias: [
      "Neer CS. Anterior acromioplasty for chronic impingement syndrome. J Bone Joint Surg Am 1972;54:41-50",
      "Park HB et al. Diagnostic accuracy of clinical tests for the different degrees of subacromial impingement. J Bone Joint Surg Am 2005;87:1446-55"
    ]
  },
  {
    id: "hawkins_kennedy",
    nome: "Teste de Hawkins-Kennedy",
    especialidade: "Ortopedia",
    indicacao: "Síndrome do Impacto Subacromial",
    tecnica: [
      "Paciente sentado ou em pé",
      "Examinador eleva o braço do paciente a 90° de flexão anterior",
      "Cotovelo também flexionado a 90°",
      "Rodar internamente o ombro forçando o braço para baixo",
      "Observar dor durante a rotação interna"
    ],
    positivo: "Dor no ombro durante a rotação interna forçada",
    negativo: "Ausência de dor",
    sensibilidade: "79%",
    especificidade: "59%",
    referencias: [
      "Hawkins RJ, Kennedy JC. Impingement syndrome in athletes. Am J Sports Med 1980;8:151-8",
      "Michener LA et al. Reliability and diagnostic accuracy of 5 physical examination tests. Arch Phys Med Rehabil 2009;90:1898-903"
    ]
  },
  {
    id: "jobe",
    nome: "Teste de Jobe (Empty Can)",
    especialidade: "Ortopedia",
    indicacao: "Lesão do Músculo Supraespinal",
    tecnica: [
      "Paciente em pé ou sentado",
      "Braços abduzidos a 90° no plano da escápula (30-45° de flexão anterior)",
      "Rotação interna completa (polegares apontando para baixo - 'lata vazia')",
      "Examinador aplica força para baixo enquanto paciente resiste",
      "Comparar força e dor entre os lados"
    ],
    positivo: "Fraqueza e/ou dor no ombro durante resistência",
    negativo: "Força preservada sem dor",
    sensibilidade: "63%",
    especificidade: "65%",
    referencias: [
      "Jobe FW, Moynes DR. Delineation of diagnostic criteria and a rehabilitation program. Am J Sports Med 1982;10:336-9",
      "Itoi E et al. Which is more useful, the full can test or the empty can test? Am J Sports Med 1999;27:65-8"
    ]
  },
  {
    id: "thompson",
    nome: "Teste de Thompson (Squeeze Test)",
    especialidade: "Ortopedia",
    indicacao: "Ruptura do Tendão de Aquiles",
    tecnica: [
      "Paciente em decúbito ventral (barriga para baixo)",
      "Pés para fora da borda da maca",
      "Examinador comprime a panturrilha (tríceps sural) com força moderada",
      "Observar movimento do pé"
    ],
    positivo: "Ausência de flexão plantar do pé (teste positivo = ruptura provável)",
    negativo: "Flexão plantar do pé presente (tendão íntegro)",
    sensibilidade: "96%",
    especificidade: "93%",
    referencias: [
      "Thompson TC. A test for rupture of the tendo achillis. Acta Orthop Scand 1962;32:461-5",
      "Maffulli N. Rupture of the Achilles tendon. J Bone Joint Surg Am 1999;81:1019-36",
      "Garras DN et al. MRI is unnecessary for diagnosing acute Achilles tendon ruptures. Clin Orthop Relat Res 2012;470:2268-73"
    ]
  },

  // ═══ NEUROLOGIA ═══════════════════════════════════════════════════════
  {
    id: "brudzinski",
    nome: "Sinal de Brudzinski",
    especialidade: "Neurologia",
    indicacao: "Meningite / Irritação Meníngea",
    tecnica: [
      "Paciente em decúbito dorsal",
      "Examinador coloca a mão atrás da cabeça do paciente",
      "Flexionar passivamente o pescoço, trazendo o queixo em direção ao tórax",
      "Observar movimento reflexo dos membros inferiores"
    ],
    positivo: "Flexão involuntária dos quadris e joelhos ao flexionar o pescoço",
    negativo: "Ausência de flexão reflexa dos membros inferiores",
    sensibilidade: "5-50%",
    especificidade: "95%",
    referencias: [
      "Brudzinski J. A new sign of the lower extremities in meningitis of children. Arch Neurol 1909;21:217",
      "Thomas KE et al. The diagnostic accuracy of Kernig's sign, Brudzinski's sign, and nuchal rigidity. Clin Infect Dis 2002;35:46-52",
      "Joffe AR. Lumbar puncture and brain herniation in acute bacterial meningitis. Pediatr Crit Care Med 2007;8:59-63"
    ]
  },
  {
    id: "kernig",
    nome: "Sinal de Kernig",
    especialidade: "Neurologia",
    indicacao: "Meningite / Irritação Meníngea",
    tecnica: [
      "Paciente em decúbito dorsal",
      "Flexionar o quadril a 90°",
      "Tentar estender passivamente o joelho",
      "Observar resistência e dor",
      "Testar ambos os lados"
    ],
    positivo: "Dor e resistência à extensão do joelho quando o quadril está flexionado a 90°",
    negativo: "Extensão completa do joelho sem dor ou resistência",
    sensibilidade: "5-21%",
    especificidade: "95%",
    referencias: [
      "Kernig W. Concerning a little noted sign of meningitis. Arch Neurol 1882;21:216",
      "Thomas KE et al. The diagnostic accuracy of Kernig's sign. Clin Infect Dis 2002;35:46-52",
      "Attia J et al. Does this adult patient have acute meningitis? JAMA 1999;282:175-81"
    ]
  },
  {
    id: "babinski",
    nome: "Sinal de Babinski",
    especialidade: "Neurologia",
    indicacao: "Lesão de Neurônio Motor Superior / Via Piramidal",
    tecnica: [
      "Paciente relaxado, em decúbito dorsal",
      "Estimular a planta do pé com objeto rombo (cabo de martelo, chave)",
      "Movimento firme, da base do calcanhar até a base dos dedos",
      "Fazer uma curva lateral ao chegar aos dedos",
      "Observar movimento do hálux e outros dedos"
    ],
    positivo: "Extensão (dorsiflexão) do hálux + abertura em leque dos outros dedos",
    negativo: "Flexão plantar do hálux e demais dedos (resposta normal no adulto)",
    sensibilidade: "Variável (50-90% conforme a gravidade)",
    especificidade: "Alta (> 90% em adultos)",
    referencias: [
      "Babinski J. Sur le réflexe cutané plantaire. C R Soc Biol (Paris) 1896;48:207-8",
      "van Gijn J. The Babinski sign and the pyramidal syndrome. J Neurol Neurosurg Psychiatry 1978;41:865-73",
      "Kumar SP, Ramasubramanian D. The Babinski sign—a reappraisal. Neurol India 2000;48:314-8"
    ]
  },
  {
    id: "romberg",
    nome: "Teste de Romberg",
    especialidade: "Neurologia",
    indicacao: "Ataxia Sensorial / Disfunção Proprioceptiva",
    tecnica: [
      "Paciente em pé, pés juntos, braços ao longo do corpo",
      "Primeiro observar equilíbrio com olhos abertos",
      "Solicitar ao paciente que feche os olhos",
      "Observar por 30-60 segundos",
      "Ficar próximo para evitar queda"
    ],
    positivo: "Desequilíbrio ou queda significativa ao fechar os olhos (piora marcante)",
    negativo: "Equilíbrio mantido mesmo de olhos fechados",
    sensibilidade: "Moderada (depende da causa)",
    especificidade: "Moderada",
    referencias: [
      "Romberg MH. Manual of Nervous Diseases of Man. London: Sydenham Society, 1853",
      "Khasnis A, Gokula RM. Romberg's test. J Postgrad Med 2003;49:169-72",
      "Pearson JE, Walterspiel JN. Evaluation of dizziness. Otolaryngol Head Neck Surg 1983;91:687-93"
    ]
  },
  {
    id: "lasegue",
    nome: "Sinal de Lasègue (Straight Leg Raise)",
    especialidade: "Neurologia",
    indicacao: "Radiculopatia Lombossacra / Compressão de Raiz Nervosa (L5/S1)",
    tecnica: [
      "Paciente em decúbito dorsal, membros relaxados",
      "Examinador eleva passivamente a perna estendida",
      "Manter o joelho em extensão completa",
      "Observar ângulo e local da dor",
      "Testar ambas as pernas"
    ],
    positivo: "Dor irradiando pela face posterior da coxa até abaixo do joelho, com elevação entre 30-70°",
    negativo: "Ausência de dor radicular, ou dor apenas lombar/posterior da coxa",
    sensibilidade: "91%",
    especificidade: "26%",
    referencias: [
      "Lasègue C. Considérations sur la sciatique. Arch Gen Med 1864;2:558-80",
      "Deyo RA et al. What can the history and physical examination tell us about low back pain? JAMA 1992;268:760-5",
      "van der Windt DA et al. Physical examination for lumbar radiculopathy due to disc herniation. Cochrane Database Syst Rev 2010;(2):CD007431"
    ]
  },
  {
    id: "hoffman",
    nome: "Sinal de Hoffmann",
    especialidade: "Neurologia",
    indicacao: "Mielopatia Cervical / Lesão de Via Piramidal Cervical",
    tecnica: [
      "Paciente com mão relaxada",
      "Examinador segura o dedo médio do paciente",
      "Realizar flexão rápida da falange distal do dedo médio ('flick')",
      "Observar movimento dos outros dedos",
      "Testar ambas as mãos"
    ],
    positivo: "Flexão reflexa do polegar e/ou indicador após o estímulo",
    negativo: "Ausência de movimento reflexo dos dedos",
    sensibilidade: "58%",
    especificidade: "78%",
    referencias: [
      "Hoffmann J. Über eine Methode, das Vorhandensein der Pyramidenbahnsymptome zu diagnostizieren. Z Klin Med 1911;73:241",
      "Denno JJ, Meadows GR. Early diagnosis of cervical spondylotic myelopathy. Spine 1991;16:1353-5",
      "Glaser JA et al. The Hoffmann's sign. J Bone Joint Surg Am 2001;83:771"
    ]
  },
  {
    id: "mingazzini",
    nome: "Manobra de Mingazzini",
    especialidade: "Neurologia",
    indicacao: "Paresia de Membros Inferiores",
    tecnica: [
      "Paciente em decúbito dorsal",
      "Solicitar que eleve ambas as pernas com quadris e joelhos flexionados a 90°",
      "Manter a posição por 30-60 segundos",
      "Observar se uma perna cai ou deriva"
    ],
    positivo: "Queda ou desvio de uma das pernas (lado parético)",
    negativo: "Ambas as pernas mantêm a posição sem desvio",
    sensibilidade: "Alta para paresia moderada/grave",
    especificidade: "Alta",
    referencias: [
      "Mingazzini G. Il reperto della flessione combinata della coscia. Riv Patol Nerv Ment 1914;19:481",
      "Schmahmann JD. Vascular syndromes of the thalamus. Stroke 2003;34:2264-78"
    ]
  },

  // ═══ REUMATOLOGIA ════════════════════════════════════════════════════
  {
    id: "schober",
    nome: "Teste de Schober",
    especialidade: "Reumatologia",
    indicacao: "Espondilite Anquilosante / Mobilidade Lombar",
    tecnica: [
      "Paciente em pé, em posição neutra",
      "Marcar a pele na altura de L5 (linha que une as cristas ilíacas)",
      "Marcar 10 cm acima e 5 cm abaixo desse ponto (total 15 cm)",
      "Solicitar flexão anterior máxima da coluna (tocar os pés)",
      "Medir a distância entre as marcas durante a flexão"
    ],
    positivo: "Aumento < 5 cm (distância final < 20 cm) = mobilidade reduzida",
    negativo: "Aumento ≥ 5 cm (distância final ≥ 20 cm) = mobilidade normal",
    sensibilidade: "Moderada (40-60%)",
    especificidade: "Moderada (60-80%)",
    referencias: [
      "Schober P. Lendenwirbelsäule und Kreuzschmerzen. Münch Med Wschr 1937;84:336-8",
      "Macrae IF, Wright V. Measurement of back movement. Ann Rheum Dis 1969;28:584-9",
      "van der Heijde D et al. ASAS/EULAR recommendations for the management of ankylosing spondylitis. Ann Rheum Dis 2006;65:442-52"
    ]
  },
  {
    id: "gaenslen",
    nome: "Teste de Gaenslen",
    especialidade: "Reumatologia",
    indicacao: "Sacroileíte / Disfunção Sacroilíaca",
    tecnica: [
      "Paciente em decúbito dorsal na borda da maca",
      "Lado a ser testado fica pendente para fora da maca",
      "Paciente abraça a perna contralateral, trazendo joelho ao peito",
      "Examinador aplica pressão para baixo na perna pendente (extensão do quadril)",
      "Observar dor na região sacroilíaca ou glútea"
    ],
    positivo: "Dor na articulação sacroilíaca ipsilateral ao lado testado",
    negativo: "Ausência de dor durante o teste",
    sensibilidade: "53%",
    especificidade: "77%",
    referencias: [
      "Gaenslen FJ. Sacro-iliac arthrodesis. JAMA 1927;89:2031-5",
      "Szadek KM et al. Diagnostic validity of criteria for sacroiliac joint pain. J Pain 2009;10:354-68",
      "Laslett M et al. Diagnosis of sacroiliac joint pain. Spine 2005;30:610-21"
    ]
  },
  {
    id: "faber",
    nome: "Teste FABER (Patrick)",
    especialidade: "Reumatologia",
    indicacao: "Artropatia Coxofemoral / Sacroileíte",
    tecnica: [
      "Paciente em decúbito dorsal",
      "Colocar o pé do lado testado sobre o joelho contralateral",
      "Formar número '4' com as pernas (Flexão, ABdução, Rotação Externa)",
      "Examinador estabiliza a crista ilíaca contralateral",
      "Aplicar pressão para baixo no joelho do lado testado",
      "Observar dor e local"
    ],
    positivo: "Dor na região inguinal (articulação coxofemoral) ou sacroilíaca",
    negativo: "Ausência de dor, mobilidade normal",
    sensibilidade: "60% (quadril), 77% (sacroilíaca)",
    especificidade: "71% (quadril), 100% (sacroilíaca)",
    referencias: [
      "Patrick HT. Brachial neuritis and sciatica. JAMA 1917;69:2176-9",
      "Martin RL et al. Clinical diagnosis of hip pain. J Orthop Sports Phys Ther 2008;38:A1-A34",
      "Sutlive TG et al. Development of a clinical prediction rule for hip osteoarthritis. J Orthop Sports Phys Ther 2008;38:542-50"
    ]
  },
  {
    id: "finkelstein",
    nome: "Teste de Finkelstein",
    especialidade: "Reumatologia",
    indicacao: "Tenossinovite de De Quervain",
    tecnica: [
      "Solicitar ao paciente que faça um punho fechando o polegar dentro dos outros dedos",
      "Examinador segura o punho do paciente",
      "Realizar desvio ulnar passivo do punho",
      "Observar dor no lado radial do punho"
    ],
    positivo: "Dor intensa no lado radial do punho (sobre apófise estiloide do rádio)",
    negativo: "Ausência de dor ou desconforto mínimo",
    sensibilidade: "89%",
    especificidade: "96%",
    referencias: [
      "Finkelstein H. Stenosing tendovaginitis at the radial styloid process. J Bone Joint Surg 1930;12:509-40",
      "Goubau JF et al. The wrist hyperflexion and abduction of the thumb (WHAT) test. Clin Orthop Relat Res 2014;472:1513-9"
    ]
  },
];

export default function ManobrasPage() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEsp, setFiltroEsp] = useState<string>("Todas");

  const especialidadesUnicas = ["Todas", ...Array.from(new Set(MANOBRAS.map(m => m.especialidade)))];

  const manobrasFiltradas = MANOBRAS.filter(m => {
    const matchEsp = filtroEsp === "Todas" || m.especialidade === filtroEsp;
    const matchSearch = m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       m.indicacao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEsp && matchSearch;
  });

  function toggleManobra(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <button
        onClick={() => navigate("/calculadoras")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Calculadoras
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Stethoscope className="w-6 h-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-gray-800">Manobras Clínicas</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        20 manobras essenciais para diagnóstico em Ortopedia, Neurologia e Reumatologia.
      </p>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar manobra ou indicação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Filtro por especialidade */}
          <div>
            <select
              value={filtroEsp}
              onChange={(e) => setFiltroEsp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {especialidadesUnicas.map(esp => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {manobrasFiltradas.length} manobra{manobrasFiltradas.length !== 1 ? 's' : ''} encontrada{manobrasFiltradas.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Lista de manobras */}
      <div className="space-y-3">
        {manobrasFiltradas.map(manobra => {
          const isExpanded = expandedId === manobra.id;
          const corEsp = manobra.especialidade === "Ortopedia" ? "border-blue-400 bg-blue-50" :
                        manobra.especialidade === "Neurologia" ? "border-purple-400 bg-purple-50" :
                        "border-amber-400 bg-amber-50";

          return (
            <div key={manobra.id} className={`bg-white rounded-xl border-2 ${corEsp} overflow-hidden transition-all`}>
              {/* Header */}
              <button
                onClick={() => toggleManobra(manobra.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-opacity-60 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{manobra.nome}</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold text-gray-600">{manobra.especialidade}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{manobra.indicacao}</span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                )}
              </button>

              {/* Conteúdo expandido */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-200">
                  {/* Técnica */}
                  <div className="pt-4">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                      🔍 Técnica
                    </p>
                    <ol className="space-y-1.5">
                      {manobra.tecnica.map((passo, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="font-semibold text-teal-600 flex-shrink-0">{idx + 1}.</span>
                          <span>{passo}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Interpretação */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-bold text-red-700 mb-1.5">✅ Teste POSITIVO</p>
                      <p className="text-sm text-red-900">{manobra.positivo}</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-bold text-green-700 mb-1.5">❌ Teste NEGATIVO</p>
                      <p className="text-sm text-green-900">{manobra.negativo}</p>
                    </div>
                  </div>

                  {/* Sensibilidade e Especificidade */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Sensibilidade</p>
                      <p className="text-base font-bold text-gray-900">{manobra.sensibilidade}</p>
                    </div>
                    <div className="w-px h-10 bg-gray-300" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Especificidade</p>
                      <p className="text-base font-bold text-gray-900">{manobra.especificidade}</p>
                    </div>
                  </div>

                  {/* Referências */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      📚 Referências
                    </p>
                    <ul className="space-y-1">
                      {manobra.referencias.map((ref, idx) => (
                        <li key={idx} className="text-[11px] text-gray-500 leading-relaxed">
                          {ref}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {manobrasFiltradas.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Stethoscope className="w-16 h-16 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">Nenhuma manobra encontrada com os filtros aplicados.</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs text-blue-800">
          <strong>💡 Dica:</strong> Estas manobras devem ser interpretadas no contexto clínico completo do paciente. 
          Sensibilidade e especificidade são valores aproximados da literatura.
        </p>
      </div>
    </div>
  );
}
