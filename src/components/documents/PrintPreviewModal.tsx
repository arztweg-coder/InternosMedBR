import { useState } from 'react';
import { X, Printer, Eye } from 'lucide-react';

interface PrintOptions {
  copies: 1 | 2;
  layout: 'portrait' | 'landscape';
  includeHeader: boolean;
  includeFooter: boolean;
  includeStamp: boolean;
  economicMode: boolean;
  margins: 'normal' | 'narrow' | 'wide';
}

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentContent: React.ReactNode;
  documentTitle: string;
}

export default function PrintPreviewModal({
  isOpen,
  onClose,
  documentContent,
  documentTitle,
}: PrintPreviewModalProps) {
  const [options, setOptions] = useState<PrintOptions>({
    copies: 1,
    layout: 'portrait',
    includeHeader: true,
    includeFooter: true,
    includeStamp: true,
    economicMode: false,
    margins: 'normal',
  });

  const [showPreview, setShowPreview] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const marginMap = { normal: '20mm', narrow: '10mm', wide: '30mm' };
    const margin = marginMap[options.margins];
    const orientation = options.layout;

    const contentEl = document.createElement('div');
    contentEl.innerHTML = document.getElementById('print-preview-content')?.innerHTML ?? '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentTitle}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              @page { size: A4 ${orientation}; margin: ${margin}; }
              body { -webkit-print-color-adjust: ${options.economicMode ? 'economy' : 'exact'}; print-color-adjust: ${options.economicMode ? 'economy' : 'exact'}; }
              .page-break { page-break-after: always; }
              ${!options.includeHeader ? '.print-header { display: none !important; }' : ''}
              ${!options.includeFooter ? '.print-footer { display: none !important; }' : ''}
              ${!options.includeStamp ? '.print-stamp { display: none !important; }' : ''}
            }
            body { font-family: 'Times New Roman', serif; font-size: 11pt; }
          </style>
        </head>
        <body>
          ${contentEl.innerHTML}
          ${options.copies === 2 ? `<div class="page-break"></div>${contentEl.innerHTML}` : ''}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); onClose(); }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-lg font-bold text-gray-900">Configurar Impressão</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Opções */}
        <div className="p-6 space-y-5">

          {/* Cópias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de vias</label>
            <div className="flex gap-3">
              {([1, 2] as const).map(n => (
                <button
                  key={n}
                  onClick={() => setOptions({ ...options, copies: n })}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                    options.copies === n
                      ? 'border-teal-600 bg-teal-50 text-teal-800'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {n} via{n === 2 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Orientação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Orientação</label>
            <div className="flex gap-3">
              <button
                onClick={() => setOptions({ ...options, layout: 'portrait' })}
                className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                  options.layout === 'portrait'
                    ? 'border-teal-600 bg-teal-50 text-teal-800'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                📄 Retrato
              </button>
              <button
                onClick={() => setOptions({ ...options, layout: 'landscape' })}
                className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                  options.layout === 'landscape'
                    ? 'border-teal-600 bg-teal-50 text-teal-800'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                📃 Paisagem
              </button>
            </div>
          </div>

          {/* Margens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Margens</label>
            <div className="flex gap-3">
              {(['narrow', 'normal', 'wide'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setOptions({ ...options, margins: m })}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                    options.margins === m
                      ? 'border-teal-600 bg-teal-50 text-teal-800'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {m === 'narrow' && 'Estreitas'}
                  {m === 'normal' && 'Padrão'}
                  {m === 'wide' && 'Largas'}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5">
            {[
              { key: 'includeHeader', label: 'Incluir cabeçalho HC-UFG' },
              { key: 'includeStamp',  label: 'Incluir carimbo do médico' },
              { key: 'includeFooter', label: 'Incluir rodapé' },
              { key: 'economicMode',  label: 'Modo econômico (sem cores)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key as keyof PrintOptions] as boolean}
                  onChange={e => setOptions({ ...options, [key]: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <p className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-2 border-b">
                Pré-visualização
              </p>
              <div id="print-preview-content" className="bg-white p-6 text-sm overflow-auto max-h-96">
                {documentContent}
              </div>
            </div>
          )}
        </div>

        {/* Footer sticky */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between rounded-b-xl">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Ocultar prévia' : 'Visualizar'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
