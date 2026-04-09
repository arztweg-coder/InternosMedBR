/**
 * AltaHospitalarV2.tsx
 * Resumo de Alta Hospitalar Otimizado
 * 
 * Melhorias:
 * - Sistema de protocolos
 * - Layout de impressão profissional
 * - Validação de CRM
 * - Campos estruturados por seções
 * - Rodapé com ArztWeg
 */

import { useState } from "react";
import { Printer, RotateCcw, FileCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import { generateProtocol } from "@/lib/protocol";
import { validateCRM } from "@/lib/auth-v2";
import PrintHeaderV2 from "@/components/print/PrintHeaderV2";
import PrintFooter from "@/components/print/PrintFooter";
import CIDSearch from "@/components/ui/CIDSearch";

export default function AltaHospitalarV2() {
  const [protocol] = useState(() => generateProtocol('ALT'));

  // DADOS DO PACIENTE
  const [nomePaciente, setNomePaciente] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [prontuario, setProntuario] = useState("");
  const [leito, setLeito] = useState("");

  // DADOS DA INTERNAÇÃO
  const [dataInternacao, setDataInternacao] = useState("");
  const [dataAlta, setDataAlta] = useState(todayISO());
  const [tipoAlta, setTipoAlta] = useState("melhorado"); // melhorado, curado, transferido, obito, evasao
  const [setor, setSetor] = useState("");

  // DIAGNÓSTICOS
  const [diagnosticoAdmissao, setDiagnosticoAdmissao] = useState("");
  const [cidAdmissao, setCidAdmissao] = useState("");
  const [cidNomeAdmissao, setCidNomeAdmissao] = useState("");
  
  const [diagnosticoAlta, setDiagnosticoAlta] = useState("");
  const [cidAlta, setCidAlta] = useState("");
  const [cidNomeAlta, setCidNomeAlta] = useState("");

  const [diagnosticoSecundario, setDiagnosticoSecundario] = useState("");
  const [cidSecundario, setCidSecundario] = useState("");
  const [cidNomeSecundario, setCidNomeSecundario] = useState("");

  // EVOLUÇÃO E PROCEDIMENTOS
  const [resumoEvolucao, setResumoEvolucao] = useState("");
  const [procedimentosRealizados, setProcedimentosRealizados] = useState("");
  const [complicacoes, setComplicacoes] = useState("");
  const [examesRelevantes, setExamesRelevantes] = useState("");

  // ALTA E ORIENTAÇÕES
  const [condicaoAlta, setCondicaoAlta] = useState("");
  const [medicacoesPrescritas, setMedicacoesPrescritas] = useState("");
  const [orientacoesAlta, setOrientacoesAlta] = useState("");
  const [restricoes, setRestricoes] = useState("");
  const [acompanhamento, setAcompanhamento] = useState("");
  const [dataRetorno, setDataRetorno] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // MÉDICO RESPONSÁVEL
  const [nomeMedico, setNomeMedico] = useState("");
  const [crmMedico, setCrmMedico] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [crmValido, setCrmValido] = useState(true);

  function handleCRMChange(value: string) {
    setCrmMedico(value);
    if (value.trim()) {
      setCrmValido(validateCRM(value));
    } else {
      setCrmValido(true);
    }
  }

  function validateForm(): boolean {
    if (!nomePaciente.trim()) {
      toast.error("Informe o nome do paciente.");
      return false;
    }
    if (!diagnosticoAlta.trim()) {
      toast.error("Informe o diagnóstico de alta.");
      return false;
    }
    if (!nomeMedico.trim()) {
      toast.error("Informe o nome do médico responsável.");
      return false;
    }
    if (!crmMedico.trim()) {
      toast.error("Informe o CRM do médico.");
      return false;
    }
    if (!crmValido) {
      toast.error("CRM em formato inválido.");
      return false;
    }
    return true;
  }

  function handleClear() {
    setNomePaciente(""); setDataNascimento(""); setProntuario(""); setLeito("");
    setDataInternacao(""); setDataAlta(todayISO()); setTipoAlta("melhorado"); setSetor("");
    setDiagnosticoAdmissao(""); setCidAdmissao(""); setCidNomeAdmissao("");
    setDiagnosticoAlta(""); setCidAlta(""); setCidNomeAlta("");
    setDiagnosticoSecundario(""); setCidSecundario(""); setCidNomeSecundario("");
    setResumoEvolucao(""); setProcedimentosRealizados(""); setComplicacoes("");
    setExamesRelevantes(""); setCondicaoAlta(""); setMedicacoesPrescritas("");
    setOrientacoesAlta(""); setRestricoes(""); setAcompanhamento("");
    setDataRetorno(""); setObservacoes(""); setNomeMedico("");
    setCrmMedico(""); setEspecialidade("");
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!validateForm()) return;

    addHistoryEntry({
      type: "alta",
      label: "Alta Hospitalar",
      patientName: nomePaciente,
      date: dataAlta,
    });

    window.print();
  }

  function calcularTempoInternacao(): string {
    if (!dataInternacao || !dataAlta) return "";
    const d1 = new Date(dataInternacao);
    const d2 = new Date(dataAlta);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dia(s)`;
  }

  return (
    <div className="animate-fade-in">
      {/* FORMULÁRIO */}
      <div className="no-print">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Resumo de Alta Hospitalar
            </h1>
            <p className="text-sm text-gray-500">
              Documento estruturado de alta com evolução completa
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-xs font-semibold text-blue-900">Protocolo</p>
            <p className="text-sm font-mono text-blue-700">{protocol}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* IDENTIFICAÇÃO DO PACIENTE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              1. Identificação do Paciente
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome Completo <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="Nome completo" value={nomePaciente} onChange={e => setNomePaciente(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Nascimento</label>
                <input type="date" className="form-input" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Prontuário</label>
                <input className="form-input" placeholder="Nº prontuário" value={prontuario} onChange={e => setProntuario(e.target.value)} />
              </div>
            </div>
          </div>

          {/* DADOS DA INTERNAÇÃO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              2. Dados da Internação
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="form-label">Data de Internação</label>
                <input type="date" className="form-input" value={dataInternacao} onChange={e => setDataInternacao(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Alta</label>
                <input type="date" className="form-input" value={dataAlta} onChange={e => setDataAlta(e.target.value)} />
              </div>
              {calcularTempoInternacao() && (
                <div>
                  <label className="form-label">Tempo de Internação</label>
                  <input className="form-input bg-gray-50" value={calcularTempoInternacao()} readOnly />
                </div>
              )}
              <div>
                <label className="form-label">Tipo de Alta</label>
                <select className="form-input" value={tipoAlta} onChange={e => setTipoAlta(e.target.value)}>
                  <option value="melhorado">Melhorado</option>
                  <option value="curado">Curado</option>
                  <option value="transferido">Transferido</option>
                  <option value="obito">Óbito</option>
                  <option value="evasao">Evasão</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              <div>
                <label className="form-label">Setor/Clínica</label>
                <input className="form-input" placeholder="Ex: Clínica Médica" value={setor} onChange={e => setSetor(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Leito</label>
                <input className="form-input" placeholder="Ex: 201-A" value={leito} onChange={e => setLeito(e.target.value)} />
              </div>
            </div>
          </div>

          {/* DIAGNÓSTICOS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              3. Diagnósticos
            </h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Diagnóstico de Admissão</label>
                <input className="form-input mb-2" placeholder="Hipótese diagnóstica inicial" value={diagnosticoAdmissao} onChange={e => setDiagnosticoAdmissao(e.target.value)} />
                <CIDSearch value={cidAdmissao} codeName={cidNomeAdmissao} onSelect={(code, name) => { setCidAdmissao(code); setCidNomeAdmissao(name); }} placeholder="CID-10 de admissão..." />
              </div>
              <div>
                <label className="form-label">Diagnóstico de Alta (Principal) <span className="text-red-500">*</span></label>
                <input className="form-input mb-2" placeholder="Diagnóstico confirmado na alta" value={diagnosticoAlta} onChange={e => setDiagnosticoAlta(e.target.value)} />
                <CIDSearch value={cidAlta} codeName={cidNomeAlta} onSelect={(code, name) => { setCidAlta(code); setCidNomeAlta(name); }} placeholder="CID-10 de alta..." />
              </div>
              <div>
                <label className="form-label">Diagnósticos Secundários (opcional)</label>
                <input className="form-input mb-2" placeholder="Comorbidades ou diagnósticos associados" value={diagnosticoSecundario} onChange={e => setDiagnosticoSecundario(e.target.value)} />
                <CIDSearch value={cidSecundario} codeName={cidNomeSecundario} onSelect={(code, name) => { setCidSecundario(code); setCidNomeSecundario(name); }} placeholder="CID-10 secundário..." />
              </div>
            </div>
          </div>

          {/* EVOLUÇÃO E PROCEDIMENTOS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              4. Evolução e Procedimentos
            </h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Resumo da Evolução Clínica</label>
                <textarea className="form-textarea" rows={4} placeholder="Evolução do quadro clínico durante a internação..." value={resumoEvolucao} onChange={e => setResumoEvolucao(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Procedimentos Realizados</label>
                <textarea className="form-textarea" rows={3} placeholder="Cirurgias, intervenções, procedimentos diagnósticos e terapêuticos..." value={procedimentosRealizados} onChange={e => setProcedimentosRealizados(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Complicações (se houver)</label>
                <textarea className="form-textarea" rows={2} placeholder="Descreva intercorrências ou complicações durante a internação..." value={complicacoes} onChange={e => setComplicacoes(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Exames Relevantes</label>
                <textarea className="form-textarea" rows={3} placeholder="Principais exames realizados e resultados importantes..." value={examesRelevantes} onChange={e => setExamesRelevantes(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ALTA E ORIENTAÇÕES */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              5. Condições de Alta e Orientações
            </h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Condição Clínica na Alta</label>
                <textarea className="form-textarea" rows={2} placeholder="Estado geral, sinais vitais, capacidade funcional..." value={condicaoAlta} onChange={e => setCondicaoAlta(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Medicações Prescritas na Alta</label>
                <textarea className="form-textarea" rows={4} placeholder={"1. Dipirona 500mg - 1 cp VO 6/6h se dor\n2. Omeprazol 20mg - 1 cp VO em jejum\n..."} value={medicacoesPrescritas} onChange={e => setMedicacoesPrescritas(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Orientações Gerais</label>
                <textarea className="form-textarea" rows={3} placeholder="Cuidados, alimentação, atividades permitidas..." value={orientacoesAlta} onChange={e => setOrientacoesAlta(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Restrições e Limitações</label>
                <textarea className="form-textarea" rows={2} placeholder="Repouso, restrição de atividades físicas, dieta..." value={restricoes} onChange={e => setRestricoes(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Acompanhamento Ambulatorial</label>
                <textarea className="form-textarea" rows={2} placeholder="Retorno ambulatorial, encaminhamentos, exames de controle..." value={acompanhamento} onChange={e => setAcompanhamento(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Data de Retorno Sugerida</label>
                <input type="date" className="form-input w-48" value={dataRetorno} onChange={e => setDataRetorno(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Observações Adicionais</label>
                <textarea className="form-textarea" rows={2} placeholder="Informações complementares..." value={observacoes} onChange={e => setObservacoes(e.target.value)} />
              </div>
            </div>
          </div>

          {/* MÉDICO RESPONSÁVEL */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              6. Médico Responsável
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome Completo <span className="text-red-500">*</span></label>
                <input className="form-input" placeholder="Nome do médico" value={nomeMedico} onChange={e => setNomeMedico(e.target.value)} />
              </div>
              <div>
                <label className="form-label">CRM/UF <span className="text-red-500">*</span></label>
                <input
                  className={`form-input ${!crmValido && crmMedico ? "border-red-500 bg-red-50" : ""}`}
                  placeholder="CRM/GO 12345"
                  value={crmMedico}
                  onChange={e => handleCRMChange(e.target.value)}
                />
                {!crmValido && crmMedico && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Formato inválido
                  </p>
                )}
              </div>
              <div className="col-span-3">
                <label className="form-label">Especialidade</label>
                <input className="form-input" placeholder="Ex: Clínica Médica" value={especialidade} onChange={e => setEspecialidade(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 mt-6">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Imprimir Alta
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* IMPRESSÃO */}
      <div className="print-only print-page text-[9pt]">
        <PrintHeaderV2 title="Resumo de Alta Hospitalar" protocolNumber={protocol} />

        <div className="space-y-3">
          {/* Identificação */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">IDENTIFICAÇÃO</p>
            <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-[8pt]">
              <div className="col-span-2"><span className="font-semibold">Paciente:</span> {nomePaciente}</div>
              {dataNascimento && <div><span className="font-semibold">DN:</span> {isoToBR(dataNascimento)}</div>}
              {prontuario && <div><span className="font-semibold">Prontuário:</span> {prontuario}</div>}
              {setor && <div><span className="font-semibold">Setor:</span> {setor}</div>}
              {leito && <div><span className="font-semibold">Leito:</span> {leito}</div>}
            </div>
          </div>

          {/* Internação */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">INTERNAÇÃO</p>
            <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-[8pt]">
              {dataInternacao && <div><span className="font-semibold">Admissão:</span> {isoToBR(dataInternacao)}</div>}
              <div><span className="font-semibold">Alta:</span> {isoToBR(dataAlta)}</div>
              {calcularTempoInternacao() && <div><span className="font-semibold">Permanência:</span> {calcularTempoInternacao()}</div>}
              <div className="col-span-2"><span className="font-semibold">Tipo de Alta:</span> {tipoAlta.charAt(0).toUpperCase() + tipoAlta.slice(1)}</div>
            </div>
          </div>

          {/* Diagnósticos */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">DIAGNÓSTICOS</p>
            <div className="text-[8pt] space-y-0.5">
              {diagnosticoAdmissao && (
                <p><span className="font-semibold">Admissão:</span> {diagnosticoAdmissao} {cidAdmissao && `(CID: ${cidAdmissao})`}</p>
              )}
              <p><span className="font-semibold">Alta (Principal):</span> {diagnosticoAlta} {cidAlta && `(CID: ${cidAlta})`}</p>
              {diagnosticoSecundario && (
                <p><span className="font-semibold">Secundários:</span> {diagnosticoSecundario} {cidSecundario && `(CID: ${cidSecundario})`}</p>
              )}
            </div>
          </div>

          {/* Evolução */}
          {resumoEvolucao && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">EVOLUÇÃO CLÍNICA</p>
              <p className="text-[8pt] text-justify whitespace-pre-line">{resumoEvolucao}</p>
            </div>
          )}

          {/* Procedimentos */}
          {procedimentosRealizados && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">PROCEDIMENTOS REALIZADOS</p>
              <p className="text-[8pt] whitespace-pre-line">{procedimentosRealizados}</p>
            </div>
          )}

          {/* Complicações */}
          {complicacoes && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">COMPLICAÇÕES</p>
              <p className="text-[8pt] whitespace-pre-line">{complicacoes}</p>
            </div>
          )}

          {/* Exames */}
          {examesRelevantes && (
            <div className="border border-gray-800 p-2">
              <p className="font-bold text-[8pt] mb-1">EXAMES RELEVANTES</p>
              <p className="text-[8pt] whitespace-pre-line">{examesRelevantes}</p>
            </div>
          )}

          {/* Alta */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">CONDIÇÕES E ORIENTAÇÕES DE ALTA</p>
            <div className="text-[8pt] space-y-1">
              {condicaoAlta && (
                <div>
                  <p className="font-semibold">Condição Clínica:</p>
                  <p className="whitespace-pre-line">{condicaoAlta}</p>
                </div>
              )}
              {medicacoesPrescritas && (
                <div>
                  <p className="font-semibold">Medicações:</p>
                  <p className="whitespace-pre-line">{medicacoesPrescritas}</p>
                </div>
              )}
              {orientacoesAlta && (
                <div>
                  <p className="font-semibold">Orientações:</p>
                  <p className="whitespace-pre-line">{orientacoesAlta}</p>
                </div>
              )}
              {restricoes && (
                <div>
                  <p className="font-semibold">Restrições:</p>
                  <p className="whitespace-pre-line">{restricoes}</p>
                </div>
              )}
              {acompanhamento && (
                <div>
                  <p className="font-semibold">Acompanhamento:</p>
                  <p className="whitespace-pre-line">{acompanhamento}</p>
                </div>
              )}
              {dataRetorno && (
                <p><span className="font-semibold">Retorno:</span> {isoToBR(dataRetorno)}</p>
              )}
              {observacoes && (
                <div>
                  <p className="font-semibold">Observações:</p>
                  <p className="whitespace-pre-line">{observacoes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Médico */}
          <div className="border border-gray-800 p-2">
            <p className="font-bold text-[8pt] mb-1">MÉDICO RESPONSÁVEL</p>
            <div className="text-[8pt]">
              <p><span className="font-semibold">Nome:</span> {nomeMedico}</p>
              <p><span className="font-semibold">CRM:</span> {crmMedico}</p>
              {especialidade && <p><span className="font-semibold">Especialidade:</span> {especialidade}</p>}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-400">
              <div className="h-12 border-b border-gray-500 mb-1"></div>
              <p className="text-center text-[8pt] font-semibold">Assinatura e Carimbo</p>
            </div>
          </div>
        </div>

        <PrintFooter />
      </div>
    </div>
  );
}
