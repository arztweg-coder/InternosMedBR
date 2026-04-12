/**
 * PrivacyBanner.tsx
 * Banner de Privacidade e Conformidade LGPD
 * 
 * Versão retrátil: aba verde discreta no canto direito da tela.
 * Ao passar o mouse (ou tocar no mobile), expande o banner completo.
 */

import { Shield, Info } from "lucide-react";
import { useState } from "react";
import { LGPD_DISCLAIMER } from "@/lib/privacy";

export default function PrivacyBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed bottom-4 right-0 z-40 no-print flex items-end"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Banner expandido */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? "max-w-sm opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        <div className="bg-green-50 border border-green-200 border-r-0 rounded-l-lg px-4 py-3 shadow-lg">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-900">
                🔒 {LGPD_DISCLAIMER.banner}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Nada é salvo após sair. Dados temporários apenas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aba verde retrátil (sempre visível) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-l-lg px-1.5 py-3 shadow-lg transition-colors flex flex-col items-center gap-1"
        title="Política de Privacidade"
      >
        <Shield className="w-4 h-4" />
        <span className="text-[9px] font-bold" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          LGPD
        </span>
      </button>
    </div>
  );
}

/**
 * Versão compacta para formulários
 */
export function PrivacyNotice() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 no-print">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-900 mb-1">
            🔒 Seus dados estão protegidos
          </p>
          <p className="text-sm text-green-800">
            Não armazenamos dados de pacientes. Ao sair do sistema, todos os dados são automaticamente apagados.
          </p>
          
          {showDetails && (
            <div className="mt-3 p-3 bg-white rounded border border-green-200">
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {LGPD_DISCLAIMER.full}
              </p>
            </div>
          )}
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-green-700 hover:text-green-800 font-medium mt-2 flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            {showDetails ? "Ocultar detalhes" : "Ver política completa"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Badge de privacidade para footer / sidebar
 */
export function PrivacyBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 text-xs text-green-800">
      <Shield className="w-3 h-3" />
      <span className="font-semibold">LGPD Conforme</span>
      <span className="text-green-600">|</span>
      <span>Dados não armazenados</span>
    </div>
  );
}
