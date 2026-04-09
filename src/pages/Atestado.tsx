import { useState } from "react";
import { Printer, RotateCcw, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import CIDSearch from "@/components/ui/CIDSearch";
import PrintHeader from "@/components/print/PrintHeader";
import PrintSignatureBlock, { type SignerRole } from "@/components/print/PrintSignatureBlock";

const ROLE_OPTIONS: { value: SignerRole; label: string }[] = [
  { value: "interno", label: "Interno" },
  { value: "medico", label: "Médico" },
  { value: "ambos", label: "Ambos" },
];

export default function Atestado() {
  const [patientName, setPatientName] = useState("");
  const [patientDoc, setPatientDoc] = useState("");
  const [cid, setCid] = useState("");
  const [cidName, setCidName] = useState("");
  const [days, setDays] = useState(1);
  const [startDate, setStartDate] = useState(todayISO());
  const [issueDate, setIssueDate] = useState(todayISO());
  const [customText, setCustomText] = useState("");
  const [signerRole, setSignerRole] = useState<SignerRole>("medico");

  function getGeneratedText() {
    const cidDisplay = cid ? `(CID: ${cid})` : "(CID: _____)";
    const daysWord = days === 1 ? "01 (um) dia" : `${String(days).padStart(2, "0")} (${days}) dias`;
    return `A pedido do(a) interessado(a), ${patientName || "________________________"}, portador(a) do documento de identidade e/ou CPF nº ${patientDoc || "________________________"}, e na qualidade de seu médico assistente, atesto, para os devidos fins, que o(a) mesmo(a), por motivos de doença ${cidDisplay}, ficou (ou estará) impossibilitado(a) de exercer suas atividades durante ${daysWord} a partir de ${isoToBR(startDate)}.`;
  }

  function handleClear() {
    setPatientName(""); setPatientDoc(""); setCid(""); setCidName("");
    setDays(1); setStartDate(todayISO()); setIssueDate(todayISO()); setCustomText("");
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!patientName.trim()) { toast.error("Informe o nome do paciente."); return; }
    addHistoryEntry({ type: "atestado", label: "Atestado Médico", patientName, date: issueDate });
    window.print();
  }

  const text = customText || getGeneratedText();

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Atestado Médico</h1>
        <p className="text-sm text-gray-500 mb-6">Gere atestados de afastamento com CID.</p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="form-label">Nome do Paciente</label>
              <input className="form-input" placeholder="Nome completo" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Nº Identidade e/ou CPF</label>
              <input className="form-input" placeholder="000.000.000-00" value={patientDoc} onChange={(e) => setPatientDoc(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="form-label">CID-10 <span className="font-normal text-gray-400">(banco de dados em português disponível)</span></label>
            <CIDSearch
              value={cid}
              codeName={cidName}
              onSelect={(code, name) => { setCid(code); setCidName(name); }}
              placeholder="Pesquisar por código ou nome..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="form-label">Dias de Afastamento</label>
              <input type="number" min={1} max={365} className="form-input" value={days} onChange={(e) => setDays(Number(e.target.value))} />
            </div>
            <div>
              <label className="form-label">Início do Afastamento</label>
              <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Data de Emissão</label>
              <input type="date" className="form-input" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="form-label">Texto do Atestado <span className="font-normal text-gray-400">(editável)</span></label>
            <textarea
              className="form-textarea font-serif text-sm"
              rows={6}
              value={customText || getGeneratedText()}
              onChange={(e) => setCustomText(e.target.value)}
            />
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
            <Printer className="w-4 h-4" /> Imprimir Atestado
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* PRINT */}
      <div className="print-only print-page">
        <PrintHeader title="Atestado Médico" />
        <p className="text-sm font-serif leading-relaxed text-justify mb-8">{text}</p>
        <PrintSignatureBlock role={signerRole} date={isoToBR(issueDate)} />
      </div>
    </div>
  );
}
