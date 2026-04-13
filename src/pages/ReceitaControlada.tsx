import { useState } from "react";
import { Plus, Printer, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { VIA_OPTIONS } from "@/constants/examPresets";
import { todayISO, isoToBR, generateId } from "@/lib/utils";
import PrintHeader from "@/components/print/PrintHeader";
import PrintSignatureBlock from "@/components/print/PrintSignatureBlock";
import type { MedicationItem } from "@/types";
import MedAutocomplete from "@/components/ui/MedAutocomplete";
import CIDSearch from "@/components/ui/CIDSearch";
import type { Medication } from "@/constants/medications";

function emptyMed(): MedicationItem {
  return { id: generateId(), via: "Oral", item: "", apresentacao: "", quantidade: "", posologia: "" };
}

function PrintVia({ meds, patientName, patientAddress, date, copy, cid, cidName }: {
  meds: MedicationItem[];
  patientName: string;
  patientAddress: string;
  date: string;
  copy: number;
  cid: string;
  cidName: string;
}) {
  const filledMeds = meds.filter((m) => m.item);
  return (
    <div className="print-page-half">
      <PrintHeader title={`Prescrição de Controle Especial – ${copy}ª Via`} />
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div><span className="font-semibold">Paciente:</span> {patientName || "________________________________________"}</div>
        <div><span className="font-semibold">Data:</span> {isoToBR(date)}</div>
        {cid && <div className="col-span-2"><span className="font-semibold">CID-10:</span> {cid}{cidName ? ` – ${cidName}` : ""}</div>}
        <div className="col-span-2"><span className="font-semibold">Endereço:</span> {patientAddress || "________________________________________"}</div>
      </div>
      {filledMeds.length > 0 ? (
        <div className="space-y-2 mb-4 text-xs">
          {filledMeds.map((med, idx) => (
            <div key={med.id}>
              <p className="font-semibold">{idx + 1}. {med.item} {med.apresentacao} – {med.via}</p>
              {med.quantidade && <p className="ml-3">Qtd: {med.quantidade}</p>}
              {med.posologia && <p className="ml-3">{med.posologia}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 mb-4 mt-2">
          {[1,2,3].map(i => (
            <p key={i} className="text-xs border-b border-gray-200 pb-1">{i}. _______________________________________________</p>
          ))}
        </div>
      )}
      <PrintSignatureBlock date={isoToBR(date)} />
      <div className="mt-3 border border-dashed border-gray-400 p-2 text-xs">
        <p className="font-semibold mb-1">Identificação do Comprador ({copy}ª Via):</p>
        <p>Nome: _____________________________________ CPF: _______________</p>
        <p className="mt-1">RG: _________________ Endereço: _________________________________</p>
      </div>
    </div>
  );
}

export default function ReceitaControlada() {
  const [patientName, setPatientName] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [date, setDate] = useState(todayISO());
  const [meds, setMeds] = useState<MedicationItem[]>([emptyMed()]);
  const [cid, setCid] = useState("");
  const [cidName, setCidName] = useState("");

  function updateMed(id: string, field: keyof MedicationItem, value: string) {
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function removeMed(id: string) {
    if (meds.length === 1) { toast.info("Mantenha ao menos um item."); return; }
    setMeds((prev) => prev.filter((m) => m.id !== id));
  }

  function handleClear() {
    setPatientName("");
    setPatientAddress("");
    setDate(todayISO());
    setMeds([emptyMed()]);
    setCid(""); setCidName("");
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    // Injetar CSS landscape antes de imprimir
    const style = document.createElement('style');
    style.id = 'landscape-print-style';
    style.textContent = '@page { size: A4 landscape; margin: 0; }';
    document.head.appendChild(style);
    document.body.classList.add('receita-landscape-mode');

    window.print();

    // Restaurar após impressão
    setTimeout(() => {
      const el = document.getElementById('landscape-print-style');
      if (el) el.remove();
      document.body.classList.remove('receita-landscape-mode');
    }, 1000);
  }

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Receituário de Controle Especial</h1>
        <p className="text-sm text-gray-500 mb-6">Impresso em duas vias para medicamentos controlados. Pode imprimir em branco.</p>

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
              <label className="form-label">Endereço do Paciente <span className="font-normal text-gray-400">(opcional)</span></label>
              <input className="form-input" placeholder="Endereço completo do paciente" value={patientAddress} onChange={(e) => setPatientAddress(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="form-label">CID-10 <span className="font-normal text-gray-400">(opcional)</span></label>
              <CIDSearch value={cid} codeName={cidName} onSelect={(c, n) => { setCid(c); setCidName(n); }} placeholder="Buscar diagnóstico..." />
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {meds.map((med, idx) => (
              <div key={med.id} className="border border-amber-200 rounded-lg p-4 bg-amber-50 relative">
                <button onClick={() => removeMed(med.id)} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-amber-700 transition-colors">
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs font-semibold text-amber-700 mb-3">Item {idx + 1}</p>
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
                      placeholder="Ex: Clonazepam, Morfina..."
                      inputClassName="text-sm"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Apresentação</label>
                    <input className="form-input text-sm" placeholder="Ex: 875+125mg" value={med.apresentacao} onChange={(e) => updateMed(med.id, "apresentacao", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="form-label text-xs">Quantidade</label>
                    <input className="form-input text-sm" placeholder="Ex: 28 cp" value={med.quantidade} onChange={(e) => updateMed(med.id, "quantidade", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label text-xs">Posologia</label>
                    <input className="form-input text-sm" placeholder="Ex: Tomar 01 cp de 12/12h por 07 dias" value={med.posologia} onChange={(e) => updateMed(med.id, "posologia", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setMeds((p) => [...p, emptyMed()])} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Adicionar Novo Item
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Gerar e Imprimir (2 Vias)
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-5 py-2.5 rounded-lg border border-amber-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar e Nova Receita
          </button>
        </div>
      </div>

      {/* PRINT: 2 vias */}
      <div className="print-only">
        <PrintVia meds={meds} patientName={patientName} patientAddress={patientAddress} date={date} copy={1} cid={cid} cidName={cidName} />
        <PrintVia meds={meds} patientName={patientName} patientAddress={patientAddress} date={date} copy={2} cid={cid} cidName={cidName} />
      </div>
    </div>
  );
}
