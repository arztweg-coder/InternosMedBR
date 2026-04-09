import { useState } from "react";
import { Plus, Printer, RotateCcw, X, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { VIA_OPTIONS } from "@/constants/examPresets";
import { todayISO, isoToBR, generateId } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import PrintHeader from "@/components/print/PrintHeader";
import PrintSignatureBlock, { type SignerRole } from "@/components/print/PrintSignatureBlock";
import type { MedicationItem } from "@/types";
import MedAutocomplete from "@/components/ui/MedAutocomplete";
import CIDSearch from "@/components/ui/CIDSearch";
import type { Medication } from "@/constants/medications";

function emptyMed(): MedicationItem {
  return { id: generateId(), via: "Oral", item: "", apresentacao: "", quantidade: "", posologia: "" };
}

const ROLE_OPTIONS: { value: SignerRole; label: string }[] = [
  { value: "interno", label: "Interno" },
  { value: "medico", label: "Médico" },
  { value: "ambos", label: "Ambos" },
  { value: "nenhum", label: "Nenhum" },
];

export default function ReceitaSimples() {
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState(todayISO());
  const [dated, setDated] = useState(false);
  const [meds, setMeds] = useState<MedicationItem[]>([emptyMed()]);
  const [cid, setCid] = useState("");
  const [cidName, setCidName] = useState("");
  const [signerRole, setSignerRole] = useState<SignerRole>("medico");

  function updateMed(id: string, field: keyof MedicationItem, value: string) {
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function removeMed(id: string) {
    if (meds.length === 1) { toast.info("Mantenha ao menos um item."); return; }
    setMeds((prev) => prev.filter((m) => m.id !== id));
  }

  function handleClear() {
    setPatientName(""); setDate(todayISO()); setDated(false); setMeds([emptyMed()]);
    setCid(""); setCidName("");
    toast.info("Receita limpa.");
  }

  function handlePrint() {
    if (!patientName.trim()) { toast.error("Informe o nome do paciente."); return; }
    if (meds.every((m) => !m.item.trim())) { toast.error("Adicione ao menos um medicamento."); return; }
    addHistoryEntry({ type: "receita_simples", label: "Receita Simples", patientName, date });
    window.print();
  }

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Receituário Simples</h1>
        <p className="text-sm text-gray-500 mb-6">Para medicamentos de uso comum sem controle especial.</p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="col-span-2 sm:col-span-1">
              <label className="form-label">Nome do Paciente</label>
              <input className="form-input" placeholder="Nome completo" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Data</label>
              <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="form-label">CID-10 <span className="font-normal text-gray-400">(opcional)</span></label>
              <CIDSearch value={cid} codeName={cidName} onSelect={(c, n) => { setCid(c); setCidName(n); }} placeholder="Buscar diagnóstico..." />
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {meds.map((med, idx) => (
              <div key={med.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                <button onClick={() => removeMed(med.id)} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-gray-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs font-semibold text-gray-500 mb-3">Item {idx + 1}</p>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div>
                    <label className="form-label text-xs">Via</label>
                    <select className="form-input text-sm" value={med.via} onChange={(e) => updateMed(med.id, "via", e.target.value)}>
                      {VIA_OPTIONS.map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="form-label text-xs">Medicamento</label>
                    <MedAutocomplete
                      value={med.item}
                      onChange={(v) => updateMed(med.id, "item", v)}
                      onSelect={(m: Medication) => {
                        updateMed(med.id, "item", m.generic);
                        if (m.presentations?.[0] && !med.apresentacao) {
                          updateMed(med.id, "apresentacao", m.presentations[0]);
                        }
                      }}
                      placeholder="Ex: Dipirona"
                      inputClassName="text-sm"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Apresentação</label>
                    <input className="form-input text-sm" placeholder="Ex: 500mg" value={med.apresentacao} onChange={(e) => updateMed(med.id, "apresentacao", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="form-label text-xs">Quantidade</label>
                    <input className="form-input text-sm" placeholder="Ex: 01 cx" value={med.quantidade} onChange={(e) => updateMed(med.id, "quantidade", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label text-xs">Posologia</label>
                    <input className="form-input text-sm" placeholder="Ex: Tomar 01 cp de 6/6h por 05 dias" value={med.posologia} onChange={(e) => updateMed(med.id, "posologia", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => setMeds((p) => [...p, emptyMed()])} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Adicionar Item
            </button>
            <button onClick={() => setDated(!dated)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${dated ? "bg-brand-green-100 border-brand-green-400 text-brand-green-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              {dated ? "✓ Com Data" : "Datar?"}
            </button>
          </div>
        </div>

        {/* Seletor de assinatura */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-brand-blue-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700">Assinatura na impressão:</span>
            <div className="flex gap-2">
              {ROLE_OPTIONS.map(o => (
                <button
                  key={o.value}
                  onClick={() => setSignerRole(o.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${signerRole === o.value ? "bg-brand-blue-600 border-brand-blue-600 text-white" : "bg-white border-gray-300 text-gray-600 hover:border-brand-blue-400"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Imprimir Receita
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-5 py-2.5 rounded-lg border border-amber-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* PRINT LAYOUT */}
      <div className="print-only print-page">
        <PrintHeader title="Prescrição Médica" />
        {dated && <p className="text-sm text-center -mt-2 mb-4">Data: {isoToBR(date)}</p>}
        <div className="flex justify-between text-sm mb-2">
          <div><span className="font-semibold">Paciente:</span> {patientName}</div>
          {cid && <div><span className="font-semibold">CID-10:</span> {cid}{cidName ? ` – ${cidName}` : ""}</div>}
        </div>
        <div className="space-y-3 mb-6">
          {meds.filter((m) => m.item).map((med, idx) => (
            <div key={med.id} className="text-sm">
              <p className="font-semibold">{idx + 1}. {med.item} {med.apresentacao} — {med.via}</p>
              {med.quantidade && <p className="ml-4">Qtd: {med.quantidade}</p>}
              {med.posologia && <p className="ml-4">{med.posologia}</p>}
            </div>
          ))}
        </div>
        <PrintSignatureBlock role={signerRole} date={isoToBR(date)} />
      </div>
    </div>
  );
}
