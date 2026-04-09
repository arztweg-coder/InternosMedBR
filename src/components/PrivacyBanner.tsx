/**
 * PrivacyBanner.tsx
 * Banner de Privacidade e Conformidade LGPD
 * 
 * Exibe aviso claro de que NÃO armazenamos dados de pacientes
 */

import { Shield, Info, X } from "lucide-react";
import { useState, useEffect } from "react";
import { LGPD_DISCLAIMER } from "@/lib/privacy";

export default function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenBanner, setHasSeenBanner] = useState(false);

  useEffect(() => {
    // Verificar se usuário já viu o banner nesta sessão
    const seen = sessionStorage.getItem('privacy_banner_seen');
    if (!seen) {
      setIsVisible(true);
    } else {
      setHasSeenBanner(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setHasSeenBanner(true);
    sessionStorage.setItem('privacy_banner_seen', 'true');
  };

  if (!isVisible && hasSeenBanner) {
    // Mostrar versão compacta no rodapé
    return (
      <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow-lg max-w-sm z-40">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{LGPD_DISCLAIMER.banner}</span>
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white shadow-lg z-50 animate-slide-down">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" />
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              Política de Privacidade - LGPD
              <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">
                ✓ Conforme
              </span>
            </h3>
            
            <div className="space-y-2 text-sm">
              <p className="font-semibold">
                ✓ NÃO armazenamos dados de pacientes em nossos servidores
              </p>
              <p>
                Todos os dados inseridos são <strong>temporários</strong> e existem apenas durante sua sessão ativa.
                Ao fechar o navegador ou sair do sistema, <strong>TODOS os dados são automaticamente apagados</strong>.
              </p>
              <p className="text-blue-100">
                Nenhuma informação sensível é enviada, salva ou persistida permanentemente.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="mt-3 text-sm underline hover:text-blue-100 transition-colors"
            >
              Entendi
            </button>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-blue-700 flex items-center justify-center transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Versão compacta para formulários
 */
export function PrivacyNotice() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
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
 * Badge de privacidade para footer
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
