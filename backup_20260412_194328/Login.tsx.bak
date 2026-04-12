import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, AlertCircle, Info, CheckCircle } from "lucide-react";
import { validateUFGEmail, mockRegister, mockLogin } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCRM, setRegCRM] = useState("");
  const [regSpecialty, setRegSpecialty] = useState("");
  const [regTurma, setRegTurma] = useState("");
  const [regPass, setRegPass] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validateUFGEmail(loginEmail)) {
      setError("Utilize um e-mail institucional (@ufg.br ou @discente.ufg.br).");
      return;
    }
    const user = mockLogin(loginEmail, loginPass);
    if (user) {
      toast.success(`Bem-vindo(a), ${user.name.split(" ")[0]}!`);
      navigate("/");
    } else {
      setError("Usuário não encontrado. Faça o cadastro primeiro.");
    }
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!regName.trim()) { setError("Informe seu nome completo."); return; }
    if (!validateUFGEmail(regEmail)) {
      setError("Utilize um e-mail institucional (@ufg.br ou @discente.ufg.br).");
      return;
    }
    const user = mockRegister(regName, regEmail, regCRM, regSpecialty, regTurma);
    toast.success(`Cadastro realizado! Bem-vindo(a), ${user.name.split(" ")[0]}!`);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel: brand */}
      <div className="hidden lg:flex w-2/5 flex-col items-center justify-center bg-brasil-blue-dark relative overflow-hidden">
        {/* Flag stripes vertical */}
        <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col">
          <div className="flex-1 bg-brasil-green" />
          <div className="flex-1 bg-brasil-yellow" />
          <div className="flex-1 bg-brasil-blue" />
        </div>
        {/* Decorative circles */}
        <div className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-brasil-blue/30 blur-3xl" />
        <div className="absolute bottom-1/4 -right-8 w-40 h-40 rounded-full bg-brasil-green/20 blur-2xl" />
        <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-brasil-yellow/10 blur-2xl" />

        <div className="relative z-10 text-center px-8">
          <img src="./favicon-512.png" alt="InternosMed" className="w-28 h-28 object-contain mx-auto mb-6 drop-shadow-2xl" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Inter<span className="text-brasil-yellow">NACIONAL</span>
          </h1>
          <p className="text-blue-200 text-sm mb-8">Portal do Interno de Medicina</p>

          {/* Flag strip */}
          <div className="flex h-1 rounded-full overflow-hidden mx-auto w-32 mb-6">
            <div className="flex-1 bg-brasil-green" />
            <div className="flex-1 bg-brasil-yellow" />
            <div className="flex-1 bg-brasil-blue-mid" />
          </div>

          <div className="space-y-3 text-left">
            {["Pedidos de Exames", "Receitas e Prescrições", "Atestados e Altas", "LME, APAC e SUS", "Calculadoras Clínicas"].map(item => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brasil-yellow flex-shrink-0" />
                <span className="text-blue-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="absolute bottom-5 text-blue-300/40 text-xs">Hospital das Clínicas – UFG · Goiânia</p>
      </div>

      {/* Right panel: form + banners laterais */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 relative">
        {/* Banner de domínios autorizados - TOPO DIREITO */}
        <div className="hidden lg:block absolute top-6 right-6 z-10">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-md max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm font-bold text-blue-900">Domínios autorizados:</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-mono text-blue-800">@ufg.br</p>
                  <p className="text-xs text-blue-600">(Docentes/Preceptores)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-mono text-blue-800">@discente.ufg.br</p>
                  <p className="text-xs text-blue-600">(Internos)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-mono text-blue-800">@ebserh.gov.br</p>
                  <p className="text-xs text-blue-600">(Médicos EBSERH)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Container central com login card e banner ArztWEG alinhados */}
        <div className="flex items-start gap-6 animate-fade-in">
          {/* Center: Login card */}
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <img src="./favicon-512.png" alt="InternosMed" className="w-20 h-20 object-contain mx-auto mb-2" />
              <h1 className="text-xl font-bold text-brasil-blue">Inter<span className="text-brasil-yellow-dark">NACIONAL</span></h1>
              <p className="text-sm text-gray-500">Portal do Interno · HC-UFG</p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Top stripe */}
              <div className="flex h-1.5">
                <div className="flex-1 bg-brasil-green" />
                <div className="flex-1 bg-brasil-yellow" />
                <div className="flex-1 bg-brasil-blue" />
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => { setMode("login"); setError(""); }}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                    mode === "login"
                      ? "text-brasil-blue border-b-2 border-brasil-blue"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => { setMode("register"); setError(""); }}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                    mode === "register"
                      ? "text-brasil-blue border-b-2 border-brasil-blue"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Cadastrar
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {mode === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="form-label">E-mail institucional</label>
                      <input type="email" className="form-input" placeholder="fulano@discente.ufg.br" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                    </div>
                    <div>
                      <label className="form-label">Senha</label>
                      <div className="relative">
                        <input type={showPass ? "text" : "password"} className="form-input pr-10" placeholder="••••••••" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-brasil-blue hover:bg-brasil-blue-dark text-white font-semibold py-3 rounded-xl transition-colors shadow-md">
                      Entrar
                    </button>
                    <p className="text-center text-xs text-gray-400">Acesso exclusivo para e-mails @ufg.br</p>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div>
                      <label className="form-label">Nome completo</label>
                      <input type="text" className="form-input" placeholder="Dr(a). Nome Sobrenome" value={regName} onChange={e => setRegName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="form-label">E-mail institucional</label>
                      <input type="email" className="form-input" placeholder="fulano@discente.ufg.br" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">CRM (opcional)</label>
                        <input type="text" className="form-input" placeholder="GO-000000" value={regCRM} onChange={e => setRegCRM(e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label">Turma</label>
                        <input type="text" className="form-input" placeholder="Ex: LXIX" value={regTurma} onChange={e => setRegTurma(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Especialidade / Área</label>
                      <input type="text" className="form-input" placeholder="Ex: Clínica Médica, Cirurgia..." value={regSpecialty} onChange={e => setRegSpecialty(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Senha</label>
                      <div className="relative">
                        <input type={showPass ? "text" : "password"} className="form-input pr-10" placeholder="Crie uma senha" value={regPass} onChange={e => setRegPass(e.target.value)} required />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-brasil-green hover:bg-brasil-green-dark text-white font-semibold py-3 rounded-xl transition-colors shadow-md mt-1">
                      Criar Conta
                    </button>
                  </form>
                )}
              </div>
            </div>

            <p className="text-center text-gray-400 text-xs mt-5">
              © {new Date().getFullYear()} InternosMed · HC-UFG
            </p>
          </div>

          {/* Right: ArztWEG banner — ALINHADO NA MESMA ALTURA DO LOGIN CARD */}
          <div className="hidden md:flex flex-col items-center w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-6 text-center w-full">
              <p className="text-lg font-bold text-gray-800 mb-1">
                🏥 Quer usar o InternosMed em seu Hospital?
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Implementação personalizada para hospitais universitários e serviços de residência médica.
              </p>
              <a
                href="mailto:contato@arztweg.com?subject=Solicitar%20Implementação%20InternosMed"
                className="flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-md mb-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Solicitar Implementação
              </a>
              <a
                href="https://www.arztweg.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border-2 border-teal-200 text-teal-700 font-semibold py-2.5 rounded-xl hover:bg-teal-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Conhecer ArztWEG
              </a>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <img src="./logo-arztweg.png" alt="ArztWEG" className="w-10 h-10 object-contain mx-auto mb-2 rounded" />
                <p className="text-xs text-gray-500 font-medium">Projeto ArztWEG - O Caminho Médico!</p>
                <p className="text-xs text-teal-600">contato@arztweg.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Banner domínios mobile - abaixo do card de login */}
        <div className="lg:hidden absolute bottom-6 left-6 right-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs font-bold text-blue-900">Domínios autorizados:</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-xs font-mono text-blue-800">@ufg.br</p>
                <p className="text-[10px] text-blue-600">Docentes</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-mono text-blue-800">@discente.ufg.br</p>
                <p className="text-[10px] text-blue-600">Internos</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-mono text-blue-800">@ebserh.gov.br</p>
                <p className="text-[10px] text-blue-600">EBSERH</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
