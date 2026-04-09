/**
 * AtestadoV2.tsx
 * Atestado Médico com Validações Aprimoradas
 * 
 * Melhorias vs versão original:
 * - Sistema de protocolos UUID
 * - Validação rigorosa de CRM
 * - Múltiplos modelos de texto
 * - Impressão otimizada
 * - Rodapé com ArztWeg
 */

import { useState } from "react";
import { Printer, RotateCcw, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { todayISO, isoToBR } from "@/lib/utils";
import { addHistoryEntry } from "@/lib/history";
import { generateProtocol } from "@/lib/protocol";
import { validateCRM } from "@/lib/auth-v2";
import PrintHeaderV2 from "@/components/print/PrintHeaderV2";
import PrintFooter from "@/components/print/PrintFooter";
import CIDSearch from "@/components/ui/CIDSearch";

// Modelos de texto de atestado
const MODELOS_TEXTO = [
  {
    id: "padrao",
    nome: "Modelo Padrão",
    template: (nome: string, doc: string, cid: string, dias: number, inicio: string) =>
      `Atesto, para os devidos fins, que ${nome || "________________________"}, portador(a) do documento de identidade e/ou CPF nº ${doc || "________________________"}, esteve sob meus cuidados médicos e, por motivo de doença${cid ? ` (CID-10: ${cid})` : ""}, deverá se afastar de suas atividades por ${dias === 1 ? "01 (um) dia" : `${String(dias).padStart(2, "0")} (${dias}) dias`}, com início em ${isoToBR(inicio)}.`,
  },
  {
    id: "simples",
    nome: "Modelo Simples",
    template: (nome: string, doc: string, cid: string, dias: number, inicio: string) =>
      `Atesto que ${nome || "________________________"}, CPF/RG ${doc || "________________________"}, necessita afastar-se de suas atividades por ${dias} dia(s) a partir de ${isoToBR(inicio)}, por motivo de saúde${cid ? ` (CID: ${cid})` : ""}.`,
  },
  {
    id: "trabalho",
    nome: "Para Trabalho/Empresa",
    template: (nome: string, doc: string, cid: string, dias: number, inicio: string) =>
      `Atesto, para fins trabalhistas, que o(a) paciente ${nome || "________________________"}, portador(a) do CPF/RG nº ${doc || "________________________"}, encontra-se em tratamento médico${cid ? ` (CID-10: ${cid})` : ""} e estará impossibilitado(a) de exercer suas funções laborais pelo período de ${dias} dia(s), iniciando-se em ${isoToBR(inicio)}.`,
  },
  {
    id: "acompanhante",
    nome: "Atestado de Acompanhante",
    template: (nome: string, doc: string, cid: string, dias: number, inicio: string) =>
      `Atesto que ${nome || "________________________"}, portador(a) do CPF/RG ${doc || "________________________"}, necessitou acompanhar familiar em consulta/procedimento médico, sendo necessário seu afastamento de atividades no dia ${isoToBR(inicio)}.`,
  },
];

export default function AtestadoV2() {
  const [protocol] = useState(() => generateProtocol('ATE'));

  // DADOS DO PACIENTE
  const [nomePaciente, setNomePaciente] = useState("");
  const [documentoPaciente, setDocumentoPaciente] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState<"CPF" | "RG">("CPF");

  // DADOS DO ATESTADO
  const [diasAfastamento, setDiasAfastamento] = useState(1);
  const [dataInicio, setDataInicio] = useState(todayISO());
  const [dataEmissao, setDataEmissao] = useState(todayISO());
  const [cidCodigo, setCidCodigo] = useState("");
  const [cidNome, setCidNome] = useState("");
  const [mostrarCID, setMostrarCID] = useState(true);
  
  // MODELO E TEXTO
  const [modeloSelecionado, setModeloSelecionado] = useState("padrao");
  const [textoCustomizado, setTextoCustomizado] = useState("");
  const [usarTextoCustomizado, setUsarTextoCustomizado] = useState(false);

  // DADOS DO MÉDICO
  const [nomeMedico, setNomeMedico] = useState("");
  const [crmMedico, setCrmMedico] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [crmValido, setCrmValido] = useState(true);

  function gerarTextoModelo(): string {
    const modelo = MODELOS_TEXTO.find(m => m.id === modeloSelecionado);
    if (!modelo) return "";

    const cidExibir = mostrarCID ? cidCodigo : "";
    return modelo.template(nomePaciente, documentoPaciente, cidExibir, diasAfastamento, dataInicio);
  }

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
    if (!nomeMedico.trim()) {
      toast.error("Informe o nome do médico.");
      return false;
    }
    if (!crmMedico.trim()) {
      toast.error("Informe o CRM do médico.");
      return false;
    }
    if (!crmValido) {
      toast.error("CRM em formato inválido. Use: CRM/UF NNNNNN (ex: CRM/GO 12345)");
      return false;
    }
    return true;
  }

  function handleClear() {
    setNomePaciente("");
    setDocumentoPaciente("");
    setDiasAfastamento(1);
    setDataInicio(todayISO());
    setDataEmissao(todayISO());
    setCidCodigo("");
    setCidNome("");
    setMostrarCID(true);
    setTextoCustomizado("");
    setUsarTextoCustomizado(false);
    setModeloSelecionado("padrao");
    setNomeMedico("");
    setCrmMedico("");
    setEspecialidade("");
    toast.info("Formulário limpo.");
  }

  function handlePrint() {
    if (!validateForm()) return;

    addHistoryEntry({
      type: "atestado",
      label: "Atestado Médico",
      patientName: nomePaciente,
      date: dataEmissao,
    });

    window.print();
  }

  const textoFinal = usarTextoCustomizado ? textoCustomizado : gerarTextoModelo();

  return (
    <div className="animate-fade-in">
      {/* FORMULÁRIO */}
      <div className="no-print">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Atestado Médico
            </h1>
            <p className="text-sm text-gray-500">
              Atestado de afastamento com múltiplos modelos de texto
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-xs font-semibold text-blue-900">Protocolo</p>
            <p className="text-sm font-mono text-blue-700">{protocol}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* DADOS DO PACIENTE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              1. Dados do Paciente
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome Completo <span className="text-red-500">*</span></label>
                <input
                  className="form-input"
                  placeholder="Nome completo do paciente"
                  value={nomePaciente}
                  onChange={e => setNomePaciente(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Tipo de Documento</label>
                <select
                  className="form-input"
                  value={tipoDocumento}
                  onChange={e => setTipoDocumento(e.target.value as "CPF" | "RG")}
                >
                  <option value="CPF">CPF</option>
                  <option value="RG">RG</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Número do Documento</label>
                <input
                  className="form-input"
                  placeholder={tipoDocumento === "CPF" ? "000.000.000-00" : "00.000.000-0"}
                  value={documentoPaciente}
                  onChange={e => setDocumentoPaciente(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* DADOS DO AFASTAMENTO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              2. Dados do Afastamento
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="form-label">Dias de Afastamento</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  className="form-input"
                  value={diasAfastamento}
                  onChange={e => setDiasAfastamento(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="form-label">Início do Afastamento</label>
                <input
                  type="date"
                  className="form-input"
                  value={dataInicio}
                  onChange={e => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Data de Emissão</label>
                <input
                  type="date"
                  className="form-input"
                  value={dataEmissao}
                  onChange={e => setDataEmissao(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* DIAGNÓSTICO (CID) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              3. Diagnóstico (Opcional)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">CID-10</label>
                <CIDSearch
                  value={cidCodigo}
                  codeName={cidNome}
                  onSelect={(code, name) => {
                    setCidCodigo(code);
                    setCidNome(name);
                  }}
                  placeholder="Buscar CID-10 (opcional)..."
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={mostrarCID}
                    onChange={e => setMostrarCID(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Exibir CID-10 no atestado impresso
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Por motivos éticos, o CID pode ser omitido do atestado para terceiros
                </p>
              </div>
            </div>
          </div>

          {/* MODELO DE TEXTO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              4. Texto do Atestado
            </h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Modelo de Texto</label>
                <select
                  className="form-input"
                  value={modeloSelecionado}
                  onChange={e => {
                    setModeloSelecionado(e.target.value);
                    setUsarTextoCustomizado(false);
                  }}
                  disabled={usarTextoCustomizado}
                >
                  {MODELOS_TEXTO.map(modelo => (
                    <option key={modelo.id} value={modelo.id}>
                      {modelo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={usarTextoCustomizado}
                    onChange={e => {
                      setUsarTextoCustomizado(e.target.checked);
                      if (e.target.checked && !textoCustomizado) {
                        setTextoCustomizado(gerarTextoModelo());
                      }
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Personalizar texto manualmente
                  </span>
                </label>
              </div>

              <div>
                <label className="form-label">Pré-visualização / Edição</label>
                <textarea
                  className="form-textarea font-serif text-sm"
                  rows={6}
                  value={textoFinal}
                  onChange={e => {
                    setTextoCustomizado(e.target.value);
                    setUsarTextoCustomizado(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* DADOS DO MÉDICO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              5. Dados do Médico
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome Completo <span className="text-red-500">*</span></label>
                <input
                  className="form-input"
                  placeholder="Nome completo do médico"
                  value={nomeMedico}
                  onChange={e => setNomeMedico(e.target.value)}
                />
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
                    Formato inválido. Use: CRM/UF NNNNNN
                  </p>
                )}
              </div>
              <div className="col-span-3">
                <label className="form-label">Especialidade (opcional)</label>
                <input
                  className="form-input"
                  placeholder="Ex: Clínica Médica, Cardiologia..."
                  value={especialidade}
                  onChange={e => setEspecialidade(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" /> Imprimir Atestado
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium px-5 py-2.5 rounded-lg border border-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* IMPRESSÃO */}
      <div className="print-only print-page">
        <PrintHeaderV2
          title="Atestado Médico"
          protocolNumber={protocol}
        />

        <div className="my-8">
          <p className="text-sm font-serif leading-relaxed text-justify">
            {textoFinal}
          </p>
        </div>

        {/* Assinatura */}
        <div className="mt-12 pt-4 border-t border-gray-400">
          <div className="max-w-xs mx-auto text-center">
            <div className="h-16 border-b border-gray-500 mb-2"></div>
            <p className="font-bold text-sm">{nomeMedico}</p>
            <p className="text-sm">{crmMedico}</p>
            {especialidade && <p className="text-sm text-gray-700">{especialidade}</p>}
            <p className="text-sm mt-2">Goiânia/GO, {isoToBR(dataEmissao)}</p>
          </div>
        </div>

        <PrintFooter />
      </div>
    </div>
  );
}
