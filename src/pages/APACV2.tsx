/**
 * APACV2.tsx
 * Autorização de Procedimento de Alta Complexidade/Custo (APAC)
 * Sistema de Informação Ambulatorial (SIA/SUS)
 * 
 * Referências:
 * - Portaria SAS/MS nº 768/2006 (Regulamenta APAC)
 * - Manual Técnico Operacional do SIA/SUS
 * - Tabela de Procedimentos, Medicamentos e OPM do SUS
 */

import { useState } from "react";
import { Printer, RotateCcw, Save, AlertCircle, Info, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR, generateId } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import { generateProtocol } from "@/lib/protocol";
import PrintHeaderV2 from "@/components/print/PrintHeaderV2";
import PrintFooter from "@/components/print/PrintFooter";
import CIDSearch from "@/components/ui/CIDSearch";

// Tipos de APAC
const TIPO_APAC = [
  { value: "1", label: "APAC Principal" },
  { value: "2", label: "APAC de Continuidade" },
  { value: "3", label: "APAC Única" },
];

// Modalidades de atendimento
const MODALIDADE_ATENDIMENTO = [
  { value: "01", label: "Quimioterapia" },
  { value: "02", label: "Radioterapia" },
  { value: "03", label: "Hemoterapia" },
  { value: "04", label: "Hemodiálise" },
  { value: "05", label: "Diálise Peritoneal" },
  { value: "06", label: "Terapia Renal Substitutiva" },
  { value: "07", label: "Acompanhamento Multiprofissional" },
  { value: "08", label: "Medicamentos" },
  { value: "09", label: "Órteses, Próteses e Materiais Especiais" },
  { value: "10", label: "Outros" },
];

// Finalidade do tratamento (oncologia)
const FINALIDADE_TRATAMENTO = [
  { value: "1", label: "Curativa" },
  { value: "2", label: "Paliativa" },
  { value: "3", label: "Profilática" },
  { value: "4", label: "Diagnóstica" },
];

interface ProcedimentoAPAC {
  id: string;
  codigo_sus: string;
  descricao: string;
  quantidade: string;
  data_inicio: string;
  data_fim: string;
}

function emptyProcedimento(): ProcedimentoAPAC {
  return {
    id: generateId(),
    codigo_sus: "",
    descricao: "",
    quantidade: "1",
    data_inicio: todayISO(),
    data_fim: "",
  };
}

export default function APACV2() {
  const [protocol] = useState(() => generateProtocol('APC'));

  // DADOS DO ESTABELECIMENTO
  const [cnes, setCnes] = useState("2337614"); // HC-UFG
  const [nomeEstabelecimento] = useState("Hospital das Clínicas - UFG");

  // DADOS DO PACIENTE
  const [nomePaciente, setNomePaciente] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [cns, setCns] = useState(""); // Cartão Nacional de Saúde
  const [nomeMae, setNomeMae] = useState("");
  const [sexo, setSexo] = useState<"M" | "F">("M");
  const [raca, setRaca] = useState("");
  
  // ENDEREÇO
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [municipio, setMunicipio] = useState("Goiânia");
  const [codMunicipio, setCodMunicipio] = useState("520870"); // Código IBGE Goiânia
  const [uf, setUf] = useState("GO");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");

  // DADOS DA APAC
  const [tipoApac, setTipoApac] = useState("1");
  const [numeroApacAnterior, setNumeroApacAnterior] = useState("");
  const [modalidade, setModalidade] = useState("01");
  const [dataAutorizacao, setDataAutorizacao] = useState(todayISO());
  const [dataInicioTratamento, setDataInicioTratamento] = useState(todayISO());
  const [dataFimTratamento, setDataFimTratamento] = useState("");
  const [validadeInicio, setValidadeInicio] = useState(todayISO());
  const [validadeFim, setValidadeFim] = useState("");

  // DIAGNÓSTICO
  const [cidPrincipal, setCidPrincipal] = useState("");
  const [cidNomePrincipal, setCidNomePrincipal] = useState("");
  const [cidSecundario, setCidSecundario] = useState("");
  const [cidNomeSecundario, setCidNomeSecundario] = useState("");
  const [cidCausa, setCidCausa] = useState("");
  const [cidNomeCausa, setCidNomeCausa] = useState("");

  // DADOS CLÍNICOS
  const [estadiamento, setEstadiamento] = useState(""); // Para oncologia
  const [ecog, setEcog] = useState(""); // Performance Status (0-4)
  const [finalidade, setFinalidade] = useState("1");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [superficieCorporal, setSuperficieCorporal] = useState("");
  
  // DADOS CLÍNICOS ESPECÍFICOS
  const [resumoClinico, setResumoClinico] = useState("");
  const [examesRealizados, setExamesRealizados] = useState("");
  const [justificativa, setJustificativa] = useState("");
  
  // TRATAMENTO ANTERIOR
  const [teveTratamentoAnterior, setTeveTratamentoAnterior] = useState<"nao" | "sim">("nao");
  const [tratamentoAnterior, setTratamentoAnterior] = useState("");

  // PROCEDIMENTOS SOLICITADOS
  const [procedimentos, setProcedimentos] = useState<ProcedimentoAPAC[]>([emptyProcedimento()]);

  // MÉDICO SOLICITANTE
  const [nomeMedico, setNomeMedico] = useState("");
  const [crmMedico, setCrmMedico] = useState("");
  const [ufCrm, setUfCrm] = useState("GO");
  const [especialidade, setEspecialidade] = useState("");
  const [cbos, setCbos] = useState(""); // Código Brasileiro de Ocupações
  const [dataSolicitacao, setDataSolicitacao] = useState(todayISO());

  function updateProcedimento(id: string, field: keyof ProcedimentoAPAC, value: string) {
    setProcedimentos(prev =>
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  }

  function removeProcedimento(id: string) {
    if (procedimentos.length === 1) {
      toast.info("Mantenha ao menos um procedimento.");
      return;
    }
    setProcedimentos(prev => prev.filter(p => p.id !== id));
  }

  function addProcedimento() {
    if (procedimentos.length >= 10) {
      toast.error("Limite máximo de 10 procedimentos por APAC.");
      return;
    }
    setProcedimentos(prev => [...prev, emptyProcedimento()]);
  }

  function calcularSuperficieCorporal() {
    if (!peso || !altura) return;
    const p = parseFloat(peso);
    const h = parseFloat(altura) / 100;
    if (p > 0 && h > 0) {
      // Fórmula de Mosteller: SC (m²) = √[(altura(cm) × peso(kg)) / 3600]
      const sc = Math.sqrt((parseFloat(altura) * p) / 3600);
      setSuperficieCorporal(sc.toFixed(2));
    }
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
    if (procedimentos.every(p => !p.codigo_sus.trim() && !p.descricao.trim())) {
      toast.error("Adicione ao menos um procedimento.");
      return false;
    }
    if (!nomeMedico.trim() || !crmMedico.trim()) {
      toast.error("Informe os dados do médico solicitante.");
      return false;
    }
    if (!justificativa.trim()) {
      toast.error("Informe a justificativa clínica.");
      return false;
    }
    return true;
  }

  function handleClear() {
    setNomePaciente(""); setDataNascimento(""); setCpf(""); setCns("");
    setNomeMae(""); setPeso(""); setAltura(""); setSuperficieCorporal("");
    setLogradouro(""); setNumero(""); setComplemento(""); setBairro("");
    setCep(""); setTelefone(""); setCidPrincipal(""); setCidNomePrincipal("");
    setCidSecundario(""); setCidNomeSecundario(""); setCidCausa(""); setCidNomeCausa("");
    setEstadiamento(""); setEcog(""); setResumoClinico(""); setExamesRealizados("");
    setJustificativa(""); setTeveTratamentoAnterior("nao"); setTratamentoAnterior("");
    setProcedimentos([emptyProcedimento()]); setNomeMedico(""); setCrmMedico("");
    setEspecialidade(""); setCbos(""); setDataSolicitacao(todayISO());
    setDataAutorizacao(todayISO()); setDataInicioTratamento(todayISO());
    setDataFimTratamento(""); setValidadeInicio(todayISO()); setValidadeFim("");
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!validateForm()) return;
    
    addHistoryEntry({
      type: "apac",
      label: "APAC - Procedimento Alta Complexidade",
      patientName: nomePaciente,
      date: dataAutorizacao,
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
              APAC – Autorização de Procedimento de Alta Complexidade
            </h1>
            <p className="text-sm text-gray-500">
              Sistema de Informação Ambulatorial (SIA/SUS)
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-xs font-semibold text-blue-900">Protocolo</p>
            <p className="text-sm font-mono text-blue-700">{protocol}</p>
          </div>
        </div>

        {/* Alerta APAC */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Atenção - Procedimento de Alta Complexidade</p>
            <p>
              Este formulário deve ser preenchido conforme Manual do SIA/SUS. Consulte a Tabela de Procedimentos
              SUS para códigos corretos. APACs requerem autorização prévia da gestão de saúde.
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
                <input className="form-input bg-gray-50" value={cnes} onChange={e => setCnes(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">Nome do Estabelecimento</label>
                <input className="form-input bg-gray-50" value={nomeEstabelecimento} readOnly />
              </div>
            </div>
          </div>

          {/* DADOS DA APAC */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              2. Dados da APAC
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="form-label">Tipo de APAC</label>
                <select className="form-input" value={tipoApac} onChange={e => setTipoApac(e.target.value)}>
                  {TIPO_APAC.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              {tipoApac === "2" && (
                <div>
                  <label className="form-label">Nº APAC Anterior</label>
                  <input className="form-input" placeholder="0000000000000" value={numeroApacAnterior} onChange={e => setNumeroApacAnterior(e.target.value)} />
                </div>
              )}
              <div>
                <label className="form-label">Modalidade de Atendimento</label>
                <select className="form-input" value={modalidade} onChange={e => setModalidade(e.target.value)}>
                  {MODALIDADE_ATENDIMENTO.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Data de Autorização</label>
                <input type="date" className="form-input" value={dataAutorizacao} onChange={e => setDataAutorizacao(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Início do Tratamento</label>
                <input type="date" className="form-input" value={dataInicioTratamento} onChange={e => setDataInicioTratamento(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Fim do Tratamento</label>
                <input type="date" className="form-input" value={dataFimTratamento} onChange={e => setDataFimTratamento(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Validade Início</label>
                <input type="date" className="form-input" value={validadeInicio} onChange={e => setValidadeInicio(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Validade Fim</label>
                <input type="date" className="form-input" value={validadeFim} onChange={e => setValidadeFim(e.target.value)} />
              </div>
            </div>
          </div>

          {/* IDENTIFICAÇÃO DO PACIENTE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              3. Identificação do Paciente
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
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              4. Endereço do Paciente
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
                <label className="form-label">Cód. IBGE Município</label>
                <input className="form-input" placeholder="000000" maxLength={6} value={codMunicipio} onChange={e => setCodMunicipio(e.target.value)} />
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
            </div>
          </div>

          {/* DIAGNÓSTICO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              5. Diagnóstico (CID-10)
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
                <label className="form-label">CID-10 Secundário (opcional)</label>
                <CIDSearch
                  value={cidSecundario}
                  codeName={cidNomeSecundario}
                  onSelect={(code, name) => { setCidSecundario(code); setCidNomeSecundario(name); }}
                  placeholder="Buscar CID-10 secundário..."
                />
              </div>
              <div>
                <label className="form-label">CID-10 Causa/Associado (opcional)</label>
                <CIDSearch
                  value={cidCausa}
                  codeName={cidNomeCausa}
                  onSelect={(code, name) => { setCidCausa(code); setCidNomeCausa(name); }}
                  placeholder="Buscar CID-10 causa..."
                />
              </div>
            </div>
          </div>

          {/* DADOS CLÍNICOS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              6. Dados Clínicos
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="form-label">Peso (kg)</label>
                  <input type="number" step="0.1" className="form-input" placeholder="70.5" value={peso} onChange={e => setPeso(e.target.value)} onBlur={calcularSuperficieCorporal} />
                </div>
                <div>
                  <label className="form-label">Altura (cm)</label>
                  <input type="number" step="1" className="form-input" placeholder="170" value={altura} onChange={e => setAltura(e.target.value)} onBlur={calcularSuperficieCorporal} />
                </div>
                <div>
                  <label className="form-label">Superfície Corporal (m²)</label>
                  <input className="form-input bg-gray-50" value={superficieCorporal} onChange={e => setSuperficieCorporal(e.target.value)} placeholder="Calculado auto." />
                </div>
                <div>
                  <label className="form-label">ECOG (0-4)</label>
                  <select className="form-input" value={ecog} onChange={e => setEcog(e.target.value)}>
                    <option value="">Selecione...</option>
                    <option value="0">0 - Ativo, sem restrições</option>
                    <option value="1">1 - Restrição leve</option>
                    <option value="2">2 - Restrição moderada</option>
                    <option value="3">3 - Muito limitado</option>
                    <option value="4">4 - Acamado</option>
                  </select>
                </div>
              </div>

              {modalidade === "01" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Estadiamento (TNM)</label>
                      <input className="form-input" placeholder="Ex: T2N1M0" value={estadiamento} onChange={e => setEstadiamento(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Finalidade do Tratamento</label>
                      <select className="form-input" value={finalidade} onChange={e => setFinalidade(e.target.value)}>
                        {FINALIDADE_TRATAMENTO.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="form-label">Resumo Clínico <span className="text-red-500">*</span></label>
                <textarea className="form-textarea" rows={4} placeholder="História clínica, evolução da doença, sintomas principais..." value={resumoClinico} onChange={e => setResumoClinico(e.target.value)} />
              </div>

              <div>
                <label className="form-label">Exames Complementares</label>
                <textarea className="form-textarea" rows={3} placeholder="Lista de exames realizados com resultados relevantes..." value={examesRealizados} onChange={e => setExamesRealizados(e.target.value)} />
              </div>

              <div>
                <label className="form-label">Teve tratamento anterior para esta condição?</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tratamento_ant" className="w-4 h-4" checked={teveTratamentoAnterior === "nao"} onChange={() => setTeveTratamentoAnterior("nao")} />
                    <span className="text-sm font-medium text-gray-700">Não</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tratamento_ant" className="w-4 h-4" checked={teveTratamentoAnterior === "sim"} onChange={() => setTeveTratamentoAnterior("sim")} />
                    <span className="text-sm font-medium text-gray-700">Sim</span>
                  </label>
                </div>
              </div>

              {teveTratamentoAnterior === "sim" && (
                <div>
                  <label className="form-label">Tratamento Anterior Realizado</label>
                  <textarea className="form-textarea" rows={2} placeholder="Descreva tratamentos prévios, medicamentos, procedimentos..." value={tratamentoAnterior} onChange={e => setTratamentoAnterior(e.target.value)} />
                </div>
              )}

              <div>
                <label className="form-label">Justificativa Clínica <span className="text-red-500">*</span></label>
                <textarea className="form-textarea" rows={4} placeholder="Justifique tecnicamente a necessidade do procedimento de alta complexidade..." value={justificativa} onChange={e => setJustificativa(e.target.value)} />
              </div>
            </div>
          </div>

          {/* PROCEDIMENTOS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider">
                7. Procedimentos Solicitados (Máximo 10)
              </h3>
              <button onClick={addProcedimento} className="flex items-center gap-1 text-sm font-medium text-brand-blue-600 hover:text-brand-blue-700 transition-colors">
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>

            <div className="space-y-4">
              {procedimentos.map((proc, idx) => (
                <div key={proc.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                  {procedimentos.length > 1 && (
                    <button onClick={() => removeProcedimento(proc.id)} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-gray-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <p className="text-xs font-semibold text-gray-500 mb-3">Procedimento {idx + 1}</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="form-label text-xs">Código SUS</label>
                      <input className="form-input text-sm" placeholder="00.00.00.000-0" value={proc.codigo_sus} onChange={e => updateProcedimento(proc.id, "codigo_sus", e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="form-label text-xs">Descrição do Procedimento</label>
                      <input className="form-input text-sm" placeholder="Nome conforme Tabela SUS" value={proc.descricao} onChange={e => updateProcedimento(proc.id, "descricao", e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label text-xs">Quantidade</label>
                      <input type="number" min="1" className="form-input text-sm" value={proc.quantidade} onChange={e => updateProcedimento(proc.id, "quantidade", e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label text-xs">Data Início</label>
                      <input type="date" className="form-input text-sm" value={proc.data_inicio} onChange={e => updateProcedimento(proc.id, "data_inicio", e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label text-xs">Data Fim</label>
                      <input type="date" className="form-input text-sm" value={proc.data_fim} onChange={e => updateProcedimento(proc.id, "data_fim", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MÉDICO SOLICITANTE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              8. Dados do Médico Solicitante
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
              <div>
                <label className="form-label">Especialidade</label>
                <input className="form-input" placeholder="Ex: Oncologia, Nefrologia..." value={especialidade} onChange={e => setEspecialidade(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CBO (Código Brasileiro de Ocupações)</label>
                <input className="form-input" placeholder="000000" maxLength={6} value={cbos} onChange={e => setCbos(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data da Solicitação</label>
                <input type="date" className="form-input" value={dataSolicitacao} onChange={e => setDataSolicitacao(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 mt-6">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Imprimir APAC
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
      <div className="print-only print-page text-[9pt]">
        <PrintHeaderV2
          title="Autorização de Procedimento de Alta Complexidade/Custo (APAC)"
          subtitle="Sistema de Informação Ambulatorial - SIA/SUS"
          protocolNumber={protocol}
        />

        <div className="space-y-2">
          {/* Estabelecimento e APAC */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">1. ESTABELECIMENTO E APAC</p>
            <div className="grid grid-cols-4 gap-x-3 gap-y-0.5 text-[8pt]">
              <div><span className="font-semibold">CNES:</span> {cnes}</div>
              <div className="col-span-2"><span className="font-semibold">Estabelecimento:</span> {nomeEstabelecimento}</div>
              <div><span className="font-semibold">Tipo:</span> {TIPO_APAC.find(t => t.value === tipoApac)?.label}</div>
              <div><span className="font-semibold">Modalidade:</span> {MODALIDADE_ATENDIMENTO.find(m => m.value === modalidade)?.label}</div>
              <div><span className="font-semibold">Autorização:</span> {isoToBR(dataAutorizacao)}</div>
              <div><span className="font-semibold">Início:</span> {isoToBR(dataInicioTratamento)}</div>
              <div><span className="font-semibold">Fim:</span> {dataFimTratamento ? isoToBR(dataFimTratamento) : "—"}</div>
            </div>
          </div>

          {/* Paciente */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">2. PACIENTE</p>
            <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-[8pt]">
              <div className="col-span-3"><span className="font-semibold">Nome:</span> {nomePaciente}</div>
              <div><span className="font-semibold">CNS:</span> {cns}</div>
              <div><span className="font-semibold">CPF:</span> {cpf || "—"}</div>
              <div><span className="font-semibold">DN:</span> {dataNascimento ? isoToBR(dataNascimento) : ""}</div>
              <div><span className="font-semibold">Sexo:</span> {sexo === "M" ? "Masculino" : "Feminino"}</div>
              {nomeMae && <div className="col-span-2"><span className="font-semibold">Mãe:</span> {nomeMae}</div>}
            </div>
          </div>

          {/* Endereço */}
          {logradouro && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">3. ENDEREÇO</p>
              <p className="text-[8pt]">
                {logradouro}, {numero} {complemento && `- ${complemento}`} - {bairro}<br />
                {municipio}/{uf} (IBGE: {codMunicipio}) - CEP: {cep} {telefone && `- Tel: ${telefone}`}
              </p>
            </div>
          )}

          {/* Diagnóstico */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">4. DIAGNÓSTICO</p>
            <div className="text-[8pt] space-y-0.5">
              <p><span className="font-semibold">CID Principal:</span> {cidPrincipal} - {cidNomePrincipal}</p>
              {cidSecundario && <p><span className="font-semibold">CID Secundário:</span> {cidSecundario} - {cidNomeSecundario}</p>}
              {cidCausa && <p><span className="font-semibold">CID Causa:</span> {cidCausa} - {cidNomeCausa}</p>}
            </div>
          </div>

          {/* Dados Clínicos */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">5. DADOS CLÍNICOS</p>
            <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-[8pt] mb-2">
              {peso && <div><span className="font-semibold">Peso:</span> {peso} kg</div>}
              {altura && <div><span className="font-semibold">Altura:</span> {altura} cm</div>}
              {superficieCorporal && <div><span className="font-semibold">SC:</span> {superficieCorporal} m²</div>}
              {ecog && <div><span className="font-semibold">ECOG:</span> {ecog}</div>}
              {estadiamento && <div><span className="font-semibold">Estadiamento:</span> {estadiamento}</div>}
              {finalidade && modalidade === "01" && <div><span className="font-semibold">Finalidade:</span> {FINALIDADE_TRATAMENTO.find(f => f.value === finalidade)?.label}</div>}
            </div>
            <div className="text-[8pt] space-y-1">
              <div>
                <p className="font-semibold mb-0.5">Resumo Clínico:</p>
                <p className="text-justify whitespace-pre-line">{resumoClinico}</p>
              </div>
              {examesRealizados && (
                <div>
                  <p className="font-semibold mb-0.5">Exames:</p>
                  <p className="whitespace-pre-line">{examesRealizados}</p>
                </div>
              )}
              {teveTratamentoAnterior === "sim" && tratamentoAnterior && (
                <div>
                  <p className="font-semibold mb-0.5">Tratamento Anterior:</p>
                  <p>{tratamentoAnterior}</p>
                </div>
              )}
              <div>
                <p className="font-semibold mb-0.5">Justificativa:</p>
                <p className="text-justify whitespace-pre-line">{justificativa}</p>
              </div>
            </div>
          </div>

          {/* Procedimentos */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">6. PROCEDIMENTOS AUTORIZADOS</p>
            <div className="space-y-1">
              {procedimentos.filter(p => p.codigo_sus || p.descricao).map((proc, idx) => (
                <div key={proc.id} className="text-[7pt] bg-gray-50 p-1 border border-gray-300">
                  <p>
                    <span className="font-semibold">{idx + 1}.</span> {proc.descricao}
                    {proc.codigo_sus && <span className="ml-2">(Cód: {proc.codigo_sus})</span>}
                    <span className="ml-2">Qtd: {proc.quantidade}</span>
                    <span className="ml-2">Período: {isoToBR(proc.data_inicio)} {proc.data_fim && `a ${isoToBR(proc.data_fim)}`}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Médico */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">7. MÉDICO SOLICITANTE</p>
            <div className="grid grid-cols-3 gap-2 text-[8pt]">
              <div className="col-span-2"><span className="font-semibold">Nome:</span> {nomeMedico}</div>
              <div><span className="font-semibold">CRM:</span> {crmMedico}/{ufCrm}</div>
              <div><span className="font-semibold">Especialidade:</span> {especialidade}</div>
              <div><span className="font-semibold">CBO:</span> {cbos}</div>
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
