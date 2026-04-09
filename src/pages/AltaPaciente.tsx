import { useState } from "react";
import { Printer, RotateCcw, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import { getStamp } from "@/lib/stamp";
import PrintHeader from "@/components/print/PrintHeader";
import PrintSignatureBlock, { type SignerRole } from "@/components/print/PrintSignatureBlock";
import CIDSearch from "@/components/ui/CIDSearch";

const ROLE_OPTIONS: { value: SignerRole; label: string }[] = [
  { value: "interno", label: "Interno" },
  { value: "medico", label: "Médico" },
  { value: "ambos", label: "Ambos" },
];

export default function AltaPaciente() {
  const [patientName, setPatientName] = useState("");
  const [patientDOB, setPatientDOB] = useState("");
  const [prontuario, setProntuario] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [dischargeDate, setDischargeDate] = useState(todayISO());
  const [diagnosis, setDiagnosis] = useState("");
  const [cid, setCid] = useState("");
  const [cidName, setCidName] = useState("");
  const [procedures, setProcedures] = useState("");
  const [medications, setMedications] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [observations, setObservations] = useState("");
  const [signerRole, setSignerRole] = useState<SignerRole>("medico");

  function handleClear() {
    setPatientName(""); setPatientDOB(""); setProntuario("");
    setAdmissionDate(""); setDischargeDate(todayISO());
    setDiagnosis(""); setCid(""); setCidName(""); setProcedures("");
    setMedications(""); setFollowUp(""); setRestrictions("");
    setReturnDate(""); setObservations("");
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!patientName.trim()) { toast.error("Informe o nome do paciente."); return; }
    if (!diagnosis.trim()) { toast.error("Informe o diagnóstico de alta."); return; }
    addHistoryEntry({ type: "alta", label: "Alta Hospitalar", patientName, date: dischargeDate });
    window.print();
  }

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Resumo de Alta Hospitalar</h1>
        <p className="text-sm text-gray-500 mb-6">Preencha os dados para gerar o documento de alta.</p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Identificação do Paciente</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="col-span-2 sm:col-span-2">
                <label className="form-label">Nome do Paciente</label>
                <input className="form-input" placeholder="Nome completo" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Nascimento</label>
                <input type="date" className="form-input" value={patientDOB} onChange={(e) => setPatientDOB(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Prontuário</label>
                <input className="form-input" placeholder="Nº prontuário" value={prontuario} onChange={(e) => setProntuario(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Internação</label>
                <input type="date" className="form-input" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Alta</label>
                <input type="date" className="form-input" value={dischargeDate} onChange={(e) => setDischargeDate(e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Diagnóstico e Procedimentos</h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Diagnóstico Principal</label>
                <input className="form-input" placeholder="Diagnóstico de alta" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CID-10</label>
                <CIDSearch value={cid} codeName={cidName} onSelect={(code, name) => { setCid(code); setCidName(name); }} />
              </div>
              <div>
                <label className="form-label">Procedimentos Realizados</label>
                <textarea className="form-textarea" rows={3} placeholder="Liste os procedimentos realizados durante a internação..." value={procedures} onChange={(e) => setProcedures(e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Orientações de Alta</h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Medicações em Uso</label>
                <textarea className="form-textarea" rows={4} placeholder={"1. Dipirona 500mg – 01 cp de 6/6h se dor ou febre\n2. ..."} value={medications} onChange={(e) => setMedications(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Restrições / Orientações</label>
                <textarea className="form-textarea" rows={2} placeholder="Repouso relativo, dieta leve, hidratação..." value={restrictions} onChange={(e) => setRestrictions(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Acompanhamento / Encaminhamento</label>
                <textarea className="form-textarea" rows={2} placeholder="Retornar ao ambulatório de Clínica Médica em..." value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Retorno</label>
                <input type="date" className="form-input w-48" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Observações</label>
                <textarea className="form-textarea" rows={2} placeholder="Observações adicionais..." value={observations} onChange={(e) => setObservations(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Seletor de assinatura */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-brand-blue-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700">Assinatura na impressão:</span>
            <div className="flex gap-2">
              {ROLE_OPTIONS.map(o => (
                <button key={o.value} onClick={() => setSignerRole(o.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${signerRole === o.value ? "bg-brand-blue-600 border-brand-blue-600 text-white" : "bg-white border-gray-300 text-gray-600 hover:border-brand-blue-400"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Imprimir Alta
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* PRINT */}
      <div className="print-only print-page">
        <PrintHeader title="Resumo de Alta Hospitalar" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-4 border-b border-gray-300 pb-3">
          <div><span className="font-semibold">Paciente:</span> {patientName}</div>
          {patientDOB && <div><span className="font-semibold">DN:</span> {isoToBR(patientDOB)}</div>}
          {prontuario && <div><span className="font-semibold">Prontuário:</span> {prontuario}</div>}
          {admissionDate && <div><span className="font-semibold">Internação:</span> {isoToBR(admissionDate)}</div>}
          <div><span className="font-semibold">Alta:</span> {isoToBR(dischargeDate)}</div>
        </div>
        {diagnosis && (
          <div className="mb-3 text-sm">
            <p className="font-semibold mb-1">Diagnóstico: <span className="font-normal">{diagnosis} {cid ? `(CID: ${cid}${cidName ? ` – ${cidName}` : ""})` : ""}</span></p>
          </div>
        )}
        {procedures && <div className="mb-3 text-sm"><p className="font-semibold mb-1">Procedimentos Realizados:</p><p className="whitespace-pre-line">{procedures}</p></div>}
        {medications && <div className="mb-3 text-sm"><p className="font-semibold mb-1">Medicações em Uso:</p><p className="whitespace-pre-line">{medications}</p></div>}
        {restrictions && <div className="mb-3 text-sm"><p className="font-semibold mb-1">Orientações / Restrições:</p><p className="whitespace-pre-line">{restrictions}</p></div>}
        {followUp && <div className="mb-3 text-sm"><p className="font-semibold mb-1">Acompanhamento:</p><p>{followUp}</p></div>}
        {returnDate && <div className="mb-3 text-sm"><p className="font-semibold">Retorno: <span className="font-normal">{isoToBR(returnDate)}</span></p></div>}
        {observations && <div className="mb-3 text-sm"><p className="font-semibold mb-1">Observações:</p><p>{observations}</p></div>}
        <PrintSignatureBlock role={signerRole} date={isoToBR(dischargeDate)} />
      </div>
    </div>
  );
}
