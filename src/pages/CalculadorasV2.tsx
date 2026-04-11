import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, ChevronDown, ChevronUp, Brain, Bone, Stethoscope, ChevronRight } from "lucide-react";

// ─── CATEGORY + TAB TYPES ────────────────────────────────────────────────────

type TabId =
  | "imc" | "ckd_cg" | "ckd_epi" | "gasometria"
  | "sodio_deficit" | "sodio_correcao"
  | "glasgow" | "nihss" | "ich_score"
  | "framingham" | "chads_vasc" | "grace" | "timi"
  | "wells_tep" | "wells_tvp" | "perc" | "sofa" | "qsofa" | "apache2" | "saps3"
  | "curb65" | "asa" | "psa" | "asas";

interface TabDef { id: TabId; label: string; category: string; }

const TABS: TabDef[] = [
  // Antropometria / Renal
  { id: "imc", label: "IMC", category: "Geral" },
  { id: "ckd_cg", label: "Cockcroft-Gault", category: "Nefrologia" },
  { id: "ckd_epi", label: "CKD-EPI", category: "Nefrologia" },
  { id: "sodio_deficit", label: "Déficit de Água Livre", category: "Nefrologia" },
  { id: "sodio_correcao", label: "Correção de Sódio", category: "Nefrologia" },
  { id: "gasometria", label: "Gasometria", category: "Nefrologia" },
  // Neurologia
  { id: "glasgow", label: "Glasgow", category: "Neurologia" },
  { id: "nihss", label: "NIHSS (AVC)", category: "Neurologia" },
  { id: "ich_score", label: "ICH Score", category: "Neurologia" },
  // Cardiologia
  { id: "framingham", label: "Framingham", category: "Cardiologia" },
  { id: "chads_vasc", label: "CHA₂DS₂-VASc", category: "Cardiologia" },
  { id: "grace", label: "GRACE (SCA)", category: "Cardiologia" },
  { id: "timi", label: "TIMI (NSTE-ACS)", category: "Cardiologia" },
  // TEV
  { id: "wells_tep", label: "Wells TEP", category: "Vascular" },
  { id: "wells_tvp", label: "Wells TVP", category: "Vascular" },
  { id: "perc", label: "PERC Rule", category: "Vascular" },
  // UTI / Sepse
  { id: "sofa", label: "SOFA", category: "UTI / Sepse" },
  { id: "qsofa", label: "qSOFA", category: "UTI / Sepse" },
  { id: "apache2", label: "APACHE II", category: "UTI / Sepse" },
  { id: "saps3", label: "SAPS 3", category: "UTI / Sepse" },
  // Pneumo / Infecto
  { id: "curb65", label: "CURB-65", category: "Infectologia" },
  // Onco / Uro
  { id: "psa", label: "PSA (Risco Ca Próstata)", category: "Urologia" },
  // Reumato
  { id: "asas", label: "ASAS (EpA Axial)", category: "Reumatologia" },
  // Cirurgia
  { id: "asa", label: "ASA (Risco Cirúrgico)", category: "Cirurgia" },
];

const CATEGORIES = ["Geral", "Nefrologia", "Neurologia", "Cardiologia", "Vascular", "UTI / Sepse", "Infectologia", "Urologia", "Reumatologia", "Cirurgia"];

// ─── RESULT BOX ──────────────────────────────────────────────────────────────
function ResultBox({ value, unit, label, color = "text-brand-blue-700", sub }: { value: string | number; unit?: string; label: string; color?: string; sub?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 mt-3">
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
      {unit && <p className="text-sm text-gray-500">{unit}</p>}
      <p className={`font-semibold mt-1 text-sm ${color}`}>{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function CheckItem({ label, pts, checked, onChange }: { label: string; pts?: number | string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 select-none">
      <input type="checkbox" className="w-4 h-4 accent-brand-blue-600 flex-shrink-0" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="flex-1 text-sm">{label}</span>
      {pts !== undefined && <span className="text-sm font-semibold text-brand-blue-600 flex-shrink-0">+{pts}</span>}
    </label>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="form-label">{label}</label>{children}</div>;
}

function Num({ value, onChange, placeholder, step }: { value: string; onChange: (v: string) => void; placeholder: string; step?: string }) {
  return <input type="number" step={step || "any"} className="form-input" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />;
}

function Sel({ value, onChange, opts }: { value: string; onChange: (v: string) => void; opts: [string, string][] }) {
  return (
    <select className="form-input" value={value} onChange={e => onChange(e.target.value)}>
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

// ─── CALCULATORS ─────────────────────────────────────────────────────────────

function IMCCalc() {
  const [w, setW] = useState(""); const [h, setH] = useState("");
  const v = w && h ? +(+w / (+h / 100) ** 2).toFixed(1) : null;
  function cls(n: number) {
    if (n < 18.5) return { label: "Baixo peso", color: "text-blue-600" };
    if (n < 25) return { label: "Peso normal", color: "text-green-600" };
    if (n < 30) return { label: "Sobrepeso", color: "text-yellow-600" };
    if (n < 35) return { label: "Obesidade grau I", color: "text-orange-500" };
    if (n < 40) return { label: "Obesidade grau II", color: "text-red-500" };
    return { label: "Obesidade grau III", color: "text-red-700" };
  }
  const c = v !== null ? cls(v) : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Peso (kg)"><Num value={w} onChange={setW} placeholder="70" /></Field>
        <Field label="Altura (cm)"><Num value={h} onChange={setH} placeholder="170" /></Field>
      </div>
      {v !== null && c && <ResultBox value={v} unit="kg/m²" label={c.label} color={c.color} />}
    </div>
  );
}

function CKDCGCalc() {
  const [cr, setCr] = useState(""); const [age, setAge] = useState(""); const [w, setW] = useState(""); const [sex, setSex] = useState("M");
  let r: number | null = null;
  if (cr && age && w) { r = +((((140 - +age) * +w) / (72 * +cr)) * (sex === "F" ? 0.85 : 1)).toFixed(1); }
  function cls(v: number) {
    if (v >= 90) return "G1 – Normal";
    if (v >= 60) return "G2 – Levemente diminuído";
    if (v >= 45) return "G3a – Leve a moderado";
    if (v >= 30) return "G3b – Moderado a grave";
    if (v >= 15) return "G4 – Grave";
    return "G5 – Falência renal";
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">[(140 – idade) × peso] / (72 × creatinina) × 0,85 se ♀</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Creatinina (mg/dL)"><Num value={cr} onChange={setCr} placeholder="1.2" step="0.01" /></Field>
        <Field label="Idade (anos)"><Num value={age} onChange={setAge} placeholder="65" /></Field>
        <Field label="Peso (kg)"><Num value={w} onChange={setW} placeholder="70" /></Field>
        <Field label="Sexo"><Sel value={sex} onChange={setSex} opts={[["M","Masculino"],["F","Feminino"]]} /></Field>
      </div>
      {r !== null && <ResultBox value={r} unit="mL/min" label={cls(r)} color={r >= 60 ? "text-green-600" : r >= 30 ? "text-yellow-600" : "text-red-600"} />}
    </div>
  );
}

function CKDEPICalc() {
  const [cr, setCr] = useState(""); const [age, setAge] = useState(""); const [sex, setSex] = useState("M");
  let eGFR: number | null = null;
  if (cr && age) {
    const scr = +cr; const a = +age;
    let k = sex === "F" ? 0.7 : 0.9;
    let alpha = sex === "F" ? -0.241 : -0.302;
    let sexFactor = sex === "F" ? 1.012 : 1;
    const ratio = scr / k;
    eGFR = +(142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.200) * Math.pow(0.9938, a) * sexFactor).toFixed(1);
  }
  function cls(v: number) {
    if (v >= 90) return { l: "G1 – Normal", c: "text-green-600" };
    if (v >= 60) return { l: "G2 – Levemente diminuído", c: "text-yellow-600" };
    if (v >= 45) return { l: "G3a – Leve a moderado", c: "text-orange-500" };
    if (v >= 30) return { l: "G3b – Moderado a grave", c: "text-orange-600" };
    if (v >= 15) return { l: "G4 – Grave", c: "text-red-500" };
    return { l: "G5 – Falência renal", c: "text-red-700" };
  }
  const c = eGFR !== null ? cls(eGFR) : null;
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">CKD-EPI 2021 (recomendado KDIGO) – mais preciso que Cockcroft-Gault</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Creatinina sérica (mg/dL)"><Num value={cr} onChange={setCr} placeholder="1.2" step="0.01" /></Field>
        <Field label="Idade (anos)"><Num value={age} onChange={setAge} placeholder="65" /></Field>
        <Field label="Sexo"><Sel value={sex} onChange={setSex} opts={[["M","Masculino"],["F","Feminino"]]} /></Field>
      </div>
      {eGFR !== null && c && <ResultBox value={eGFR} unit="mL/min/1,73m²" label={c.l} color={c.c} />}
    </div>
  );
}

function GasometriaCalc() {
  const [ph, setPh] = useState(""); const [pco2, setPco2] = useState(""); const [hco3, setHco3] = useState("");
  const [pao2, setPao2] = useState(""); const [fio2, setFio2] = useState("21");
  const phN = +ph; const pco2N = +pco2; const hco3N = +hco3;
  let result: { disturbio: string; compensacao: string; oxigenacao: string; color: string } | null = null;
  if (ph && pco2 && hco3) {
    let disturbio = ""; let compensacao = ""; let color = "text-green-600";
    if (phN < 7.35) {
      color = "text-red-600";
      if (pco2N > 45) disturbio = "Acidose Respiratória";
      else if (hco3N < 22) disturbio = "Acidose Metabólica";
      else disturbio = "Distúrbio misto ou acidose";
    } else if (phN > 7.45) {
      color = "text-blue-600";
      if (pco2N < 35) disturbio = "Alcalose Respiratória";
      else if (hco3N > 26) disturbio = "Alcalose Metabólica";
      else disturbio = "Distúrbio misto ou alcalose";
    } else {
      disturbio = "pH Normal (7,35–7,45)";
    }
    if (disturbio === "Acidose Metabólica") {
      const expPCO2 = 1.5 * hco3N + 8;
      compensacao = Math.abs(pco2N - expPCO2) < 2 ? "Compensação respiratória adequada (Winter)" : `PCO₂ esperado: ${expPCO2.toFixed(1)} (±2). Considerar distúrbio misto.`;
    } else if (disturbio === "Alcalose Metabólica") {
      const expPCO2 = 0.7 * hco3N + 21;
      compensacao = Math.abs(pco2N - expPCO2) < 2 ? "Compensação respiratória adequada" : `PCO₂ esperado: ${expPCO2.toFixed(1)} (±2). Considerar distúrbio misto.`;
    } else if (disturbio === "Acidose Respiratória") {
      const expHCO3 = pco2N > 45 ? 24 + 0.1 * (pco2N - 40) : 24;
      compensacao = `HCO₃⁻ esperado (agudo): ${expHCO3.toFixed(1)} | Crônico: ${(24 + 0.35 * (pco2N - 40)).toFixed(1)}`;
    } else if (disturbio === "Alcalose Respiratória") {
      compensacao = `HCO₃⁻ esperado (agudo): ${(24 - 0.2 * (40 - pco2N)).toFixed(1)} | Crônico: ${(24 - 0.5 * (40 - pco2N)).toFixed(1)}`;
    }
    let oxigenacao = "";
    if (pao2 && fio2) {
      const fi = +fio2 / 100;
      const pf = +pao2 / fi;
      if (pf >= 300) oxigenacao = `PaO₂/FiO₂: ${pf.toFixed(0)} – Normal`;
      else if (pf >= 200) oxigenacao = `PaO₂/FiO₂: ${pf.toFixed(0)} – SDRA Leve`;
      else if (pf >= 100) oxigenacao = `PaO₂/FiO₂: ${pf.toFixed(0)} – SDRA Moderada`;
      else oxigenacao = `PaO₂/FiO₂: ${pf.toFixed(0)} – SDRA Grave`;
    }
    result = { disturbio, compensacao, oxigenacao, color };
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="pH"><Num value={ph} onChange={setPh} placeholder="7.38" step="0.01" /></Field>
        <Field label="pCO₂ (mmHg)"><Num value={pco2} onChange={setPco2} placeholder="40" /></Field>
        <Field label="HCO₃⁻ (mEq/L)"><Num value={hco3} onChange={setHco3} placeholder="24" /></Field>
        <Field label="PaO₂ (mmHg) — opcional"><Num value={pao2} onChange={setPao2} placeholder="95" /></Field>
        <Field label="FiO₂ (%) — opcional"><Num value={fio2} onChange={setFio2} placeholder="21" /></Field>
      </div>
      {result && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
          <p className={`text-lg font-bold ${result.color}`}>{result.disturbio}</p>
          {result.compensacao && <p className="text-sm text-gray-700">{result.compensacao}</p>}
          {result.oxigenacao && <p className="text-sm text-blue-700 font-medium">{result.oxigenacao}</p>}
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            <p>Referências: pH 7,35–7,45 | pCO₂ 35–45 | HCO₃⁻ 22–26 | BE −2 a +2</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SodioDeficitCalc() {
  const [na, setNa] = useState(""); const [w, setW] = useState(""); const [sex, setSex] = useState("M");
  let result: string | null = null;
  if (na && w) {
    const tbw = +w * (sex === "M" ? 0.6 : 0.5);
    const deficit = tbw * ((+na / 140) - 1);
    result = `Déficit de água livre: ${deficit.toFixed(1)} litros\nÁgua corporal total estimada: ${tbw.toFixed(1)} L`;
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">DAL = ACT × (Na atual / 140 – 1) | Usado em hipernatremia</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sódio atual (mEq/L)"><Num value={na} onChange={setNa} placeholder="155" /></Field>
        <Field label="Peso (kg)"><Num value={w} onChange={setW} placeholder="70" /></Field>
        <Field label="Sexo"><Sel value={sex} onChange={setSex} opts={[["M","Masculino (ACT = 0,6)"],["F","Feminino (ACT = 0,5)"]]} /></Field>
      </div>
      {result && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          {result.split("\n").map((l, i) => <p key={i} className={i === 0 ? "text-lg font-bold text-brand-blue-700" : "text-sm text-gray-600"}>{l}</p>)}
          <p className="text-xs text-gray-400 mt-2">Repor lentamente! Máx. 0,5–1 mEq/L/h para evitar edema cerebral.</p>
        </div>
      )}
    </div>
  );
}

function SodioCorrecaoCalc() {
  const [na, setNa] = useState(""); const [w, setW] = useState(""); const [sex, setSex] = useState("M"); const [target, setTarget] = useState("130");
  let result: string | null = null;
  if (na && w && target) {
    const tbw = +w * (sex === "M" ? 0.6 : 0.5);
    const delta = (+target - +na) * tbw;
    result = `Para elevar Na de ${na} → ${target} mEq/L: ${Math.abs(delta).toFixed(0)} mEq de sódio\nACT: ${tbw.toFixed(1)} L`;
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Déficit Na = (Na desejado – Na atual) × ACT | Usado em hiponatremia</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sódio atual (mEq/L)"><Num value={na} onChange={setNa} placeholder="118" /></Field>
        <Field label="Sódio alvo (mEq/L)"><Num value={target} onChange={setTarget} placeholder="130" /></Field>
        <Field label="Peso (kg)"><Num value={w} onChange={setW} placeholder="70" /></Field>
        <Field label="Sexo"><Sel value={sex} onChange={setSex} opts={[["M","Masculino"],["F","Feminino"]]} /></Field>
      </div>
      {result && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          {result.split("\n").map((l, i) => <p key={i} className={i === 0 ? "text-lg font-bold text-brand-blue-700" : "text-sm text-gray-600"}>{l}</p>)}
          <p className="text-xs text-gray-400 mt-2">⚠️ Limite: máx. 8–10 mEq/L em 24h (risco de mielinólise pontina)</p>
        </div>
      )}
    </div>
  );
}

function GlasgowCalc() {
  const [o, setO] = useState(4); const [v, setV] = useState(5); const [m, setM] = useState(6);
  const t = o + v + m;
  function sev(n: number) {
    if (n >= 13) return { l: "TCE Leve", c: "text-green-600" };
    if (n >= 9) return { l: "TCE Moderado", c: "text-yellow-600" };
    return { l: "TCE Grave", c: "text-red-600" };
  }
  const s = sev(t);
  return (
    <div className="space-y-4">
      {([
        ["Abertura Ocular", o, setO, [[4,"Espontânea"],[3,"À voz"],[2,"À dor"],[1,"Ausente"]]],
        ["Resposta Verbal", v, setV, [[5,"Orientado"],[4,"Confuso"],[3,"Palavras inapropriadas"],[2,"Sons incompreensíveis"],[1,"Ausente"]]],
        ["Resposta Motora", m, setM, [[6,"Obedece comandos"],[5,"Localiza dor"],[4,"Retirada"],[3,"Flexão anormal (decorticação)"],[2,"Extensão anormal (descerebração)"],[1,"Ausente"]]],
      ] as [string, number, React.Dispatch<React.SetStateAction<number>>, [number, string][]][]).map(([label, val, set, opts]) => (
        <Field key={label} label={label}>
          <Sel value={String(val)} onChange={v => set(+v)} opts={opts.map(([n, l]) => [String(n), `${n} – ${l}`])} />
        </Field>
      ))}
      <ResultBox value={`${t}/15`} label={s.l} color={s.c} sub={`O${o} + V${v} + M${m}`} />
    </div>
  );
}

function NIHSSCalc() {
  const items: [string, number][] = [
    ["1a. Nível de consciência (0–3)", 3],
    ["1b. Perguntas sobre consciência (0–2)", 2],
    ["1c. Resposta a comandos (0–2)", 2],
    ["2. Olhar (0–2)", 2],
    ["3. Campos visuais (0–3)", 3],
    ["4. Paralisia facial (0–3)", 3],
    ["5. Força MMSS – braço direito (0–4)", 4],
    ["6. Força MMSS – braço esquerdo (0–4)", 4],
    ["7. Força MMII – perna direita (0–4)", 4],
    ["8. Força MMII – perna esquerda (0–4)", 4],
    ["9. Ataxia dos membros (0–2)", 2],
    ["10. Sensibilidade (0–2)", 2],
    ["11. Afasia (0–3)", 3],
    ["12. Disartria (0–2)", 2],
    ["13. Extinção / negligência (0–2)", 2],
  ];
  const [vals, setVals] = useState<number[]>(items.map(() => 0));
  const total = vals.reduce((a, b) => a + b, 0);
  function cls(n: number) {
    if (n === 0) return { l: "Sem déficit", c: "text-green-600" };
    if (n <= 4) return { l: "AVC leve", c: "text-yellow-600" };
    if (n <= 15) return { l: "AVC moderado", c: "text-orange-600" };
    if (n <= 20) return { l: "AVC moderado a grave", c: "text-red-500" };
    return { l: "AVC grave", c: "text-red-700" };
  }
  const c = cls(total);
  return (
    <div className="space-y-2">
      {items.map(([label, max], i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <span className="flex-1 text-gray-700">{label}</span>
          <select className="form-input w-20 text-sm py-1" value={vals[i]} onChange={e => { const n = [...vals]; n[i] = +e.target.value; setVals(n); }}>
            {Array.from({ length: max + 1 }, (_, j) => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
      ))}
      <ResultBox value={total} unit="pontos" label={c.l} color={c.c} sub="Limiar trombólise IV: NIHSS ≥ 4 e ≤ 25 (verificar protocolo)" />
    </div>
  );
}

function ICHScoreCalc() {
  const items = [
    { label: "Glasgow 3–4", pts: 2 },
    { label: "Glasgow 5–12", pts: 1 },
    { label: "Volume do hematoma ≥ 30 mL", pts: 1 },
    { label: "Extensão intraventricular", pts: 1 },
    { label: "Origem infratentorial", pts: 1 },
    { label: "Idade ≥ 80 anos", pts: 1 },
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const score = items.reduce((s, it, i) => s + (checked[i] ? it.pts : 0), 0);
  const mortalidade = ["13%", "26%", "29%", "72%", "97%", "100%"][Math.min(score, 5)];
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Prediz mortalidade em 30 dias no AVC hemorrágico (ICH)</p>
      {items.map((it, i) => <CheckItem key={i} label={`${it.label}`} pts={it.pts} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={`${score}/6`} label={`Mortalidade 30 dias ≈ ${mortalidade}`} color={score <= 1 ? "text-green-600" : score <= 2 ? "text-yellow-600" : "text-red-600"} />
    </div>
  );
}

function FraminghamCalc() {
  const [age, setAge] = useState(""); const [sex, setSex] = useState("M");
  const [totalChol, setTotalChol] = useState(""); const [hdl, setHdl] = useState("");
  const [sbp, setSbp] = useState(""); const [sbpTreated, setSbpTreated] = useState("N");
  const [smoking, setSmoking] = useState("N"); const [diabetes, setDiabetes] = useState("N");

  let risk10y: number | null = null;
  if (age && totalChol && hdl && sbp) {
    const a = +age; const tc = +totalChol; const h = +hdl; const s = +sbp;
    let lnAge: number, lnTotalChol: number, lnHdl: number, lnSbp: number, smokePts: number, diabetesPts: number;
    if (sex === "M") {
      lnAge = Math.log(a) * 3.06117;
      lnTotalChol = Math.log(tc) * 1.12370;
      lnHdl = Math.log(h) * -0.93263;
      lnSbp = sbpTreated === "Y" ? Math.log(s) * 1.93303 : Math.log(s) * 1.65431;
      smokePts = smoking === "Y" ? 0.65451 : 0;
      diabetesPts = diabetes === "Y" ? 0.57367 : 0;
      const sum = lnAge + lnTotalChol + lnHdl + lnSbp + smokePts + diabetesPts;
      risk10y = +(1 - Math.pow(0.88936, Math.exp(sum - 23.9802))) * 100;
    } else {
      lnAge = Math.log(a) * 2.32888;
      lnTotalChol = Math.log(tc) * 1.20904;
      lnHdl = Math.log(h) * -0.70833;
      lnSbp = sbpTreated === "Y" ? Math.log(s) * 2.82263 : Math.log(s) * 2.76157;
      smokePts = smoking === "Y" ? 0.52873 : 0;
      diabetesPts = diabetes === "Y" ? 0.69154 : 0;
      const sum = lnAge + lnTotalChol + lnHdl + lnSbp + smokePts + diabetesPts;
      risk10y = +(1 - Math.pow(0.95012, Math.exp(sum - 26.1931))) * 100;
    }
    risk10y = +risk10y.toFixed(1);
  }
  function cls(r: number) {
    if (r < 10) return { l: "Baixo risco (<10%)", c: "text-green-600" };
    if (r < 20) return { l: "Risco intermediário (10–20%)", c: "text-yellow-600" };
    return { l: "Alto risco (≥20%)", c: "text-red-600" };
  }
  const c = risk10y !== null ? cls(risk10y) : null;
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Risco de evento cardiovascular em 10 anos (D'Agostino 2008 – pontos contínuos)</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sexo"><Sel value={sex} onChange={setSex} opts={[["M","Masculino"],["F","Feminino"]]} /></Field>
        <Field label="Idade (anos)"><Num value={age} onChange={setAge} placeholder="50" /></Field>
        <Field label="Colesterol total (mg/dL)"><Num value={totalChol} onChange={setTotalChol} placeholder="200" /></Field>
        <Field label="HDL (mg/dL)"><Num value={hdl} onChange={setHdl} placeholder="50" /></Field>
        <Field label="PAS (mmHg)"><Num value={sbp} onChange={setSbp} placeholder="120" /></Field>
        <Field label="Em tratamento anti-hipertensivo?"><Sel value={sbpTreated} onChange={setSbpTreated} opts={[["N","Não"],["Y","Sim"]]} /></Field>
        <Field label="Tabagismo atual"><Sel value={smoking} onChange={setSmoking} opts={[["N","Não"],["Y","Sim"]]} /></Field>
        <Field label="Diabetes"><Sel value={diabetes} onChange={setDiabetes} opts={[["N","Não"],["Y","Sim"]]} /></Field>
      </div>
      {risk10y !== null && c && <ResultBox value={`${risk10y}%`} label={c.l} color={c.c} sub="Risco cardiovascular em 10 anos (Framingham)" />}
    </div>
  );
}

function CHADSVASCCalc() {
  const items = [
    { label: "IC / Disfunção VE", pts: 1 },
    { label: "HAS", pts: 1 },
    { label: "Idade ≥ 75 anos", pts: 2 },
    { label: "Diabetes mellitus", pts: 1 },
    { label: "AVC / AIT / TE prévio", pts: 2 },
    { label: "Doença vascular (IAM, DAP, placa aórtica)", pts: 1 },
    { label: "Idade 65–74 anos", pts: 1 },
    { label: "Sexo feminino", pts: 1 },
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const score = items.reduce((s, it, i) => s + (checked[i] ? it.pts : 0), 0);
  function cls(s: number) {
    if (s === 0) return { l: "Sem anticoagulação indicada", c: "text-green-600" };
    if (s === 1) return { l: "Considerar anticoagulação (risco baixo–intermediário)", c: "text-yellow-600" };
    return { l: "Anticoagulação recomendada (OAC)", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Indicação de anticoagulação na Fibrilação Atrial não valvular</p>
      {items.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={score} label={c.l} color={c.c} />
    </div>
  );
}

function GRACECalc() {
  const items = [
    { label: "Killip I (sem ICC)", pts: 0 },
    { label: "Killip II (estertores ½ inf.)", pts: 20 },
    { label: "Killip III (edema pulmonar)", pts: 39 },
    { label: "Killip IV (choque cardiogênico)", pts: 59 },
  ];
  const ageItems = [[0,"<40"],[18,"40–49"],[36,"50–59"],[55,"60–69"],[73,"70–79"],[91,"≥80"]] as [number,string][];
  const fcItems = [[0,"<70"],[3,"70–89"],[9,"90–109"],[15,"110–149"],[24,"150–199"],[46,"≥200"]] as [number,string][];
  const sbpItems = [[58,"<80"],[53,"80–99"],[43,"100–119"],[34,"120–139"],[24,"140–159"],[10,"160–199"],[0,"≥200"]] as [number,string][];
  const crItems = [[1,"0–0,39"],[4,"0,40–0,79"],[7,"0,80–1,19"],[10,"1,20–1,59"],[13,"1,60–1,99"],[21,"2,00–3,99"],[28,"≥4,00"]] as [number,string][];
  const [killip, setKillip] = useState(0);
  const [agePts, setAgePts] = useState(0);
  const [fcPts, setFcPts] = useState(0);
  const [sbpPts, setSbpPts] = useState(0);
  const [crPts, setCrPts] = useState(1);
  const [cardiac, setCardiac] = useState(false);
  const [st, setSt] = useState(false);
  const [enzymes, setEnzymes] = useState(false);
  const score = killip + agePts + fcPts + sbpPts + crPts + (cardiac ? 39 : 0) + (st ? 28 : 0) + (enzymes ? 14 : 0);
  function cls(s: number) {
    if (s < 109) return { l: "Baixo risco (<1% mort. hospitalar)", c: "text-green-600" };
    if (s < 140) return { l: "Risco intermediário (1–3%)", c: "text-yellow-600" };
    return { l: "Alto risco (>3%)", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Classe Killip"><select className="form-input" value={killip} onChange={e => setKillip(+e.target.value)}>{items.map((it, i) => <option key={i} value={it.pts}>{it.label}</option>)}</select></Field>
        <Field label="Faixa etária"><select className="form-input" value={agePts} onChange={e => setAgePts(+e.target.value)}>{ageItems.map(([pts, l]) => <option key={pts} value={pts}>{l} (+{pts})</option>)}</select></Field>
        <Field label="FC (bpm)"><select className="form-input" value={fcPts} onChange={e => setFcPts(+e.target.value)}>{fcItems.map(([pts, l]) => <option key={pts} value={pts}>{l} (+{pts})</option>)}</select></Field>
        <Field label="PAS (mmHg)"><select className="form-input" value={sbpPts} onChange={e => setSbpPts(+e.target.value)}>{sbpItems.map(([pts, l]) => <option key={pts} value={pts}>{l} (+{pts})</option>)}</select></Field>
        <Field label="Creatinina (mg/dL)"><select className="form-input" value={crPts} onChange={e => setCrPts(+e.target.value)}>{crItems.map(([pts, l]) => <option key={pts} value={pts}>{l} (+{pts})</option>)}</select></Field>
      </div>
      <CheckItem label="Parada cardíaca na admissão (+39)" pts={39} checked={cardiac} onChange={setCardiac} />
      <CheckItem label="Desvio de ST (+28)" pts={28} checked={st} onChange={setSt} />
      <CheckItem label="Marcadores cardíacos elevados (+14)" pts={14} checked={enzymes} onChange={setEnzymes} />
      <ResultBox value={score} label={c.l} color={c.c} sub="GRACE Score – SCA sem supra" />
    </div>
  );
}

function TIMICalc() {
  const items = [
    { label: "Idade ≥ 65 anos", pts: 1 },
    { label: "≥ 3 fatores de risco de DAC (tabagismo, HAS, hipercolesterolemia, DM, história familiar)", pts: 1 },
    { label: "DAC prévia conhecida (estenose ≥ 50%)", pts: 1 },
    { label: "Uso de AAS nos últimos 7 dias", pts: 1 },
    { label: "Angina grave recente (≥ 2 episódios em 24h)", pts: 1 },
    { label: "Marcadores cardíacos elevados (Tn ou CK-MB)", pts: 1 },
    { label: "Desvio de ST ≥ 0,5 mm", pts: 1 },
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const score = checked.filter(Boolean).length;
  function cls(s: number) {
    if (s <= 2) return { l: "Baixo risco (~5% evento em 14d)", c: "text-green-600" };
    if (s <= 4) return { l: "Risco intermediário (~13%)", c: "text-yellow-600" };
    return { l: "Alto risco (~26–41%)", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">TIMI Risk Score – NSTE-ACS (instável / NSTEMI)</p>
      {items.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={`${score}/7`} label={c.l} color={c.c} />
    </div>
  );
}

function WellsTEPCalc() {
  const items = [
    { label: "TVP clínica ou TEP anteriores", pts: 1.5 },
    { label: "FC > 100 bpm", pts: 1.5 },
    { label: "Cirurgia ou imobilização nas últimas 4 semanas", pts: 1.5 },
    { label: "Sinal clínico de TVP", pts: 3 },
    { label: "Diagnóstico alternativo menos provável que TEP", pts: 3 },
    { label: "Hemoptise", pts: 1 },
    { label: "Câncer ativo (trat. ≤ 6 meses ou paliativo)", pts: 1 },
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const score = items.reduce((s, it, i) => s + (checked[i] ? it.pts : 0), 0);
  function cls(s: number) {
    if (s <= 1) return { l: "Baixa probabilidade (<2%)", c: "text-green-600" };
    if (s <= 6) return { l: "Probabilidade moderada (~20%)", c: "text-yellow-600" };
    return { l: "Alta probabilidade (~67%)", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-2">
      {items.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={score} label={c.l} color={c.c} sub="Score ≤4 + D-Dímero neg. → TEP excluído com segurança" />
    </div>
  );
}

function WellsTVPCalc() {
  const items = [
    { label: "Câncer ativo (tratamento atual ou ≤ 6 meses)", pts: 1 },
    { label: "Paralisia, paresia ou imobilização de MMII", pts: 1 },
    { label: "Acamado por ≥ 3 dias ou cirurgia ≤ 12 semanas com anestesia geral/regional", pts: 1 },
    { label: "Dor localizada no trajeto do sistema venoso profundo", pts: 1 },
    { label: "Edema em todo o membro inferior", pts: 1 },
    { label: "Edema de panturrilha > 3 cm que o lado assintomático", pts: 1 },
    { label: "Edema com cacifo (depressível) sintomático", pts: 1 },
    { label: "Veias colaterais superficiais (não varicosas)", pts: 1 },
    { label: "TVP documentada anteriormente", pts: 1 },
    { label: "Diagnóstico alternativo igualmente ou mais provável", pts: -2 },
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const score = items.reduce((s, it, i) => s + (checked[i] ? it.pts : 0), 0);
  function cls(s: number) {
    if (s <= 0) return { l: "Baixa probabilidade (~3%)", c: "text-green-600" };
    if (s <= 2) return { l: "Probabilidade moderada (~17%)", c: "text-yellow-600" };
    return { l: "Alta probabilidade (~75%)", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-2">
      {items.map((it, i) => <CheckItem key={i} label={`${it.label}`} pts={it.pts} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={score} label={c.l} color={c.c} />
    </div>
  );
}

function PERCCalc() {
  const items = [
    "Idade < 50 anos",
    "FC < 100 bpm",
    "SpO₂ ≥ 95%",
    "Sem hemoptise",
    "Sem uso de estrogênio exógeno",
    "Sem TVP prévia ou TEP prévio",
    "Sem edema unilateral de MMII",
    "Sem cirurgia ou trauma com necessidade de hospitalização nas últimas 4 semanas",
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const allPERC = checked.every(Boolean);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Todos os critérios PERC devem ser VERDADEIROS para excluir TEP sem exames (em pacientes de baixa probabilidade pré-teste)</p>
      {items.map((it, i) => <CheckItem key={i} label={it} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <div className={`rounded-xl p-4 text-center border mt-3 ${allPERC ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
        <p className={`text-lg font-bold ${allPERC ? "text-green-600" : "text-red-600"}`}>
          {allPERC ? "PERC Negativo – TEP excluído sem D-Dímero" : "PERC Positivo – Prosseguir investigação (D-Dímero / Imagem)"}
        </p>
        <p className="text-xs text-gray-500 mt-1">Válido apenas em pacientes de BAIXA probabilidade (Wells ≤ 1)</p>
      </div>
    </div>
  );
}

function SOFACalc() {
  const [pao2fio2, setPao2fio2] = useState(""); const [plat, setPlat] = useState(""); const [bili, setBili] = useState("");
  const [map, setMap] = useState(""); const [vasopressor, setVasopressor] = useState("0");
  const [gcs, setGcs] = useState("15"); const [cr, setCr] = useState(""); const [diurese, setDiurese] = useState("");

  function respPts() { const v = +pao2fio2; if (!v) return 0; if (v >= 400) return 0; if (v >= 300) return 1; if (v >= 200) return 2; if (v >= 100) return 3; return 4; }
  function coagPts() { const v = +plat; if (!v) return 0; if (v >= 150) return 0; if (v >= 100) return 1; if (v >= 50) return 2; if (v >= 20) return 3; return 4; }
  function livPts() { const v = +bili; if (!v) return 0; if (v < 1.2) return 0; if (v < 2) return 1; if (v < 6) return 2; if (v < 12) return 3; return 4; }
  function cvPts() { const v = +vasopressor; return +v; }
  function neuroPts() { const v = +gcs; if (v === 15) return 0; if (v >= 13) return 1; if (v >= 10) return 2; if (v >= 6) return 3; return 4; }
  function renalPts() {
    let p = 0;
    const v = +cr;
    if (v >= 5) p = 4; else if (v >= 3.5) p = 3; else if (v >= 2) p = 2; else if (v >= 1.2) p = 1;
    const d = +diurese;
    if (d && d < 200) p = Math.max(p, 4);
    else if (d && d < 500) p = Math.max(p, 3);
    return p;
  }
  const r = respPts(), cg = coagPts(), li = livPts(), cv = cvPts(), ne = neuroPts(), re = renalPts();
  const total = r + cg + li + cv + ne + re;
  function cls(s: number) {
    if (s < 6) return { l: "Mortalidade <10%", c: "text-green-600" };
    if (s < 10) return { l: "Mortalidade 15–20%", c: "text-yellow-600" };
    if (s < 13) return { l: "Mortalidade 40–50%", c: "text-orange-600" };
    return { l: "Mortalidade >80%", c: "text-red-600" };
  }
  const c = cls(total);
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Sepse = disfunção orgânica aguda (∆SOFA ≥ 2) + suspeita infecção. Choque = vasopressor + lactato &gt; 2 após reposição.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="PaO₂/FiO₂ (mmHg)"><Num value={pao2fio2} onChange={setPao2fio2} placeholder="Ex: 300" /></Field>
        <Field label="Plaquetas (x10³/µL)"><Num value={plat} onChange={setPlat} placeholder="Ex: 150" /></Field>
        <Field label="Bilirrubina (mg/dL)"><Num value={bili} onChange={setBili} placeholder="Ex: 1.5" step="0.1" /></Field>
        <Field label="Creatinina (mg/dL)"><Num value={cr} onChange={setCr} placeholder="Ex: 1.5" step="0.1" /></Field>
        <Field label="Diurese (mL/dia) — opcional"><Num value={diurese} onChange={setDiurese} placeholder="Ex: 800" /></Field>
        <Field label="Glasgow (3–15)">
          <Sel value={gcs} onChange={setGcs} opts={Array.from({length:13},(_,i)=>15-i).map(v => [String(v), String(v)])} />
        </Field>
        <div className="col-span-2">
          <label className="form-label">Suporte cardiovascular</label>
          <select className="form-input" value={vasopressor} onChange={e => setVasopressor(e.target.value)}>
            <option value="0">PAM ≥ 70 mmHg sem vasopressor</option>
            <option value="1">PAM &lt; 70 mmHg</option>
            <option value="2">Dopa ≤ 5 µg ou Dobuta (qualquer dose)</option>
            <option value="3">Dopa 5,1–15 µg ou Norepi/Adrenalina ≤ 0,1</option>
            <option value="4">Dopa &gt; 15 µg ou Norepi/Adrenalina &gt; 0,1</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        {[["Resp",r],["Coag",cg],["Fígado",li],["CV",cv],["Neuro",ne],["Renal",re]].map(([k,v]) => (
          <div key={k} className="bg-gray-50 rounded-lg p-2 border"><p className="text-gray-500">{k}</p><p className="text-lg font-bold text-gray-800">{v}</p></div>
        ))}
      </div>
      <ResultBox value={total} unit="pontos" label={c.l} color={c.c} />
    </div>
  );
}

function QSOFACalc() {
  const items = [
    "FR ≥ 22 ipm",
    "PAS ≤ 100 mmHg",
    "Alteração do sensório (Glasgow < 15)",
  ];
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const score = checked.filter(Boolean).length;
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Triagem rápida de sepse à beira-leito (emergência / enfermaria). Score ≥ 2 → alta mortalidade</p>
      {items.map((it, i) => <CheckItem key={i} label={it} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={`${score}/3`} label={score >= 2 ? "qSOFA ≥ 2 – Investigar sepse (SOFA completo)" : "qSOFA < 2 – Baixo risco de sepse"} color={score >= 2 ? "text-red-600" : "text-green-600"} />
    </div>
  );
}

function APACHE2Calc() {
  const [age, setAge] = useState(""); const [chrDz, setChrDz] = useState("0");
  const [gcs, setGcs] = useState("15");
  const [temp, setTemp] = useState(""); const [map, setMap] = useState(""); const [fc, setFc] = useState("");
  const [fr, setFr] = useState(""); const [pao2, setPao2] = useState(""); const [fio2, setFio2] = useState("");
  const [ph, setPh] = useState(""); const [na, setNa] = useState(""); const [k, setK] = useState("");
  const [cr, setCr] = useState(""); const [arf, setArf] = useState("N"); const [hct, setHct] = useState(""); const [wbc, setWbc] = useState("");

  function agePts(a: number) { if (a < 45) return 0; if (a < 55) return 2; if (a < 65) return 3; if (a < 75) return 5; return 6; }
  function tempPts(t: number) { if (t >= 41) return 4; if (t >= 39) return 3; if (t >= 38.5) return 1; if (t >= 36) return 0; if (t >= 34) return 1; if (t >= 32) return 2; if (t >= 30) return 3; return 4; }
  function mapPts(m: number) { if (m >= 160) return 4; if (m >= 130) return 3; if (m >= 110) return 2; if (m >= 70) return 0; if (m >= 50) return 2; return 4; }
  function fcPts(f: number) { if (f >= 180) return 4; if (f >= 140) return 3; if (f >= 110) return 2; if (f >= 70) return 0; if (f >= 55) return 2; if (f >= 40) return 3; return 4; }
  function frPts(r: number) { if (r >= 50) return 4; if (r >= 35) return 3; if (r >= 25) return 1; if (r >= 12) return 0; if (r >= 10) return 1; if (r >= 6) return 2; return 4; }
  function oxyPts() { if (+fio2 >= 50) { const pf = +pao2 / (+fio2/100); if (pf < 200) return 4; if (pf < 350) return 2; if (pf < 500) return 0; return 0; } return +pao2 >= 70 ? 0 : +pao2 >= 61 ? 1 : +pao2 >= 55 ? 3 : 4; }
  function phPts(p: number) { if (p >= 7.7) return 4; if (p >= 7.6) return 3; if (p >= 7.5) return 1; if (p >= 7.33) return 0; if (p >= 7.25) return 2; if (p >= 7.15) return 3; return 4; }
  function naPts(n: number) { if (n >= 180) return 4; if (n >= 160) return 3; if (n >= 155) return 2; if (n >= 150) return 1; if (n >= 130) return 0; if (n >= 120) return 2; if (n >= 111) return 3; return 4; }
  function kPts(kv: number) { if (kv >= 7) return 4; if (kv >= 6) return 3; if (kv >= 5.5) return 1; if (kv >= 3.5) return 0; if (kv >= 3) return 1; if (kv >= 2.5) return 2; return 4; }
  function crPts(c: number, acute: boolean) { const v = acute ? c * 2 : c; if (v >= 3.5) return 4; if (v >= 2) return 3; if (v >= 1.5) return 2; if (v >= 0.6) return 0; return 2; }
  function hctPts(h: number) { if (h >= 60) return 4; if (h >= 50) return 2; if (h >= 46) return 1; if (h >= 30) return 0; if (h >= 20) return 2; return 4; }
  function wbcPts(w: number) { if (w >= 40) return 4; if (w >= 20) return 2; if (w >= 15) return 1; if (w >= 3) return 0; if (w >= 1) return 2; return 4; }
  function gcsPts(g: number) { return 15 - g; }

  const a = +age; const t = +temp; const m = +map; const f = +fc; const r = +fr; const p = +ph; const nv = +na; const kv = +k; const cv = +cr; const hv = +hct; const wv = +wbc; const gv = +gcs;
  const pts = [
    age ? agePts(a) : 0, +chrDz,
    temp ? tempPts(t) : 0, map ? mapPts(m) : 0, fc ? fcPts(f) : 0,
    fr ? frPts(r) : 0,
    pao2 ? oxyPts() : 0,
    ph ? phPts(p) : 0, na ? naPts(nv) : 0, k ? kPts(kv) : 0,
    cr ? crPts(cv, arf === "Y") : 0,
    hct ? hctPts(hv) : 0, wbc ? wbcPts(wv) : 0,
    gcs ? gcsPts(gv) : 0,
  ];
  const total = pts.reduce((a, b) => a + b, 0);
  function cls(s: number) {
    if (s < 10) return { l: "Mortalidade ~10%", c: "text-green-600" };
    if (s < 20) return { l: "Mortalidade ~25%", c: "text-yellow-600" };
    if (s < 30) return { l: "Mortalidade ~40%", c: "text-orange-600" };
    return { l: "Mortalidade >70%", c: "text-red-600" };
  }
  const c = cls(total);
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">APACHE II – Valores piores nas primeiras 24h de UTI</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Idade"><Num value={age} onChange={setAge} placeholder="65" /></Field>
        <Field label="Glasgow"><Sel value={gcs} onChange={setGcs} opts={Array.from({length:13},(_,i)=>15-i).map(v=>[String(v),String(v)])} /></Field>
        <Field label="Temperatura (°C)"><Num value={temp} onChange={setTemp} placeholder="37.0" step="0.1" /></Field>
        <Field label="PAM (mmHg)"><Num value={map} onChange={setMap} placeholder="80" /></Field>
        <Field label="FC (bpm)"><Num value={fc} onChange={setFc} placeholder="80" /></Field>
        <Field label="FR (irpm)"><Num value={fr} onChange={setFr} placeholder="16" /></Field>
        <Field label="PaO₂ (mmHg)"><Num value={pao2} onChange={setPao2} placeholder="95" /></Field>
        <Field label="FiO₂ (%)"><Num value={fio2} onChange={setFio2} placeholder="21" /></Field>
        <Field label="pH arterial"><Num value={ph} onChange={setPh} placeholder="7.40" step="0.01" /></Field>
        <Field label="Sódio (mEq/L)"><Num value={na} onChange={setNa} placeholder="138" /></Field>
        <Field label="Potássio (mEq/L)"><Num value={k} onChange={setK} placeholder="4.0" step="0.1" /></Field>
        <Field label="Creatinina (mg/dL)"><Num value={cr} onChange={setCr} placeholder="1.0" step="0.1" /></Field>
        <Field label="IRA presente?"><Sel value={arf} onChange={setArf} opts={[["N","Não"],["Y","Sim (duplica pontos Cr)"]]} /></Field>
        <Field label="Hematócrito (%)"><Num value={hct} onChange={setHct} placeholder="40" /></Field>
        <Field label="Leucócitos (x10³/µL)"><Num value={wbc} onChange={setWbc} placeholder="10" /></Field>
        <div className="col-span-2">
          <label className="form-label">Pontos por doença crônica</label>
          <select className="form-input" value={chrDz} onChange={e => setChrDz(e.target.value)}>
            <option value="0">Sem doença crônica grave</option>
            <option value="2">Doença crônica grave – eletivo</option>
            <option value="5">Doença crônica grave – emergência ou imunossuprimido</option>
          </select>
        </div>
      </div>
      <ResultBox value={total} unit="pontos" label={c.l} color={c.c} sub="APACHE II score – estimativa de mortalidade hospitalar" />
    </div>
  );
}

function SAPS3Calc() {
  const [age, setAge] = useState(""); const [los, setLos] = useState("0");
  const [malignancy, setMalignancy] = useState("0"); const [chronic, setChronic] = useState("0");
  const [gcs, setGcs] = useState("15"); const [sbp, setSbp] = useState(""); const [hr, setHr] = useState("");
  const [o2, setO2] = useState("0"); const [temp, setTemp] = useState(""); const [bili, setBili] = useState("");
  const [cr, setCr] = useState(""); const [plat, setPlat] = useState(""); const [wbc, setWbc] = useState("");
  const [admission, setAdmission] = useState("0");

  function agePts(a: number) { if (a < 40) return 0; if (a < 60) return 5; if (a < 70) return 9; if (a < 75) return 13; if (a < 80) return 15; return 18; }
  function gcsPts(g: number) { if (g >= 14) return 0; if (g >= 12) return 4; if (g >= 9) return 7; if (g >= 6) return 10; return 15; }
  function sbpPts(v: number) { if (v >= 120) return 0; if (v >= 70) return 5; return 11; }
  function hrPts(v: number) { if (v < 120) return 0; if (v < 160) return 5; return 7; }
  function crPts(v: number) { if (v < 1.2) return 0; if (v < 2) return 2; if (v < 3.5) return 7; return 11; }
  function platPts(v: number) { if (v >= 100) return 0; if (v >= 50) return 5; return 13; }
  function biliPts(v: number) { if (v < 2) return 0; if (v < 6) return 4; return 6; }
  function tempPts(v: number) { return v < 35 ? 4 : 0; }
  function wbcPts(v: number) { if (v >= 1) return 0; return 12; }

  const a = +age; const g = +gcs; const sv = +sbp; const hv = +hr; const cv = +cr; const pv = +plat; const bv = +bili; const tv = +temp; const wv = +wbc;
  const pts = [
    age ? agePts(a) : 0, +los, +malignancy, +chronic,
    gcs ? gcsPts(g) : 0,
    sbp ? sbpPts(sv) : 0,
    hr ? hrPts(hv) : 0,
    +o2,
    temp ? tempPts(tv) : 0,
    bili ? biliPts(bv) : 0,
    cr ? crPts(cv) : 0,
    plat ? platPts(pv) : 0,
    wbc ? wbcPts(wv) : 0,
    +admission
  ];
  const total = pts.reduce((a, b) => a + b, 0);
  const logit = -32.6659 + Math.log(total + 1) * 7.3068;
  const mort = +(1 / (1 + Math.exp(-logit)) * 100).toFixed(1);
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">SAPS 3 – Estimativa de mortalidade hospitalar baseada em dados na admissão (0–3h)</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Idade"><Num value={age} onChange={setAge} placeholder="65" /></Field>
        <Field label="Glasgow"><Sel value={gcs} onChange={setGcs} opts={Array.from({length:13},(_,i)=>15-i).map(v=>[String(v),String(v)])} /></Field>
        <Field label="PAS (mmHg)"><Num value={sbp} onChange={setSbp} placeholder="120" /></Field>
        <Field label="FC (bpm)"><Num value={hr} onChange={setHr} placeholder="80" /></Field>
        <Field label="Creatinina (mg/dL)"><Num value={cr} onChange={setCr} placeholder="1.0" step="0.1" /></Field>
        <Field label="Plaquetas (x10³)"><Num value={plat} onChange={setPlat} placeholder="150" /></Field>
        <Field label="Bilirrubina (mg/dL)"><Num value={bili} onChange={setBili} placeholder="1.0" step="0.1" /></Field>
        <Field label="Temperatura (°C)"><Num value={temp} onChange={setTemp} placeholder="37" step="0.1" /></Field>
        <Field label="Leucócitos (x10³/µL)"><Num value={wbc} onChange={setWbc} placeholder="10" /></Field>
        <Field label="Internação pré-UTI (dias)">
          <select className="form-input" value={los} onChange={e => setLos(e.target.value)}>
            <option value="0">0 dias</option><option value="3">1–3 dias (+3)</option><option value="7">≥ 3 dias (+7)</option>
          </select>
        </Field>
        <Field label="Neoplasia hematológica">
          <select className="form-input" value={malignancy} onChange={e => setMalignancy(e.target.value)}>
            <option value="0">Não</option><option value="6">Sim (+6)</option><option value="10">Metastática (+10)</option>
          </select>
        </Field>
        <Field label="Tipo de admissão">
          <select className="form-input" value={admission} onChange={e => setAdmission(e.target.value)}>
            <option value="0">Cirúrgico eletivo</option><option value="6">Clínico / Cirúrgico urgência</option>
          </select>
        </Field>
        <Field label="Suporte de O₂ / Ventilação">
          <select className="form-input" value={o2} onChange={e => setO2(e.target.value)}>
            <option value="0">Nenhum / O₂ supl.</option><option value="9">VMI (+9)</option>
          </select>
        </Field>
      </div>
      {total > 0 && (
        <ResultBox value={`${mort}%`} label={`Score: ${total} pontos`} color={mort < 20 ? "text-green-600" : mort < 50 ? "text-yellow-600" : "text-red-600"} sub="Mortalidade hospitalar estimada (SAPS 3)" />
      )}
    </div>
  );
}

function CURB65Calc() {
  const items = ["Confusão mental (nova)","Ureia > 19 mg/dL (> 7 mmol/L)","FR ≥ 30 rpm","PA sistólica < 90 ou diastólica ≤ 60 mmHg","Idade ≥ 65 anos"];
  const [checked, setChecked] = useState<boolean[]>(new Array(5).fill(false));
  const score = checked.filter(Boolean).length;
  function cls(s: number) {
    if (s <= 1) return { l: "Baixo risco – Ambulatorial", c: "text-green-600", m: "< 3%" };
    if (s === 2) return { l: "Risco moderado – Hospitalização curta", c: "text-yellow-600", m: "~9%" };
    return { l: "Alto risco – Internação (considerar UTI se ≥ 3)", c: "text-red-600", m: "15–40%" };
  }
  const c = cls(score);
  return (
    <div className="space-y-3">
      {items.map((it, i) => <CheckItem key={i} label={it} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={`${score}/5`} label={c.l} color={c.c} sub={`Mortalidade estimada: ${c.m}`} />
    </div>
  );
}

function PSACalc() {
  const [psa, setPsa] = useState(""); const [psaFree, setPsaFree] = useState(""); const [vol, setVol] = useState("");
  const [psa2, setPsa2] = useState(""); const [months, setMonths] = useState("");
  const ratio = psa && psaFree ? +((+psaFree / +psa) * 100).toFixed(1) : null;
  const density = psa && vol ? +((+psa / +vol).toFixed(2)) : null;
  let velocity: number | null = null;
  if (psa && psa2 && months && +months > 0) {
    velocity = +(((+psa - +psa2) / (+months / 12)).toFixed(2));
  }
  function ratioRisk(r: number) {
    if (r < 10) return { l: "Alto risco de Ca (~56%)", c: "text-red-600" };
    if (r < 15) return { l: "Risco moderado-alto (~28%)", c: "text-orange-600" };
    if (r < 25) return { l: "Risco moderado (~16%)", c: "text-yellow-600" };
    return { l: "Baixo risco (<8%)", c: "text-green-600" };
  }
  function densityRisk(d: number) {
    if (d < 0.1) return { l: "PSAD baixo – menor suspeita de Ca", c: "text-green-600" };
    if (d < 0.15) return { l: "PSAD intermediário", c: "text-yellow-600" };
    return { l: "PSAD ≥ 0,15 – maior suspeita de Ca (biópsia)", c: "text-red-600" };
  }
  function velRisk(v: number) {
    if (v < 0.35) return { l: "Velocidade baixa – menor suspeita", c: "text-green-600" };
    if (v < 0.75) return { l: "Velocidade intermediária", c: "text-yellow-600" };
    return { l: "Velocidade ≥ 0,75 ng/mL/ano – alta suspeita", c: "text-red-600" };
  }
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">1. Relação PSA Livre/Total</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="PSA Total (ng/mL)"><Num value={psa} onChange={setPsa} placeholder="5.0" step="0.01" /></Field>
          <Field label="PSA Livre (ng/mL)"><Num value={psaFree} onChange={setPsaFree} placeholder="1.2" step="0.01" /></Field>
        </div>
        {ratio !== null && (() => { const r = ratioRisk(ratio); return <ResultBox value={`${ratio}%`} label={r.l} color={r.c} sub="Razão PSAl/PSAt — quanto menor, maior o risco" />; })()}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">2. Densidade do PSA (PSAD)</p>
        <Field label="Volume da próstata (mL – via US/TRUS)"><Num value={vol} onChange={setVol} placeholder="30" /></Field>
        {density !== null && psa && (() => { const d = densityRisk(density); return <ResultBox value={density} unit="ng/mL/mL" label={d.l} color={d.c} />; })()}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">3. Velocidade do PSA</p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="PSA atual (ng/mL)"><Num value={psa} onChange={setPsa} placeholder="5.0" step="0.01" /></Field>
          <Field label="PSA anterior (ng/mL)"><Num value={psa2} onChange={setPsa2} placeholder="3.5" step="0.01" /></Field>
          <Field label="Intervalo (meses)"><Num value={months} onChange={setMonths} placeholder="12" /></Field>
        </div>
        {velocity !== null && (() => { const v = velRisk(velocity); return <ResultBox value={velocity} unit="ng/mL/ano" label={v.l} color={v.c} />; })()}
      </div>
    </div>
  );
}

function ASASCalc() {
  const axItems = [
    "Dor lombar inflamatória (início < 45 anos, duração ≥ 3 meses)",
    "Artrite",
    "Entesite (calcanhar)",
    "Uveíte anterior",
    "Dactilite",
    "Psoríase",
    "Doença de Crohn / Retocolite ulcerativa",
    "Boa resposta a AINEs",
    "História familiar de EpA (1º ou 2º grau)",
    "HLA-B27 positivo",
    "PCR elevada (sem outra causa)",
  ];
  const [sacroRx, setSacroRx] = useState("N"); const [sacroRM, setSacroRM] = useState("N"); const [hlaB27, setHlaB27] = useState("N");
  const [checked, setChecked] = useState<boolean[]>(axItems.map(() => false));
  const features = checked.filter(Boolean).length;

  const rxPath = sacroRx === "Y" && features >= 1;
  const mriPath = sacroRM === "Y" && features >= 1;
  const clinPath = hlaB27 === "Y" && features >= 2;
  const classifiable = rxPath || mriPath || clinPath;

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Critérios ASAS 2009 para Espondiloartrite Axial (EpA ax). Aplica-se a pacientes com dor lombar crônica ≥ 3 meses com início antes dos 45 anos.</p>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Sacroiliíte na radiografia">
          <Sel value={sacroRx} onChange={setSacroRx} opts={[["N","Não"],["Y","Sim (grau ≥ 2 bil. ou ≥ 3 unilateral)"]]} />
        </Field>
        <Field label="Sacroiliíte na RM">
          <Sel value={sacroRM} onChange={setSacroRM} opts={[["N","Não"],["Y","Sim (inflamação ativa)"]]} />
        </Field>
        <Field label="HLA-B27">
          <Sel value={hlaB27} onChange={setHlaB27} opts={[["N","Negativo / não testado"],["Y","Positivo"]]} />
        </Field>
      </div>
      <div>
        <p className="form-label mb-2">Características clínicas / laboratoriais da EpA (marque os presentes):</p>
        {axItems.map((it, i) => <CheckItem key={i} label={it} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      </div>
      <div className={`rounded-xl p-4 border-2 mt-3 ${classifiable ? "bg-brand-blue-50 border-brand-blue-300" : "bg-gray-50 border-gray-200"}`}>
        <p className={`text-lg font-bold ${classifiable ? "text-brand-blue-700" : "text-gray-500"}`}>
          {classifiable ? "Classifica como EpA Axial (ASAS)" : "Não preenche critérios ASAS"}
        </p>
        <div className="mt-2 space-y-1 text-sm">
          <p className={rxPath ? "text-brand-blue-600 font-medium" : "text-gray-400"}>
            {rxPath ? "✓" : "○"} Via radiográfica: sacroiliíte Rx + ≥1 característica EpA
          </p>
          <p className={mriPath ? "text-brand-blue-600 font-medium" : "text-gray-400"}>
            {mriPath ? "✓" : "○"} Via por imagem (RM): sacroiliíte ativa + ≥1 característica EpA
          </p>
          <p className={clinPath ? "text-brand-blue-600 font-medium" : "text-gray-400"}>
            {clinPath ? "✓" : "○"} Via clínica: HLA-B27 + ≥2 características EpA
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-2">{features} característica{features !== 1 ? "s" : ""} EpA marcada{features !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}

function ASACalc() {
  const classes = [
    { asa: "ASA I", desc: "Paciente saudável sem doença sistêmica", risco: "Mínimo (< 0,1%)", color: "bg-green-50 border-green-300 text-green-800" },
    { asa: "ASA II", desc: "Doença sistêmica leve (HAS controlada, DM, tabagismo, obesidade moderada)", risco: "Baixo (0,1–0,5%)", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
    { asa: "ASA III", desc: "Doença sistêmica grave não incapacitante (ICC, DPOC, DRC, DM descompensado)", risco: "Moderado (1–5%)", color: "bg-orange-50 border-orange-300 text-orange-800" },
    { asa: "ASA IV", desc: "Doença sistêmica grave com risco de vida (IAM recente, DRC grave)", risco: "Alto (5–15%)", color: "bg-red-50 border-red-300 text-red-800" },
    { asa: "ASA V", desc: "Paciente moribundo, sem expectativa de sobrevida 24h sem cirurgia", risco: "Muito alto (> 25%)", color: "bg-red-100 border-red-400 text-red-900" },
    { asa: "ASA VI", desc: "Morte encefálica declarada – doador de órgãos", risco: "—", color: "bg-gray-100 border-gray-300 text-gray-700" },
  ];
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {classes.map((c, i) => (
        <button key={i} onClick={() => setSel(i)} className={`w-full text-left p-3 rounded-xl border-2 transition-all ${sel === i ? c.color : "bg-white border-gray-200 hover:border-gray-300"}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">{c.asa}</span>
            <span className="text-xs font-medium">{c.risco}</span>
          </div>
          <p className="text-xs mt-0.5 opacity-80">{c.desc}</p>
        </button>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const CALC_MAP: Record<TabId, React.ReactNode> = {
  imc: <IMCCalc />,
  ckd_cg: <CKDCGCalc />,
  ckd_epi: <CKDEPICalc />,
  gasometria: <GasometriaCalc />,
  sodio_deficit: <SodioDeficitCalc />,
  sodio_correcao: <SodioCorrecaoCalc />,
  glasgow: <GlasgowCalc />,
  nihss: <NIHSSCalc />,
  ich_score: <ICHScoreCalc />,
  framingham: <FraminghamCalc />,
  chads_vasc: <CHADSVASCCalc />,
  grace: <GRACECalc />,
  timi: <TIMICalc />,
  wells_tep: <WellsTEPCalc />,
  wells_tvp: <WellsTVPCalc />,
  perc: <PERCCalc />,
  sofa: <SOFACalc />,
  qsofa: <QSOFACalc />,
  apache2: <APACHE2Calc />,
  saps3: <SAPS3Calc />,
  curb65: <CURB65Calc />,
  psa: <PSACalc />,
  asas: <ASASCalc />,
  asa: <ASACalc />,
};

export default function Calculadoras() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("sofa");
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());

  function handleCalculatorSelect(id: TabId) {
    setTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleCat(cat: string) {
    setCollapsedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  const currentTab = TABS.find(t => t.id === tab);

  const specialties = [
    {
      title: 'Neurocirurgia',
      icon: Brain,
      count: '6 calculadoras',
      description: 'GCS, Hunt-Hess, Fisher, Rankin',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
      href: '/calculadoras/neurocirurgia',
    },
    {
      title: 'Reumatologia',
      icon: Bone,
      count: '8 manobras',
      description: 'Testes clínicos e manobras diagnósticas',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      iconColor: 'text-orange-600',
      href: '/calculadoras/reumatologia',
    },
    {
      title: 'Exame Físico',
      icon: Stethoscope,
      count: '6 sistemas',
      description: 'Achados normais esperados',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-blue-600',
      href: '/calculadoras/exame-fisico',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-6 h-6 text-brand-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Calculadoras Clínicas</h1>
      </div>
      <p className="text-sm text-gray-500 mb-5">24 ferramentas de apoio à decisão – atualizadas com diretrizes vigentes.</p>

      {/* Especialidades com páginas dedicadas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {specialties.map((spec) => {
          const Icon = spec.icon;
          return (
            <button
              key={spec.href}
              onClick={() => navigate(spec.href)}
              className={`flex items-center gap-3 bg-white border rounded-xl p-3.5 text-left transition-all group shadow-sm hover:shadow-md cursor-pointer ${spec.color}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${spec.color}`}>
                <Icon className={`w-5 h-5 ${spec.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{spec.title}</p>
                <p className="text-xs text-gray-500">{spec.count} · {spec.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar nav */}
        <nav className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {CATEGORIES.map(cat => {
              const catTabs = TABS.filter(t => t.category === cat);
              const collapsed = collapsedCats.has(cat);
              return (
                <div key={cat} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => toggleCat(cat)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    {cat}
                    {collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  </button>
                  {!collapsed && catTabs.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleCalculatorSelect(t.id)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        tab === t.id
                          ? "bg-brand-blue-600 text-white font-semibold"
                          : "text-gray-700 hover:bg-brand-blue-50 hover:text-brand-blue-700"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Calculator panel */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-1">{currentTab?.label}</h2>
            <p className="text-xs text-gray-400 mb-4">{currentTab?.category}</p>
            {CALC_MAP[tab]}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Calculadoras para apoio clínico. Não substituem o julgamento médico.
      </p>
    </div>
  );
}
