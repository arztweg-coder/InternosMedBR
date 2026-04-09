/**
 * LMEV2.tsx
 * Laudo para Solicitação, Avaliação e Autorização de Medicamentos do
 * Componente Especializado da Assistência Farmacêutica (CEAF)
 * 
 * Referências:
 * - Portaria de Consolidação nº 2/GM/MS (28/09/2017)
 * - Manual de Instrução do Laudo para Medicação Especial (SUS)
 * - Protocolos Clínicos e Diretrizes Terapêuticas (PCDT) do Ministério da Saúde
 */

import { useState } from "react";
import { Printer, RotateCcw, Plus, X, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR, generateId } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import { generateProtocol } from "@/lib/protocol";
import PrintHeaderV2 from "@/components/print/PrintHeaderV2";
import PrintFooter from "@/components/print/PrintFooter";
import CIDSearch from "@/components/ui/CIDSearch";

interface MedicamentoLME {
  id: string;
  nome: string;
  concentracao: string;
  forma_farmaceutica: string;
  quantidade_mes_1: string;
  quantidade_mes_2: string;
  quantidade_mes_3: string;
  quantidade_mes_4: string;
  quantidade_mes_5: string;
  quantidade_mes_6: string;
}

function emptyMed(): MedicamentoLME {
  return {
    id: generateId(),
    nome: "",
    concentracao: "",
    forma_farmaceutica: "",
    quantidade_mes_1: "",
    quantidade_mes_2: "",
    quantidade_mes_3: "",
    quantidade_mes_4: "",
    quantidade_mes_5: "",
    quantidade_mes_6: "",
  };
}

export default function LMEV2() {
  const [protocol] = useState(() => generateProtocol('LME'));

  // DADOS DO PACIENTE
  const [nomePaciente, setNomePaciente] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [cns, setCns] = useState(""); // Cartão Nacional de Saúde
  const [nomeMae, setNomeMae] = useState("");
  const [sexo, setSexo] = useState<"M" | "F">("M");
  const [raca, setRaca] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  
  // ENDEREÇO
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [municipio, setMunicipio] = useState("Goiânia");
  const [uf, setUf] = useState("GO");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  // DIAGNÓSTICO E DADOS CLÍNICOS
  const [cidPrincipal, setCidPrincipal] = useState("");
  const [cidNomePrincipal, setCidNomePrincipal] = useState("");
  const [cidSecundario1, setCidSecundario1] = useState("");
  const [cidNomeSecundario1, setCidNomeSecundario1] = useState("");
  const [cidSecundario2, setCidSecundario2] = useState("");
  const [cidNomeSecundario2, setCidNomeSecundario2] = useState("");
  
  const [resumoClinico, setResumoClinico] = useState("");
  const [examesRealizados, setExamesRealizados] = useState("");
  const [tratamentoPrevio, setTratamentoPrevio] = useState("");
  const [justificativaSolicitacao, setJustificativaSolicitacao] = useState("");
  
  // TRATAMENTO ANTERIOR
  const [teveTratamentoAnterior, setTeveTratamentoAnterior] = useState<"nao" | "sim">("nao");
  const [motivoInterrupcao, setMotivoInterrupcao] = useState("");

  // MEDICAMENTOS SOLICITADOS
  const [medicamentos, setMedicamentos] = useState<MedicamentoLME[]>([emptyMed()]);

  // DADOS DO MÉDICO SOLICITANTE
  const [nomeMedico, setNomeMedico] = useState("");
  const [crmMedico, setCrmMedico] = useState("");
  const [ufCrm, setUfCrm] = useState("GO");
  const [especialidade, setEspecialidade] = useState("");
  const [telefoneConsultorio, setTelefoneConsultorio] = useState("");
  const [emailMedico, setEmailMedico] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState(todayISO());

  // RESPONSÁVEL LEGAL (se incapaz)
  const [pacienteIncapaz, setPacienteIncapaz] = useState<"nao" | "sim">("nao");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");
  const [parentesco, setParentesco] = useState("");

  function updateMed(id: string, field: keyof MedicamentoLME, value: string) {
    setMedicamentos(prev => 
      prev.map(m => m.id === id ? { ...m, [field]: value } : m)
    );
  }

  function removeMed(id: string) {
    if (medicamentos.length === 1) {
      toast.info("Mantenha ao menos um medicamento.");
      return;
    }
    setMedicamentos(prev => prev.filter(m => m.id !== id));
  }

  function addMed() {
    if (medicamentos.length >= 10) {
      toast.error("Limite máximo de 10 medicamentos por laudo.");
      return;
    }
    setMedicamentos(prev => [...prev, emptyMed()]);
  }

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
      toast.error("Informe o CID-10 principal.");
      return false;
    }
    if (medicamentos.every(m => !m.nome.trim())) {
      toast.error("Adicione ao menos um medicamento.");
      return false;
    }
    if (!nomeMedico.trim() || !crmMedico.trim()) {
      toast.error("Informe os dados do médico solicitante.");
      return false;
    }
    if (!resumoClinico.trim()) {
      toast.error("Informe o resumo clínico.");
      return false;
    }
    return true;
  }

  function handleClear() {
    setNomePaciente(""); setDataNascimento(""); setCpf(""); setCns("");
    setNomeMae(""); setPeso(""); setAltura(""); setLogradouro("");
    setNumero(""); setComplemento(""); setBairro(""); setCep("");
    setTelefone(""); setEmail(""); setCidPrincipal(""); setCidNomePrincipal("");
    setCidSecundario1(""); setCidNomeSecundario1(""); setCidSecundario2("");
    setCidNomeSecundario2(""); setResumoClinico(""); setExamesRealizados("");
    setTratamentoPrevio(""); setJustificativaSolicitacao("");
    setTeveTratamentoAnterior("nao"); setMotivoInterrupcao("");
    setMedicamentos([emptyMed()]); setNomeMedico(""); setCrmMedico("");
    setEspecialidade(""); setTelefoneConsultorio(""); setEmailMedico("");
    setDataSolicitacao(todayISO()); setPacienteIncapaz("nao");
    setNomeResponsavel(""); setCpfResponsavel(""); setParentesco("");
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!validateForm()) return;
    
    addHistoryEntry({
      type: "lme",
      label: "LME - Medicação Especializada",
      patientName: nomePaciente,
      date: dataSolicitacao,
    });
    
    window.print();
  }

  function calcularIMC(): string {
    if (!peso || !altura) return "";
    const p = parseFloat(peso);
    const a = parseFloat(altura) / 100;
    if (p > 0 && a > 0) {
      const imc = p / (a * a);
      return imc.toFixed(1);
    }
    return "";
  }

  return (
    <div className="animate-fade-in">
      {/* FORMULÁRIO */}
      <div className="no-print">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              LME – Laudo para Medicação Especializada
            </h1>
            <p className="text-sm text-gray-500">
              Componente Especializado da Assistência Farmacêutica (CEAF/SUS)
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-xs font-semibold text-blue-900">Protocolo</p>
            <p className="text-sm font-mono text-blue-700">{protocol}</p>
          </div>
        </div>

        {/* Alerta PCDT */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Atenção - Protocolos Clínicos (PCDT)</p>
            <p>
              Este laudo deve seguir os Protocolos Clínicos e Diretrizes Terapêuticas do Ministério da Saúde.
              Consulte os PCDT vigentes antes de solicitar medicamentos especializados.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* DADOS DO PACIENTE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              1. Identificação do Paciente
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 sm:col-span-2">
                <label className="form-label">Nome Completo <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="Nome completo do paciente" value={nomePaciente} onChange={e => setNomePaciente(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Nascimento</label>
                <input type="date" className="form-input" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CNS <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="000 0000 0000 0000" maxLength={15} value={cns} onChange={e => setCns(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CPF</label>
                <input className="form-input" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Sexo</label>
                <select className="form-input" value={sexo} onChange={e => setSexo(e.target.value as "M" | "F")}>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
              <div className="col-span-3 sm:col-span-2">
                <label className="form-label">Nome da Mãe</label>
                <input className="form-input" placeholder="Nome completo da mãe" value={nomeMae} onChange={e => setNomeMae(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Raça/Cor</label>
                <select className="form-input" value={raca} onChange={e => setRaca(e.target.value)}>
                  <option value="">Selecione...</option>
                  <option value="1">Branca</option>
                  <option value="2">Preta</option>
                  <option value="3">Parda</option>
                  <option value="4">Amarela</option>
                  <option value="5">Indígena</option>
                </select>
              </div>
              <div>
                <label className="form-label">Peso (kg)</label>
                <input type="number" step="0.1" className="form-input" placeholder="70.5" value={peso} onChange={e => setPeso(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Altura (cm)</label>
                <input type="number" step="1" className="form-input" placeholder="170" value={altura} onChange={e => setAltura(e.target.value)} />
              </div>
              {calcularIMC() && (
                <div>
                  <label className="form-label">IMC Calculado</label>
                  <input className="form-input bg-gray-50" value={calcularIMC()} readOnly />
                </div>
              )}
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              2. Endereço e Contato
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="form-label">Logradouro</label>
                <input className="form-input" placeholder="Rua, Avenida..." value={logradouro} onChange={e => setLogradouro(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Número</label>
                <input className="form-input" placeholder="Nº" value={numero} onChange={e => setNumero(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Complemento</label>
                <input className="form-input" placeholder="Apto, Bloco..." value={complemento} onChange={e => setComplemento(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Bairro</label>
                <input className="form-input" value={bairro} onChange={e => setBairro(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Município</label>
                <input className="form-input" value={municipio} onChange={e => setMunicipio(e.target.value)} />
              </div>
              <div>
                <label className="form-label">UF</label>
                <input className="form-input" maxLength={2} value={uf} onChange={e => setUf(e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="form-label">CEP</label>
                <input className="form-input" placeholder="00000-000" value={cep} onChange={e => setCep(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Telefone</label>
                <input className="form-input" placeholder="(00) 00000-0000" value={telefone} onChange={e => setTelefone(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">E-mail</label>
                <input type="email" className="form-input" placeholder="paciente@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
          </div>

          {/* DIAGNÓSTICO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              3. Diagnóstico (CID-10)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">CID-10 Principal <span className="text-red-500">*</span></label>
                <CIDSearch 
                  value={cidPrincipal}
                  codeName={cidNomePrincipal}
                  onSelect={(code, name) => { setCidPrincipal(code); setCidNomePrincipal(name); }}
                  placeholder="Buscar CID-10 principal..."
                />
              </div>
              <div>
                <label className="form-label">CID-10 Secundário 1 (opcional)</label>
                <CIDSearch 
                  value={cidSecundario1}
                  codeName={cidNomeSecundario1}
                  onSelect={(code, name) => { setCidSecundario1(code); setCidNomeSecundario1(name); }}
                  placeholder="Buscar CID-10 secundário..."
                />
              </div>
              <div>
                <label className="form-label">CID-10 Secundário 2 (opcional)</label>
                <CIDSearch 
                  value={cidSecundario2}
                  codeName={cidNomeSecundario2}
                  onSelect={(code, name) => { setCidSecundario2(code); setCidNomeSecundario2(name); }}
                  placeholder="Buscar CID-10 secundário..."
                />
              </div>
            </div>
          </div>

          {/* DADOS CLÍNICOS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              4. Informações Clínicas
            </h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Resumo Clínico do Caso <span className="text-red-500">*</span></label>
                <textarea className="form-textarea" rows={4} placeholder="Descreva a história clínica, manifestações, evolução da doença..." value={resumoClinico} onChange={e => setResumoClinico(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Exames Complementares Realizados</label>
                <textarea className="form-textarea" rows={3} placeholder="Liste exames laboratoriais, imagem, biópsias, etc. com resultados relevantes..." value={examesRealizados} onChange={e => setExamesRealizados(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Teve tratamento anterior para esta condição?</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tratamento_anterior" className="w-4 h-4" checked={teveTratamentoAnterior === "nao"} onChange={() => setTeveTratamentoAnterior("nao")} />
                    <span className="text-sm font-medium text-gray-700">Não</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tratamento_anterior" className="w-4 h-4" checked={teveTratamentoAnterior === "sim"} onChange={() => setTeveTratamentoAnterior("sim")} />
                    <span className="text-sm font-medium text-gray-700">Sim</span>
                  </label>
                </div>
              </div>
              {teveTratamentoAnterior === "sim" && (
                <>
                  <div>
                    <label className="form-label">Tratamento(s) Prévio(s)</label>
                    <textarea className="form-textarea" rows={2} placeholder="Medicamentos utilizados anteriormente, doses, duração..." value={tratamentoPrevio} onChange={e => setTratamentoPrevio(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Motivo da Interrupção/Troca</label>
                    <textarea className="form-textarea" rows={2} placeholder="Falha terapêutica, efeitos adversos, contraindicação..." value={motivoInterrupcao} onChange={e => setMotivoInterrupcao(e.target.value)} />
                  </div>
                </>
              )}
              <div>
                <label className="form-label">Justificativa para Solicitação do Medicamento Especializado <span className="text-red-500">*</span></label>
                <textarea className="form-textarea" rows={3} placeholder="Justifique tecnicamente conforme PCDT vigente, com referência a protocolos e evidências..." value={justificativaSolicitacao} onChange={e => setJustificativaSolicitacao(e.target.value)} />
              </div>
            </div>
          </div>

          {/* MEDICAMENTOS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider">
                5. Medicamentos Solicitados (Máximo 10)
              </h3>
              <button onClick={addMed} className="flex items-center gap-1 text-sm font-medium text-brand-blue-600 hover:text-brand-blue-700 transition-colors">
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>

            <div className="space-y-4">
              {medicamentos.map((med, idx) => (
                <div key={med.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                  {medicamentos.length > 1 && (
                    <button onClick={() => removeMed(med.id)} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-gray-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <p className="text-xs font-semibold text-gray-500 mb-3">Medicamento {idx + 1}</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className="form-label text-xs">Nome do Medicamento (DCB)</label>
                      <input className="form-input text-sm" placeholder="Denominação Comum Brasileira" value={med.nome} onChange={e => updateMed(med.id, "nome", e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label text-xs">Concentração</label>
                      <input className="form-input text-sm" placeholder="Ex: 500mg" value={med.concentracao} onChange={e => updateMed(med.id, "concentracao", e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label text-xs">Forma Farmacêutica</label>
                      <input className="form-input text-sm" placeholder="Ex: comprimido" value={med.forma_farmaceutica} onChange={e => updateMed(med.id, "forma_farmaceutica", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2 mt-3">
                    <div className="col-span-6 text-xs font-semibold text-gray-600 mb-1">Quantidade por Mês:</div>
                    {[1, 2, 3, 4, 5, 6].map(mes => (
                      <div key={mes}>
                        <label className="form-label text-xs">Mês {mes}</label>
                        <input 
                          type="number" 
                          min="0" 
                          className="form-input text-sm" 
                          placeholder="0" 
                          value={med[`quantidade_mes_${mes}` as keyof MedicamentoLME]} 
                          onChange={e => updateMed(med.id, `quantidade_mes_${mes}` as keyof MedicamentoLME, e.target.value)} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MÉDICO SOLICITANTE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              6. Dados do Médico Solicitante
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome Completo <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="Nome completo do médico" value={nomeMedico} onChange={e => setNomeMedico(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CRM <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input className="form-input flex-1" placeholder="12345" value={crmMedico} onChange={e => setCrmMedico(e.target.value)} />
                  <input className="form-input w-16" maxLength={2} placeholder="UF" value={ufCrm} onChange={e => setUfCrm(e.target.value.toUpperCase())} />
                </div>
              </div>
              <div className="col-span-2">
                <label className="form-label">Especialidade</label>
                <input className="form-input" placeholder="Ex: Reumatologia, Endocrinologia..." value={especialidade} onChange={e => setEspecialidade(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Telefone</label>
                <input className="form-input" placeholder="(00) 0000-0000" value={telefoneConsultorio} onChange={e => setTelefoneConsultorio(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">E-mail</label>
                <input type="email" className="form-input" placeholder="medico@email.com" value={emailMedico} onChange={e => setEmailMedico(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data da Solicitação</label>
                <input type="date" className="form-input" value={dataSolicitacao} onChange={e => setDataSolicitacao(e.target.value)} />
              </div>
            </div>
          </div>

          {/* RESPONSÁVEL LEGAL (se incapaz) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              7. Responsável Legal (se paciente incapaz)
            </h3>
            <div className="mb-3">
              <label className="form-label">O paciente é civilmente incapaz?</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="incapaz" className="w-4 h-4" checked={pacienteIncapaz === "nao"} onChange={() => setPacienteIncapaz("nao")} />
                  <span className="text-sm font-medium text-gray-700">Não</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="incapaz" className="w-4 h-4" checked={pacienteIncapaz === "sim"} onChange={() => setPacienteIncapaz("sim")} />
                  <span className="text-sm font-medium text-gray-700">Sim</span>
                </label>
              </div>
            </div>
            {pacienteIncapaz === "sim" && (
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="form-label">Nome do Responsável Legal</label>
                  <input className="form-input" placeholder="Nome completo" value={nomeResponsavel} onChange={e => setNomeResponsavel(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">CPF do Responsável</label>
                  <input className="form-input" placeholder="000.000.000-00" value={cpfResponsavel} onChange={e => setCpfResponsavel(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Parentesco/Relação</label>
                  <input className="form-input" placeholder="Ex: Pai, Mãe, Tutor..." value={parentesco} onChange={e => setParentesco(e.target.value)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 mt-6">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Imprimir LME
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar Formulário
          </button>
        </div>
      </div>

      {/* IMPRESSÃO */}
      <div className="print-only print-page text-[9pt]">
        <PrintHeaderV2 
          title="Laudo para Solicitação de Medicamentos do CEAF"
          subtitle="Componente Especializado da Assistência Farmacêutica"
          protocolNumber={protocol}
        />

        <div className="space-y-2">
          {/* Paciente */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">1. PACIENTE</p>
            <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-[8pt]">
              <div className="col-span-3"><span className="font-semibold">Nome:</span> {nomePaciente}</div>
              <div><span className="font-semibold">CNS:</span> {cns}</div>
              <div><span className="font-semibold">CPF:</span> {cpf || "Não informado"}</div>
              <div><span className="font-semibold">DN:</span> {dataNascimento ? isoToBR(dataNascimento) : ""}</div>
              <div><span className="font-semibold">Sexo:</span> {sexo === "M" ? "Masculino" : "Feminino"}</div>
              <div><span className="font-semibold">Peso:</span> {peso ? `${peso} kg` : ""}</div>
              <div><span className="font-semibold">Altura:</span> {altura ? `${altura} cm` : ""}</div>
              {nomeMae && <div className="col-span-3"><span className="font-semibold">Mãe:</span> {nomeMae}</div>}
            </div>
          </div>

          {/* Endereço */}
          {logradouro && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">2. ENDEREÇO</p>
              <p className="text-[8pt]">
                {logradouro}, {numero} {complemento && `- ${complemento}`} - {bairro}<br />
                {municipio}/{uf} - CEP: {cep} {telefone && `- Tel: ${telefone}`}
              </p>
            </div>
          )}

          {/* Diagnóstico */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">3. DIAGNÓSTICO</p>
            <div className="text-[8pt] space-y-0.5">
              <p><span className="font-semibold">CID Principal:</span> {cidPrincipal} - {cidNomePrincipal}</p>
              {cidSecundario1 && <p><span className="font-semibold">CID Secundário 1:</span> {cidSecundario1} - {cidNomeSecundario1}</p>}
              {cidSecundario2 && <p><span className="font-semibold">CID Secundário 2:</span> {cidSecundario2} - {cidNomeSecundario2}</p>}
            </div>
          </div>

          {/* Resumo Clínico */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">4. RESUMO CLÍNICO</p>
            <p className="text-[8pt] text-justify whitespace-pre-line">{resumoClinico}</p>
          </div>

          {/* Exames */}
          {examesRealizados && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">5. EXAMES COMPLEMENTARES</p>
              <p className="text-[8pt] text-justify whitespace-pre-line">{examesRealizados}</p>
            </div>
          )}

          {/* Tratamento Prévio */}
          {teveTratamentoAnterior === "sim" && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">6. TRATAMENTO ANTERIOR</p>
              <p className="text-[8pt]"><span className="font-semibold">Medicamentos prévios:</span> {tratamentoPrevio}</p>
              <p className="text-[8pt]"><span className="font-semibold">Motivo da troca:</span> {motivoInterrupcao}</p>
            </div>
          )}

          {/* Justificativa */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">7. JUSTIFICATIVA</p>
            <p className="text-[8pt] text-justify whitespace-pre-line">{justificativaSolicitacao}</p>
          </div>

          {/* Medicamentos */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">8. MEDICAMENTOS SOLICITADOS</p>
            <div className="space-y-2">
              {medicamentos.filter(m => m.nome.trim()).map((med, idx) => (
                <div key={med.id} className="text-[7pt] bg-gray-50 p-1 border border-gray-300">
                  <p className="font-semibold">{idx + 1}. {med.nome} {med.concentracao} {med.forma_farmaceutica}</p>
                  <p className="mt-0.5">
                    <span className="font-semibold">Quantidades:</span>
                    {[1, 2, 3, 4, 5, 6].map(mes => {
                      const qtd = med[`quantidade_mes_${mes}` as keyof MedicamentoLME];
                      return qtd ? ` M${mes}=${qtd}` : "";
                    }).filter(Boolean).join(" | ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Médico */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">9. MÉDICO SOLICITANTE</p>
            <div className="grid grid-cols-2 gap-2 text-[8pt]">
              <div><span className="font-semibold">Nome:</span> {nomeMedico}</div>
              <div><span className="font-semibold">CRM:</span> {crmMedico}/{ufCrm}</div>
              <div><span className="font-semibold">Especialidade:</span> {especialidade}</div>
              <div><span className="font-semibold">Data:</span> {isoToBR(dataSolicitacao)}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-400">
              <div className="h-12 border-b border-gray-500 mb-1"></div>
              <p className="text-center text-[8pt] font-semibold">Assinatura e Carimbo do Médico</p>
            </div>
          </div>

          {/* Responsável */}
          {pacienteIncapaz === "sim" && nomeResponsavel && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">10. RESPONSÁVEL LEGAL</p>
              <div className="text-[8pt]">
                <p><span className="font-semibold">Nome:</span> {nomeResponsavel}</p>
                <p><span className="font-semibold">CPF:</span> {cpfResponsavel} <span className="ml-3 font-semibold">Parentesco:</span> {parentesco}</p>
              </div>
            </div>
          )}
        </div>

        <PrintFooter />
      </div>
    </div>
  );
}
