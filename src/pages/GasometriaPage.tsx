import { useState } from "react";
import { Activity, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GasometriaResult {
  tipo: string;
  descricao: string;
  condutas: string[];
  referencias: string[];
  color: string;
}

export default function GasometriaPage() {
  const navigate = useNavigate();
  
  // Campos de entrada
  const [ph, setPh] = useState("");
  const [pco2, setPco2] = useState("");
  const [hco3, setHco3] = useState("");
  const [po2, setPo2] = useState("");
  const [be, setBe] = useState("");
  const [sato2, setSato2] = useState("");
  const [lactato, setLactato] = useState("");

  // Resultados calculados
  const [resultado, setResultado] = useState<GasometriaResult | null>(null);
  const [anionGap, setAnionGap] = useState<number | null>(null);

  // Valores de referência
  const REF = {
    ph: { min: 7.35, max: 7.45 },
    pco2: { min: 35, max: 45 },
    hco3: { min: 22, max: 26 },
    po2: { min: 80, max: 100 },
    be: { min: -2, max: 2 },
    sato2: { min: 95, max: 100 },
    lactato: { max: 2.0 },
  };

  function calcularAnionGap(na: number, cl: number, hco3Val: number): number {
    return na - (cl + hco3Val);
  }

  function interpretarGasometria() {
    const phVal = parseFloat(ph);
    const pco2Val = parseFloat(pco2);
    const hco3Val = parseFloat(hco3);
    const beVal = parseFloat(be);

    if (isNaN(phVal) || isNaN(pco2Val) || isNaN(hco3Val)) {
      alert("Preencha ao menos pH, pCO₂ e HCO₃⁻");
      return;
    }

    let tipo = "";
    let descricao = "";
    let condutas: string[] = [];
    let referencias: string[] = [];
    let color = "";

    // 1. Determinar se é acidemia ou alcalemia
    const isAcidemia = phVal < 7.35;
    const isAlcalemia = phVal > 7.45;

    // 2. Determinar se é metabólica ou respiratória
    const isMetabolicAcid = hco3Val < 22;
    const isMetabolicAlk = hco3Val > 26;
    const isRespAcid = pco2Val > 45;
    const isRespAlk = pco2Val < 35;

    // ─── ACIDOSE METABÓLICA ───────────────────────────────────────────────
    if (isAcidemia && isMetabolicAcid) {
      tipo = "Acidose Metabólica";
      
      // Verificar compensação esperada: pCO₂ esperado = 1.5 × HCO₃ + 8 (±2)
      const pco2Esperado = 1.5 * hco3Val + 8;
      const compensado = Math.abs(pco2Val - pco2Esperado) <= 2;
      
      descricao = compensado 
        ? "Acidose metabólica com compensação respiratória adequada"
        : pco2Val > pco2Esperado 
          ? "Acidose metabólica + acidose respiratória (mista)"
          : "Acidose metabólica com hiperventilação";

      condutas = [
        "Investigar causa da acidose metabólica",
        "Calcular ânion gap (AG = Na⁺ - [Cl⁻ + HCO₃⁻])",
        "AG elevado (>12): cetoacidose, acidose láctica, uremia, intoxicações",
        "AG normal (8-12): diarreia, acidose tubular renal, perdas intestinais",
        "Tratar causa base",
        "Considerar bicarbonato se pH < 7.1 e instabilidade hemodinâmica",
        "Monitorar eletrólitos (K⁺, Ca²⁺, Mg²⁺)",
      ];
      
      referencias = [
        "Berend K et al. Physiological approach to assessment of acid-base disturbances. N Engl J Med 2014;371:1434-45",
        "Kraut JA, Madias NE. Metabolic acidosis: pathophysiology, diagnosis and management. Nat Rev Nephrol 2010;6:274-85",
        "Seifter JL. Integration of acid-base and electrolyte disorders. N Engl J Med 2014;371:1821-31",
      ];
      
      color = "text-red-700";
    }

    // ─── ACIDOSE RESPIRATÓRIA ─────────────────────────────────────────────
    else if (isAcidemia && isRespAcid) {
      tipo = "Acidose Respiratória";
      
      // Compensação aguda: HCO₃ sobe 1 mEq/L para cada 10 mmHg de ↑pCO₂
      // Compensação crônica: HCO₃ sobe 3.5 mEq/L para cada 10 mmHg de ↑pCO₂
      const deltaPco2 = pco2Val - 40;
      const esperadoAgudo = 24 + (deltaPco2 / 10);
      const esperadoCronico = 24 + (3.5 * deltaPco2 / 10);
      
      const aguda = Math.abs(hco3Val - esperadoAgudo) < 2;
      const cronica = Math.abs(hco3Val - esperadoCronico) < 3;
      
      descricao = cronica 
        ? "Acidose respiratória crônica (compensação renal presente)" 
        : aguda 
          ? "Acidose respiratória aguda (sem compensação significativa)"
          : "Acidose respiratória com compensação incompleta";

      condutas = [
        "Assegurar via aérea pérvia",
        "Avaliar necessidade de suporte ventilatório",
        "Investigar causa: DPOC, pneumonia, derrame pleural, neuromuscular, depressão SNC",
        "Oxigenoterapia guiada por saturação (alvo 88-92% se DPOC)",
        "Tratar causa base (broncodilatadores, antibióticos, ventilação não-invasiva)",
        "Evitar sedação excessiva",
        "Considerar IOT + VM se pH < 7.25 + sinais de fadiga respiratória",
      ];
      
      referencias = [
        "Epstein SK, Singh N. Respiratory acidosis. Respir Care 2001;46:366-83",
        "Caples SM et al. Obstructive sleep apnea. Ann Intern Med 2005;142:187-97",
        "Global Initiative for Chronic Obstructive Lung Disease (GOLD) 2023",
      ];
      
      color = "text-orange-700";
    }

    // ─── ALCALOSE METABÓLICA ──────────────────────────────────────────────
    else if (isAlcalemia && isMetabolicAlk) {
      tipo = "Alcalose Metabólica";
      
      // Compensação esperada: pCO₂ sobe 0.7 mmHg para cada 1 mEq/L de ↑HCO₃
      const deltaHco3 = hco3Val - 24;
      const pco2Esperado = 40 + (0.7 * deltaHco3);
      const compensado = Math.abs(pco2Val - pco2Esperado) <= 2;
      
      descricao = compensado 
        ? "Alcalose metabólica com compensação respiratória adequada"
        : "Alcalose metabólica com compensação incompleta";

      condutas = [
        "Investigar causa: vômitos, diuréticos, hiperaldosteronismo",
        "Avaliar volemia e cloreto urinário",
        "Cl⁻ urinário < 20 mEq/L: responsiva a salina (vômitos, diuréticos, pós-hipercapnia)",
        "Cl⁻ urinário > 20 mEq/L: resistente a salina (hiperaldosteronismo, Cushing, Bartter/Gitelman)",
        "Reposição de volume com NaCl 0.9% se depletado",
        "Corrigir hipocalemia e hipomagnesemia",
        "Tratar causa base (ex: inibir bomba de prótons se vômitos)",
      ];
      
      referencias = [
        "Galla JH. Metabolic alkalosis. J Am Soc Nephrol 2000;11:369-75",
        "Palmer BF, Clegg DJ. Electrolyte disturbances in patients with chronic alcohol-use disorder. N Engl J Med 2017;377:1368-77",
        "Luke RG, Galla JH. It is chloride depletion alkalosis, not contraction alkalosis. J Am Soc Nephrol 2012;23:204-7",
      ];
      
      color = "text-blue-700";
    }

    // ─── ALCALOSE RESPIRATÓRIA ────────────────────────────────────────────
    else if (isAlcalemia && isRespAlk) {
      tipo = "Alcalose Respiratória";
      
      // Compensação aguda: HCO₃ cai 2 mEq/L para cada 10 mmHg de ↓pCO₂
      // Compensação crônica: HCO₃ cai 5 mEq/L para cada 10 mmHg de ↓pCO₂
      const deltaPco2 = 40 - pco2Val;
      const esperadoAgudo = 24 - (2 * deltaPco2 / 10);
      const esperadoCronico = 24 - (5 * deltaPco2 / 10);
      
      const aguda = Math.abs(hco3Val - esperadoAgudo) < 2;
      const cronica = Math.abs(hco3Val - esperadoCronico) < 3;
      
      descricao = cronica 
        ? "Alcalose respiratória crônica (compensação renal presente)" 
        : aguda 
          ? "Alcalose respiratória aguda (hiperventilação recente)"
          : "Alcalose respiratória com compensação incompleta";

      condutas = [
        "Identificar e tratar causa da hiperventilação",
        "Causas comuns: ansiedade, dor, hipoxemia, sepse, TEP, gravidez, altitude",
        "Se ansiedade/pânico: técnicas de respiração controlada, reassegurar paciente",
        "Investigar TEP se fatores de risco presentes (Wells, D-dímero)",
        "Avaliar necessidade de oximetria, angiotomografia",
        "Tratar sepse se critérios presentes (qSOFA, lactato)",
        "Evitar rebreathing em saco de papel (risco de hipoxemia)",
      ];
      
      referencias = [
        "Laffey JG, Kavanagh BP. Hypocapnia. N Engl J Med 2002;347:43-53",
        "Foster GT et al. Respiratory alkalosis. Respir Care 2001;46:384-91",
        "Curley G et al. Hypocapnia and the injured brain. Anesthesiology 2010;113:1204-25",
      ];
      
      color = "text-teal-700";
    }

    // ─── DISTÚRBIO MISTO ──────────────────────────────────────────────────
    else if ((isAcidemia && isMetabolicAcid && isRespAcid) || 
             (isAlcalemia && isMetabolicAlk && isRespAlk)) {
      tipo = "Distúrbio Ácido-Base Misto";
      descricao = "Múltiplos distúrbios presentes simultaneamente";
      condutas = [
        "Investigar todas as causas potenciais",
        "Avaliar contexto clínico completo",
        "Tratar cada distúrbio individualmente",
        "Monitoramento frequente de gasometria",
        "Considerar interconsulta com nefrologista/intensivista",
      ];
      referencias = [
        "Berend K et al. Diagnostic use of base excess in acid-base disorders. N Engl J Med 2018;378:1419-28",
      ];
      color = "text-purple-700";
    }

    // ─── NORMAL ───────────────────────────────────────────────────────────
    else {
      tipo = "Gasometria Normal";
      descricao = "Valores dentro dos parâmetros de normalidade";
      condutas = [
        "Gasometria arterial sem alterações significativas",
        "Manter vigilância clínica",
        "Reavaliar se sintomas persistirem",
      ];
      referencias = [];
      color = "text-green-700";
    }

    setResultado({ tipo, descricao, condutas, referencias, color });
  }

  function limparCampos() {
    setPh("");
    setPco2("");
    setHco3("");
    setPo2("");
    setBe("");
    setSato2("");
    setLactato("");
    setResultado(null);
    setAnionGap(null);
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/calculadoras")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Calculadoras
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-800">Gasometria Arterial</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Interpretação completa de gasometria arterial com condutas baseadas em evidências.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel de entrada */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Dados da Gasometria</h2>
          
          <div className="space-y-4">
            {/* pH */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                pH <span className="text-xs text-gray-400">(7,35 – 7,45)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                placeholder="Ex: 7.40"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* pCO₂ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                pCO₂ <span className="text-xs text-gray-400">(35 – 45 mmHg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={pco2}
                onChange={(e) => setPco2(e.target.value)}
                placeholder="Ex: 40"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* HCO₃⁻ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                HCO₃⁻ <span className="text-xs text-gray-400">(22 – 26 mEq/L)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={hco3}
                onChange={(e) => setHco3(e.target.value)}
                placeholder="Ex: 24"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* pO₂ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                pO₂ <span className="text-xs text-gray-400">(80 – 100 mmHg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={po2}
                onChange={(e) => setPo2(e.target.value)}
                placeholder="Ex: 95"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* BE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                BE (Base Excess) <span className="text-xs text-gray-400">(-2 a +2 mEq/L)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={be}
                onChange={(e) => setBe(e.target.value)}
                placeholder="Ex: 0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* SatO₂ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                SatO₂ <span className="text-xs text-gray-400">(95 – 100%)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={sato2}
                onChange={(e) => setSato2(e.target.value)}
                placeholder="Ex: 98"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Lactato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lactato <span className="text-xs text-gray-400">({"<"} 2.0 mmol/L)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={lactato}
                onChange={(e) => setLactato(e.target.value)}
                placeholder="Ex: 1.2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={interpretarGasometria}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Interpretar
            </button>
            <button
              onClick={limparCampos}
              className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Limpar
            </button>
          </div>

          {/* Referências rápidas */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Valores de Referência
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• pH: 7,35 – 7,45</p>
              <p>• pCO₂: 35 – 45 mmHg</p>
              <p>• HCO₃⁻: 22 – 26 mEq/L</p>
              <p>• pO₂: 80 – 100 mmHg</p>
              <p>• BE: -2 a +2 mEq/L</p>
              <p>• SatO₂: 95 – 100%</p>
              <p>• Lactato: {"<"} 2.0 mmol/L</p>
            </div>
          </div>
        </div>

        {/* Painel de resultados */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Interpretação</h2>

          {resultado ? (
            <div className="space-y-6">
              {/* Diagnóstico */}
              <div className={`p-4 rounded-xl border-2 ${resultado.color} bg-opacity-5`}>
                <p className="text-base font-bold mb-1">{resultado.tipo}</p>
                <p className="text-sm opacity-90">{resultado.descricao}</p>
              </div>

              {/* Condutas */}
              {resultado.condutas.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    📋 Condutas Sugeridas
                  </p>
                  <ul className="space-y-2">
                    {resultado.condutas.map((conduta, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{conduta}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Referências */}
              {resultado.referencias.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    📚 Referências
                  </p>
                  <ul className="space-y-1">
                    {resultado.referencias.map((ref, idx) => (
                      <li key={idx} className="text-[11px] text-gray-500 leading-relaxed">
                        {ref}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Alertas especiais */}
              {parseFloat(lactato) > 4 && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-1">⚠️ Lactato elevado ({lactato} mmol/L)</p>
                    <p className="text-xs">
                      Investigar choque, sepse, hipoperfusão tecidual. Considerar ressuscitação volêmica guiada por metas.
                    </p>
                  </div>
                </div>
              )}

              {parseFloat(po2) < 60 && (
                <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-800">
                    <p className="font-semibold mb-1">⚠️ Hipoxemia grave (pO₂ {po2} mmHg)</p>
                    <p className="text-xs">
                      Iniciar oxigenoterapia imediatamente. Avaliar necessidade de suporte ventilatório.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                Preencha os dados da gasometria e clique em <strong>Interpretar</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-xs text-yellow-800">
          <strong>⚠️ Aviso:</strong> Esta ferramenta auxilia na interpretação de gasometrias arteriais, mas não substitui o julgamento clínico. 
          Sempre correlacione os resultados com o contexto clínico do paciente.
        </p>
      </div>
    </div>
  );
}
