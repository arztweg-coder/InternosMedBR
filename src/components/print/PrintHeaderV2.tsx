/**
 * PrintHeaderV2.tsx
 * Cabeçalho Institucional Otimizado para Impressão
 * 
 * Melhorias:
 * - SVG vetorizado com fallback PNG
 * - Número de protocolo UUID
 * - Layout conforme padrão HC-UFG
 * - Otimizado para impressoras térmicas e a laser
 */

interface PrintHeaderV2Props {
  title: string; // Ex: "Atestado Médico", "Receita Simples"
  protocolNumber?: string; // UUID gerado automaticamente
  showProtocol?: boolean; // Exibir número de protocolo
  subtitle?: string; // Subtítulo opcional
}

export default function PrintHeaderV2({
  title,
  protocolNumber,
  showProtocol = true,
  subtitle,
}: PrintHeaderV2Props) {
  return (
    <div className="border-b-2 border-gray-800 pb-3 mb-4">
      {/* Cabeçalho Institucional */}
      <div className="text-center mb-2">
        <div className="font-bold text-[11pt] leading-tight text-gray-900">
          UNIVERSIDADE FEDERAL DE GOIÁS
        </div>
        <div className="text-[10pt] text-gray-800">
          HOSPITAL DAS CLÍNICAS – EBSERH
        </div>
        <div className="text-[9pt] text-gray-700">
          1ª Avenida, s/n – Setor Leste Universitário – Goiânia/GO
        </div>
        <div className="text-[8pt] text-gray-600">
          Tel.: (62) 3269-8000 | www.hc.ufg.br
        </div>
      </div>

      {/* Título do Documento */}
      <div className="text-center mt-3">
        <h1
          className="text-[14pt] font-bold uppercase tracking-wide text-gray-900"
          style={{ letterSpacing: '0.08em' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[9pt] text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Número de Protocolo */}
      {showProtocol && protocolNumber && (
        <div className="text-right mt-2">
          <span className="text-[8pt] text-gray-500 font-mono">
            Protocolo: {protocolNumber}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Versão com Logo em SVG (usar quando disponível)
 */
export function PrintHeaderWithLogo({
  title,
  protocolNumber,
  showProtocol = true,
}: PrintHeaderV2Props) {
  return (
    <div className="border-b-2 border-gray-800 pb-3 mb-4">
      <div className="flex items-start justify-between gap-4">
        {/* Logo UFG/EBSERH */}
        <div className="flex-shrink-0">
          <svg
            width="80"
            height="60"
            viewBox="0 0 80 60"
            className="text-brand-blue-600"
            fill="currentColor"
          >
            {/* Placeholder - Substituir pelo logo oficial UFG/EBSERH */}
            <rect width="80" height="60" rx="4" fill="#003366" />
            <text
              x="40"
              y="25"
              textAnchor="middle"
              className="text-white font-bold text-xs"
              fill="white"
            >
              UFG
            </text>
            <text
              x="40"
              y="40"
              textAnchor="middle"
              className="text-white text-[8px]"
              fill="white"
            >
              HC-EBSERH
            </text>
          </svg>
        </div>

        {/* Informações Institucionais */}
        <div className="flex-1 text-center">
          <div className="font-bold text-[11pt] text-gray-900">
            UNIVERSIDADE FEDERAL DE GOIÁS
          </div>
          <div className="text-[10pt] text-gray-800">
            HOSPITAL DAS CLÍNICAS – EBSERH
          </div>
          <div className="text-[14pt] font-bold uppercase tracking-wide text-gray-900 mt-2">
            {title}
          </div>
        </div>

        {/* Espaço para carimbo (se necessário) */}
        <div className="flex-shrink-0 w-20"></div>
      </div>

      {showProtocol && protocolNumber && (
        <div className="text-right mt-2">
          <span className="text-[8pt] text-gray-500 font-mono">
            Protocolo: {protocolNumber}
          </span>
        </div>
      )}
    </div>
  );
}
