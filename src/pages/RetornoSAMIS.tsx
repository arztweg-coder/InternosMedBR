import { useState } from "react";
import { Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import PrintHeader from "@/components/print/PrintHeader";
import PrintSignatureBlock from "@/components/print/PrintSignatureBlock";

const DIAS_SEMANA = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const HORARIOS = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

export default function RetornoSAMIS() {
  const [patientName, setPatientName] = useState("");
  const [prontuario, setProntuario] = useState("");
  const [ambulatorio, setAmbulatorio] = useState("");
  const [medico, setMedico] = useState("");
  const [grade, setGrade] = useState("");
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");

  function handleClear() {
    setPatientName(""); setProntuario(""); setAmbulatorio("");
    setMedico(""); setGrade(""); setDia(""); setHorario("");
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (patientName.trim()) {
      addHistoryEntry({ type: "retorno", label: "Retorno Ambulatorial", patientName, date: todayISO() });
    }
    window.print();
  }

  const ViaBlock = ({ label }: { label: string }) => (
    <div className="print-page-half flex flex-col">
      <PrintHeader title={`Retorno Ambulatorial – ${label}`} />
      <div className="flex-1 text-sm space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div><p className="text-xs text-gray-500 font-semibold">PACIENTE:</p><p className="font-medium">{patientName || "________________________________________"}</p></div>
          <div><p className="text-xs text-gray-500 font-semibold">PRONTUÁRIO:</p><p className="font-medium">{prontuario || "________________"}</p></div>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs font-bold uppercase text-gray-600 mb-2">Favor agendar o retorno do paciente no ambulatório de:</p>
          <p className="font-bold text-base border-b border-gray-400 pb-1">{ambulatorio || "________________________________"}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div><p className="text-xs text-gray-500 font-semibold">MÉDICO(A):</p><p>{medico || "____________________"}</p></div>
          <div><p className="text-xs text-gray-500 font-semibold">GRADE:</p><p>{grade || "_______________"}</p></div>
          <div><p className="text-xs text-gray-500 font-semibold">DIA:</p><p>{dia || "____________________"}</p></div>
          <div><p className="text-xs text-gray-500 font-semibold">HORÁRIO:</p><p>{horario || "_______________"}</p></div>
        </div>
      </div>
      <PrintSignatureBlock date={isoToBR(todayISO())} />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Retorno Ambulatorial – SAMIS</h1>
        <p className="text-sm text-gray-500 mb-6">Agendamento de retorno para o ambulatório (2 vias). Pode imprimir em branco.</p>

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
            <div className="col-span-2">
              <label className="form-label">Ambulatório</label>
              <input className="form-input" placeholder="Ex: Cardiologia, Clínica Médica, Cirurgia Geral..." value={ambulatorio} onChange={e => setAmbulatorio(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Médico(a)</label>
              <input className="form-input" value={medico} onChange={e => setMedico(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Grade / Turno</label>
              <input className="form-input" placeholder="Ex: Manhã, Tarde" value={grade} onChange={e => setGrade(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Dia da Semana</label>
              <select className="form-input" value={dia} onChange={e => setDia(e.target.value)}>
                <option value="">Selecione...</option>
                {DIAS_SEMANA.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Horário</label>
              <select className="form-input" value={horario} onChange={e => setHorario(e.target.value)}>
                <option value="">Selecione...</option>
                {HORARIOS.map(h => <option key={h}>{h}</option>)}
              </select>
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

      <div className="print-only">
        <ViaBlock label="1ª Via – SAMIS" />
        <ViaBlock label="2ª Via – Paciente" />
      </div>
    </div>
  );
}
