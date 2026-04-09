/**
 * AIH.tsx
 * Autorização de Internação Hospitalar (AIH)
 * Formulário oficial DATASUS para Sistema Único de Saúde (SUS)
 * 
 * Referências:
 * - Manual Técnico Operacional do SIH/SUS (Ministério da Saúde)
 * - Portaria GM/MS nº 1.559/2008 (Política Nacional de Regulação)
 */

import { useState } from "react";
import { Printer, RotateCcw, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import { generateProtocol } from "@/lib/protocol";
import PrintHeaderV2 from "@/components/print/PrintHeaderV2";
import PrintFooter from "@/components/print/PrintFooter";
import CIDSearch from "@/components/ui/CIDSearch";

// Tipos de caráter de internação conforme SIH/SUS
const CARATER_INTERNACAO = [
  { value: "1", label: "Eletiva" },
  { value: "2", label: "Urgência/Emergência" },
  { value: "3", label: "Acidente no local de trabalho ou a serviço da empresa" },
  { value: "4", label: "Acidente no trajeto para o trabalho" },
  { value: "5", label: "Outros tipos de acidente de trânsito" },
  { value: "6", label: "Outros tipos de lesões e envenenamentos por agentes químicos ou físicos" },
];

// Tipos de regime de internação
const REGIME_INTERNACAO = [
  { value: "1", label: "Hospitalar" },
  { value: "2", label: "Hospital-Dia" },
  { value: "5", label: "Domiciliar" },
];

export default function AIH() {
  const [protocol] = useState(() => generateProtocol('AIH'));
  
  // Dados do Estabelecimento
  const [cnes, setCnes] = useState("2337614"); // CNES HC-UFG
  const [nomeEstabelecimento] = useState("Hospital das Clínicas - UFG");
  
  // Dados do Paciente
  const [nomePaciente, setNomePaciente] = useState("");
  const [cpf, setCpf] = useState("");
  const [cns, setCns] = useState(""); // Cartão Nacional de Saúde
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState<"M" | "F">("M");
  const [nomeMae, setNomeMae] = useState("");
  const [raca, setRaca] = useState(""); // 1-Branca, 2-Preta, 3-Parda, 4-Amarela, 5-Indígena
  
  // Endereço
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [municipio, setMunicipio] = useState("Goiânia");
  const [uf, setUf] = useState("GO");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  
  // Dados da Internação
  const [dataInternacao, setDataInternacao] = useState(todayISO());
  const [caraterInternacao, setCaraterInternacao] = useState("1");
  const [regimeInternacao, setRegimeInternacao] = useState("1");
  const [diagnosticoPrincipal, setDiagnosticoPrincipal] = useState("");
  const [cidPrincipal, setCidPrincipal] = useState("");
  const [cidNomePrincipal, setCidNomePrincipal] = useState("");
  const [diagnosticoSecundario, setDiagnosticoSecundario] = useState("");
  const [cidSecundario, setCidSecundario] = useState("");
  const [cidNomeSecundario, setCidNomeSecundario] = useState("");
  
  // Procedimento Solicitado
  const [procedimento, setProcedimento] = useState("");
  const [codigoProcedimento, setCodigoProcedimento] = useState(""); // Tabela SUS
  const [quantidade, setQuantidade] = useState(1);
  const [clinica, setClinica] = useState(""); // Ex: Clínica Médica, Cirúrgica, etc.
  
  // Justificativa
  const [justificativa, setJustificativa] = useState("");
  
  // Dados do Solicitante
  const [nomeSolicitante, setNomeSolicitante] = useState("");
  const [crmSolicitante, setCrmSolicitante] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState(todayISO());

  function validateForm(): boolean {
    if (!nomePaciente.trim()) {
      toast.error("Informe o nome do paciente.");
      return false;
    }
    if (!cns.trim() && !cpf.trim()) {
      toast.error("Informe o CNS ou CPF do paciente.");
      return false;
    }
    if (!cidPrincipal.trim()) {
      toast.error("Informe o CID principal.");
      return false;
    }
    if (!procedimento.trim()) {
      toast.error("Informe o procedimento solicitado.");
      return false;
    }
    if (!nomeSolicitante.trim() || !crmSolicitante.trim()) {
      toast.error("Informe os dados do solicitante.");
      return false;
    }
    return true;
  }

  function handleClear() {
    setNomePaciente(""); setCpf(""); setCns(""); setDataNascimento("");
    setNomeMae(""); setRaca(""); setLogradouro(""); setNumero("");
    setComplemento(""); setBairro(""); setCep(""); setTelefone("");
    setDataInternacao(todayISO()); setCaraterInternacao("1");
    setDiagnosticoPrincipal(""); setCidPrincipal(""); setCidNomePrincipal("");
    setDiagnosticoSecundario(""); setCidSecundario(""); setCidNomeSecundario("");
    setProcedimento(""); setCodigoProcedimento(""); setJustificativa("");
    setNomeSolicitante(""); setCrmSolicitante(""); setDataSolicitacao(todayISO());
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!validateForm()) return;
    
    addHistoryEntry({
      type: "aih",
      label: "AIH - Autorização de Internação",
      patientName: nomePaciente,
      date: dataInternacao,
    });
    
    window.print();
  }

  return (
    <div className="animate-fade-in">
      {/* FORMULÁRIO */}
      <div className="no-print">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              AIH – Autorização de Internação Hospitalar
            </h1>
            <p className="text-sm text-gray-500">
              Formulário oficial do Sistema de Informações Hospitalares (SIH/SUS)
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-xs font-semibold text-blue-900">Protocolo</p>
            <p className="text-sm font-mono text-blue-700">{protocol}</p>
          </div>
        </div>

        {/* Alerta DATASUS */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Atenção - Documento Oficial SUS</p>
            <p>
              Este formulário deve ser preenchido conforme Manual Técnico Operacional do SIH/SUS.
              Todos os campos obrigatórios devem ser preenchidos corretamente.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* ESTABELECIMENTO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              1. Identificação do Estabelecimento
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="form-label">CNES</label>
                <input className="form-input bg-gray-50" value={cnes} onChange={(e) => setCnes(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Nome do Estabelecimento</label>
                <input className="form-input bg-gray-50" value={nomeEstabelecimento} readOnly />
              </div>
            </div>
          </div>

          {/* IDENTIFICAÇÃO DO PACIENTE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              2. Identificação do Paciente
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="form-label">Nome Completo <span className="text-red-500">*</span></label>
                  <input className="form-input" placeholder="Nome completo do paciente" value={nomePaciente} onChange={(e) => setNomePaciente(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">CNS (Cartão Nacional de Saúde)</label>
                  <input className="form-input" placeholder="000 0000 0000 0000" maxLength={15} value={cns} onChange={(e) => setCns(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">CPF</label>
                  <input className="form-input" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Data de Nascimento</label>
                  <input type="date" className="form-input" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Sexo</label>
                  <select className="form-input" value={sexo} onChange={(e) => setSexo(e.target.value as "M" | "F")}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="form-label">Nome da Mãe</label>
                  <input className="form-input" placeholder="Nome completo da mãe" value={nomeMae} onChange={(e) => setNomeMae(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Raça/Cor</label>
                  <select className="form-input" value={raca} onChange={(e) => setRaca(e.target.value)}>
                    <option value="">Selecione...</option>
                    <option value="1">Branca</option>
                    <option value="2">Preta</option>
                    <option value="3">Parda</option>
                    <option value="4">Amarela</option>
                    <option value="5">Indígena</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              3. Endereço do Paciente
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="form-label">Logradouro</label>
                <input className="form-input" placeholder="Rua, Avenida..." value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Número</label>
                <input className="form-input" placeholder="Nº" value={numero} onChange={(e) => setNumero(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Complemento</label>
                <input className="form-input" placeholder="Apto, Bloco..." value={complemento} onChange={(e) => setComplemento(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Bairro</label>
                <input className="form-input" value={bairro} onChange={(e) => setBairro(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Município</label>
                <input className="form-input" value={municipio} onChange={(e) => setMunicipio(e.target.value)} />
              </div>
              <div>
                <label className="form-label">UF</label>
                <input className="form-input" maxLength={2} value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="form-label">CEP</label>
                <input className="form-input" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Telefone</label>
                <input className="form-input" placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              </div>
            </div>
          </div>

          {/* DADOS DA INTERNAÇÃO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              4. Dados da Internação
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="form-label">Data da Internação <span className="text-red-500">*</span></label>
                <input type="date" className="form-input" value={dataInternacao} onChange={(e) => setDataInternacao(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Caráter da Internação</label>
                <select className="form-input" value={caraterInternacao} onChange={(e) => setCaraterInternacao(e.target.value)}>
                  {CARATER_INTERNACAO.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Regime de Internação</label>
                <select className="form-input" value={regimeInternacao} onChange={(e) => setRegimeInternacao(e.target.value)}>
                  {REGIME_INTERNACAO.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-3">
                <label className="form-label">Clínica</label>
                <input className="form-input" placeholder="Ex: Clínica Médica, Cirúrgica, Pediátrica..." value={clinica} onChange={(e) => setClinica(e.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="form-label">Diagnóstico Principal <span className="text-red-500">*</span></label>
                <input className="form-input mb-2" placeholder="Descrição do diagnóstico principal" value={diagnosticoPrincipal} onChange={(e) => setDiagnosticoPrincipal(e.target.value)} />
                <CIDSearch value={cidPrincipal} codeName={cidNomePrincipal} onSelect={(code, name) => { setCidPrincipal(code); setCidNomePrincipal(name); }} placeholder="Buscar CID-10 principal..." />
              </div>
              
              <div>
                <label className="form-label">Diagnóstico Secundário (opcional)</label>
                <input className="form-input mb-2" placeholder="Descrição do diagnóstico secundário" value={diagnosticoSecundario} onChange={(e) => setDiagnosticoSecundario(e.target.value)} />
                <CIDSearch value={cidSecundario} codeName={cidNomeSecundario} onSelect={(code, name) => { setCidSecundario(code); setCidNomeSecundario(name); }} placeholder="Buscar CID-10 secundário..." />
              </div>
            </div>
          </div>

          {/* PROCEDIMENTO SOLICITADO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              5. Procedimento Solicitado
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="form-label">Descrição do Procedimento <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="Nome do procedimento conforme Tabela SUS" value={procedimento} onChange={(e) => setProcedimento(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Código SUS</label>
                <input className="form-input" placeholder="00.00.00.000-0" value={codigoProcedimento} onChange={(e) => setCodigoProcedimento(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Quantidade</label>
                <input type="number" min={1} className="form-input" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
              </div>
              <div className="col-span-3">
                <label className="form-label">Justificativa Clínica <span className="text-red-500">*</span></label>
                <textarea className="form-textarea" rows={4} placeholder="Justifique clinicamente a necessidade do procedimento/internação..." value={justificativa} onChange={(e) => setJustificativa(e.target.value)} />
              </div>
            </div>
          </div>

          {/* SOLICITANTE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              6. Dados do Solicitante
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome do Médico Solicitante <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="Nome completo" value={nomeSolicitante} onChange={(e) => setNomeSolicitante(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CRM <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="CRM/UF 00000" value={crmSolicitante} onChange={(e) => setCrmSolicitante(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data da Solicitação</label>
                <input type="date" className="form-input" value={dataSolicitacao} onChange={(e) => setDataSolicitacao(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex gap-3 mt-6">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Imprimir AIH
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar Formulário
          </button>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors ml-auto">
            <Save className="w-4 h-4" /> Salvar Rascunho
          </button>
        </div>
      </div>

      {/* IMPRESSÃO */}
      <div className="print-only print-page">
        <PrintHeaderV2 
          title="Autorização de Internação Hospitalar (AIH)" 
          subtitle="Sistema de Informações Hospitalares - SIH/SUS"
          protocolNumber={protocol}
        />

        <div className="text-[9pt] space-y-3">
          {/* Estabelecimento */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">1. ESTABELECIMENTO</p>
            <div className="grid grid-cols-3 gap-2 text-[8pt]">
              <div><span className="font-semibold">CNES:</span> {cnes}</div>
              <div className="col-span-2"><span className="font-semibold">Nome:</span> {nomeEstabelecimento}</div>
            </div>
          </div>

          {/* Paciente */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">2. IDENTIFICAÇÃO DO PACIENTE</p>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[8pt]">
              <div className="col-span-3"><span className="font-semibold">Nome:</span> {nomePaciente}</div>
              <div><span className="font-semibold">CNS:</span> {cns || "Não informado"}</div>
              <div><span className="font-semibold">CPF:</span> {cpf || "Não informado"}</div>
              <div><span className="font-semibold">DN:</span> {dataNascimento ? isoToBR(dataNascimento) : ""}</div>
              <div><span className="font-semibold">Sexo:</span> {sexo === "M" ? "Masculino" : "Feminino"}</div>
              <div className="col-span-2"><span className="font-semibold">Mãe:</span> {nomeMae}</div>
            </div>
          </div>

          {/* Endereço */}
          {logradouro && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">3. ENDEREÇO</p>
              <p className="text-[8pt]">
                {logradouro}, {numero} {complemento && `- ${complemento}`} - {bairro}<br />
                {municipio}/{uf} - CEP: {cep} {telefone && `- Tel: ${telefone}`}
              </p>
            </div>
          )}

          {/* Internação */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">4. DADOS DA INTERNAÇÃO</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[8pt]">
              <div><span className="font-semibold">Data Internação:</span> {isoToBR(dataInternacao)}</div>
              <div><span className="font-semibold">Caráter:</span> {CARATER_INTERNACAO.find(c => c.value === caraterInternacao)?.label}</div>
              <div><span className="font-semibold">Regime:</span> {REGIME_INTERNACAO.find(r => r.value === regimeInternacao)?.label}</div>
              <div><span className="font-semibold">Clínica:</span> {clinica}</div>
              <div className="col-span-2"><span className="font-semibold">Diagnóstico Principal:</span> {diagnosticoPrincipal} ({cidPrincipal})</div>
              {diagnosticoSecundario && (
                <div className="col-span-2"><span className="font-semibold">Diagnóstico Secundário:</span> {diagnosticoSecundario} ({cidSecundario})</div>
              )}
            </div>
          </div>

          {/* Procedimento */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">5. PROCEDIMENTO SOLICITADO</p>
            <div className="text-[8pt] space-y-1">
              <p><span className="font-semibold">Procedimento:</span> {procedimento} {codigoProcedimento && `(Cód: ${codigoProcedimento})`}</p>
              <p><span className="font-semibold">Quantidade:</span> {quantidade}</p>
              <div>
                <p className="font-semibold mb-0.5">Justificativa:</p>
                <p className="text-justify">{justificativa}</p>
              </div>
            </div>
          </div>

          {/* Solicitante */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">6. SOLICITANTE</p>
            <div className="grid grid-cols-2 gap-2 text-[8pt]">
              <div><span className="font-semibold">Médico:</span> {nomeSolicitante}</div>
              <div><span className="font-semibold">CRM:</span> {crmSolicitante}</div>
              <div><span className="font-semibold">Data:</span> {isoToBR(dataSolicitacao)}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-400">
              <div className="h-12 border-b border-gray-500 mb-1"></div>
              <p className="text-center text-[8pt] font-semibold">Assinatura e Carimbo do Médico Solicitante</p>
            </div>
          </div>
        </div>

        <PrintFooter />
      </div>
    </div>
  );
}
