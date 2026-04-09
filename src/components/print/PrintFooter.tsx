/**
 * PrintFooter.tsx
 * Rodapé para Documentos Impressos
 * 
 * Inclui:
 * - Watermark de segurança
 * - Propaganda do projeto ArztWeg
 * - Informações de conformidade LGPD
 */

interface PrintFooterProps {
  showWatermark?: boolean;
  showArztWeg?: boolean;
  customText?: string;
}

export default function PrintFooter({
  showWatermark = true,
  showArztWeg = true,
  customText,
}: PrintFooterProps) {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <div className="mt-8 pt-4 border-t border-gray-300 text-[8pt] text-gray-600 space-y-1">
      {/* Watermark de Segurança */}
      {showWatermark && (
        <p className="text-center italic">
          Documento gerado eletronicamente em {timestamp} via InternosMed HC-UFG/EBSERH
        </p>
      )}

      {/* Texto customizado */}
      {customText && (
        <p className="text-center">{customText}</p>
      )}

      {/* Propaganda ArztWeg */}
      {showArztWeg && (
        <div className="text-center pt-2 border-t border-gray-200 mt-2">
          <p className="font-semibold text-gray-700">
            Sistema desenvolvido pelo projeto{' '}
            <span className="text-brand-blue-600 font-bold">ArztWeg</span>
          </p>
          <p className="text-[7pt] text-gray-500">
            Tecnologia em Saúde Digital | www.arztweg.com.br
          </p>
        </div>
      )}

      {/* Conformidade LGPD */}
      <p className="text-center text-[7pt] text-gray-500 mt-1">
        Este documento contém informações protegidas pela LGPD (Lei nº 13.709/2018)
      </p>
    </div>
  );
}

/**
 * Rodapé compacto para documentos em duas vias
 */
export function PrintFooterCompact({ showArztWeg = true }: { showArztWeg?: boolean }) {
  return (
    <div className="mt-4 pt-2 border-t border-gray-300 text-[7pt] text-gray-500">
      <p className="text-center">
        InternosMed HC-UFG/EBSERH
        {showArztWeg && (
          <> • Desenvolvido por <span className="font-semibold text-brand-blue-600">ArztWeg</span></>
        )}
      </p>
    </div>
  );
}
