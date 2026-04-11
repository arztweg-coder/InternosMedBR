import { X, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [acceptedCheckbox, setAcceptedCheckbox] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    
    if (isAtBottom && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  const handleAccept = () => {
    if (acceptedCheckbox) {
      onAccept();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Termos de Uso e Política de Privacidade
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={!hasScrolled}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div 
          className="flex-1 overflow-y-auto p-6"
          onScroll={handleScroll}
        >
          <div className="prose prose-sm max-w-none">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-gray-800 font-semibold text-sm">
                ⚠️ Por favor, leia todo o documento até o final antes de aceitar. 
                O botão "Aceitar" será habilitado após a leitura completa.
              </p>
            </div>

            <h3 className="text-lg font-bold mb-4">CONTRATO DE PRESTAÇÃO DE SERVIÇO DIGITAL</h3>
            <p className="mb-4">
              Plataforma <strong>InternosMed — internos.med.br</strong>
            </p>

            {/* Versão resumida do contrato para o modal */}
            <section className="mb-6">
              <h4 className="font-bold mb-2">PREÂMBULO</h4>
              <p className="text-gray-700 text-sm mb-4">
                Ao cadastrar-se, você declara ter lido e aceitar integralmente os Termos de Uso 
                da plataforma InternosMed, desenvolvida por ArztWEG, em conformidade com a LGPD 
                (Lei nº 13.709/2018).
              </p>
            </section>

            <section className="mb-6">
              <h4 className="font-bold mb-2">PRINCIPAIS PONTOS</h4>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                <li><strong>Gratuidade:</strong> O acesso é totalmente gratuito</li>
                <li><strong>Acesso restrito:</strong> Apenas emails @ufg.br, @discente.ufg.br e @ebserh.gov.br</li>
                <li><strong>Dados pessoais:</strong> Coletamos apenas nome, email e foto do Google</li>
                <li><strong>Privacidade:</strong> Dados de pacientes NÃO são armazenados no servidor</li>
                <li><strong>Responsabilidade:</strong> A plataforma é ferramenta de apoio, não substitui julgamento clínico</li>
                <li><strong>Uso adequado:</strong> Proibido compartilhar acesso ou usar indevidamente</li>
              </ul>
            </section>

            <section className="mb-6">
              <h4 className="font-bold mb-2">PROTEÇÃO DE DADOS (LGPD)</h4>
              <p className="text-gray-700 text-sm mb-2">
                Seus direitos como titular de dados:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li>Confirmação da existência de tratamento</li>
                <li>Acesso aos seus dados</li>
                <li>Correção de dados incompletos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação</li>
                <li>Portabilidade dos dados</li>
                <li>Revogação do consentimento</li>
              </ul>
              <p className="text-gray-700 text-sm mt-2">
                Entre em contato: <strong>contato@arztweg.com</strong>
              </p>
            </section>

            <section className="mb-6">
              <h4 className="font-bold mb-2">SEGURANÇA DA INFORMAÇÃO</h4>
              <p className="text-gray-700 text-sm">
                Implementamos medidas técnicas de segurança: HTTPS/TLS, autenticação Google OAuth 2.0, 
                restrição por domínio e monitoramento de logs.
              </p>
            </section>

            <div className="bg-teal-50 border-2 border-teal-600 rounded-lg p-4 mt-8">
              <p className="text-gray-800 font-semibold text-center">
                Para ler o contrato completo, acesse: 
                <a 
                  href="/termos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline ml-1"
                >
                  internos.med.br/termos
                </a>
              </p>
            </div>

            {/* Scroll Indicator */}
            {!hasScrolled && (
              <div className="sticky bottom-0 bg-gradient-to-t from-white to-transparent pt-8 pb-4 text-center">
                <p className="text-gray-500 text-sm animate-pulse">
                  ↓ Role até o final para habilitar o aceite ↓
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <label className="flex items-start gap-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedCheckbox}
              onChange={(e) => setAcceptedCheckbox(e.target.checked)}
              disabled={!hasScrolled}
              className="w-5 h-5 mt-0.5 text-teal-600 rounded disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">
              Declaro que li e aceito integralmente os <strong>Termos de Uso e Política de Privacidade</strong> 
              da plataforma InternosMed, em conformidade com a Lei nº 13.709/2018 (LGPD).
            </span>
          </label>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAccept}
              disabled={!acceptedCheckbox}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Aceitar e Continuar
            </button>
          </div>

          {hasScrolled && acceptedCheckbox && (
            <p className="text-xs text-green-600 text-center mt-3 flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Pronto para aceitar os termos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
