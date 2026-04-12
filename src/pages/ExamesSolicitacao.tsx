import { useState } from "react";
import { Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { ROUTINE_PRESETS, SURGICAL_PRESETS, type ExamPreset } from "@/constants/examPresets";
import { todayISO, isoToBR } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import PrintHeader from "@/components/print/PrintHeader";
import PrintSignatureBlock from "@/components/print/PrintSignatureBlock";

export default function ExamesSolicitacao() {
  const [tab, setTab] = useState<"rotina" | "cirurgico">("rotina");
  const [activePresets, setActivePresets] = useState<string[]>([]);
  const [patientName, setPatientName] = useState("");
  const [patientSex, setPatientSex] = useState<"M"|"F"|"">("");
  const [patientDOB, setPatientDOB] = useState("");
  const [motherName, setMotherName] = useState("");
  const [prontuario, setProntuario] = useState("");
  const [ward, setWard] = useState("");
  const [bed, setBed] = useState("");
  const [examsText, setExamsText] = useState("");
  const [indication, setIndication] = useState("");
  const [date, setDate] = useState(todayISO());

  const presets = tab === "rotina" ? ROUTINE_PRESETS : SURGICAL_PRESETS;

  function togglePreset(preset: ExamPreset) {
    const isActive = activePresets.includes(preset.id);
    if (isActive) {
      setActivePresets((prev) => prev.filter((p) => p !== preset.id));
      const lines = examsText.split("\n").filter((l) => !preset.exams.includes(l.trim()));
      setExamsText(lines.join("\n").trim());
    } else {
      setActivePresets((prev) => [...prev, preset.id]);
      const current = examsText.trim();
      const newExams = preset.exams.join("\n");
      setExamsText(current ? `${current}\n${newExams}` : newExams);
    }
  }

  function handleClear() {
    setActivePresets([]);
    setPatientName(""); setPatientSex(""); setPatientDOB(""); setMotherName("");
    setProntuario(""); setWard(""); setBed(""); setExamsText(""); setIndication(""); setDate(todayISO());
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (patientName.trim()) {
      addHistoryEntry({ type: "exames", label: "Pedido de Exames", patientName, date });
    }
    window.print();
  }

  const examsList = examsText.split("\n").filter((l) => l.trim());

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Pedido de Exames</h1>
        <p className="text-sm text-gray-500 mb-6">Selecione os perfis ou adicione exames manualmente. Pode imprimir em branco.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["rotina", "cirurgico"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setActivePresets([]); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t
                  ? "bg-brand-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-blue-300"
              }`}
            >
              {t === "rotina" ? "Exames de Rotina" : "Risco Cirúrgico / Pré-op"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            <div className="col-span-2 sm:col-span-2">
              <label className="form-label">Nome do Paciente</label>
              <input className="form-input" placeholder="Nome completo" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Sexo</label>
              <select className="form-input" value={patientSex} onChange={e => setPatientSex(e.target.value as "M"|"F"|"")}>
                <option value="">—</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <label className="form-label">Data de Nascimento</label>
              <input type="date" className="form-input" value={patientDOB} onChange={e => setPatientDOB(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="form-label">Nome da Mãe</label>
              <input className="form-input" placeholder="Nome da mãe" value={motherName} onChange={e => setMotherName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Prontuário / Nº Atendimento</label>
              <input className="form-input" placeholder="Nº prontuário" value={prontuario} onChange={(e) => setProntuario(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Setor de Origem</label>
              <input className="form-input" placeholder="Ex: 3B, UTI..." value={ward} onChange={(e) => setWard(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Nº do Leito</label>
              <input className="form-input" placeholder="Ex: 12" value={bed} onChange={(e) => setBed(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Data da Solicitação</label>
              <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <p className="form-label mb-2">Adicionar Perfis Comuns:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => togglePreset(preset)}
                  className={`exam-tag ${activePresets.includes(preset.id) ? "active" : "inactive"}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Exames Solicitados <span className="text-gray-400 font-normal">(um por linha)</span></label>
            <textarea
              className="form-textarea"
              rows={6}
              placeholder={"Hemograma completo\nGlicemia de jejum\n..."}
              value={examsText}
              onChange={(e) => setExamsText(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Indicação Clínica</label>
            <textarea className="form-textarea" rows={2} placeholder="Diagnóstico / hipótese diagnóstica..." value={indication} onChange={(e) => setIndication(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Imprimir Pedido
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* PRINT LAYOUT – 2 vias */}
      <div className="print-only">
        {[1, 2].map((via) => (
          <div key={via} className="print-page-half">
            <PrintHeader title="Pedido de Exames" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs mb-2">
              <div className="col-span-2">
                <span className="font-semibold">Nome do paciente:</span> {patientName || "________________________________________"}
                {patientSex ? <span> · Sexo: {patientSex === "M" ? "( X ) Masculino  (   ) Feminino" : "(   ) Masculino  ( X ) Feminino"}</span> : <span> · Sexo: (   ) Masculino  (   ) Feminino</span>}
              </div>
              <div><span className="font-semibold">Data de nascimento:</span> {patientDOB ? isoToBR(patientDOB) : "___/___/______"}</div>
              <div className="col-span-2"><span className="font-semibold">Nome da mãe:</span> {motherName || "________________________________________"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs border border-gray-300 rounded p-1.5 mb-2">
              <div><p className="text-gray-500 text-xs">Prontuário / Nº Atend.</p><p>{prontuario || "___________"}</p></div>
              <div><p className="text-gray-500 text-xs">Setor de Origem</p><p>{ward || "___________"}</p></div>
              <div><p className="text-gray-500 text-xs">Nº do Leito</p><p>{bed || "________"}</p></div>
            </div>
            <div className="mb-2">
              <p className="font-semibold text-xs mb-1 border-b border-gray-300 pb-0.5">Exames Solicitados:</p>
              {examsList.length > 0 ? (
                <ol className="list-decimal list-inside space-y-0.5 text-xs">
                  {examsList.map((ex, i) => <li key={i}>{ex}</li>)}
                </ol>
              ) : (
                <div className="space-y-2 mt-2">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <p key={i} className="text-xs border-b border-gray-200 pb-1">{i}. _______________________________________________</p>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-2 text-xs">
              <p className="font-semibold">Indicação Clínica:</p>
              <p>{indication || "_______________________________________________"}</p>
            </div>
            <div className="text-xs"><span className="font-semibold">Data da Solicitação:</span> {isoToBR(date)}</div>
            <PrintSignatureBlock date={isoToBR(date)} />
          </div>
        ))}
      </div>
    </div>
  );
}
