import { useState } from "react";
import { Printer, RotateCcw, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR } from "@/lib/utils";
import { getStoredUser } from "@/lib/auth";
import { addHistoryEntry } from "@/lib/history";
import PrintHeader from "@/components/print/PrintHeader";
import PrintSignatureBlock, { type SignerRole } from "@/components/print/PrintSignatureBlock";

const ROLE_OPTIONS: { value: SignerRole; label: string }[] = [
  { value: "interno", label: "Interno" },
  { value: "medico", label: "Médico" },
  { value: "ambos", label: "Ambos" },
];

export default function APAC() {
  const user = getStoredUser();
  // Estabelecimento
  const CNES = "2338424";
  // Paciente
  const [patientName, setPatientName] = useState("");
  const [sex, setSex] = useState<"M" | "F">("M");
  const [prontuario, setProntuario] = useState("");
  const [patientDOB, setPatientDOB] = useState("");
  const [cns, setCns] = useState("");
  const [raca, setRaca] = useState("");
  const [etnia, setEtnia] = useState("");
  const [motherName, setMotherName] = useState("");
  const [responsibleName, setResponsibleName] = useState("");
  const [phoneResp, setPhoneResp] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Goiânia");
  const [ibge, setIbge] = useState("520870");
  const [uf, setUf] = useState("GO");
  const [cep, setCep] = useState("74900000");
  // Procedimento principal
  const [procCode, setProcCode] = useState("");
  const [procName, setProcName] = useState("");
  const [procQtd, setProcQtd] = useState("01");
  // Procedimentos secundários (até 3 grupos)
  const [secProcs, setSecProcs] = useState([
    { code: "", name: "", qtd: "" },
    { code: "", name: "", qtd: "" },
    { code: "", name: "", qtd: "" },
  ]);
  function updateSecProc(idx: number, field: string, val: string) {
    setSecProcs(p => p.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  }
  // Justificativa
  const [diagnosis, setDiagnosis] = useState("");
  const [cid1, setCid1] = useState("");
  const [cid2, setCid2] = useState("");
  const [cid3, setCid3] = useState("");
  const [observations, setObservations] = useState("");
  // Solicitação
  const [doctorName, setDoctorName] = useState(user?.name || "");
  const [doctorDocType, setDoctorDocType] = useState<"CNS" | "CPF">("CPF");
  const [doctorDoc, setDoctorDoc] = useState("");
  const [date, setDate] = useState(todayISO());
  const [signerRole, setSignerRole] = useState<SignerRole>("medico");

  function handleClear() {
    setPatientName(""); setSex("M"); setProntuario(""); setPatientDOB("");
    setCns(""); setRaca(""); setEtnia(""); setMotherName(""); setResponsibleName("");
    setPhoneResp(""); setAddress(""); setCity("Goiânia"); setIbge("520870");
    setUf("GO"); setCep("74900000"); setProcCode(""); setProcName(""); setProcQtd("01");
    setSecProcs([{ code:"",name:"",qtd:"" },{ code:"",name:"",qtd:"" },{ code:"",name:"",qtd:"" }]);
    setDiagnosis(""); setCid1(""); setCid2(""); setCid3(""); setObservations("");
    setDoctorName(user?.name || ""); setDoctorDoc(""); setDate(todayISO());
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!patientName.trim()) { toast.error("Informe o nome do paciente."); return; }
    if (!procName.trim()) { toast.error("Informe o procedimento principal."); return; }
    addHistoryEntry({ type: "apac", label: "APAC", patientName, date });
    window.print();
  }

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">APAC – Laudo para Solicitação/Autorização de Procedimento Ambulatorial</h1>
        <p className="text-sm text-gray-500 mb-6">Formulário padrão SUS para procedimentos de alta complexidade.</p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4 space-y-5">
          {/* Estabelecimento */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Identificação do Estabelecimento</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="form-label">Nome do Estabelecimento</label>
                <input className="form-input" value="Hospital das Clínicas da UFG" readOnly />
              </div>
              <div>
                <label className="form-label">CNES</label>
                <input className="form-input" value={CNES} readOnly />
              </div>
            </div>
          </div>

          {/* Paciente */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Identificação do Paciente</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="form-label">Nome do Paciente</label>
                <input className="form-input" placeholder="Nome completo" value={patientName} onChange={e => setPatientName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Sexo</label>
                <select className="form-input" value={sex} onChange={e => setSex(e.target.value as "M"|"F")}>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
              <div>
                <label className="form-label">Nº Prontuário</label>
                <input className="form-input" placeholder="Prontuário" value={prontuario} onChange={e => setProntuario(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CNS</label>
                <input className="form-input" placeholder="Cartão Nacional de Saúde" value={cns} onChange={e => setCns(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Nascimento</label>
                <input type="date" className="form-input" value={patientDOB} onChange={e => setPatientDOB(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Raça/Cor</label>
                <select className="form-input" value={raca} onChange={e => setRaca(e.target.value)}>
                  <option value="">Selecione</option>
                  {["01 – Branca","02 – Preta","03 – Parda","04 – Amarela","05 – Indígena"].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Etnia</label>
                <input className="form-input" placeholder="Etnia (se indígena)" value={etnia} onChange={e => setEtnia(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Nome da Mãe</label>
                <input className="form-input" placeholder="Nome completo da mãe" value={motherName} onChange={e => setMotherName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Nome do Responsável</label>
                <input className="form-input" placeholder="Se menor ou incapaz" value={responsibleName} onChange={e => setResponsibleName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Telefone (Responsável)</label>
                <input className="form-input" placeholder="(62) 00000-0000" value={phoneResp} onChange={e => setPhoneResp(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Endereço (Rua, Nº, Bairro)</label>
                <input className="form-input" placeholder="Endereço completo" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Município</label>
                <input className="form-input" placeholder="Goiânia" value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Cód. IBGE</label>
                <input className="form-input" placeholder="520870" value={ibge} onChange={e => setIbge(e.target.value)} />
              </div>
              <div>
                <label className="form-label">UF</label>
                <input className="form-input" placeholder="GO" value={uf} onChange={e => setUf(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CEP</label>
                <input className="form-input" placeholder="00000000" value={cep} onChange={e => setCep(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Procedimento principal */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Procedimento Principal Solicitado</h3>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="form-label">Código</label>
                <input className="form-input" placeholder="0207010013" value={procCode} onChange={e => setProcCode(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Nome do Procedimento</label>
                <input className="form-input" placeholder="Nome do procedimento principal" value={procName} onChange={e => setProcName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Qtde.</label>
                <input className="form-input" placeholder="01" value={procQtd} onChange={e => setProcQtd(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Procedimentos secundários */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Procedimento(s) Secundário(s)</h3>
            {secProcs.map((sp, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-3 mb-2">
                <div>
                  <label className="form-label text-xs">Código {idx + 1}</label>
                  <input className="form-input" placeholder="Código" value={sp.code} onChange={e => updateSecProc(idx,"code",e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="form-label text-xs">Nome</label>
                  <input className="form-input" placeholder={`Procedimento secundário ${idx + 1}`} value={sp.name} onChange={e => updateSecProc(idx,"name",e.target.value)} />
                </div>
                <div>
                  <label className="form-label text-xs">Qtde.</label>
                  <input className="form-input" placeholder="01" value={sp.qtd} onChange={e => updateSecProc(idx,"qtd",e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* Justificativa */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Justificativa do(s) Procedimento(s)</h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Descrição do Diagnóstico</label>
                <input className="form-input" placeholder="Ex: Aneurisma" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="form-label">CID-10 Principal</label>
                  <input className="form-input" placeholder="Ex: I671" value={cid1} onChange={e => setCid1(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">CID-10 Secundário</label>
                  <input className="form-input" placeholder="Opcional" value={cid2} onChange={e => setCid2(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">CID-10 Causas Associadas</label>
                  <input className="form-input" placeholder="Opcional" value={cid3} onChange={e => setCid3(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label">Observações</label>
                <textarea className="form-textarea" rows={3} placeholder="Ex: Paciente em acompanhamento de aneurisma cerebral..." value={observations} onChange={e => setObservations(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Solicitação */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Solicitação</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Nome do Profissional Solicitante</label>
                <input className="form-input" value={doctorName} onChange={e => setDoctorName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data da Solicitação</label>
                <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
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
                <input className="form-input" placeholder="Nº CPF ou CNS" value={doctorDoc} onChange={e => setDoctorDoc(e.target.value)} />
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
            <Printer className="w-4 h-4" /> Imprimir APAC
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* PRINT */}
      <div className="print-only print-page" style={{ padding: "10mm 15mm" }}>
        {/* Header */}
        <PrintHeader title="Laudo para Solicitação / Autorização de Procedimento Ambulatorial (APAC)" />

        {/* Estabelecimento */}
        <table className="w-full text-xs border-collapse border border-gray-800 mb-0" style={{ borderTop: "none" }}>
          <tbody>
            <tr>
              <td className="border border-gray-600 px-2 py-1 font-bold uppercase" colSpan={2}>Identificação do Estabelecimento de Saúde (Solicitante)</td>
            </tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">1 – Nome do Estabelecimento</p>
                <p className="font-bold uppercase">Hospital das Clínicas da UFG</p>
              </td>
              <td className="border border-gray-600 px-2 py-1 w-24">
                <p className="text-xs text-gray-500">2 – CNES</p>
                <p className="font-bold tracking-widest">{CNES}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Paciente */}
        <table className="w-full text-xs border-collapse border border-gray-800 mb-0" style={{ borderTop: "none" }}>
          <tbody>
            <tr><td className="border border-gray-600 px-2 py-0.5 font-bold uppercase bg-gray-100" colSpan={4}>Identificação do Paciente</td></tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1" colSpan={2}>
                <p className="text-xs text-gray-500">3 – Nome do Paciente</p>
                <p className="font-semibold uppercase">{patientName}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1 w-16">
                <p className="text-xs text-gray-500">4 – Sexo</p>
                <p>{sex === "M" ? "Masc." : "Fem."}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">5 – Nº Prontuário</p>
                <p>{prontuario}</p>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">6 – CNS</p>
                <p>{cns || "__________________"}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">7 – Data de Nascimento</p>
                <p>{patientDOB ? isoToBR(patientDOB) : "___/___/______"}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">8 – Raça/Cor</p>
                <p>{raca}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">8.1 – Etnia</p>
                <p>{etnia}</p>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1" colSpan={2}>
                <p className="text-xs text-gray-500">9 – Nome da Mãe</p>
                <p className="uppercase">{motherName}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1" colSpan={2}>
                <p className="text-xs text-gray-500">10 – Telefone</p>
                <p>{phoneResp}</p>
              </td>
            </tr>
            {responsibleName && (
              <tr>
                <td className="border border-gray-600 px-2 py-1" colSpan={4}>
                  <p className="text-xs text-gray-500">11 – Nome do Responsável</p>
                  <p className="uppercase">{responsibleName}</p>
                </td>
              </tr>
            )}
            <tr>
              <td className="border border-gray-600 px-2 py-1" colSpan={3}>
                <p className="text-xs text-gray-500">13 – Endereço</p>
                <p className="uppercase">{address}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">17 – CEP</p>
                <p>{cep}</p>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1" colSpan={2}>
                <p className="text-xs text-gray-500">14 – Município</p>
                <p className="uppercase">{city}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">15 – Cód. IBGE</p>
                <p>{ibge}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">16 – UF</p>
                <p>{uf}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Procedimento principal */}
        <table className="w-full text-xs border-collapse border border-gray-800 mb-0" style={{ borderTop: "none" }}>
          <tbody>
            <tr><td className="border border-gray-600 px-2 py-0.5 font-bold uppercase bg-gray-100" colSpan={3}>Procedimento Solicitado</td></tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1 w-32">
                <p className="text-xs text-gray-500">18 – Código</p>
                <p className="tracking-widest font-mono">{procCode}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">19 – Nome do Procedimento Principal</p>
                <p className="uppercase font-semibold">{procName}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1 w-12">
                <p className="text-xs text-gray-500">20 – Qtde.</p>
                <p className="text-center">{procQtd}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Procedimentos secundários */}
        {secProcs.some(s => s.name) && (
          <table className="w-full text-xs border-collapse border border-gray-800 mb-0" style={{ borderTop: "none" }}>
            <tbody>
              <tr><td className="border border-gray-600 px-2 py-0.5 font-bold uppercase bg-gray-100" colSpan={3}>Procedimento(s) Secundário(s)</td></tr>
              {secProcs.filter(s => s.name).map((sp, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-600 px-2 py-1 w-32">
                    <p className="text-xs text-gray-500">Cód. {21 + idx * 3}</p>
                    <p className="font-mono">{sp.code}</p>
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    <p className="text-xs text-gray-500">Nome {22 + idx * 3}</p>
                    <p className="uppercase">{sp.name}</p>
                  </td>
                  <td className="border border-gray-600 px-2 py-1 w-12">
                    <p className="text-xs text-gray-500">Qtde.</p>
                    <p>{sp.qtd}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Justificativa */}
        <table className="w-full text-xs border-collapse border border-gray-800 mb-0" style={{ borderTop: "none" }}>
          <tbody>
            <tr><td className="border border-gray-600 px-2 py-0.5 font-bold uppercase bg-gray-100" colSpan={4}>Justificativa do(s) Procedimento(s) Solicitado(s)</td></tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1" colSpan={2}>
                <p className="text-xs text-gray-500">36 – Descrição do Diagnóstico</p>
                <p className="uppercase font-semibold">{diagnosis}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">37 – CID Principal</p>
                <p className="font-mono">{cid1}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">38 – CID Sec.</p>
                <p className="font-mono">{cid2}</p>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1" colSpan={4}>
                <p className="text-xs text-gray-500">40 – Observações</p>
                <p className="uppercase">{observations}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Solicitação */}
        <table className="w-full text-xs border-collapse border border-gray-800" style={{ borderTop: "none" }}>
          <tbody>
            <tr><td className="border border-gray-600 px-2 py-0.5 font-bold uppercase bg-gray-100" colSpan={3}>Solicitação</td></tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1 col-span-1">
                <p className="text-xs text-gray-500">41 – Nome do Profissional Solicitante</p>
                <p className="font-semibold uppercase">{doctorName}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1 w-28">
                <p className="text-xs text-gray-500">42 – Data da Solicitação</p>
                <p>{isoToBR(date)}</p>
              </td>
              <td className="border border-gray-600 px-2 py-1 w-28">
                <p className="text-xs text-gray-500">45 – Assinatura/CRM</p>
                <PrintSignatureBlock role={signerRole} date={isoToBR(date)} columns={false} />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-600 px-2 py-1">
                <p className="text-xs text-gray-500">43 – Tipo: ({doctorDocType === "CNS" ? "X" : " "}) CNS ({doctorDocType === "CPF" ? "X" : " "}) CPF</p>
              </td>
              <td className="border border-gray-600 px-2 py-1" colSpan={2}>
                <p className="text-xs text-gray-500">44 – Nº do documento</p>
                <p className="font-mono">{doctorDoc}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Autorização (vazio, preenchido pela instituição) */}
        <table className="w-full text-xs border-collapse border border-gray-800 mt-1">
          <tbody>
            <tr><td className="border border-gray-600 px-2 py-0.5 font-bold uppercase bg-gray-100" colSpan={3}>Autorização (preenchimento pelo autorizador)</td></tr>
            <tr>
              <td className="border border-gray-600 px-2 py-3"><p className="text-xs text-gray-500">46 – Nome do Profissional Autorizador</p></td>
              <td className="border border-gray-600 px-2 py-3"><p className="text-xs text-gray-500">47 – Cód. Órgão Emissor</p></td>
              <td className="border border-gray-600 px-2 py-3"><p className="text-xs text-gray-500">52 – Nº da Autorização (APAC)</p></td>
            </tr>
            <tr>
              <td className="border border-gray-600 px-2 py-3"><p className="text-xs text-gray-500">50 – Data da Autorização</p></td>
              <td className="border border-gray-600 px-2 py-3"><p className="text-xs text-gray-500">51 – Assinatura e carimbo</p></td>
              <td className="border border-gray-600 px-2 py-3">
                <p className="text-xs text-gray-500">53 – Período de validade da APAC</p>
                <p className="text-xs text-gray-400">____/____/______  a  ____/____/______</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
