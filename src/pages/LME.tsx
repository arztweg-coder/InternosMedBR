
import { useState } from "react";
import { Printer, RotateCcw, Plus, X, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR, generateId } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import { getStamp } from "@/lib/stamp";
import PrintHeader from "@/components/print/PrintHeader";
import PrintSignatureBlock, { type SignerRole } from "@/components/print/PrintSignatureBlock";
import type { LMEMedItem } from "@/types";

const ROLE_OPTIONS: { value: SignerRole; label: string }[] = [
  { value: "interno", label: "Interno" },
  { value: "medico", label: "Médico" },
  { value: "ambos", label: "Ambos" },
];

function emptyMed(): LMEMedItem {
  return { id: generateId(), nome: "", qtd1: "", qtd2: "", qtd3: "", qtd4: "", qtd5: "", qtd6: "" };
}

export default function LME() {
  const stamp = getStamp();
  // Patient
  const [patientName, setPatientName] = useState("");
  const [patientDOB, setPatientDOB] = useState("");
  const [cns, setCns] = useState("");
  const [cpf, setCpf] = useState("");
  const [motherName, setMotherName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  // Diagnosis
  const [cid, setCid] = useState("");
  const [cidName, setCidName] = useState("");
  // Medications
  const [meds, setMeds] = useState<LMEMedItem[]>([emptyMed()]);
  // Clinical
  const [anamnese, setAnamnese] = useState("");
  const [previousTreatment, setPreviousTreatment] = useState("");
  const [hasPreviousTreatment, setHasPreviousTreatment] = useState<"nao" | "sim">("nao");
  const [incapable, setIncapable] = useState<"nao" | "sim">("nao");
  const [responsibleName, setResponsibleName] = useState("");
  // Doctor
  const [doctorName, setDoctorName] = useState(stamp.name || "");
  const [doctorCRM, setDoctorCRM] = useState(stamp.crm || "");
  const [doctorDoc, setDoctorDoc] = useState("");
  const [doctorDocType, setDoctorDocType] = useState<"CNS" | "CPF">("CPF");
  const [date, setDate] = useState(todayISO());
  // Patient responsible
  const [patientDoc, setPatientDoc] = useState("");
  const [patientDocType, setPatientDocType] = useState<"CPF" | "CNS">("CPF");
  const [patientEmail, setPatientEmail] = useState("");
  const [respSignature, setRespSignature] = useState("");
  const [signerRole, setSignerRole] = useState<SignerRole>("medico");

  function updateMed(id: string, field: keyof LMEMedItem, value: string) {
    setMeds(p => p.map(m => m.id === id ? { ...m, [field]: value } : m));
  }
  function removeMed(id: string) {
    if (meds.length === 1) { toast.info("Mantenha ao menos um medicamento."); return; }
    setMeds(p => p.filter(m => m.id !== id));
  }

  function handleClear() {
    setPatientName(""); setPatientDOB(""); setCns(""); setCpf("");
    setMotherName(""); setAddress(""); setCity(""); setPhone("");
    setWeight(""); setHeight(""); setCid(""); setCidName("");
    setMeds([emptyMed()]); setAnamnese(""); setPreviousTreatment("");
    setHasPreviousTreatment("nao"); setIncapable("nao"); setResponsibleName("");
    setDoctorName(stamp?.name || ""); setDoctorCRM(stamp?.crm || ""); // Changed from 'user' to 'stamp'
    setDoctorDoc(""); setDate(todayISO()); setPatientDoc(""); setPatientEmail(""); setRespSignature("");
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!patientName.trim()) { toast.error("Informe o nome do paciente."); return; }
    if (meds.every(m => !m.nome.trim())) { toast.error("Informe ao menos um medicamento."); return; }
    addHistoryEntry({ type: "lme", label: "LME", patientName, date });
    window.print();
  }

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">LME – Laudo Médico Especializado</h1>
        <p className="text-sm text-gray-500 mb-6">Solicitação de medicamentos de dispensação especial pelo SUS (CEAF).</p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4 space-y-5">
          {/* Paciente */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Dados do Paciente</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="form-label">Nome do Paciente</label>
                <input className="form-input" placeholder="Nome completo" value={patientName} onChange={e => setPatientName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Nascimento</label>
                <input type="date" className="form-input" value={patientDOB} onChange={e => setPatientDOB(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CNS</label>
                <input className="form-input" placeholder="Cartão Nacional de Saúde" value={cns} onChange={e => setCns(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CPF</label>
                <input className="form-input" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Nome da Mãe</label>
                <input className="form-input" placeholder="Nome completo da mãe" value={motherName} onChange={e => setMotherName(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Endereço</label>
                <input className="form-input" placeholder="Rua, Nº, Bairro" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Município</label>
                <input className="form-input" placeholder="Goiânia" value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Telefone</label>
                <input className="form-input" placeholder="(62) 00000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Peso (kg)</label>
                <input className="form-input" placeholder="Ex: 70" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Altura (cm)</label>
                <input className="form-input" placeholder="Ex: 170" value={height} onChange={e => setHeight(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Diagnóstico */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Diagnóstico</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">CID-10</label>
                <input className="form-input" placeholder="Ex: E11.0" value={cid} onChange={e => setCid(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Nome da Doença</label>
                <input className="form-input" placeholder="Diagnóstico principal" value={cidName} onChange={e => setCidName(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Medicamentos */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Medicamentos Solicitados</h3>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border border-gray-300 px-2 py-1.5 text-left">Medicamento</th>
                    <th className="border border-gray-300 px-2 py-1.5 w-14">1º mês</th>
                    <th className="border border-gray-300 px-2 py-1.5 w-14">2º mês</th>
                    <th className="border border-gray-300 px-2 py-1.5 w-14">3º mês</th>
                    <th className="border border-gray-300 px-2 py-1.5 w-14">4º mês</th>
                    <th className="border border-gray-300 px-2 py-1.5 w-14">5º mês</th>
                    <th className="border border-gray-300 px-2 py-1.5 w-14">6º mês</th>
                    <th className="border border-gray-300 px-1 py-1.5 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {meds.map((med, idx) => (
                    <tr key={med.id}>
                      <td className="border border-gray-300 px-1 py-1">
                        <input className="w-full text-xs px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-blue-400 rounded" placeholder={`Medicamento ${idx + 1}`} value={med.nome} onChange={e => updateMed(med.id, "nome", e.target.value)} />
                      </td>
                      {(["qtd1","qtd2","qtd3","qtd4","qtd5","qtd6"] as const).map(q => (
                        <td key={q} className="border border-gray-300 px-1 py-1">
                          <input className="w-full text-xs text-center px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-blue-400 rounded" placeholder="0" value={med[q]} onChange={e => updateMed(med.id, q, e.target.value)} />
                        </td>
                      ))}
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        <button onClick={() => removeMed(med.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setMeds(p => [...p, emptyMed()])} className="flex items-center gap-1.5 text-sm text-brand-blue-600 hover:text-brand-blue-800 font-medium">
              <Plus className="w-4 h-4" /> Adicionar medicamento
            </button>
          </div>

          {/* Anamnese */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Anamnese e Tratamento Prévio</h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">11 – Anamnese</label>
                <textarea className="form-textarea" rows={4} placeholder="Descreva a história clínica do paciente..." value={anamnese} onChange={e => setAnamnese(e.target.value)} />
              </div>
              <div>
                <label className="form-label">12 – Paciente realizou tratamento prévio ou está em tratamento?</label>
                <div className="flex gap-4 mt-1">
                  {(["nao","sim"] as const).map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="prevTreat" value={v} checked={hasPreviousTreatment === v} onChange={() => setHasPreviousTreatment(v)} className="accent-brand-blue-600" />
                      <span className="text-sm font-medium">{v === "nao" ? "NÃO" : "SIM"}</span>
                    </label>
                  ))}
                </div>
                {hasPreviousTreatment === "sim" && (
                  <textarea className="form-textarea mt-2" rows={3} placeholder="Relatar tratamentos anteriores e resultados..." value={previousTreatment} onChange={e => setPreviousTreatment(e.target.value)} />
                )}
              </div>
              <div>
                <label className="form-label">13 – Atestado de capacidade</label>
                <p className="text-xs text-gray-500 mb-2">O paciente é considerado incapaz (Art. 3º e 4º do Código Civil)?</p>
                <div className="flex gap-4">
                  {(["nao","sim"] as const).map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="incapable" value={v} checked={incapable === v} onChange={() => setIncapable(v)} className="accent-brand-blue-600" />
                      <span className="text-sm font-medium">{v === "nao" ? "NÃO" : "SIM"}</span>
                    </label>
                  ))}
                </div>
                {incapable === "sim" && (
                  <div className="mt-2">
                    <label className="form-label">Nome do responsável pelo paciente</label>
                    <input className="form-input" placeholder="Nome completo do responsável" value={responsibleName} onChange={e => setResponsibleName(e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Médico */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">17 – Dados do Médico Solicitante</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Nome do Médico</label>
                <input className="form-input" value={doctorName} onChange={e => setDoctorName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CRM</label>
                <input className="form-input" placeholder="GO-000000" value={doctorCRM} onChange={e => setDoctorCRM(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Tipo de documento</label>
                <select className="form-input" value={doctorDocType} onChange={e => setDoctorDocType(e.target.value as "CNS"|"CPF")}>
                  <option value="CPF">CPF</option>
                  <option value="CNS">CNS</option>
                </select>
              </div>
              <div>
                <label className="form-label">Nº do documento</label>
                <input className="form-input" placeholder={doctorDocType === "CPF" ? "000.000.000-00" : "Cartão Nacional de Saúde"} value={doctorDoc} onChange={e => setDoctorDoc(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data</label>
                <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Paciente / Responsável */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">21–23 – Dados do Paciente/Responsável</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Tipo de documento (paciente)</label>
                <select className="form-input" value={patientDocType} onChange={e => setPatientDocType(e.target.value as "CPF"|"CNS")}>
                  <option value="CPF">CPF</option>
                  <option value="CNS">CNS</option>
                </select>
              </div>
              <div>
                <label className="form-label">Nº do documento (paciente)</label>
                <input className="form-input" placeholder="Número do documento" value={patientDoc} onChange={e => setPatientDoc(e.target.value)} />
              </div>
              <div>
                <label className="form-label">E-mail do paciente</label>
                <input className="form-input" placeholder="email@exemplo.com" value={patientEmail} onChange={e => setPatientEmail(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Assinatura do responsável</label>
                <input className="form-input" placeholder="Nome completo do responsável pelo preenchimento" value={respSignature} onChange={e => setRespSignature(e.target.value)} />
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
            <Printer className="w-4 h-4" /> Imprimir LME
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* PRINT */}
      <div className="print-only print-page">
        <PrintHeader title="Laudo para Solicitação/Renovação de Medicamento – LME" />

        {/* Paciente */}
        <div className="border border-gray-400 rounded p-2 mb-2 text-xs">
          <p className="font-bold mb-1 uppercase text-xs border-b border-gray-300 pb-0.5">Identificação do Paciente</p>
          <div className="grid grid-cols-3 gap-1">
            <div className="col-span-2"><span className="font-semibold">Nome:</span> {patientName}</div>
            <div><span className="font-semibold">DN:</span> {patientDOB ? isoToBR(patientDOB) : "___/___/______"}</div>
            <div><span className="font-semibold">CNS:</span> {cns || "__________________"}</div>
            <div><span className="font-semibold">CPF:</span> {cpf || "___.___.___-__"}</div>
            {phone && <div><span className="font-semibold">Tel:</span> {phone}</div>}
            {motherName && <div className="col-span-2"><span className="font-semibold">Mãe:</span> {motherName}</div>}
            {address && <div className="col-span-3"><span className="font-semibold">End.:</span> {address}{city ? ` – ${city}` : ""}</div>}
            {weight && <div><span className="font-semibold">Peso:</span> {weight} kg</div>}
            {height && <div><span className="font-semibold">Altura:</span> {height} cm</div>}
          </div>
        </div>

        {/* CID */}
        <div className="border border-gray-400 rounded p-2 mb-2 text-xs">
          <p className="font-bold mb-1 uppercase text-xs border-b border-gray-300 pb-0.5">Diagnóstico</p>
          <p><span className="font-semibold">CID-10:</span> {cid} {cidName && `– ${cidName}`}</p>
        </div>

        {/* Medicamentos */}
        <div className="border border-gray-400 rounded p-2 mb-2 text-xs">
          <p className="font-bold mb-1 uppercase text-xs border-b border-gray-300 pb-0.5">Medicamentos Solicitados – Quantidade por mês</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-1 py-0.5 text-left">Medicamento</th>
                <th className="border border-gray-300 px-1 py-0.5 w-10 text-center">1º</th>
                <th className="border border-gray-300 px-1 py-0.5 w-10 text-center">2º</th>
                <th className="border border-gray-300 px-1 py-0.5 w-10 text-center">3º</th>
                <th className="border border-gray-300 px-1 py-0.5 w-10 text-center">4º</th>
                <th className="border border-gray-300 px-1 py-0.5 w-10 text-center">5º</th>
                <th className="border border-gray-300 px-1 py-0.5 w-10 text-center">6º</th>
              </tr>
            </thead>
            <tbody>
              {meds.filter(m => m.nome).map((med, i) => (
                <tr key={med.id}>
                  <td className="border border-gray-300 px-1 py-0.5">{i + 1}. {med.nome}</td>
                  <td className="border border-gray-300 px-1 py-0.5 text-center">{med.qtd1 || "—"}</td>
                  <td className="border border-gray-300 px-1 py-0.5 text-center">{med.qtd2 || "—"}</td>
                  <td className="border border-gray-300 px-1 py-0.5 text-center">{med.qtd3 || "—"}</td>
                  <td className="border border-gray-300 px-1 py-0.5 text-center">{med.qtd4 || "—"}</td>
                  <td className="border border-gray-300 px-1 py-0.5 text-center">{med.qtd5 || "—"}</td>
                  <td className="border border-gray-300 px-1 py-0.5 text-center">{med.qtd6 || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Anamnese */}
        {anamnese && (
          <div className="border border-gray-400 rounded p-2 mb-2 text-xs">
            <p className="font-bold mb-1 uppercase text-xs border-b border-gray-300 pb-0.5">11 – Anamnese</p>
            <p className="whitespace-pre-line">{anamnese}</p>
          </div>
        )}

        {/* Tratamento prévio */}
        <div className="border border-gray-400 rounded p-2 mb-2 text-xs">
          <p className="font-bold mb-1 uppercase text-xs border-b border-gray-300 pb-0.5">12 – Tratamento Prévio</p>
          <p>{hasPreviousTreatment === "nao" ? "NÃO realizou tratamento prévio." : `SIM. ${previousTreatment}`}</p>
        </div>

        {/* Capacidade */}
        <div className="border border-gray-400 rounded p-2 mb-2 text-xs">
          <p className="font-bold mb-1 uppercase text-xs border-b border-gray-300 pb-0.5">13 – Atestado de Capacidade</p>
          <p>Paciente incapaz? {incapable === "nao" ? "NÃO" : `SIM – Responsável: ${responsibleName}`}</p>
        </div>

        {/* Médico */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="border border-gray-400 rounded p-2 text-xs">
            <p className="font-bold mb-1 uppercase text-xs border-b border-gray-300 pb-0.5">17 – Assinatura do Médico</p>
            <PrintSignatureBlock role={signerRole} date={isoToBR(date)} columns={false} />
          </div> {/* Closing div for the doctor's signature block */}
          <div className="border border-gray-400 rounded p-2 text-xs">
            <p className="font-bold mb-1 uppercase text-xs border-b border-gray-300 pb-0.5">21–23 – Paciente / Responsável</p>
            {patientDoc && <p>{patientDocType}: {patientDoc}</p>}
            {patientEmail && <p>E-mail: {patientEmail}</p>}
            <div className="mt-3">
              <p className="text-xs font-semibold">Assinatura do responsável pelo preenchimento:</p>
              <div className="h-6 border-b border-gray-400 mt-1"></div>
              {respSignature && <p className="text-xs mt-0.5">{respSignature}</p>}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">Suporte: ceaf.daf@saude.gov.br · HC-UFG – InternosMed</p>
      </div>
    </div>
  );
}
