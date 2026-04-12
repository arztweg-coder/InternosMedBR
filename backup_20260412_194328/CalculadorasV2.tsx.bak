import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, ChevronDown, ChevronUp, Stethoscope, ChevronRight } from "lucide-react";

// ─── CATEGORY + TAB TYPES ────────────────────────────────────────────────────

type TabId =
  // Geral
  | "imc"
  // Cardiologia
  | "framingham" | "chads_vasc" | "grace" | "timi" | "heart" | "has_bled"
  // Neurologia
  | "glasgow" | "nihss" | "ich_score"
  // Neurocirurgia
  | "hunt_hess" | "fisher" | "rankin" | "spetzler" | "wfns"
  // Pneumologia
  | "curb65" | "stop_bang" | "rox_index" | "act_asma" | "gina_controle"
  // Vascular / TEV
  | "wells_tep" | "wells_tvp" | "perc" | "caprini"
  // Nefrologia
  | "ckd_cg" | "ckd_epi" | "gasometria" | "sodio_deficit" | "sodio_correcao"
  // UTI / Sepse
  | "sofa" | "qsofa" | "apache2" | "saps3"
  // Reumatologia
  | "asas"
  // Pediatria
  | "pecarn" | "apgar" | "dose_pediatrica" | "holliday_segar"
  // Obstetrícia
  | "dpp_naegele" | "bishop"
  // Farmacologia
  | "qtc_bazett" | "correcao_calcio" | "anion_gap"
  // Psiquiatria
  | "phq9" | "gad7" | "ciwa_ar"
  // Cirurgia
  | "asa"
  // Urologia
  | "psa";

interface TabDef { id: TabId; label: string; category: string; }

const TABS: TabDef[] = [
  // 🏥 Geral
  { id: "imc", label: "IMC", category: "🏥 Geral" },
  // 🫀 Cardiologia
  { id: "framingham", label: "Framingham", category: "🫀 Cardiologia" },
  { id: "chads_vasc", label: "CHA₂DS₂-VASc", category: "🫀 Cardiologia" },
  { id: "has_bled", label: "HAS-BLED", category: "🫀 Cardiologia" },
  { id: "grace", label: "GRACE (SCA)", category: "🫀 Cardiologia" },
  { id: "timi", label: "TIMI (NSTE-ACS)", category: "🫀 Cardiologia" },
  { id: "heart", label: "HEART Score", category: "🫀 Cardiologia" },
  // 🧠 Neurologia
  { id: "glasgow", label: "Glasgow (ECG)", category: "🧠 Neurologia" },
  { id: "nihss", label: "NIHSS (AVC)", category: "🧠 Neurologia" },
  { id: "ich_score", label: "ICH Score", category: "🧠 Neurologia" },
  // 🧬 Neurocirurgia
  { id: "hunt_hess", label: "Hunt-Hess (HSA)", category: "🧬 Neurocirurgia" },
  { id: "fisher", label: "Fisher Modificado", category: "🧬 Neurocirurgia" },
  { id: "rankin", label: "Rankin Modificado", category: "🧬 Neurocirurgia" },
  { id: "spetzler", label: "Spetzler-Martin (MAV)", category: "🧬 Neurocirurgia" },
  { id: "wfns", label: "WFNS (HSA)", category: "🧬 Neurocirurgia" },
  // 🫁 Pneumologia
  { id: "curb65", label: "CURB-65", category: "🫁 Pneumologia" },
  { id: "stop_bang", label: "STOP-Bang (AOS)", category: "🫁 Pneumologia" },
  { id: "rox_index", label: "ROX Index (CNAF)", category: "🫁 Pneumologia" },
  { id: "act_asma", label: "ACT (Controle Asma)", category: "🫁 Pneumologia" },
  { id: "gina_controle", label: "GINA (Etapas de Controle)", category: "🫁 Pneumologia" },
  // 🩸 Vascular / TEV
  { id: "wells_tep", label: "Wells TEP", category: "🩸 Vascular / TEV" },
  { id: "wells_tvp", label: "Wells TVP", category: "🩸 Vascular / TEV" },
  { id: "perc", label: "PERC Rule", category: "🩸 Vascular / TEV" },
  { id: "caprini", label: "Caprini (Profilaxia)", category: "🩸 Vascular / TEV" },
  // 🔬 Nefrologia
  { id: "ckd_cg", label: "Cockcroft-Gault", category: "🔬 Nefrologia" },
  { id: "ckd_epi", label: "CKD-EPI 2021", category: "🔬 Nefrologia" },
  { id: "gasometria", label: "Gasometria Arterial", category: "🔬 Nefrologia" },
  { id: "sodio_deficit", label: "Déficit de Água Livre", category: "🔬 Nefrologia" },
  { id: "sodio_correcao", label: "Correção de Sódio", category: "🔬 Nefrologia" },
  // 🏨 UTI / Sepse
  { id: "sofa", label: "SOFA", category: "🏨 UTI / Sepse" },
  { id: "qsofa", label: "qSOFA", category: "🏨 UTI / Sepse" },
  { id: "apache2", label: "APACHE II", category: "🏨 UTI / Sepse" },
  { id: "saps3", label: "SAPS 3", category: "🏨 UTI / Sepse" },
  // 🦴 Reumatologia
  { id: "asas", label: "ASAS (EpA Axial)", category: "🦴 Reumatologia" },
  // 🍼 Pediatria
  { id: "pecarn", label: "PECARN (TCE Pediátrico)", category: "🍼 Pediatria" },
  { id: "apgar", label: "Apgar", category: "🍼 Pediatria" },
  { id: "dose_pediatrica", label: "Dose mg/kg", category: "🍼 Pediatria" },
  { id: "holliday_segar", label: "Holliday-Segar", category: "🍼 Pediatria" },
  // 🤰 Obstetrícia
  { id: "dpp_naegele", label: "DPP (Naegele)", category: "🤰 Obstetrícia" },
  { id: "bishop", label: "Bishop Score", category: "🤰 Obstetrícia" },
  // 🧪 Farmacologia
  { id: "qtc_bazett", label: "QTc (Bazett)", category: "🧪 Farmacologia" },
  { id: "correcao_calcio", label: "Cálcio Corrigido", category: "🧪 Farmacologia" },
  { id: "anion_gap", label: "Ânion Gap", category: "🧪 Farmacologia" },
  // 🧠 Psiquiatria
  { id: "phq9", label: "PHQ-9 (Depressão)", category: "🧠 Psiquiatria" },
  { id: "gad7", label: "GAD-7 (Ansiedade)", category: "🧠 Psiquiatria" },
  { id: "ciwa_ar", label: "CIWA-Ar (Abstinência)", category: "🧠 Psiquiatria" },
  // 🔪 Cirurgia
  { id: "asa", label: "ASA (Risco Cirúrgico)", category: "🔪 Cirurgia" },
  // 🔬 Urologia
  { id: "psa", label: "PSA (Risco Ca Próstata)", category: "🔬 Urologia" },
];

const CATEGORIES = [
  "🏥 Geral",
  "🫀 Cardiologia",
  "🧠 Neurologia",
  "🧬 Neurocirurgia",
  "🫁 Pneumologia",
  "🩸 Vascular / TEV",
  "🔬 Nefrologia",
  "🏨 UTI / Sepse",
  "🦴 Reumatologia",
  "🍼 Pediatria",
  "🤰 Obstetrícia",
  "🧪 Farmacologia",
  "🧠 Psiquiatria",
  "🔪 Cirurgia",
  "🔬 Urologia",
];

// ─── SHARED UI COMPONENTS ────────────────────────────────────────────────────

function ResultBox({ value, unit, label, color = "text-brand-blue-700", sub, condutas, referencias }: {
  value: string | number;
  unit?: string;
  label: string;
  color?: string;
  sub?: string;
  condutas?: string[];
  referencias?: string[];
}) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 mt-3 overflow-hidden">
      {/* Resultado principal */}
      <div className="p-4 text-center">
        <p className={`text-4xl font-bold ${color}`}>{value}</p>
        {unit && <p className="text-sm text-gray-500">{unit}</p>}
        <p className={`font-semibold mt-1 text-sm ${color}`}>{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {/* Condutas sugeridas */}
      {condutas && condutas.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-3 bg-blue-50/50">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">📋 Condutas</p>
          <ul className="space-y-1">
            {condutas.map((c, i) => (
              <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                <span className="text-brand-blue-600 mt-0.5 flex-shrink-0">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Referências */}
      {referencias && referencias.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-100/50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">📚 Referências</p>
          {referencias.map((r, i) => (
            <p key={i} className="text-[10px] text-gray-400 leading-relaxed">{r}</p>
          ))}
        </div>
      )}
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

// ═══════════════════════════════════════════════════════════════════════════════
// 🏥 GERAL
// ═══════════════════════════════════════════════════════════════════════════════

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
      {v !== null && c && <ResultBox value={v} unit="kg/m²" label={c.label} color={c.color}
        condutas={v < 18.5 ? ["Investigar causas de baixo peso (desnutrição, doenças consuntivas)", "Avaliar necessidade de suporte nutricional"] : v < 25 ? ["Manter hábitos saudáveis e atividade física regular"] : v < 30 ? ["Orientar mudanças de estilo de vida", "Avaliar comorbidades metabólicas (HAS, DM, dislipidemia)"] : ["Encaminhar para acompanhamento nutricional", "Rastrear síndrome metabólica", "Considerar tratamento farmacológico se IMC ≥ 40 ou ≥ 35 com comorbidades"]}
        referencias={["OMS. Obesity and overweight. Fact sheet, 2024", "ABESO. Diretrizes Brasileiras de Obesidade, 4ª ed., 2016"]}
      />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🫀 CARDIOLOGIA
// ═══════════════════════════════════════════════════════════════════════════════

function FraminghamCalc() {
  const [age, setAge] = useState(""); const [sex, setSex] = useState("M");
  const [totalChol, setTotalChol] = useState(""); const [hdl, setHdl] = useState("");
  const [sbp, setSbp] = useState(""); const [sbpTreated, setSbpTreated] = useState("N");
  const [smoking, setSmoking] = useState("N"); const [diabetes, setDiabetes] = useState("N");
  let risk10y: number | null = null;
  if (age && totalChol && hdl && sbp) {
    const a = +age; const tc = +totalChol; const h = +hdl; const s = +sbp;
    if (sex === "M") {
      const sum = Math.log(a)*3.06117 + Math.log(tc)*1.12370 + Math.log(h)*-0.93263 + Math.log(s)*(sbpTreated==="Y"?1.93303:1.65431) + (smoking==="Y"?0.65451:0) + (diabetes==="Y"?0.57367:0);
      risk10y = +(1 - Math.pow(0.88936, Math.exp(sum - 23.9802))) * 100;
    } else {
      const sum = Math.log(a)*2.32888 + Math.log(tc)*1.20904 + Math.log(h)*-0.70833 + Math.log(s)*(sbpTreated==="Y"?2.82263:2.76157) + (smoking==="Y"?0.52873:0) + (diabetes==="Y"?0.69154:0);
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
      {risk10y !== null && c && <ResultBox value={`${risk10y}%`} label={c.l} color={c.c} sub="Risco cardiovascular em 10 anos (Framingham)"
        condutas={risk10y < 10 ? ["Orientar estilo de vida saudável", "Reavaliar em 5 anos"] : risk10y < 20 ? ["Considerar estatina se LDL > 130 mg/dL", "Otimizar controle de HAS e DM", "Orientar MEV (dieta, exercício, cessação tabágica)"] : ["Estatina de alta potência recomendada", "Controle rigoroso de todos os FR", "Considerar AAS se benefício > risco de sangramento", "Solicitar escore de cálcio coronariano se dúvida"]}
        referencias={["D'Agostino RB et al. Circulation, 2008;117:743-53", "SBC. Diretriz Brasileira de Prevenção Cardiovascular, 2019"]}
      />}
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
      <ResultBox value={score} label={c.l} color={c.c}
        condutas={score === 0 ? ["Sem necessidade de anticoagulação", "Reavaliar periodicamente"] : score === 1 ? ["Considerar anticoagulação oral (DOAC preferível)", "Avaliar HAS-BLED para risco de sangramento"] : ["Anticoagulação oral indicada (DOAC ou warfarina)", "Avaliar HAS-BLED concomitante", "FA valvular: warfarina mandatória"]}
        referencias={["Lip GYH et al. Chest, 2010;137:263-72", "SBC. Diretriz de FA, 2023"]}
      />
    </div>
  );
}

function HASBLEDCalc() {
  const items = [
    { label: "HAS (PAS > 160 mmHg)", pts: 1 },
    { label: "Função renal anormal (Cr > 2,3; diálise; transplante renal)", pts: 1 },
    { label: "Função hepática anormal (doença hepática crônica ou bilirrubina > 2×)", pts: 1 },
    { label: "AVC prévio", pts: 1 },
    { label: "Sangramento prévio ou predisposição", pts: 1 },
    { label: "INR lábil (TTR < 60%)", pts: 1 },
    { label: "Idade > 65 anos", pts: 1 },
    { label: "Uso de drogas (antiplaquetários, AINEs)", pts: 1 },
    { label: "Uso abusivo de álcool", pts: 1 },
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const score = items.reduce((s, it, i) => s + (checked[i] ? it.pts : 0), 0);
  function cls(s: number) {
    if (s <= 2) return { l: "Baixo risco de sangramento", c: "text-green-600" };
    return { l: "Alto risco de sangramento – considerar ajuste terapêutico", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Risco de sangramento em pacientes anticoagulados com FA. Não contraindica anticoagulação, mas orienta manejo.</p>
      {items.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={`${score}/9`} label={c.l} color={c.c} sub="Score ≥ 3 = alto risco — não contraindica OAC, mas exige vigilância"
        condutas={score <= 2 ? ["Manter anticoagulação conforme indicação", "Monitorar INR se warfarina (TTR > 65%)"] : ["Revisar fatores de risco modificáveis (HAS, álcool, AINEs)", "Considerar troca para DOAC se INR lábil", "Não suspender anticoagulação apenas pelo HAS-BLED alto", "Intensificar monitoramento clínico e laboratorial"]}
        referencias={["Pisters R et al. Chest, 2010;138:1093-100", "ESC AF Guidelines, 2020"]}
      />
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
      <ResultBox value={score} label={c.l} color={c.c} sub="GRACE Score – SCA sem supra"
        condutas={score < 109 ? ["Estratégia conservadora inicial aceitável", "Teste funcional antes da alta", "AAS + clopidogrel + estatina + IECA/BRA"] : score < 140 ? ["Estratificação invasiva precoce (24–72h)", "Dupla antiagregação + anticoagulação", "Monitorização contínua em UCO"] : ["Cineangiocoronariografia em < 24h", "Considerar IIb/IIIa se alto risco", "UTI coronariana + monitorização hemodinâmica"]}
        referencias={["Fox KAA et al. BMJ, 2006;332:1091-4", "SBC. Diretriz de SCA sem supra de ST, 2021"]}
      />
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
      <ResultBox value={`${score}/7`} label={c.l} color={c.c}
        condutas={score <= 2 ? ["Considerar alta precoce com teste funcional", "Manter AAS + estatina", "Reavaliação ambulatorial em 1–2 semanas"] : score <= 4 ? ["Internação para monitorização", "Dupla antiagregação", "Estratificação invasiva em 24–72h"] : ["Estratégia invasiva precoce (< 24h)", "Anticoagulação plena + dupla antiagregação", "UTI coronariana"]}
        referencias={["Antman EM et al. JAMA, 2000;284:835-42", "SBC. Diretriz de SCA, 2021"]}
      />
    </div>
  );
}

function HEARTScoreCalc() {
  const [history, setHistory] = useState("0");
  const [ecg, setEcg] = useState("0");
  const [age, setAge] = useState("0");
  const [risk, setRisk] = useState("0");
  const [troponin, setTroponin] = useState("0");
  const score = +history + +ecg + +age + +risk + +troponin;
  function cls(s: number) {
    if (s <= 3) return { l: "Baixo risco (0,9–1,7%) – considerar alta precoce", c: "text-green-600" };
    if (s <= 6) return { l: "Risco moderado (12–16,6%) – observação / investigação", c: "text-yellow-600" };
    return { l: "Alto risco (50–65%) – conduta invasiva precoce", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Estratificação de risco para eventos cardíacos maiores (MACE) em 6 semanas na dor torácica aguda. Six et al., 2008.</p>
      <Field label="History (história)">
        <Sel value={history} onChange={setHistory} opts={[["0","Inespecífica (0)"],["1","Moderadamente suspeita (1)"],["2","Altamente suspeita (2)"]]} />
      </Field>
      <Field label="ECG">
        <Sel value={ecg} onChange={setEcg} opts={[["0","Normal (0)"],["1","Alteração inespecífica da repolarização (1)"],["2","Desvio de ST significativo (2)"]]} />
      </Field>
      <Field label="Age (idade)">
        <Sel value={age} onChange={setAge} opts={[["0","< 45 anos (0)"],["1","45–64 anos (1)"],["2","≥ 65 anos (2)"]]} />
      </Field>
      <Field label="Risk factors (fatores de risco)">
        <Sel value={risk} onChange={setRisk} opts={[["0","Nenhum FR conhecido (0)"],["1","1–2 FR (HAS, DM, dislipidemia, tabagismo, obesidade, HF+) (1)"],["2","≥ 3 FR ou DAC prévia (2)"]]} />
      </Field>
      <Field label="Troponin (troponina)">
        <Sel value={troponin} onChange={setTroponin} opts={[["0","Normal (0)"],["1","1–3× limite superior (1)"],["2","> 3× limite superior (2)"]]} />
      </Field>
      <ResultBox value={`${score}/10`} label={c.l} color={c.c} sub="HEART Score — MACE em 6 semanas"
        condutas={score <= 3 ? ["Alta precoce segura se troponina seriada negativa", "Orientar retorno se recorrência dos sintomas", "Seguimento ambulatorial em 2 semanas"] : score <= 6 ? ["Internação para observação e troponina seriada", "ECG seriado a cada 3–6h", "Considerar teste funcional ou angiotomografia"] : ["Conduta invasiva precoce", "Dupla antiagregação + anticoagulação", "Cineangiocoronariografia em < 24h"]}
        referencias={["Six AJ et al. Neth Heart J, 2008;16:191-6", "Backus BE et al. Int J Cardiol, 2013;168:2153-8"]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 NEUROLOGIA
// ═══════════════════════════════════════════════════════════════════════════════

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
      <ResultBox value={`${t}/15`} label={s.l} color={s.c} sub={`O${o} + V${v} + M${m}`}
        condutas={t >= 13 ? ["Observação clínica por 4–6h", "TC de crânio se mecanismo de alta energia, uso de anticoagulantes ou idade > 65", "Alta com orientações de sinais de alarme"] : t >= 9 ? ["TC de crânio urgente", "Internação em unidade com monitorização neurológica", "Avaliação neurocirúrgica", "Reavaliação seriada do Glasgow a cada 1–2h"] : ["IOT protetora (Glasgow ≤ 8)", "TC de crânio imediata", "Avaliação neurocirúrgica de emergência", "Monitorização de PIC se indicado", "Manter PAS > 90 e SpO₂ > 90%"]}
        referencias={["Teasdale G, Jennett B. Lancet, 1974;2:81-4", "ATLS. Advanced Trauma Life Support, 10ª ed., 2018"]}
      />
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
      <ResultBox value={total} unit="pontos" label={c.l} color={c.c} sub="Limiar trombólise IV: NIHSS ≥ 4 e ≤ 25 (verificar protocolo)"
        condutas={total === 0 ? ["Investigar etiologia (ECG, ecocardiograma, doppler)", "Prevenção secundária conforme etiologia"] : total <= 4 ? ["Considerar trombólise se déficit incapacitante", "Investigação etiológica completa em 24–48h", "AAS 300 mg (se não trombolisado)"] : total <= 25 ? ["Trombólise IV com alteplase se < 4,5h do início (checklist)", "Considerar trombectomia mecânica se oclusão de grande vaso", "UTI/AVC: monitorizar PA, glicemia, temperatura", "Não reduzir PA se < 220/120 (sem trombólise)"] : ["Avaliar elegibilidade para trombectomia mecânica", "Prognóstico reservado — discutir com família", "Cuidados neurointensivos"]}
        referencias={["AHA/ASA Guidelines for Acute Ischemic Stroke, 2019", "Brott T et al. Stroke, 1989;20:864-70"]}
      />
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
      {items.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={`${score}/6`} label={`Mortalidade 30 dias ≈ ${mortalidade}`} color={score <= 1 ? "text-green-600" : score <= 2 ? "text-yellow-600" : "text-red-600"}
        condutas={score <= 1 ? ["Controle de PA (alvo PAS < 140 mmHg nas primeiras 6h)", "Monitorização neurológica intensiva", "TC controle em 6–24h", "Reverter anticoagulação se aplicável"] : score <= 3 ? ["UTI com monitorização contínua", "Avaliação neurocirúrgica (craniotomia vs conservador)", "Controle rigoroso de PA e coagulopatia", "Profilaxia de convulsão se lobar"] : ["Prognóstico muito reservado", "Discussão precoce de cuidados paliativos com família", "Não usar ICH Score isoladamente para limitar tratamento"]}
        referencias={["Hemphill JC et al. Stroke, 2001;32:891-7", "AHA/ASA. Guidelines for ICH, 2022"]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧬 NEUROCIRURGIA
// ═══════════════════════════════════════════════════════════════════════════════

function HuntHessCalc() {
  const grades = [
    { grade: "I", desc: "Assintomático ou cefaleia leve, rigidez de nuca mínima", mort: "~1%", color: "bg-green-50 border-green-300 text-green-800" },
    { grade: "II", desc: "Cefaleia moderada a grave, rigidez de nuca, sem déficit neurológico (exceto paralisia de NC)", mort: "~5%", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
    { grade: "III", desc: "Sonolência, confusão ou déficit focal leve", mort: "~19%", color: "bg-orange-50 border-orange-300 text-orange-800" },
    { grade: "IV", desc: "Estupor, hemiparesia moderada a grave, postura de descerebração precoce", mort: "~42%", color: "bg-red-50 border-red-300 text-red-800" },
    { grade: "V", desc: "Coma profundo, postura de descerebração, aparência moribunda", mort: "~77%", color: "bg-red-100 border-red-400 text-red-900" },
  ];
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Classificação clínica da Hemorragia Subaracnóidea (HSA) aneurismática. Orienta indicação e timing cirúrgico.</p>
      {grades.map((g, i) => (
        <button key={i} onClick={() => setSel(i)} className={`w-full text-left p-3 rounded-xl border-2 transition-all ${sel === i ? g.color : "bg-white border-gray-200 hover:border-gray-300"}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">Grau {g.grade}</span>
            <span className="text-xs font-medium">Mort. {g.mort}</span>
          </div>
          <p className="text-xs mt-0.5 opacity-80">{g.desc}</p>
        </button>
      ))}
    </div>
  );
}

function FisherCalc() {
  const grades = [
    { grade: "1", desc: "Sem sangue detectado na TC", risco: "Baixo risco de vasoespasmo", color: "bg-green-50 border-green-300 text-green-800" },
    { grade: "2", desc: "Sangue difuso fino (< 1 mm de espessura)", risco: "Baixo risco de vasoespasmo", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
    { grade: "3", desc: "Coágulo localizado e/ou sangue espesso (> 1 mm) nas cisternas", risco: "Alto risco de vasoespasmo", color: "bg-orange-50 border-orange-300 text-orange-800" },
    { grade: "4", desc: "Hemorragia intraventricular ou intraparenquimatosa difusa", risco: "Risco intermediário de vasoespasmo", color: "bg-red-50 border-red-300 text-red-800" },
  ];
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Fisher Modificado — Prediz risco de vasoespasmo cerebral após HSA com base na TC de crânio.</p>
      {grades.map((g, i) => (
        <button key={i} onClick={() => setSel(i)} className={`w-full text-left p-3 rounded-xl border-2 transition-all ${sel === i ? g.color : "bg-white border-gray-200 hover:border-gray-300"}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">Fisher {g.grade}</span>
            <span className="text-xs font-medium">{g.risco}</span>
          </div>
          <p className="text-xs mt-0.5 opacity-80">{g.desc}</p>
        </button>
      ))}
    </div>
  );
}

function RankinCalc() {
  const grades = [
    { grade: "0", desc: "Sem sintomas", color: "bg-green-50 border-green-300 text-green-800" },
    { grade: "1", desc: "Sem incapacidade significativa apesar dos sintomas — capaz de realizar atividades e deveres habituais", color: "bg-green-50 border-green-300 text-green-800" },
    { grade: "2", desc: "Incapacidade leve — incapaz de realizar todas as atividades prévias, mas cuida de si sem assistência", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
    { grade: "3", desc: "Incapacidade moderada — requer alguma ajuda, mas caminha sem assistência", color: "bg-orange-50 border-orange-300 text-orange-800" },
    { grade: "4", desc: "Incapacidade moderadamente grave — incapaz de caminhar e atender necessidades sem assistência", color: "bg-red-50 border-red-300 text-red-800" },
    { grade: "5", desc: "Incapacidade grave — acamado, incontinente, requer cuidados de enfermagem constantes", color: "bg-red-100 border-red-400 text-red-900" },
    { grade: "6", desc: "Óbito", color: "bg-gray-100 border-gray-300 text-gray-700" },
  ];
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Escala de Rankin Modificada — Avalia grau de incapacidade funcional pós-AVC. Desfecho primário em ensaios clínicos de AVC.</p>
      {grades.map((g, i) => (
        <button key={i} onClick={() => setSel(i)} className={`w-full text-left p-3 rounded-xl border-2 transition-all ${sel === i ? g.color : "bg-white border-gray-200 hover:border-gray-300"}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">mRS {g.grade}</span>
          </div>
          <p className="text-xs mt-0.5 opacity-80">{g.desc}</p>
        </button>
      ))}
    </div>
  );
}

function SpetzlerMartinCalc() {
  const [size, setSize] = useState("1");
  const [eloquence, setEloquence] = useState("0");
  const [drainage, setDrainage] = useState("0");
  const score = +size + +eloquence + +drainage;
  function cls(s: number) {
    if (s <= 2) return { l: "Grau I–II — Baixo risco cirúrgico", c: "text-green-600" };
    if (s === 3) return { l: "Grau III — Risco intermediário", c: "text-yellow-600" };
    return { l: "Grau IV–V — Alto risco cirúrgico (considerar alternativas)", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Grading de MAV (malformação arteriovenosa) cerebral. Orienta risco cirúrgico.</p>
      <Field label="Tamanho do nidus">
        <Sel value={size} onChange={setSize} opts={[["1","< 3 cm (1 pt)"],["2","3–6 cm (2 pts)"],["3","> 6 cm (3 pts)"]]} />
      </Field>
      <Field label="Área eloquente adjacente">
        <Sel value={eloquence} onChange={setEloquence} opts={[["0","Não eloquente (0 pt)"],["1","Eloquente (1 pt)"]]} />
      </Field>
      <Field label="Drenagem venosa">
        <Sel value={drainage} onChange={setDrainage} opts={[["0","Superficial apenas (0 pt)"],["1","Drenagem profunda (1 pt)"]]} />
      </Field>
      <ResultBox value={`${score}/5`} label={c.l} color={c.c} sub="Spetzler-Martin — MAV cerebral"
        condutas={score <= 2 ? ["Microcirurgia é opção segura", "Taxas de complicação < 5%", "Embolização pré-operatória pode ser considerada"] : score === 3 ? ["Abordagem multimodal (embolização + cirurgia ± radiocirurgia)", "Decisão individualizada conforme anatomia e experiência do centro"] : ["Risco cirúrgico elevado — considerar radiocirurgia estereotáxica", "Tratamento conservador pode ser preferível em MAVs não rotas", "Estudo ARUBA: conservador vs intervenção em MAVs não rotas"]}
        referencias={["Spetzler RF, Martin NA. J Neurosurg, 1986;65:476-83", "Mohr JP et al. (ARUBA) Lancet, 2014;383:614-21"]}
      />
    </div>
  );
}

function WFNSCalc() {
  const grades = [
    { grade: "I", gcs: "15", deficit: "Ausente", mort: "~5%", color: "bg-green-50 border-green-300 text-green-800" },
    { grade: "II", gcs: "13–14", deficit: "Ausente", mort: "~9%", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
    { grade: "III", gcs: "13–14", deficit: "Presente", mort: "~20%", color: "bg-orange-50 border-orange-300 text-orange-800" },
    { grade: "IV", gcs: "7–12", deficit: "Presente ou ausente", mort: "~33%", color: "bg-red-50 border-red-300 text-red-800" },
    { grade: "V", gcs: "3–6", deficit: "Presente ou ausente", mort: "~77%", color: "bg-red-100 border-red-400 text-red-900" },
  ];
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">World Federation of Neurosurgical Societies — Classificação da HSA baseada em Glasgow e déficit focal.</p>
      {grades.map((g, i) => (
        <button key={i} onClick={() => setSel(i)} className={`w-full text-left p-3 rounded-xl border-2 transition-all ${sel === i ? g.color : "bg-white border-gray-200 hover:border-gray-300"}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">WFNS {g.grade}</span>
            <span className="text-xs font-medium">Mort. {g.mort}</span>
          </div>
          <p className="text-xs mt-0.5 opacity-80">GCS {g.gcs} | Déficit focal: {g.deficit}</p>
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🫁 PNEUMOLOGIA
// ═══════════════════════════════════════════════════════════════════════════════

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
      <ResultBox value={`${score}/5`} label={c.l} color={c.c} sub={`Mortalidade estimada: ${c.m}`}
        condutas={score <= 1 ? ["Tratamento ambulatorial", "Amoxicilina 500mg 8/8h por 7 dias OU azitromicina 500mg/dia por 3 dias", "Reavaliação em 48–72h"] : score === 2 ? ["Considerar hospitalização curta ou hospital-dia", "Amoxicilina-clavulanato + macrolídeo OU fluoroquinolona respiratória", "Colher hemoculturas e escarro antes de ATB"] : ["Internação hospitalar (UTI se ≥ 4)", "Cefalosporina 3ª geração + macrolídeo IV", "Hemoculturas, gasometria, lactato", "Avaliar necessidade de suporte ventilatório"]}
        referencias={["Lim WS et al. Thorax, 2003;58:377-82", "SBPT. Diretrizes de PAC em adultos, 2022"]}
      />
    </div>
  );
}

function STOPBangCalc() {
  const items = [
    "Snoring – Ronca alto?",
    "Tired – Cansaço excessivo diurno ou sonolência?",
    "Observed – Alguém observou pausas respiratórias no sono?",
    "Pressure – Hipertensão arterial em tratamento?",
    "BMI > 35 kg/m²",
    "Age > 50 anos",
    "Neck – Circunferência cervical > 40 cm",
    "Gender – Sexo masculino",
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const score = checked.filter(Boolean).length;
  function cls(s: number) {
    if (s <= 2) return { l: "Baixo risco para AOS", c: "text-green-600" };
    if (s <= 4) return { l: "Risco intermediário para AOS", c: "text-yellow-600" };
    return { l: "Alto risco para AOS – solicitar polissonografia", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Triagem de Apneia Obstrutiva do Sono (AOS). Chung et al., Anesthesiology 2008.</p>
      {items.map((it, i) => <CheckItem key={i} label={it} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={`${score}/8`} label={c.l} color={c.c}
        condutas={score <= 2 ? ["Baixa probabilidade de AOS", "Orientar higiene do sono e perda de peso se IMC elevado"] : score <= 4 ? ["Considerar polissonografia ambulatorial (nível III)", "Avaliar sonolência diurna (Epworth)", "Orientar evitar álcool e sedativos antes de dormir"] : ["Polissonografia diagnóstica indicada", "Alta probabilidade de AOS moderada/grave", "Avaliar risco perioperatório aumentado em cirurgias", "Iniciar CPAP se IAH ≥ 15 ou sintomático"]}
        referencias={["Chung F et al. Anesthesiology, 2008;108:812-21", "AASM. Clinical Practice Guideline for OSA, 2017"]}
      />
    </div>
  );
}

function ROXIndexCalc() {
  const [spo2, setSpo2] = useState(""); const [fio2, setFio2] = useState(""); const [fr, setFr] = useState("");
  let rox: number | null = null;
  if (spo2 && fio2 && fr && +fr > 0) {
    rox = +((+spo2 / +fio2) / +fr).toFixed(2);
  }
  function cls(r: number) {
    if (r >= 4.88) return { l: "Baixo risco de intubação – manter CNAF", c: "text-green-600" };
    if (r >= 3.85) return { l: "Risco intermediário – reavaliar em 2h", c: "text-yellow-600" };
    return { l: "Alto risco de falha da CNAF – considerar intubação", c: "text-red-600" };
  }
  const c = rox !== null ? cls(rox) : null;
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">ROX Index — Prediz sucesso/falha da Cânula Nasal de Alto Fluxo (CNAF). Avaliar em 2, 6 e 12h. Roca et al., JCCM 2016.</p>
      <div className="grid grid-cols-3 gap-4">
        <Field label="SpO₂ (%)"><Num value={spo2} onChange={setSpo2} placeholder="95" /></Field>
        <Field label="FiO₂ (%) — na CNAF"><Num value={fio2} onChange={setFio2} placeholder="60" /></Field>
        <Field label="FR (irpm)"><Num value={fr} onChange={setFr} placeholder="22" /></Field>
      </div>
      {rox !== null && c && <ResultBox value={rox} label={c.l} color={c.c} sub="ROX = (SpO₂/FiO₂) / FR"
        condutas={rox >= 4.88 ? ["Manter CNAF com reavaliação periódica", "Reduzir FiO₂ se SpO₂ > 96%", "Monitorar sinais de fadiga respiratória"] : rox >= 3.85 ? ["Reavaliar em 2h — tendência é mais importante que valor isolado", "Manter vigilância de esforço respiratório", "Preparar plano de intubação se piora"] : ["Alto risco de falha da CNAF", "Preparar para IOT (sequência rápida)", "Não postergar intubação — atraso aumenta mortalidade"]}
        referencias={["Roca O et al. J Crit Care, 2016;35:200-5", "Roca O et al. AJRCCM, 2019;199:1368-76"]}
      />}
    </div>
  );
}

function ACTCalc() {
  const questions = [
    "Nas últimas 4 semanas, quanto a asma impediu de fazer as coisas no trabalho, escola ou casa?",
    "Nas últimas 4 semanas, quantas vezes teve falta de ar?",
    "Nas últimas 4 semanas, quantas vezes os sintomas (chiado, tosse, falta de ar, aperto no peito) o(a) acordaram à noite ou mais cedo que o habitual?",
    "Nas últimas 4 semanas, quantas vezes usou o broncodilatador de resgate (salbutamol/fenoterol)?",
    "Como você classificaria o controle da sua asma nas últimas 4 semanas?",
  ];
  const opts: [string, string][][] = [
    [["1","Sempre (1)"],["2","Na maioria do tempo (2)"],["3","Algumas vezes (3)"],["4","Poucas vezes (4)"],["5","Nunca (5)"]],
    [["1","Mais que 1x/dia (1)"],["2","1x/dia (2)"],["3","3–6x/semana (3)"],["4","1–2x/semana (4)"],["5","Nenhuma (5)"]],
    [["1","≥ 4 noites/sem (1)"],["2","2–3 noites/sem (2)"],["3","1x/semana (3)"],["4","1–2 vezes (4)"],["5","Nenhuma (5)"]],
    [["1","≥ 3x/dia (1)"],["2","1–2x/dia (2)"],["3","2–3x/semana (3)"],["4","≤ 1x/semana (4)"],["5","Nenhuma (5)"]],
    [["1","Nada controlada (1)"],["2","Mal controlada (2)"],["3","Razoavelmente controlada (3)"],["4","Bem controlada (4)"],["5","Totalmente controlada (5)"]],
  ];
  const [vals, setVals] = useState<string[]>(questions.map(() => "5"));
  const score = vals.reduce((s, v) => s + +v, 0);
  function cls(s: number) {
    if (s === 25) return { l: "Asma totalmente controlada", c: "text-green-600" };
    if (s >= 20) return { l: "Asma bem controlada", c: "text-yellow-600" };
    return { l: "Asma NÃO controlada – revisar tratamento", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Asthma Control Test (Nathan et al., 2004). Auto-aplicável. Score ≥ 20 = bem controlada; 25 = totalmente controlada; &lt; 20 = não controlada.</p>
      {questions.map((q, i) => (
        <div key={i} className="space-y-1">
          <p className="text-sm text-gray-700">{i + 1}. {q}</p>
          <Sel value={vals[i]} onChange={v => { const n = [...vals]; n[i] = v; setVals(n); }} opts={opts[i]} />
        </div>
      ))}
      <ResultBox value={`${score}/25`} label={c.l} color={c.c} sub="ACT — Asthma Control Test"
        condutas={score === 25 ? ["Asma totalmente controlada — manter tratamento atual", "Considerar step-down após 3 meses estável"] : score >= 20 ? ["Asma bem controlada — manter tratamento", "Verificar adesão e técnica inalatória", "Reavaliar em 1–3 meses"] : ["Asma NÃO controlada — considerar step-up", "Verificar adesão, técnica inalatória e exposição a gatilhos", "Avaliar diagnósticos diferenciais", "Reavaliar em 2–4 semanas após ajuste"]}
        referencias={["Nathan RA et al. J Allergy Clin Immunol, 2004;113:59-65", "GINA Report, 2024"]}
      />
    </div>
  );
}

function GINAControleCalc() {
  const controlItems = [
    "Sintomas diurnos > 2x/semana",
    "Despertar noturno por asma",
    "Uso de broncodilatador de resgate > 2x/semana",
    "Limitação de atividades por asma",
  ];
  const [checked, setChecked] = useState<boolean[]>(controlItems.map(() => false));
  const positivos = checked.filter(Boolean).length;
  function cls(n: number) {
    if (n === 0) return { l: "Asma CONTROLADA", c: "text-green-600", desc: "Nenhum critério nas últimas 4 semanas" };
    if (n <= 2) return { l: "Asma PARCIALMENTE controlada", c: "text-yellow-600", desc: "1–2 critérios nas últimas 4 semanas" };
    return { l: "Asma NÃO controlada", c: "text-red-600", desc: "3–4 critérios nas últimas 4 semanas" };
  }
  const c = cls(positivos);

  const steps = [
    { step: "1", trat: "SABA por demanda (resgate apenas)", manut: "Sem controlador diário", cor: "bg-green-50 border-green-200" },
    { step: "2", trat: "CI dose baixa diário", manut: "Alternativa: antileucotrieno", cor: "bg-yellow-50 border-yellow-200" },
    { step: "3", trat: "CI dose baixa + LABA", manut: "Alternativa: CI dose média", cor: "bg-orange-50 border-orange-200" },
    { step: "4", trat: "CI dose média/alta + LABA", manut: "Considerar add-on: tiotrópio, anti-IgE", cor: "bg-red-50 border-red-200" },
    { step: "5", trat: "CI dose alta + LABA + OCS / biológico", manut: "Encaminhar ao especialista", cor: "bg-red-100 border-red-300" },
  ];
  const [currentStep, setCurrentStep] = useState("2");

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Avaliação de controle da asma e orientação de step-up/step-down conforme GINA 2024. Nas últimas 4 semanas, o paciente teve:</p>
      <div>
        <p className="form-label mb-2">Critérios de controle (últimas 4 semanas):</p>
        {controlItems.map((it, i) => <CheckItem key={i} label={it} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      </div>
      <div className={`rounded-xl p-4 border-2 ${positivos === 0 ? "bg-green-50 border-green-300" : positivos <= 2 ? "bg-yellow-50 border-yellow-300" : "bg-red-50 border-red-300"}`}>
        <p className={`text-lg font-bold ${c.c}`}>{c.l}</p>
        <p className="text-xs text-gray-600 mt-1">{c.desc}</p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="form-label mb-2">Etapa atual de tratamento (Step):</p>
        <Sel value={currentStep} onChange={setCurrentStep} opts={[["1","Step 1"],["2","Step 2"],["3","Step 3"],["4","Step 4"],["5","Step 5"]]} />
        <div className="mt-3 space-y-2">
          {steps.map(s => (
            <div key={s.step} className={`p-3 rounded-xl border ${currentStep === s.step ? s.cor + " ring-2 ring-brand-blue-400" : "bg-white border-gray-100 opacity-60"}`}>
              <p className="font-bold text-sm text-gray-800">Step {s.step}</p>
              <p className="text-xs text-gray-600">{s.trat}</p>
              <p className="text-xs text-gray-400">{s.manut}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Controlada por ≥ 3 meses → considerar step-down. Não controlada → step-up (após checar adesão e técnica inalatória).</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🩸 VASCULAR / TEV
// ═══════════════════════════════════════════════════════════════════════════════

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
      <ResultBox value={score} label={c.l} color={c.c} sub="Score ≤4 + D-Dímero neg. → TEP excluído com segurança"
        condutas={score <= 1 ? ["Solicitar D-Dímero", "Se D-Dímero negativo: TEP excluído", "Se D-Dímero positivo: angiotomografia de tórax"] : score <= 6 ? ["Solicitar D-Dímero (ajustado por idade se > 50: corte = idade × 10)", "Se positivo: angiotomografia pulmonar", "Iniciar anticoagulação se alta suspeita clínica enquanto aguarda imagem"] : ["Angiotomografia pulmonar imediata", "Iniciar anticoagulação empírica (heparina)", "Se instabilidade hemodinâmica: considerar trombólise", "Ecocardiograma à beira-leito se choque"]}
        referencias={["Wells PS et al. Thromb Haemost, 2000;83:416-20", "SBPT. Recomendações para TEP, 2020"]}
      />
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
      {items.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={score} label={c.l} color={c.c}
        condutas={score <= 0 ? ["D-Dímero — se negativo, TVP excluída", "Se positivo: ultrassom Doppler venoso"] : score <= 2 ? ["Ultrassom Doppler venoso de MMII", "Se negativo + alta suspeita: repetir em 5–7 dias", "Considerar D-Dímero complementar"] : ["Ultrassom Doppler venoso imediato", "Iniciar anticoagulação empírica enquanto aguarda exame", "Se US indisponível: anticoagular e agendar em 24h"]}
        referencias={["Wells PS et al. NEJM, 2003;349:1227-35", "SBACV. Diretrizes de TVP, 2018"]}
      />
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

function CapriniCalc() {
  const items1 = [
    { label: "Idade 41–60 anos", pts: 1 },
    { label: "Cirurgia menor prevista", pts: 1 },
    { label: "IMC > 25", pts: 1 },
    { label: "Edema de MMII", pts: 1 },
    { label: "Veias varicosas", pts: 1 },
    { label: "Gravidez ou pós-parto (< 1 mês)", pts: 1 },
    { label: "Abortamento espontâneo de repetição", pts: 1 },
    { label: "ACO ou TRH", pts: 1 },
    { label: "Sepse (< 1 mês)", pts: 1 },
    { label: "Doença pulmonar grave (incluindo pneumonia < 1 mês)", pts: 1 },
    { label: "DPOC", pts: 1 },
    { label: "Restrição ao leito (> 72h)", pts: 1 },
    { label: "IAM atual", pts: 1 },
    { label: "ICC atual (< 1 mês)", pts: 1 },
  ];
  const items2 = [
    { label: "Idade 61–74 anos", pts: 2 },
    { label: "Cirurgia artroscópica", pts: 2 },
    { label: "Cirurgia aberta (> 45 min)", pts: 2 },
    { label: "Neoplasia maligna", pts: 2 },
    { label: "Acamado (> 72h)", pts: 2 },
    { label: "Acesso venoso central", pts: 2 },
    { label: "Gesso imobilizador", pts: 2 },
  ];
  const items3 = [
    { label: "Idade ≥ 75 anos", pts: 3 },
    { label: "TVP/TEP prévio", pts: 3 },
    { label: "HF+ TVP/TEP", pts: 3 },
    { label: "Fator V de Leiden", pts: 3 },
    { label: "Anticorpo antifosfolípide positivo", pts: 3 },
    { label: "Hiper-homocisteinemia", pts: 3 },
    { label: "Trombocitopenia induzida por heparina", pts: 3 },
    { label: "Outra trombofilia hereditária ou adquirida", pts: 3 },
  ];
  const items5 = [
    { label: "AVC (< 1 mês)", pts: 5 },
    { label: "Artroplastia eletiva de MMII", pts: 5 },
    { label: "Fratura de quadril, pelve ou MMII", pts: 5 },
    { label: "Trauma múltiplo (< 1 mês)", pts: 5 },
    { label: "Lesão medular aguda com paralisia (< 1 mês)", pts: 5 },
  ];
  const allItems = [...items1, ...items2, ...items3, ...items5];
  const [checked, setChecked] = useState<boolean[]>(allItems.map(() => false));
  const score = allItems.reduce((s, it, i) => s + (checked[i] ? it.pts : 0), 0);
  function cls(s: number) {
    if (s <= 1) return { l: "Risco muito baixo – deambulação precoce", c: "text-green-600" };
    if (s === 2) return { l: "Risco baixo – profilaxia mecânica", c: "text-yellow-600" };
    if (s <= 4) return { l: "Risco moderado – profilaxia farmacológica", c: "text-orange-600" };
    return { l: "Risco alto – profilaxia farmacológica + mecânica", c: "text-red-600" };
  }
  const c = cls(score);
  const offset1 = 0;
  const offset2 = items1.length;
  const offset3 = offset2 + items2.length;
  const offset5 = offset3 + items3.length;
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Estratificação de risco de TEV cirúrgico. Orienta profilaxia perioperatória.</p>
      <p className="text-xs font-semibold text-gray-600 mt-2">1 ponto cada:</p>
      {items1.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[offset1+i]} onChange={v => { const n = [...checked]; n[offset1+i] = v; setChecked(n); }} />)}
      <p className="text-xs font-semibold text-gray-600 mt-2">2 pontos cada:</p>
      {items2.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[offset2+i]} onChange={v => { const n = [...checked]; n[offset2+i] = v; setChecked(n); }} />)}
      <p className="text-xs font-semibold text-gray-600 mt-2">3 pontos cada:</p>
      {items3.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[offset3+i]} onChange={v => { const n = [...checked]; n[offset3+i] = v; setChecked(n); }} />)}
      <p className="text-xs font-semibold text-gray-600 mt-2">5 pontos cada:</p>
      {items5.map((it, i) => <CheckItem key={i} label={it.label} pts={it.pts} checked={checked[offset5+i]} onChange={v => { const n = [...checked]; n[offset5+i] = v; setChecked(n); }} />)}
      <ResultBox value={score} label={c.l} color={c.c} sub="Caprini Score — Profilaxia de TEV"
        condutas={score <= 1 ? ["Deambulação precoce", "Sem necessidade de profilaxia farmacológica"] : score === 2 ? ["Profilaxia mecânica (meias elásticas ou CPI)", "Deambulação precoce"] : score <= 4 ? ["Enoxaparina 40mg SC 1x/dia OU HNF 5000UI SC 8/8h", "Iniciar 6–12h após cirurgia", "Manter por 7–14 dias ou até deambulação"] : ["Enoxaparina 40mg SC 1x/dia + CPI", "Considerar profilaxia estendida (28 dias) em cirurgia oncológica", "Avaliar contraindicações ao anticoagulante"]}
        referencias={["Caprini JA. Clin Appl Thromb Hemost, 2004;10:303-10", "ACCP. Chest Guidelines, 2012"]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔬 NEFROLOGIA
// ═══════════════════════════════════════════════════════════════════════════════

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
      {r !== null && <ResultBox value={r} unit="mL/min" label={cls(r)} color={r >= 60 ? "text-green-600" : r >= 30 ? "text-yellow-600" : "text-red-600"}
        condutas={r >= 90 ? ["Função renal preservada", "Rastrear fatores de risco (DM, HAS)"] : r >= 60 ? ["Monitorar progressão anual", "Controlar HAS (alvo < 130/80)", "Evitar nefrotóxicos (AINEs, contrastes)"] : r >= 30 ? ["Encaminhar ao nefrologista", "Ajustar doses de medicamentos por TFG", "Avaliar distúrbios do metabolismo mineral-ósseo"] : ["Preparar para TRS (diálise/transplante)", "Avaliar confecção de FAV se TFG < 20", "Restringir potássio e fósforo na dieta"]}
        referencias={["Cockcroft DW, Gault MH. Nephron, 1976;16:31-41", "KDIGO CKD Guidelines, 2024"]}
      />}
    </div>
  );
}

function CKDEPICalc() {
  const [cr, setCr] = useState(""); const [age, setAge] = useState(""); const [sex, setSex] = useState("M");
  let eGFR: number | null = null;
  if (cr && age) {
    const scr = +cr; const a = +age;
    const k = sex === "F" ? 0.7 : 0.9;
    const alpha = sex === "F" ? -0.241 : -0.302;
    const sexFactor = sex === "F" ? 1.012 : 1;
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
      {eGFR !== null && c && <ResultBox value={eGFR} unit="mL/min/1,73m²" label={c.l} color={c.c}
        condutas={eGFR >= 90 ? ["Função renal normal", "Rastrear albuminúria se DM ou HAS"] : eGFR >= 60 ? ["DRC estágio 2 — monitorar anualmente", "Controlar PA (alvo < 130/80 se albuminúria)", "Considerar iSGLT2 se albuminúria > 30 mg/g"] : eGFR >= 30 ? ["Encaminhar ao nefrologista", "iSGLT2 (dapagliflozina) se TFG ≥ 20", "Ajuste de doses renais em prescrições", "Monitorar K+, Ca, PO₄, PTH, Hb"] : ["Planejamento de TRS", "FAV se TFG < 20", "Restrição dietética de K+, Na, PO₄", "Eritropoetina se Hb < 10"]}
        referencias={["Inker LA et al. NEJM, 2021;385:1737-49 (CKD-EPI 2021)", "KDIGO CKD Guidelines, 2024"]}
      />}
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
          <p className="text-xs text-gray-400 mt-2">Limite: máx. 8–10 mEq/L em 24h (risco de mielinólise pontina)</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🏨 UTI / SEPSE
// ═══════════════════════════════════════════════════════════════════════════════

function SOFACalc() {
  const [pao2fio2, setPao2fio2] = useState(""); const [plat, setPlat] = useState(""); const [bili, setBili] = useState("");
  const [vasopressor, setVasopressor] = useState("0");
  const [gcs, setGcs] = useState("15"); const [cr, setCr] = useState(""); const [diurese, setDiurese] = useState("");

  function respPts() { const v = +pao2fio2; if (!v) return 0; if (v >= 400) return 0; if (v >= 300) return 1; if (v >= 200) return 2; if (v >= 100) return 3; return 4; }
  function coagPts() { const v = +plat; if (!v) return 0; if (v >= 150) return 0; if (v >= 100) return 1; if (v >= 50) return 2; if (v >= 20) return 3; return 4; }
  function livPts() { const v = +bili; if (!v) return 0; if (v < 1.2) return 0; if (v < 2) return 1; if (v < 6) return 2; if (v < 12) return 3; return 4; }
  function cvPts() { return +vasopressor; }
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
          <div key={k as string} className="bg-gray-50 rounded-lg p-2 border"><p className="text-gray-500">{k as string}</p><p className="text-lg font-bold text-gray-800">{v as number}</p></div>
        ))}
      </div>
      <ResultBox value={total} unit="pontos" label={c.l} color={c.c}
        condutas={total < 6 ? ["Monitorar evolução — reavaliar SOFA em 24h", "Tratar foco infeccioso se identificado"] : total < 10 ? ["Sepse provável se ∆SOFA ≥ 2", "Iniciar bundle da 1ª hora: lactato, hemoculturas, ATB empírico, cristaloide 30mL/kg", "Vasopressor se PAM < 65 após reposição volêmica"] : ["Choque séptico se vasopressor + lactato > 2", "Noradrenalina 1ª linha (alvo PAM ≥ 65)", "Corticoide (hidrocortisona 200mg/dia) se choque refratário", "Monitorar clearance de lactato a cada 2h"]}
        referencias={["Singer M et al. (Sepsis-3) JAMA, 2016;315:801-10", "SSC. Surviving Sepsis Campaign Guidelines, 2021"]}
      />
    </div>
  );
}

function QSOFACalc() {
  const items = ["FR ≥ 22 ipm", "PAS ≤ 100 mmHg", "Alteração do sensório (Glasgow < 15)"];
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const score = checked.filter(Boolean).length;
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Triagem rápida de sepse à beira-leito. Score ≥ 2 → alta mortalidade.</p>
      {items.map((it, i) => <CheckItem key={i} label={it} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      <ResultBox value={`${score}/3`} label={score >= 2 ? "qSOFA ≥ 2 – Investigar sepse (SOFA completo)" : "qSOFA < 2 – Baixo risco de sepse"} color={score >= 2 ? "text-red-600" : "text-green-600"}
        condutas={score < 2 ? ["Baixo risco de sepse — continuar avaliação clínica", "Não exclui infecção — tratar conforme quadro"] : ["Calcular SOFA completo para confirmar disfunção orgânica", "Colher lactato sérico e hemoculturas", "Iniciar ATB empírico em < 1h se suspeita de sepse", "Reposição volêmica com cristaloide 30 mL/kg se hipotensão"]}
        referencias={["Seymour CW et al. JAMA, 2016;315:762-74", "Singer M et al. (Sepsis-3) JAMA, 2016;315:801-10"]}
      />
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
  function frPts(rv: number) { if (rv >= 50) return 4; if (rv >= 35) return 3; if (rv >= 25) return 1; if (rv >= 12) return 0; if (rv >= 10) return 1; if (rv >= 6) return 2; return 4; }
  function oxyPts() { if (+fio2 >= 50) { const pf = +pao2 / (+fio2/100); if (pf < 200) return 4; if (pf < 350) return 2; if (pf < 500) return 0; return 0; } return +pao2 >= 70 ? 0 : +pao2 >= 61 ? 1 : +pao2 >= 55 ? 3 : 4; }
  function phPts(p: number) { if (p >= 7.7) return 4; if (p >= 7.6) return 3; if (p >= 7.5) return 1; if (p >= 7.33) return 0; if (p >= 7.25) return 2; if (p >= 7.15) return 3; return 4; }
  function naPts(n: number) { if (n >= 180) return 4; if (n >= 160) return 3; if (n >= 155) return 2; if (n >= 150) return 1; if (n >= 130) return 0; if (n >= 120) return 2; if (n >= 111) return 3; return 4; }
  function kPts(kv: number) { if (kv >= 7) return 4; if (kv >= 6) return 3; if (kv >= 5.5) return 1; if (kv >= 3.5) return 0; if (kv >= 3) return 1; if (kv >= 2.5) return 2; return 4; }
  function crPts(c: number, acute: boolean) { const v = acute ? c * 2 : c; if (v >= 3.5) return 4; if (v >= 2) return 3; if (v >= 1.5) return 2; if (v >= 0.6) return 0; return 2; }
  function hctPts(h: number) { if (h >= 60) return 4; if (h >= 50) return 2; if (h >= 46) return 1; if (h >= 30) return 0; if (h >= 20) return 2; return 4; }
  function wbcPts(w: number) { if (w >= 40) return 4; if (w >= 20) return 2; if (w >= 15) return 1; if (w >= 3) return 0; if (w >= 1) return 2; return 4; }
  function gcsPts(g: number) { return 15 - g; }

  const a = +age; const t = +temp; const m = +map; const f = +fc; const rv = +fr; const p = +ph; const nv = +na; const kv = +k; const cv = +cr; const hv = +hct; const wv = +wbc; const gv = +gcs;
  const pts = [
    age ? agePts(a) : 0, +chrDz,
    temp ? tempPts(t) : 0, map ? mapPts(m) : 0, fc ? fcPts(f) : 0,
    fr ? frPts(rv) : 0,
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
      <ResultBox value={total} unit="pontos" label={c.l} color={c.c} sub="APACHE II score – estimativa de mortalidade hospitalar"
        condutas={total < 10 ? ["Prognóstico favorável", "Monitorização padrão de UTI"] : total < 20 ? ["Risco moderado — reavaliação diária", "Intensificar monitorização e terapia direcionada"] : total < 30 ? ["Alto risco — considerar discussão sobre diretivas antecipadas", "Medidas intensivas máximas se indicado clinicamente"] : ["Mortalidade > 70% — prognóstico muito reservado", "Discutir com família sobre objetivos do cuidado", "Não usar APACHE isoladamente para limitar terapia"]}
        referencias={["Knaus WA et al. Crit Care Med, 1985;13:818-29", "AMIB. Diretrizes Brasileiras de Terapia Intensiva"]}
      />
    </div>
  );
}

function SAPS3Calc() {
  const [age, setAge] = useState(""); const [los, setLos] = useState("0");
  const [malignancy, setMalignancy] = useState("0"); const [gcs, setGcs] = useState("15");
  const [sbp, setSbp] = useState(""); const [hr, setHr] = useState("");
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
  function wbcPts(v: number) { return v >= 1 ? 0 : 12; }

  const a = +age; const g = +gcs; const sv = +sbp; const hv = +hr; const cv = +cr; const pv = +plat; const bv = +bili; const tv = +temp; const wv = +wbc;
  const pts = [
    age ? agePts(a) : 0, +los, +malignancy,
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
        <ResultBox value={`${mort}%`} label={`Score: ${total} pontos`} color={mort < 20 ? "text-green-600" : mort < 50 ? "text-yellow-600" : "text-red-600"} sub="Mortalidade hospitalar estimada (SAPS 3)"
          condutas={mort < 20 ? ["Prognóstico favorável", "Cuidados intensivos padrão"] : mort < 50 ? ["Risco moderado-alto — monitorização rigorosa", "Reavaliação diária de metas terapêuticas"] : ["Prognóstico reservado", "Discutir diretivas antecipadas de vontade", "Considerar parecer paliativo se indicado"]}
          referencias={["Moreno RP et al. Intensive Care Med, 2005;31:1345-55", "AMIB. Adaptação regional SAPS 3 para América Latina"]}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🦴 REUMATOLOGIA
// ═══════════════════════════════════════════════════════════════════════════════

function ASASCalc() {
  const axItems = [
    "Dor lombar inflamatória (início < 45 anos, duração ≥ 3 meses)",
    "Artrite", "Entesite (calcanhar)", "Uveíte anterior", "Dactilite", "Psoríase",
    "Doença de Crohn / Retocolite ulcerativa", "Boa resposta a AINEs",
    "História familiar de EpA (1º ou 2º grau)", "HLA-B27 positivo", "PCR elevada (sem outra causa)",
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
        <Field label="Sacroiliíte na radiografia"><Sel value={sacroRx} onChange={setSacroRx} opts={[["N","Não"],["Y","Sim (grau ≥ 2 bil. ou ≥ 3 unilateral)"]]} /></Field>
        <Field label="Sacroiliíte na RM"><Sel value={sacroRM} onChange={setSacroRM} opts={[["N","Não"],["Y","Sim (inflamação ativa)"]]} /></Field>
        <Field label="HLA-B27"><Sel value={hlaB27} onChange={setHlaB27} opts={[["N","Negativo / não testado"],["Y","Positivo"]]} /></Field>
      </div>
      <div>
        <p className="form-label mb-2">Características clínicas / laboratoriais da EpA:</p>
        {axItems.map((it, i) => <CheckItem key={i} label={it} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      </div>
      <div className={`rounded-xl p-4 border-2 mt-3 ${classifiable ? "bg-brand-blue-50 border-brand-blue-300" : "bg-gray-50 border-gray-200"}`}>
        <p className={`text-lg font-bold ${classifiable ? "text-brand-blue-700" : "text-gray-500"}`}>
          {classifiable ? "Classifica como EpA Axial (ASAS)" : "Não preenche critérios ASAS"}
        </p>
        <div className="mt-2 space-y-1 text-sm">
          <p className={rxPath ? "text-brand-blue-600 font-medium" : "text-gray-400"}>{rxPath ? "✓" : "○"} Via radiográfica: sacroiliíte Rx + ≥1 característica EpA</p>
          <p className={mriPath ? "text-brand-blue-600 font-medium" : "text-gray-400"}>{mriPath ? "✓" : "○"} Via por imagem (RM): sacroiliíte ativa + ≥1 característica EpA</p>
          <p className={clinPath ? "text-brand-blue-600 font-medium" : "text-gray-400"}>{clinPath ? "✓" : "○"} Via clínica: HLA-B27 + ≥2 características EpA</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">{features} característica{features !== 1 ? "s" : ""} EpA marcada{features !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🍼 PEDIATRIA
// ═══════════════════════════════════════════════════════════════════════════════

function PECARNCalc() {
  const [ageGroup, setAgeGroup] = useState<"<2"|">=2">("<2");
  const itemsUnder2 = [
    "Alteração do nível de consciência (GCS < 15)",
    "Hematoma subgaleal palpável (não frontal)",
    "Fratura palpável de crânio",
    "Perda de consciência ≥ 5 segundos",
    "Mecanismo de trauma grave (queda > 90 cm, impacto de alta energia, atropelamento)",
    "Comportamento alterado segundo os pais",
  ];
  const itemsOver2 = [
    "Alteração do nível de consciência (GCS < 15)",
    "Sinais de fratura de base de crânio",
    "Vômitos",
    "Perda de consciência",
    "Mecanismo de trauma grave (queda > 1,5 m, impacto de alta energia, atropelamento)",
    "Cefaleia intensa",
  ];
  const items = ageGroup === "<2" ? itemsUnder2 : itemsOver2;
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const highRisk = checked[0] || checked[1] || checked[2]; // first 3 are high risk criteria
  const intermediateRisk = checked.slice(3).some(Boolean);

  // Reset checked when age group changes
  const handleAgeChange = (v: string) => {
    setAgeGroup(v as "<2"|">=2");
    setChecked(items.map(() => false));
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">PECARN Pediatric Head Injury/Trauma Algorithm — Identifica crianças com risco muito baixo de lesão intracraniana clinicamente importante (ciTBI) que não necessitam de TC de crânio.</p>
      <Field label="Faixa etária">
        <Sel value={ageGroup} onChange={handleAgeChange} opts={[["<2","< 2 anos"],[">=2","≥ 2 anos"]]} />
      </Field>
      <div>
        <p className="form-label mb-2">Critérios presentes:</p>
        {items.map((it, i) => <CheckItem key={`${ageGroup}-${i}`} label={it} checked={checked[i]} onChange={v => { const n = [...checked]; n[i] = v; setChecked(n); }} />)}
      </div>
      <div className={`rounded-xl p-4 border-2 mt-3 ${highRisk ? "bg-red-50 border-red-300" : intermediateRisk ? "bg-yellow-50 border-yellow-300" : "bg-green-50 border-green-300"}`}>
        <p className={`text-lg font-bold ${highRisk ? "text-red-700" : intermediateRisk ? "text-yellow-700" : "text-green-700"}`}>
          {highRisk ? "Alto risco — TC de crânio recomendada" : intermediateRisk ? "Risco intermediário — TC vs observação (decisão compartilhada)" : "Risco muito baixo — TC de crânio NÃO indicada"}
        </p>
        <p className="text-xs text-gray-500 mt-1">{highRisk ? "Risco de ciTBI: ~4,4%" : intermediateRisk ? "Risco de ciTBI: ~0,9%" : "Risco de ciTBI: < 0,05%"}</p>
      </div>
    </div>
  );
}

function ApgarCalc() {
  const categories = [
    { label: "Frequência Cardíaca", opts: [["0","Ausente (0)"],["1","< 100 bpm (1)"],["2","≥ 100 bpm (2)"]] },
    { label: "Esforço Respiratório", opts: [["0","Ausente (0)"],["1","Irregular / choro fraco (1)"],["2","Choro forte (2)"]] },
    { label: "Tônus Muscular", opts: [["0","Flácido (0)"],["1","Alguma flexão (1)"],["2","Movimentos ativos (2)"]] },
    { label: "Irritabilidade Reflexa", opts: [["0","Sem resposta (0)"],["1","Careta / choro fraco (1)"],["2","Choro vigoroso / tosse / espirro (2)"]] },
    { label: "Cor", opts: [["0","Cianose central / palidez (0)"],["1","Acrocianose (1)"],["2","Rosado (2)"]] },
  ];
  const [vals, setVals] = useState<string[]>(categories.map(() => "2"));
  const score = vals.reduce((s, v) => s + +v, 0);
  function cls(s: number) {
    if (s >= 7) return { l: "RN em boas condições", c: "text-green-600" };
    if (s >= 4) return { l: "Depressão moderada – necessita atenção", c: "text-yellow-600" };
    return { l: "Depressão grave – reanimação imediata", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Avaliação do recém-nascido no 1° e 5° minuto de vida. Virginia Apgar, 1953.</p>
      {categories.map((cat, i) => (
        <Field key={i} label={cat.label}>
          <Sel value={vals[i]} onChange={v => { const n = [...vals]; n[i] = v; setVals(n); }} opts={cat.opts as [string, string][]} />
        </Field>
      ))}
      <ResultBox value={`${score}/10`} label={c.l} color={c.c}
        condutas={score >= 7 ? ["RN em boas condições — cuidados de rotina", "Clampeamento tardio do cordão", "Contato pele a pele e aleitamento precoce"] : score >= 4 ? ["Ventilação com pressão positiva (VPP) com máscara", "Aspiração de vias aéreas se necessário", "Reavaliar em 30 segundos"] : ["Iniciar reanimação neonatal imediata (VPP + O₂)", "Se FC < 60 após VPP: compressões torácicas 3:1", "Considerar IOT e adrenalina se sem resposta", "Acionar equipe neonatal"]}
        referencias={["Apgar V. Curr Res Anesth Analg, 1953;32:260-7", "SBP/ILCOR. Reanimação Neonatal, 2022"]}
      />
    </div>
  );
}

function DosePediatricaCalc() {
  const [peso, setPeso] = useState(""); const [dose, setDose] = useState(""); const [conc, setConc] = useState("");
  const totalMg = peso && dose ? +(+peso * +dose).toFixed(2) : null;
  const totalMl = totalMg !== null && conc && +conc > 0 ? +(totalMg / +conc).toFixed(2) : null;
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Cálculo rápido de dose pediátrica por peso. Sempre confira com tabela de dose máxima da medicação.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Peso da criança (kg)"><Num value={peso} onChange={setPeso} placeholder="12" /></Field>
        <Field label="Dose prescrita (mg/kg)"><Num value={dose} onChange={setDose} placeholder="10" step="0.1" /></Field>
        <Field label="Concentração do fármaco (mg/mL) — opcional"><Num value={conc} onChange={setConc} placeholder="20" step="0.1" /></Field>
      </div>
      {totalMg !== null && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-3xl font-bold text-brand-blue-700">{totalMg} mg</p>
          <p className="text-sm text-gray-500">Dose total calculada</p>
          {totalMl !== null && (
            <>
              <p className="text-2xl font-bold text-brand-blue-600 mt-2">{totalMl} mL</p>
              <p className="text-sm text-gray-500">Volume a administrar</p>
            </>
          )}
          <p className="text-xs text-gray-400 mt-2">Verifique dose máxima antes de prescrever</p>
        </div>
      )}
    </div>
  );
}

function HollidaySagarCalc() {
  const [peso, setPeso] = useState("");
  let result: { total: number; rate: string } | null = null;
  if (peso && +peso > 0) {
    const p = +peso;
    let total = 0;
    if (p <= 10) total = p * 100;
    else if (p <= 20) total = 1000 + (p - 10) * 50;
    else total = 1500 + (p - 20) * 20;
    const ratePerHour = (total / 24).toFixed(1);
    result = { total, rate: ratePerHour };
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Cálculo de necessidade hídrica basal em pediatria (Holliday-Segar, 1957). Regra 4-2-1 para taxa horária.</p>
      <Field label="Peso (kg)"><Num value={peso} onChange={setPeso} placeholder="15" /></Field>
      {result && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center space-y-2">
          <p className="text-3xl font-bold text-brand-blue-700">{result.total} mL/dia</p>
          <p className="text-sm text-gray-500">Necessidade hídrica basal em 24h</p>
          <p className="text-xl font-bold text-brand-blue-600">{result.rate} mL/h</p>
          <p className="text-sm text-gray-500">Taxa de infusão contínua</p>
          <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
            <p>≤ 10 kg: 100 mL/kg | 10–20 kg: 1000 + 50 mL/kg acima de 10 | &gt; 20 kg: 1500 + 20 mL/kg acima de 20</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🤰 OBSTETRÍCIA
// ═══════════════════════════════════════════════════════════════════════════════

function DPPNaegeleCalc() {
  const [dum, setDum] = useState("");
  let dpp: string | null = null;
  let igSemanas: number | null = null;
  if (dum) {
    const d = new Date(dum);
    const dppDate = new Date(d);
    dppDate.setDate(dppDate.getDate() + 280);
    dpp = dppDate.toLocaleDateString("pt-BR");
    const hoje = new Date();
    const diff = Math.floor((hoje.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    igSemanas = +(diff / 7).toFixed(1);
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Regra de Naegele: DPP = DUM + 280 dias (40 semanas). Referência para cálculo da idade gestacional.</p>
      <Field label="Data da Última Menstruação (DUM)">
        <input type="date" className="form-input" value={dum} onChange={e => setDum(e.target.value)} />
      </Field>
      {dpp && igSemanas !== null && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center space-y-2">
          <p className="text-3xl font-bold text-brand-blue-700">{dpp}</p>
          <p className="text-sm text-gray-500">Data Provável do Parto (DPP)</p>
          <p className="text-xl font-bold text-brand-blue-600">{igSemanas} semanas</p>
          <p className="text-sm text-gray-500">Idade Gestacional atual (aproximada)</p>
        </div>
      )}
    </div>
  );
}

function BishopCalc() {
  const [dilatacao, setDilatacao] = useState("0");
  const [apagamento, setApagamento] = useState("0");
  const [consistencia, setConsistencia] = useState("0");
  const [posicao, setPosicao] = useState("0");
  const [altura, setAltura] = useState("0");
  const score = +dilatacao + +apagamento + +consistencia + +posicao + +altura;
  function cls(s: number) {
    if (s >= 9) return { l: "Colo muito favorável – indução provavelmente eficaz", c: "text-green-600" };
    if (s >= 6) return { l: "Colo favorável – indução pode ser considerada", c: "text-yellow-600" };
    return { l: "Colo desfavorável – considerar maturação cervical antes de indução", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Avalia favorabilidade cervical para indução do trabalho de parto. Bishop ≥ 6 = favorável.</p>
      <Field label="Dilatação (cm)">
        <Sel value={dilatacao} onChange={setDilatacao} opts={[["0","Fechado (0)"],["1","1–2 cm (1)"],["2","3–4 cm (2)"],["3","≥ 5 cm (3)"]]} />
      </Field>
      <Field label="Apagamento (%)">
        <Sel value={apagamento} onChange={setApagamento} opts={[["0","0–30% (0)"],["1","40–50% (1)"],["2","60–70% (2)"],["3","≥ 80% (3)"]]} />
      </Field>
      <Field label="Consistência do colo">
        <Sel value={consistencia} onChange={setConsistencia} opts={[["0","Firme (0)"],["1","Médio (1)"],["2","Amolecido (2)"]]} />
      </Field>
      <Field label="Posição do colo">
        <Sel value={posicao} onChange={setPosicao} opts={[["0","Posterior (0)"],["1","Mediano (1)"],["2","Anterior (2)"]]} />
      </Field>
      <Field label="Altura da apresentação (plano De Lee)">
        <Sel value={altura} onChange={setAltura} opts={[["0","-3 (0)"],["1","-2 (1)"],["2","-1 / 0 (2)"],["3","+1 / +2 (3)"]]} />
      </Field>
      <ResultBox value={`${score}/13`} label={c.l} color={c.c} sub="Bishop Score — Favorabilidade cervical"
        condutas={score >= 9 ? ["Colo muito favorável — indução com ocitocina", "Alta taxa de sucesso na indução"] : score >= 6 ? ["Colo favorável — indução pode ser iniciada", "Considerar amniotomia + ocitocina"] : ["Colo desfavorável — maturação cervical antes de indução", "Misoprostol 25µg vaginal a cada 6h (máx 4 doses)", "Sonda de Foley transcervical como alternativa", "Reavaliar Bishop após maturação"]}
        referencias={["Bishop EH. Obstet Gynecol, 1964;24:266-8", "FEBRASGO. Indução do Trabalho de Parto, 2021"]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧪 FARMACOLOGIA
// ═══════════════════════════════════════════════════════════════════════════════

function QTcBazettCalc() {
  const [qt, setQt] = useState(""); const [fc, setFc] = useState("");
  let qtc: number | null = null;
  if (qt && fc && +fc > 0) {
    const rr = 60 / +fc;
    qtc = +(+qt / Math.sqrt(rr)).toFixed(0);
  }
  function cls(q: number) {
    if (q < 440) return { l: "QTc normal", c: "text-green-600" };
    if (q < 500) return { l: "QTc prolongado – revisar medicações", c: "text-yellow-600" };
    return { l: "QTc muito prolongado – risco de Torsades de Pointes!", c: "text-red-600" };
  }
  const c = qtc !== null ? cls(qtc) : null;
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">QTc = QT / √RR (Bazett). Impreciso em FC muito alta (&gt;100) ou muito baixa (&lt;60).</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="QT medido (ms)"><Num value={qt} onChange={setQt} placeholder="420" /></Field>
        <Field label="FC (bpm)"><Num value={fc} onChange={setFc} placeholder="72" /></Field>
      </div>
      {qtc !== null && c && <ResultBox value={`${qtc} ms`} label={c.l} color={c.c} sub="Normal: < 440 ms (♂) / < 460 ms (♀)"
        condutas={qtc < 440 ? ["QTc normal — sem restrições medicamentosas por QT"] : qtc < 500 ? ["Revisar medicações que prolongam QT (antipsicóticos, macrolídeos, antiarrítmicos)", "Corrigir K+ > 4,0 e Mg²⁺ > 2,0 mEq/L", "ECG de controle após ajuste"] : ["RISCO de Torsades de Pointes!", "Suspender TODAS as medicações que prolongam QT", "Correção agressiva de K+ e Mg²⁺", "Monitorização contínua em UTI/UCO", "Isoproterenol ou marca-passo provisório se TdP recorrente"]}
        referencias={["Bazett HC. Heart, 1920;7:353-70", "CredibleMeds.org — QT Drug Lists", "AHA/ACC. Management of Drug-Induced QT Prolongation"]}
      />}
    </div>
  );
}

function CorrecaoCalcioCalc() {
  const [ca, setCa] = useState(""); const [alb, setAlb] = useState("");
  let corrigido: number | null = null;
  if (ca && alb) {
    corrigido = +(+ca + 0.8 * (4 - +alb)).toFixed(1);
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Ca corrigido = Ca medido + 0,8 × (4 – albumina). Usar quando albumina &lt; 4 g/dL.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Cálcio total (mg/dL)"><Num value={ca} onChange={setCa} placeholder="8.5" step="0.1" /></Field>
        <Field label="Albumina sérica (g/dL)"><Num value={alb} onChange={setAlb} placeholder="3.0" step="0.1" /></Field>
      </div>
      {corrigido !== null && (
        <ResultBox value={corrigido} unit="mg/dL" label={corrigido < 8.5 ? "Hipocalcemia corrigida" : corrigido > 10.5 ? "Hipercalcemia corrigida" : "Cálcio corrigido normal (8,5–10,5)"} color={corrigido < 8.5 ? "text-red-600" : corrigido > 10.5 ? "text-red-600" : "text-green-600"}
          condutas={corrigido < 8.5 ? ["Investigar: PTH, vitamina D, magnésio", "Se sintomático (Chvostek+, Trousseau+): gluconato de cálcio 10% IV", "Reposição oral: carbonato de cálcio + vitamina D"] : corrigido > 10.5 ? ["Investigar: PTH (hiperparatireoidismo?), neoplasia, vitamina D", "Hipercalcemia grave (>14): SF 0,9% agressivo + furosemida", "Considerar bifosfonato IV (ácido zoledrônico)", "Corticoides se granulomatose ou mieloma"] : ["Cálcio dentro da faixa normal após correção"]}
          referencias={["Payne RB et al. BMJ, 1973;4:643-6", "KDIGO. CKD-MBD Guidelines, 2017"]}
        />
      )}
    </div>
  );
}

function AnionGapCalc() {
  const [na, setNa] = useState(""); const [cl, setCl] = useState(""); const [hco3, setHco3] = useState(""); const [alb, setAlb] = useState("");
  let ag: number | null = null;
  let agCorrigido: number | null = null;
  if (na && cl && hco3) {
    ag = +(+na - +cl - +hco3).toFixed(1);
    if (alb) {
      agCorrigido = +(ag + 2.5 * (4 - +alb)).toFixed(1);
    }
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">AG = Na⁺ – (Cl⁻ + HCO₃⁻). Normal: 8–12 mEq/L. Corrigir pela albumina se &lt; 4 g/dL.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sódio (mEq/L)"><Num value={na} onChange={setNa} placeholder="140" /></Field>
        <Field label="Cloro (mEq/L)"><Num value={cl} onChange={setCl} placeholder="105" /></Field>
        <Field label="Bicarbonato (mEq/L)"><Num value={hco3} onChange={setHco3} placeholder="24" /></Field>
        <Field label="Albumina (g/dL) — opcional"><Num value={alb} onChange={setAlb} placeholder="4.0" step="0.1" /></Field>
      </div>
      {ag !== null && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center space-y-2">
          <p className={`text-3xl font-bold ${ag > 12 ? "text-red-600" : "text-green-600"}`}>{ag} mEq/L</p>
          <p className="text-sm text-gray-500">Ânion Gap</p>
          {agCorrigido !== null && (
            <>
              <p className={`text-xl font-bold ${agCorrigido > 12 ? "text-red-600" : "text-green-600"}`}>{agCorrigido} mEq/L</p>
              <p className="text-sm text-gray-500">AG corrigido pela albumina</p>
            </>
          )}
          <p className="text-xs text-gray-400 mt-1">AG elevado: MUDPILES (Metanol, Uremia, DKA, Propileno, Isoniazida/ferro, Lactato, Etilenoglicol, Salicilatos)</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 PSIQUIATRIA
// ═══════════════════════════════════════════════════════════════════════════════

function PHQ9Calc() {
  const questions = [
    "Pouco interesse ou prazer em fazer as coisas",
    "Sentir-se para baixo, deprimido(a) ou sem esperança",
    "Dificuldade para dormir, ou dormir demais",
    "Cansaço ou pouca energia",
    "Apetite diminuído ou comer demais",
    "Sentir-se mal consigo mesmo — se sentir um fracasso ou achar que decepcionou a família",
    "Dificuldade de concentração (ler jornal, assistir TV)",
    "Lentidão para se movimentar ou falar / agitação ou inquietude",
    "Pensamentos de que seria melhor estar morto(a) ou de se machucar de alguma forma",
  ];
  const [vals, setVals] = useState<number[]>(questions.map(() => 0));
  const score = vals.reduce((a, b) => a + b, 0);
  function cls(s: number) {
    if (s <= 4) return { l: "Depressão mínima", c: "text-green-600" };
    if (s <= 9) return { l: "Depressão leve", c: "text-yellow-600" };
    if (s <= 14) return { l: "Depressão moderada", c: "text-orange-600" };
    if (s <= 19) return { l: "Depressão moderadamente grave", c: "text-red-500" };
    return { l: "Depressão grave", c: "text-red-700" };
  }
  const c = cls(score);
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Nas últimas 2 semanas, com que frequência o(a) paciente foi incomodado(a) por:</p>
      {questions.map((q, i) => (
        <div key={i} className="space-y-1">
          <p className="text-sm text-gray-700">{i + 1}. {q}</p>
          <select className="form-input text-sm" value={vals[i]} onChange={e => { const n = [...vals]; n[i] = +e.target.value; setVals(n); }}>
            <option value={0}>Nenhuma vez (0)</option>
            <option value={1}>Vários dias (1)</option>
            <option value={2}>Mais da metade dos dias (2)</option>
            <option value={3}>Quase todos os dias (3)</option>
          </select>
        </div>
      ))}
      <ResultBox value={`${score}/27`} label={c.l} color={c.c} sub="PHQ-9 — Kroenke et al., 2001"
        condutas={score <= 4 ? ["Depressão mínima — sem tratamento específico", "Reavaliar em consulta de rotina"] : score <= 9 ? ["Considerar watchful waiting com reavaliação em 2 semanas", "Psicoterapia (TCC) como 1ª linha"] : score <= 14 ? ["Iniciar antidepressivo (ISRS 1ª linha: sertralina, escitalopram)", "Encaminhar para psicoterapia", "Reavaliar em 4–6 semanas"] : score <= 19 ? ["Antidepressivo + psicoterapia combinados", "Encaminhar ao psiquiatra", "Monitorar risco de suicídio (item 9)"] : ["Encaminhamento psiquiátrico urgente", "Avaliar necessidade de internação", "Supervisão próxima para risco de suicídio", "Antidepressivo + psicoterapia intensiva"]}
        referencias={["Kroenke K et al. J Gen Intern Med, 2001;16:606-13", "APA. Practice Guidelines for MDD, 2010"]}
      />
    </div>
  );
}

function GAD7Calc() {
  const questions = [
    "Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)",
    "Não ser capaz de impedir ou de controlar as preocupações",
    "Preocupar-se muito com diversas coisas",
    "Dificuldade para relaxar",
    "Ficar tão agitado(a) que é difícil ficar sentado(a)",
    "Ficar facilmente aborrecido(a) ou irritado(a)",
    "Sentir medo como se algo horrível pudesse acontecer",
  ];
  const [vals, setVals] = useState<number[]>(questions.map(() => 0));
  const score = vals.reduce((a, b) => a + b, 0);
  function cls(s: number) {
    if (s <= 4) return { l: "Ansiedade mínima", c: "text-green-600" };
    if (s <= 9) return { l: "Ansiedade leve", c: "text-yellow-600" };
    if (s <= 14) return { l: "Ansiedade moderada", c: "text-orange-600" };
    return { l: "Ansiedade grave", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Nas últimas 2 semanas, com que frequência o(a) paciente foi incomodado(a) por:</p>
      {questions.map((q, i) => (
        <div key={i} className="space-y-1">
          <p className="text-sm text-gray-700">{i + 1}. {q}</p>
          <select className="form-input text-sm" value={vals[i]} onChange={e => { const n = [...vals]; n[i] = +e.target.value; setVals(n); }}>
            <option value={0}>Nenhuma vez (0)</option>
            <option value={1}>Vários dias (1)</option>
            <option value={2}>Mais da metade dos dias (2)</option>
            <option value={3}>Quase todos os dias (3)</option>
          </select>
        </div>
      ))}
      <ResultBox value={`${score}/21`} label={c.l} color={c.c} sub="GAD-7 — Spitzer et al., 2006"
        condutas={score <= 4 ? ["Ansiedade mínima — sem intervenção específica", "Orientar técnicas de relaxamento e higiene do sono"] : score <= 9 ? ["Psicoterapia (TCC) como 1ª linha", "Considerar ISRS se sintomas persistentes"] : score <= 14 ? ["ISRS (sertralina, escitalopram) como 1ª linha farmacológica", "Encaminhar para psicoterapia estruturada", "Reavaliar em 4 semanas"] : ["Antidepressivo + psicoterapia combinados", "Encaminhar ao psiquiatra", "Benzodiazepínico por curto período se incapacitante (máx 2–4 sem)", "Avaliar comorbidades (depressão, abuso de substâncias)"]}
        referencias={["Spitzer RL et al. Arch Intern Med, 2006;166:1092-7", "NICE. GAD and Panic Disorder Guidelines, 2019"]}
      />
    </div>
  );
}

function CIWAArCalc() {
  const items = [
    { label: "Náusea / vômitos", max: 7 },
    { label: "Tremor", max: 7 },
    { label: "Sudorese paroxística", max: 7 },
    { label: "Ansiedade", max: 7 },
    { label: "Agitação", max: 7 },
    { label: "Distúrbios táteis (prurido, queimação, dormência, formigamento)", max: 7 },
    { label: "Distúrbios auditivos (sons mais intensos, alucinações)", max: 7 },
    { label: "Distúrbios visuais (fotossensibilidade, alucinações)", max: 7 },
    { label: "Cefaleia", max: 7 },
    { label: "Orientação / nível de consciência", max: 4 },
  ];
  const [vals, setVals] = useState<number[]>(items.map(() => 0));
  const score = vals.reduce((a, b) => a + b, 0);
  function cls(s: number) {
    if (s <= 8) return { l: "Abstinência leve — monitorar", c: "text-green-600" };
    if (s <= 15) return { l: "Abstinência moderada — considerar farmacoterapia", c: "text-yellow-600" };
    if (s <= 20) return { l: "Abstinência grave — farmacoterapia indicada", c: "text-orange-600" };
    return { l: "Abstinência muito grave — risco de delirium tremens / convulsão", c: "text-red-600" };
  }
  const c = cls(score);
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Clinical Institute Withdrawal Assessment for Alcohol. Reavaliar a cada 1–4h. Score ≥ 10 = tratar; ≥ 20 = cuidado intensivo.</p>
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <span className="flex-1 text-gray-700">{it.label}</span>
          <select className="form-input w-20 text-sm py-1" value={vals[i]} onChange={e => { const n = [...vals]; n[i] = +e.target.value; setVals(n); }}>
            {Array.from({ length: it.max + 1 }, (_, j) => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
      ))}
      <ResultBox value={score} unit="pontos" label={c.l} color={c.c} sub="CIWA-Ar — Sullivan et al., 1989"
        condutas={score <= 8 ? ["Abstinência leve — monitorar a cada 4h", "Hidratação oral + tiamina 300mg VO/dia", "Suporte nutricional"] : score <= 15 ? ["Diazepam 10mg VO ou lorazepam 2mg se hepatopatia", "Reavaliar CIWA a cada 2h", "Tiamina 300mg IV antes de glicose"] : score <= 20 ? ["Diazepam 20mg VO/IV ou lorazepam 4mg", "Reavaliar CIWA a cada 1h", "Monitorar em leito com supervisão", "Tiamina 500mg IV por 3 dias (profilaxia Wernicke)"] : ["Risco iminente de delirium tremens / convulsão", "Diazepam 20mg IV — repetir a cada 15min se necessário", "UTI ou leito com monitorização contínua", "Tiamina 500mg IV + suporte hemodinâmico", "Considerar fenobarbital se refratário a BZD"]}
        referencias={["Sullivan JT et al. Br J Addict, 1989;84:1353-7", "ASAM. Alcohol Withdrawal Management Guidelines, 2020"]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔪 CIRURGIA
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// 🔬 UROLOGIA
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// CALC MAP + MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const CALC_MAP: Record<TabId, React.ReactNode> = {
  // Geral
  imc: <IMCCalc />,
  // Cardiologia
  framingham: <FraminghamCalc />,
  chads_vasc: <CHADSVASCCalc />,
  has_bled: <HASBLEDCalc />,
  grace: <GRACECalc />,
  timi: <TIMICalc />,
  heart: <HEARTScoreCalc />,
  // Neurologia
  glasgow: <GlasgowCalc />,
  nihss: <NIHSSCalc />,
  ich_score: <ICHScoreCalc />,
  // Neurocirurgia
  hunt_hess: <HuntHessCalc />,
  fisher: <FisherCalc />,
  rankin: <RankinCalc />,
  spetzler: <SpetzlerMartinCalc />,
  wfns: <WFNSCalc />,
  // Pneumologia
  curb65: <CURB65Calc />,
  stop_bang: <STOPBangCalc />,
  rox_index: <ROXIndexCalc />,
  act_asma: <ACTCalc />,
  gina_controle: <GINAControleCalc />,
  // Vascular / TEV
  wells_tep: <WellsTEPCalc />,
  wells_tvp: <WellsTVPCalc />,
  perc: <PERCCalc />,
  caprini: <CapriniCalc />,
  // Nefrologia
  ckd_cg: <CKDCGCalc />,
  ckd_epi: <CKDEPICalc />,
  gasometria: <GasometriaCalc />,
  sodio_deficit: <SodioDeficitCalc />,
  sodio_correcao: <SodioCorrecaoCalc />,
  // UTI / Sepse
  sofa: <SOFACalc />,
  qsofa: <QSOFACalc />,
  apache2: <APACHE2Calc />,
  saps3: <SAPS3Calc />,
  // Reumatologia
  asas: <ASASCalc />,
  // Pediatria
  pecarn: <PECARNCalc />,
  apgar: <ApgarCalc />,
  dose_pediatrica: <DosePediatricaCalc />,
  holliday_segar: <HollidaySagarCalc />,
  // Obstetrícia
  dpp_naegele: <DPPNaegeleCalc />,
  bishop: <BishopCalc />,
  // Farmacologia
  qtc_bazett: <QTcBazettCalc />,
  correcao_calcio: <CorrecaoCalcioCalc />,
  anion_gap: <AnionGapCalc />,
  // Psiquiatria
  phq9: <PHQ9Calc />,
  gad7: <GAD7Calc />,
  ciwa_ar: <CIWAArCalc />,
  // Cirurgia
  asa: <ASACalc />,
  // Urologia
  psa: <PSACalc />,
};

export default function Calculadoras() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId | null>(null);
  // Item 3: todas as categorias começam fechadas
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set(CATEGORIES));

  function handleCalculatorSelect(id: TabId) {
    setTab(id);
    // Item 4: no mobile, scroll até o painel da calculadora (não para o topo)
    setTimeout(() => {
      const panel = document.getElementById('calc-panel');
      if (panel && window.innerWidth < 1024) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  function toggleCat(cat: string) {
    setCollapsedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  const currentTab = tab ? TABS.find(t => t.id === tab) : null;
  const totalCalcs = TABS.length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-6 h-6 text-brand-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Calculadoras Clínicas</h1>
      </div>
      <p className="text-sm text-gray-500 mb-5">{totalCalcs} ferramentas de apoio à decisão – atualizadas com diretrizes vigentes.</p>

      {/* Cards de links para páginas dedicadas */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Exame Físico */}
          <button
            onClick={() => navigate('/calculadoras/exame-fisico')}
            className="flex items-center gap-3 bg-white border rounded-xl p-3.5 text-left transition-all group shadow-sm hover:shadow-md cursor-pointer bg-blue-50 text-blue-700 border-blue-200"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50 text-blue-700 border-blue-200">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">🩻 Exame Físico</p>
              <p className="text-xs text-gray-500">6 sistemas · Achados</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
          </button>

          {/* Gasometria Arterial */}
          <button
            onClick={() => navigate('/calculadoras/gasometria')}
            className="flex items-center gap-3 bg-white border rounded-xl p-3.5 text-left transition-all group shadow-sm hover:shadow-md cursor-pointer bg-red-50 text-red-700 border-red-200"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50 text-red-700 border-red-200">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">🫁 Gasometria</p>
              <p className="text-xs text-gray-500">Interpretação completa</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
          </button>

          {/* Manobras Clínicas */}
          <button
            onClick={() => navigate('/calculadoras/manobras')}
            className="flex items-center gap-3 bg-white border rounded-xl p-3.5 text-left transition-all group shadow-sm hover:shadow-md cursor-pointer bg-teal-50 text-teal-700 border-teal-200"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-teal-50 text-teal-700 border-teal-200">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">🤲 Manobras</p>
              <p className="text-xs text-gray-500">20 manobras clínicas</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
          </button>

          {/* Fórum */}
          <button
            onClick={() => navigate('/forum')}
            className="flex items-center gap-3 bg-white border rounded-xl p-3.5 text-left transition-all group shadow-sm hover:shadow-md cursor-pointer bg-purple-50 text-purple-700 border-purple-200"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-50 text-purple-700 border-purple-200">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">💬 Fórum</p>
              <p className="text-xs text-gray-500">Discussões · 72h</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar nav with emojis */}
        <nav className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {CATEGORIES.map(cat => {
              const catTabs = TABS.filter(t => t.category === cat);
              const collapsed = collapsedCats.has(cat);
              return (
                <div key={cat} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => toggleCat(cat)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    <span>{cat}</span>
                    <span className="flex items-center gap-1">
                      <span className="text-[10px] font-normal text-gray-400 normal-case">{catTabs.length}</span>
                      {collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                    </span>
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
        <div id="calc-panel" className="flex-1 min-w-0">
          {tab && currentTab ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-1">{currentTab.label}</h2>
              <p className="text-xs text-gray-400 mb-4">{currentTab.category}</p>
              {CALC_MAP[tab]}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
              <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Selecione uma calculadora</p>
              <p className="text-xs text-gray-400 mt-1">Escolha uma especialidade na lista ao lado e clique na calculadora desejada.</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Calculadoras para apoio clínico. Não substituem o julgamento médico.
      </p>
    </div>
  );
}
