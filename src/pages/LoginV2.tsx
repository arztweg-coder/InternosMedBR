/**
 * LoginV2.tsx
 * Página de Login com Validação Multi-Domínio
 * Domínios autorizados: @ufg.br | @discente.ufg.br | @ebserh.gov.br
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2, Info, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  validateEmailDomain,
  setCurrentUser,
  generateUserId,
  getDefaultRoleByDomain,
  getDefaultInstitution,
  AUTHORIZED_DOMAINS,
  type UserProfile,
} from "@/lib/auth-v2";

export default function LoginV2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Mostrar mensagem se sessão expirou
    if (searchParams.get("timeout") === "true") {
      toast.error("Sessão expirada por inatividade. Faça login novamente.");
    }
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error("Preencha email e senha.");
      return;
    }

    const domain = validateEmailDomain(email);
    
    if (!domain) {
      toast.error(
        `Email não autorizado. Use: ${AUTHORIZED_DOMAINS.map(d => `@${d}`).join(", ")}`
      );
      return;
    }

    setLoading(true);

    // Simulação de autenticação (substituir por Supabase Auth)
    setTimeout(() => {
      const user: UserProfile = {
        id: generateUserId(),
        email: email.toLowerCase().trim(),
        domain,
        name: email.split("@")[0], // Placeholder - pegar do perfil real
        role: getDefaultRoleByDomain(domain),
        institution: getDefaultInstitution(domain),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        mfaEnabled: false,
      };

      setCurrentUser(user);
      toast.success(`Bem-vindo(a), ${user.name}!`);
      navigate("/");
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">

      {/* Box hospitais — canto superior direito */}
      <div className="absolute top-4 right-4 w-72 hidden lg:block z-10">
        <div className="bg-white rounded-xl shadow-md border-2 border-teal-100 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            🏥 Seu Hospital Quer Usar o InternosMed?
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Implementação personalizada para hospitais universitários e serviços de residência médica.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:contato@arztweg.com?subject=InternosMed - Solicitação de Serviços para Hospital"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-xs font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              Solicitar Implementação
            </a>
            <a
              href="https://www.arztweg.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-teal-600 border border-teal-500 rounded-lg hover:bg-teal-50 transition-colors text-xs font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Conhecer ArztWEG
            </a>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 text-center">
            Dr. Frank Walczak · Projeto ArztWEG
          </p>
        </div>
      </div>

      {/* Login centralizado */}
      <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img
              src="/favicon-512.png"
              alt="InternosMed"
              className="h-24 w-24 object-contain mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Internos<span className="text-brand-blue-600">Med</span>
          </h1>
          <p className="text-gray-600 font-medium">Portal do Interno de Medicina</p>
          <p className="text-sm text-gray-500 mt-1">HC-UFG | EBSERH</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="seu.nome@ufg.br"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Esqueci a senha */}
          <div className="text-center mt-4">
            <a
              href="/recuperar-senha"
              className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium"
            >
              Esqueci minha senha
            </a>
          </div>
        </div>

        {/* Avisos de Domínio Autorizado */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Domínios autorizados:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <code className="bg-white px-2 py-0.5 rounded">@ufg.br</code>
                  <span className="text-xs text-gray-600">(Docentes/Preceptores)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <code className="bg-white px-2 py-0.5 rounded">@discente.ufg.br</code>
                  <span className="text-xs text-gray-600">(Internos)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <code className="bg-white px-2 py-0.5 rounded">@ebserh.gov.br</code>
                  <span className="text-xs text-gray-600">(Médicos EBSERH)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Link para ArztWeg */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-full px-5 py-2.5">
            <span className="text-sm text-gray-700">Desenvolvido pelo projeto</span>
            <a
              href="https://arztweg.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              ArztWeg
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} InternosMed — HC-UFG
          <br />
          Desenvolvido em conformidade com LGPD
        </p>
      </div>
      </div>{/* fim flex centralizado */}
    </div>
  );
}
