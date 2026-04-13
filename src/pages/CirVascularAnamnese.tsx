import { useState } from 'react';
import { Download, Printer, FileText, FileWarning, Stethoscope, ClipboardList } from 'lucide-react';

const MODELOS = [
  {
    id: 'consulta',
    titulo: '1ª Consulta Ambulatorial',
    descricao: 'Modelo completo de primeira consulta em cirurgia vascular — anamnese, exame físico vascular e plano terapêutico.',
    arquivo: '/templates/vascular/MODELO_1ª_CONSULTA_AMBULATORIAL.docx',
    tipo: 'docx',
    icon: Stethoscope,
    cor: 'border-blue-400 bg-blue-50 text-blue-700',
  },
  {
    id: 'evolucao',
    titulo: 'Evolução Cir. Vascular',
    descricao: 'Modelo de evolução ambulatorial e hospitalar para pacientes em acompanhamento de cirurgia vascular.',
    arquivo: '/templates/vascular/MODELO_EVOLUÇÃO_CIR_VASCULAR.docx',
    tipo: 'docx',
    icon: ClipboardList,
    cor: 'border-teal-400 bg-teal-50 text-teal-700',
  },
  {
    id: 'tci',
    titulo: 'TCI — Recusa de Tratamento',
    descricao: 'Termo de Consentimento Informado para recusa de tratamento proposto em cirurgia vascular.',
    arquivo: '/templates/vascular/TCI_RECUSA_TRATAMENTO.docx',
    tipo: 'docx',
    icon: FileWarning,
    cor: 'border-amber-400 bg-amber-50 text-amber-700',
  },
  {
    id: 'igra',
    titulo: 'Formulário IGRA',
    descricao: 'Solicitação de exame IGRA (Interferon Gamma Release Assay) para rastreio de tuberculose latente.',
    arquivo: '/templates/vascular/FORMULARIO_SOLICITACAO_IGRA.pdf',
    tipo: 'pdf',
    icon: FileText,
    cor: 'border-red-400 bg-red-50 text-red-700',
  },
];

export default function CirVascularAnamnese() {
  const [imprimindo, setImprimindo] = useState<string | null>(null);

  function handlePrint(modelo: typeof MODELOS[0]) {
    setImprimindo(modelo.id);
    if (modelo.tipo === 'pdf') {
      // Abrir PDF em nova aba para impressão
      const win = window.open(modelo.arquivo, '_blank');
      if (win) win.focus();
    } else {
      // Para DOCX: baixar o arquivo (não é possível imprimir DOCX diretamente no browser)
      const a = document.createElement('a');
      a.href = modelo.arquivo;
      a.download = modelo.arquivo.split('/').pop() || 'modelo.docx';
      a.click();
    }
    setTimeout(() => setImprimindo(null), 1500);
  }

  return (
    <div className="space-y-4 print:p-0">

      <p className="text-sm text-gray-500 mb-2 no-print">
        Selecione um modelo para baixar ou imprimir. Os documentos estão no formato original (DOCX/PDF).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODELOS.map(modelo => {
          const Icon = modelo.icon;
          return (
            <div key={modelo.id}
              className={`border-2 rounded-xl p-5 ${modelo.cor}`}>
              <div className="flex items-start gap-3 mb-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{modelo.titulo}</p>
                  <p className="text-xs opacity-75 mt-0.5 leading-snug">{modelo.descricao}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                {/* Download */}
                <a
                  href={modelo.arquivo}
                  download
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-current rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar
                </a>

                {/* Imprimir / Abrir */}
                <button
                  onClick={() => handlePrint(modelo)}
                  disabled={imprimindo === modelo.id}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-current rounded-lg text-xs font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  <Printer className="w-3.5 h-3.5" />
                  {imprimindo === modelo.id ? 'Abrindo...' : modelo.tipo === 'pdf' ? 'Abrir PDF' : 'Baixar e Imprimir'}
                </button>
              </div>

              <p className="text-[10px] opacity-50 mt-2 text-right uppercase tracking-wide">
                {modelo.tipo === 'pdf' ? 'PDF' : 'Word (.docx)'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Instruções */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 no-print">
        <p className="font-semibold text-gray-700 mb-1">Como usar:</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Clique em <strong>Baixar</strong> para salvar o modelo no computador</li>
          <li>Abra o arquivo no Word ou Google Docs, preencha e imprima</li>
          <li>O PDF pode ser aberto e impresso diretamente no navegador</li>
        </ul>
      </div>
    </div>
  );
}
