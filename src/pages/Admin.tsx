import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, LogOut, Users, FileText, BarChart2, Trash2, AlertCircle,
  Settings, DollarSign, Star, Lock, Unlock, ChevronDown, ChevronUp,
  Crown, UserCheck, Save, RefreshCw, Tag
} from "lucide-react";
import { getHistory, clearHistory } from "@/lib/history";
import { isoToBR } from "@/lib/utils";
import { toast } from "sonner";
import logoSrc from "@/assets/logo-internosmed.png";
import {
  getPlanConfig, savePlanConfig, ALL_FEATURES, getPremiumPrice,
  getUserList, setUserRole, type UserRole, type PlanConfig
} from "@/lib/access";

const ADMIN_EMAIL = "walczak@discente.ufg.br";
const ADMIN_PASSWORD = "Fr@nkCisc0WALCZAK";
const ADMIN_SESSION_KEY = "internosmed_admin_session";

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
      onLogin();
    } else {
      setError("Credenciais inválidas. Acesso restrito ao administrador.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brasil-blue via-brasil-blue-dark to-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Brazilian flag stripe top */}
        <div className="flex h-2 rounded-t-2xl overflow-hidden mb-0">
          <div className="flex-1 bg-brasil-green" />
          <div className="flex-1 bg-brasil-yellow" />
          <div className="flex-1 bg-brasil-blue" />
        </div>
        <div className="bg-white rounded-b-2xl shadow-2xl p-6 pt-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brasil-blue flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Shield className="w-3 h-3" /> ÁREA RESTRITA
            </div>
            <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-sm text-gray-500 mt-0.5">InternosMed · HC-UFG</p>
          </div>
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">E-mail do Administrador</label>
              <input type="email" className="form-input" placeholder="admin@discente.ufg.br" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Senha</label>
              <input type="password" className="form-input" placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-brasil-blue hover:bg-brasil-blue-dark text-white font-semibold py-3 rounded-xl transition-colors shadow-md">
              Acessar Painel
            </button>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs mt-4">Criado e Administrado por @Frank.RC.Walczak</p>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-brasil-blue/10 text-brasil-blue border-brasil-blue/20",
    green: "bg-brasil-green/10 text-brasil-green border-brasil-green/20",
    amber: "bg-brasil-yellow/20 text-amber-700 border-brasil-yellow/30",
    red: "bg-red-50 text-red-600 border-red-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── TAB: GESTÃO DE FUNÇÕES ────────────────────────────────────────────────────
function FeatureManagementTab() {
  const [config, setConfig] = useState<PlanConfig>(getPlanConfig());
  const [saved, setSaved] = useState(false);

  function toggleFree(id: string) {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [id]: { ...prev.features[id], free: !prev.features[id].free }
      }
    }));
    setSaved(false);
  }

  function toggleAmbassador(id: string) {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [id]: { ...prev.features[id], ambassador: !prev.features[id].ambassador }
      }
    }));
    setSaved(false);
  }

  function handleSave() {
    savePlanConfig(config);
    setSaved(true);
    toast.success("Configuração de acesso salva com sucesso.");
    setTimeout(() => setSaved(false), 3000);
  }

  const docFeatures = ALL_FEATURES.filter(f => f.category === "document");
  const toolFeatures = ALL_FEATURES.filter(f => f.category === "tool");

  function FeatureRow({ f }: { f: typeof ALL_FEATURES[0] }) {
    const isFree = config.features[f.id]?.free ?? f.defaultFree;
    const isAmbassador = config.features[f.id]?.ambassador ?? true;
    return (
      <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{f.label}</p>
          <p className="text-xs text-gray-400">{f.path}</p>
        </div>
        {/* FREE toggle */}
        <button
          onClick={() => toggleFree(f.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isFree
              ? "bg-brasil-green/10 border-brasil-green/30 text-brasil-green"
              : "bg-gray-100 border-gray-200 text-gray-400"
          }`}
        >
          {isFree ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          Free
        </button>
        {/* AMBASSADOR toggle */}
        <button
          onClick={() => toggleAmbassador(f.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isAmbassador
              ? "bg-purple-50 border-purple-200 text-purple-700"
              : "bg-gray-100 border-gray-200 text-gray-400"
          }`}
        >
          {isAmbassador ? <Star className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          Embaixador
        </button>
        {/* PREMIUM (always on) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-brasil-yellow/20 border-brasil-yellow/40 text-amber-700">
          <Crown className="w-3 h-3" /> Premium
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-brasil-blue/5 border border-brasil-blue/20 rounded-xl p-4 text-sm text-brasil-blue-dark">
        <p className="font-semibold mb-1">Como funciona:</p>
        <ul className="text-xs space-y-0.5 text-gray-600 list-disc list-inside">
          <li><span className="font-semibold text-brasil-green">Free</span>: disponível para todos os usuários cadastrados</li>
          <li><span className="font-semibold text-purple-700">Embaixador</span>: acesso selecionado pelo admin — mais que free, menos que premium</li>
          <li><span className="font-semibold text-amber-700">Premium</span>: acesso completo a todas as funções (sempre ativo)</li>
        </ul>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-brasil-blue" /> Documentos Clínicos
        </h3>
        {docFeatures.map(f => <FeatureRow key={f.id} f={f} />)}
      </div>

      {/* Tools */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-brasil-blue" /> Ferramentas
        </h3>
        {toolFeatures.map(f => <FeatureRow key={f.id} f={f} />)}
      </div>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all shadow-md ${
          saved
            ? "bg-brasil-green text-white"
            : "bg-brasil-blue hover:bg-brasil-blue-dark text-white"
        }`}
      >
        <Save className="w-4 h-4" />
        {saved ? "Salvo!" : "Salvar Configuração de Acesso"}
      </button>
    </div>
  );
}

// ─── TAB: PLANOS E PREÇOS ─────────────────────────────────────────────────────
function PricingTab() {
  const [config, setConfig] = useState<PlanConfig>(getPlanConfig());
  const [saved, setSaved] = useState(false);

  const pricing = getPremiumPrice();
  // Recalculate live
  const liveSub = ALL_FEATURES.reduce((s, f) => s + (config.prices[f.id] || 0), 0);
  const liveDiscount = (liveSub * config.discount) / 100;
  const liveTotal = liveSub - liveDiscount;

  function setPrice(id: string, val: number) {
    setConfig(prev => ({ ...prev, prices: { ...prev.prices, [id]: val } }));
    setSaved(false);
  }

  function setDiscount(val: number) {
    setConfig(prev => ({ ...prev, discount: Math.min(100, Math.max(0, val)) }));
    setSaved(false);
  }

  function handleSave() {
    savePlanConfig(config);
    setSaved(true);
    toast.success("Tabela de preços salva.");
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    const def = ALL_FEATURES.reduce((acc, f) => ({ ...acc, [f.id]: f.price }), {});
    setConfig(prev => ({ ...prev, prices: def, discount: 20 }));
    setSaved(false);
  }

  return (
    <div className="space-y-5">
      {/* Summary card */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Subtotal (soma)</p>
          <p className="text-2xl font-bold text-gray-800">R$ {liveSub.toFixed(2)}</p>
          <p className="text-xs text-gray-400">por mês</p>
        </div>
        <div className="bg-brasil-yellow/10 rounded-xl border-2 border-brasil-yellow/40 p-4 text-center">
          <p className="text-xs text-amber-600 mb-1">Desconto Admin</p>
          <p className="text-2xl font-bold text-amber-700">{config.discount}%</p>
          <p className="text-xs text-amber-500">- R$ {liveDiscount.toFixed(2)}</p>
        </div>
        <div className="bg-brasil-green/10 rounded-xl border-2 border-brasil-green/30 p-4 text-center">
          <p className="text-xs text-brasil-green mb-1">Valor Final Premium</p>
          <p className="text-2xl font-bold text-brasil-green">R$ {liveTotal.toFixed(2)}</p>
          <p className="text-xs text-gray-400">por mês</p>
        </div>
      </div>

      {/* Discount slider */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 text-brasil-yellow-dark" /> Desconto do Pacote Premium
        </h3>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0} max={80} step={5}
            value={config.discount}
            onChange={e => setDiscount(+e.target.value)}
            className="flex-1 accent-brasil-yellow-dark"
          />
          <div className="flex items-center gap-2 bg-brasil-yellow/10 border border-brasil-yellow/40 rounded-lg px-3 py-1.5">
            <input
              type="number"
              min={0} max={80} step={1}
              value={config.discount}
              onChange={e => setDiscount(+e.target.value)}
              className="w-12 text-center font-bold text-amber-700 bg-transparent text-sm outline-none"
            />
            <span className="text-amber-700 font-bold">%</span>
          </div>
        </div>
      </div>

      {/* Per-feature pricing */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-brasil-blue" /> Preço por Funcionalidade (R$/mês)
        </h3>
        <div className="space-y-2">
          {ALL_FEATURES.map(f => (
            <div key={f.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className="flex-1 text-sm text-gray-700">{f.label}</span>
              <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg overflow-hidden">
                <span className="px-2 py-1.5 text-xs text-gray-400 bg-gray-50 border-r border-gray-200">R$</span>
                <input
                  type="number"
                  min={0} step={0.1}
                  value={config.prices[f.id] ?? f.price}
                  onChange={e => setPrice(f.id, +e.target.value)}
                  className="w-16 px-2 py-1.5 text-sm text-right outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} className={`flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all shadow-md ${saved ? "bg-brasil-green text-white" : "bg-brasil-blue hover:bg-brasil-blue-dark text-white"}`}>
          <Save className="w-4 h-4" /> {saved ? "Salvo!" : "Salvar Tabela de Preços"}
        </button>
        <button onClick={handleReset} className="flex items-center gap-2 font-medium px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Restaurar Padrão
        </button>
      </div>
    </div>
  );
}

// ─── TAB: USUÁRIOS ────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState(getUserList());
  const [search, setSearch] = useState("");

  const roleLabels: Record<UserRole, string> = {
    free: "Free",
    premium: "Premium",
    ambassador: "Embaixador",
    admin: "Admin",
  };

  const roleColors: Record<UserRole, string> = {
    free: "bg-gray-100 text-gray-600 border-gray-200",
    premium: "bg-brasil-yellow/20 text-amber-700 border-brasil-yellow/40",
    ambassador: "bg-purple-50 text-purple-700 border-purple-200",
    admin: "bg-red-50 text-red-700 border-red-200",
  };

  const roleIcons: Record<UserRole, React.ReactNode> = {
    free: <Unlock className="w-3 h-3" />,
    premium: <Crown className="w-3 h-3" />,
    ambassador: <Star className="w-3 h-3" />,
    admin: <Shield className="w-3 h-3" />,
  };

  function handleRoleChange(email: string, role: UserRole) {
    setUserRole(email, role);
    setUsers(getUserList());
    toast.success(`Papel de ${email} atualizado para ${roleLabels[role]}.`);
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-brasil-blue" /> Usuários Registrados ({users.length})
          </h3>
          <input
            className="form-input w-48 text-sm"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            {users.length === 0 ? "Nenhum usuário registrado ainda." : "Nenhum usuário encontrado."}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map(u => (
              <div key={u.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-brasil-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {u.name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border ${roleColors[u.role]}`}>
                  {roleIcons[u.role]} {roleLabels[u.role]}
                </span>
                <select
                  value={u.role}
                  onChange={e => handleRoleChange(u.email, e.target.value as UserRole)}
                  className="form-input w-36 text-sm py-1.5"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="ambassador">Embaixador</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role legend */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-brasil-blue" /> Papéis de Usuário
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {([
            ["free", "Free", "Acesso às funções marcadas como livres no painel de gestão"],
            ["ambassador", "Embaixador", "Acesso curado pelo admin — perfil especial para parceiros e promotores"],
            ["premium", "Premium", "Acesso completo a todas as funcionalidades do portal"],
            ["admin", "Admin", "Controle total — gestão de usuários, preços e configurações"],
          ] as [UserRole, string, string][]).map(([role, label, desc]) => (
            <div key={role} className={`p-3 rounded-lg border ${roleColors[role]}`}>
              <div className="flex items-center gap-1.5 font-semibold mb-0.5">
                {roleIcons[role]} {label}
              </div>
              <p className="text-xs opacity-80">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: HISTÓRICO ────────────────────────────────────────────────────────────
function HistoricoTab() {
  const history = getHistory();
  const typeCounts: Record<string, number> = {};
  history.forEach(e => { typeCounts[e.type] = (typeCounts[e.type] || 0) + 1; });

  const typeLabels: Record<string, string> = {
    exames: "Pedido de Exames", receita_simples: "Receita Simples",
    receita_controlada: "Receita Controlada", atestado: "Atestado Médico",
    alta: "Alta Hospitalar", encaminhamento: "Encaminhamento",
    retorno: "Retorno/SAMIS", lme: "LME", apac: "APAC",
  };

  function handleClearHistory() {
    if (confirm("Tem certeza que deseja apagar TODO o histórico de documentos?")) {
      clearHistory();
      toast.success("Histórico apagado.");
      window.location.reload();
    }
  }

  function handleClearUsers() {
    if (confirm("Remover dados de sessão de usuário?")) {
      localStorage.removeItem("internosmed_user");
      localStorage.removeItem("internosmed_stamp");
      toast.success("Dados de usuário removidos.");
    }
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total de Documentos" value={history.length} color="blue" />
        <StatCard icon={Users} label="Documentos Hoje" value={history.filter(e => e.date === new Date().toISOString().split("T")[0]).length} color="green" />
        <StatCard icon={BarChart2} label="Tipos de Documento" value={Object.keys(typeCounts).length} color="amber" />
        <StatCard icon={Shield} label="Administrador" value="Ativo" color="red" />
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-brasil-blue" /> Documentos por Tipo
        </h3>
        {Object.entries(typeCounts).length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Nenhum documento no histórico.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-44 truncate">{typeLabels[type] || type}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-brasil-blue h-2 rounded-full transition-all" style={{ width: `${(count / Math.max(...Object.values(typeCounts))) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-brasil-blue" /> Histórico Recente (últimos 20)
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Nenhum documento no histórico.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
                  <th className="text-left py-2 pr-4">Tipo</th>
                  <th className="text-left py-2 pr-4">Paciente</th>
                  <th className="text-left py-2 pr-4">Data</th>
                  <th className="text-left py-2">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 20).map(entry => (
                  <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 pr-4">
                      <span className="inline-block bg-brasil-blue/10 text-brasil-blue text-xs font-medium px-2 py-0.5 rounded-full">
                        {typeLabels[entry.type] || entry.type}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-gray-700">{entry.patientName}</td>
                    <td className="py-2 pr-4 text-gray-500">{isoToBR(entry.date)}</td>
                    <td className="py-2 text-gray-400 text-xs">{new Date(entry.createdAt).toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-5">
        <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Zona de Perigo
        </h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleClearHistory} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium px-4 py-2 rounded-lg transition-colors text-sm">
            <Trash2 className="w-4 h-4" /> Apagar Todo o Histórico
          </button>
          <button onClick={handleClearUsers} className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-medium px-4 py-2 rounded-lg transition-colors text-sm">
            <Users className="w-4 h-4" /> Remover Dados de Usuário
          </button>
        </div>
        <p className="text-xs text-red-400 mt-3">Ações irreversíveis. Os dados são armazenados localmente no navegador.</p>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"users" | "features" | "pricing" | "history">("users");

  function handleLogout() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    navigate("/login");
    toast.info("Sessão administrativa encerrada.");
  }

  const tabs = [
    { id: "users" as const, label: "Usuários", icon: Users },
    { id: "features" as const, label: "Gestão de Acesso", icon: Settings },
    { id: "pricing" as const, label: "Planos e Preços", icon: DollarSign },
    { id: "history" as const, label: "Histórico & Stats", icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-brasil-blue-dark text-white px-6 py-0 flex items-center shadow-xl">
        {/* Brazilian flag stripe left */}
        <div className="flex flex-col w-1.5 self-stretch mr-4">
          <div className="flex-1 bg-brasil-green" />
          <div className="flex-1 bg-brasil-yellow" />
          <div className="flex-1 bg-white/30" />
        </div>
        <div className="flex items-center gap-3 py-4 flex-1">
          <img src={logoSrc} alt="InternosMed" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="font-bold text-sm">Painel Administrativo · Inter<span className="text-brasil-yellow">NACIONAL</span></h1>
            <p className="text-xs text-blue-200">Logado como: {ADMIN_EMAIL}</p>
          </div>
          <div className="ml-auto flex gap-3">
            <button onClick={() => navigate("/")} className="text-xs text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
              ← Portal
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-red-300 hover:text-white bg-red-900/30 hover:bg-red-800 px-3 py-1.5 rounded-lg transition-colors">
              <LogOut className="w-3 h-3" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? "border-brasil-blue text-brasil-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "features" && <FeatureManagementTab />}
        {activeTab === "pricing" && <PricingTab />}
        {activeTab === "history" && <HistoricoTab />}

        <p className="text-center text-xs text-gray-400 mt-8">
          Criado e Administrado por @Frank.RC.Walczak · InternosMed · HC-UFG
        </p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  return <AdminPanel />;
}
