import { useState } from "react";
import { Printer, RotateCcw, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import { getStamp } from "@/lib/stamp";
import PrintHeader from "@/components/print/PrintHeader";
import PrintSignatureBlock, { type SignerRole } from "@/components/print/PrintSignatureBlock";

const ROLE_OPTIONS: { value: SignerRole; label: string }[] = [
  { value: "interno", label: "Interno" },
  { value: "medico", label: "Médico" },
  { value: "ambos", label: "Ambos" },
  { value: "nenhum", label: "Nenhum" },
];

export default function Encaminhamento() {
  const [patientName, setPatientName] = useState("");
  const [prontuario, setProntuario] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [destination, setDestination] = useState("");
  const [justification, setJustification] = useState("");
  const [date, setDate] = useState(todayISO());
  const [signerRole, setSignerRole] = useState<SignerRole>("medico");

  function handleClear() {
    setPatientName(""); setProntuario(""); setSpecialty("");
    setDestination(""); setJustification(""); setDate(todayISO());
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!patientName.trim()) { toast.error("Informe o nome do paciente."); return; }
    if (!destination.trim()) { toast.error("Informe o serviço de encaminhamento."); return; }
    addHistoryEntry({ type: "encaminhamento", label: "Encaminhamento", patientName, date });
    window.print();
  }

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Ficha de Encaminhamento para Interconsulta</h1>
        <p className="text-sm text-gray-500 mb-6">Impresso em duas vias para solicitação de interconsulta.</p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="form-label">Nome do Paciente</label>
              <input className="form-input" placeholder="Nome completo" value={patientName} onChange={e => setPatientName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Nº Prontuário</label>
              <input className="form-input" placeholder="Nº prontuário" value={prontuario} onChange={e => setProntuario(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Especialidade de Origem</label>
              <input className="form-input" placeholder="Ex: Clínica Médica" value={specialty} onChange={e => setSpecialty(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Encaminhamento ao Serviço de</label>
              <input className="form-input" placeholder="Ex: Cardiologia, Nefrologia..." value={destination} onChange={e => setDestination(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Data</label>
              <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="form-label">Justificativa</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Descreva o motivo do encaminhamento, história clínica resumida, hipótese diagnóstica..."
              value={justification}
              onChange={e => setJustification(e.target.value)}
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
            <Printer className="w-4 h-4" /> Imprimir (2 Vias)
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* PRINT – 2 vias */}
      <div className="print-only">
        {[1, 2].map((via) => (
          <div key={via} className="print-page-half">
            <PrintHeader title="Ficha de Encaminhamento para Interconsulta" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
              <div><span className="font-semibold">Especialidade de Origem:</span> <span>{specialty || "________________________"}</span></div>
              <div><span className="font-semibold">Nº Prontuário:</span> <span>{prontuario || "_______________"}</span></div>
              <div className="col-span-2"><span className="font-semibold">Nome:</span> <span>{patientName}</span></div>
            </div>
            <div className="text-xs mb-2">
              <span className="font-semibold">Encaminhamento ao Serviço de:</span> <span>{destination}</span>
            </div>
            <div className="text-xs mb-3">
              <p className="font-semibold mb-1">Justificativa:</p>
              <p className="whitespace-pre-line min-h-[60px] border-b border-gray-300 pb-2">{justification}</p>
            </div>
            <div className="text-xs mb-2"><span className="font-semibold">Data:</span> {isoToBR(date)}</div>
            <PrintSignatureBlock role={signerRole} date={isoToBR(date)} columns={signerRole === "ambos"} />
          </div>
        ))}
      </div>
    </div>
  );
}
