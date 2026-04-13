import { useNavigate } from "react-router-dom";
import { getStoredUser, getInitials } from "@/lib/auth";
import { todayBR } from "@/lib/utils";
import {
  FlaskConical, Pill, ScrollText, FileText, ClipboardList, FilePlus2,
  HeartPulse, ChevronRight, Send, CalendarClock, Calculator, Clock,
  User, Crown, Star, Lock, StickyNote, Link2,
} from "lucide-react";

// Documentos Clínicos — ordenados A→Z (Anamnese removida: está no topo)
const tools = [
  { path: "/alta",              icon: ClipboardList, label: "Alta do Paciente",    desc: "Resumo de alta hospitalar",                            color: "bg-teal-50 text-teal-700 border-teal-100" },
  { path: "/apac",              icon: HeartPulse,    label: "APAC",                desc: "Laudo para Autorização de Procedimento Ambulatorial",  color: "bg-rose-50 text-rose-700 border-rose-100" },
  { path: "/atestado",          icon: FileText,      label: "Atestado Médico",     desc: "Afastamento com CID-10",                               color: "bg-purple-50 text-purple-700 border-purple-100" },
  { path: "/encaminhamento",    icon: Send,          label: "Encaminhamento",      desc: "Interconsulta – 2 vias",                               color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { path: "/lme",               icon: FilePlus2,     label: "LME",                 desc: "Laudo Médico Especializado (CEAF/SUS)",                 color: "bg-orange-50 text-orange-700 border-orange-100" },
  { path: "/exames",            icon: FlaskConical,  label: "Pedido de Exames",    desc: "Rotina, risco cirúrgico e personalizados",              color: "bg-brasil-blue/10 text-brasil-blue border-brasil-blue/20" },
  { path: "/receita-controlada",icon: ScrollText,    label: "Receita Controlada",  desc: "Controle especial, duas vias",                         color: "bg-brasil-yellow/20 text-amber-700 border-brasil-yellow/30" },
  { path: "/receita-simples",   icon: Pill,          label: "Receita Simples",     desc: "Medicamentos de uso comum",                            color: "bg-brasil-green/10 text-brasil-green border-brasil-green/20" },
  { path: "/retorno",           icon: CalendarClock, label: "Retorno / SAMIS",     desc: "Agendamento ambulatorial – 2 vias",                    color: "bg-cyan-50 text-cyan-700 border-cyan-100" },
];

const utilities = [
  { path: "/calculadoras", icon: Calculator, label: "Calculadoras Clínicas", desc: "Ferramentas de apoio clínico", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { path: "/historico",    icon: Clock,      label: "Histórico",             desc: "Documentos gerados neste dispositivo", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { path: "/notas",        icon: StickyNote, label: "Bloco de Notas",        desc: "Anotações rápidas do plantão", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { path: "/links",        icon: Link2,      label: "Links Úteis",           desc: "AGHUX, Laudos, Vivace, QWEN", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { path: "/perfil",       icon: User,       label: "Meu Perfil",            desc: "Nome, CRM e dados do médico", color: "bg-gray-50 text-gray-700 border-gray-200" },
];

const roleDisplay = {
  free:       { label: "Plano Free",      icon: Lock,  color: "text-gray-500",  bg: "bg-gray-100" },
  premium:    { label: "Premium ✦",       icon: Crown, color: "text-amber-700", bg: "bg-brasil-yellow/20" },
  ambassador: { label: "Embaixador ✦",    icon: Star,  color: "text-purple-700",bg: "bg-purple-50" },
  admin:      { label: "Administrador",   icon: Crown, color: "text-red-700",   bg: "bg-red-50" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const role = user?.role || "free";
  const rd = roleDisplay[role] || roleDisplay.free;
  const RoleIcon = rd.icon;

  return (
    <div className="animate-fade-in">

      {/* ── 5 Botões principais ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <button onClick={() => navigate('/anamnese')}
          className="bg-[#009B3A] hover:bg-[#007A2E] text-white p-5 rounded-xl shadow-md flex flex-col items-center gap-2 transition-all hover:scale-105">
          <span className="text-3xl">🩺</span>
          <span className="font-bold text-sm">Anamnese</span>
        </button>
        <button onClick={() => navigate('/notas')}
          className="bg-[#FEDF00] hover:bg-[#E5C900] text-gray-900 p-5 rounded-xl shadow-md flex flex-col items-center gap-2 transition-all hover:scale-105">
          <span className="text-3xl">📝</span>
          <span className="font-bold text-sm">Bloco de Notas</span>
        </button>
        <button onClick={() => navigate('/calculadoras')}
          className="bg-[#002776] hover:bg-[#001A5C] text-white p-5 rounded-xl shadow-md flex flex-col items-center gap-2 transition-all hover:scale-105">
          <span className="text-3xl">🧮</span>
          <span className="font-bold text-sm">Calculadoras</span>
        </button>
        <button onClick={() => navigate('/forum')}
          className="bg-[#FEDF00] hover:bg-[#E5C900] text-gray-900 p-5 rounded-xl shadow-md flex flex-col items-center gap-2 transition-all hover:scale-105">
          <span className="text-3xl">💬</span>
          <span className="font-bold text-sm">Fórum</span>
        </button>
        <button onClick={() => navigate('/links')}
          className="bg-[#009B3A] hover:bg-[#007A2E] text-white p-5 rounded-xl shadow-md flex flex-col items-center gap-2 transition-all hover:scale-105">
          <span className="text-3xl">🔗</span>
          <span className="font-bold text-sm">Links Úteis</span>
        </button>
      </div>

      {/* ── Header boas-vindas ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-brasil-green" />
          <div className="flex-1 bg-brasil-yellow" />
          <div className="flex-1 bg-brasil-blue" />
        </div>
        <div className="flex items-center gap-4 mt-1">
          <div className="w-12 h-12 rounded-full bg-brasil-blue flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
            {user ? getInitials(user.name) : "?"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Olá, {user?.name?.split(" ")[0] || "Interno"}!
            </h1>
            <p className="text-sm text-gray-500">
              {todayBR()} · {user?.specialty || "Interno de Medicina"} · HC-UFG
            </p>
            <p className="text-xs text-gray-400 mt-1.5">
              Conheça o projeto{' '}
              <a href="https://www.arztweg.com/" target="_blank" rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-semibold underline">
                ArztWEG
              </a>
              {' '}do autor, e prepare-se para fazer residência médica na Europa.
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${rd.bg} ${rd.color}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              {rd.label}
            </div>
            {user?.crm && (
              <p className="text-xs text-gray-400 hidden sm:block">CRM: <span className="font-medium text-gray-600">{user.crm}</span></p>
            )}
            <img src="./favicon-512.png" alt="InternosMed" className="h-16 w-16 object-contain hidden sm:block" />
          </div>
        </div>
      </div>

      {/* ── Ferramentas ──────────────────────────────────────────────────────── */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ferramentas</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
        {utilities.map(({ path, icon: Icon, label, desc, color }) => (
          <button key={path} onClick={() => navigate(path)}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3.5 text-left transition-all group shadow-sm hover:bg-gray-50 hover:border-gray-300 cursor-pointer">
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-700 text-sm">{label}</p>
              <p className="text-xs text-gray-400 truncate">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Documentos Clínicos (A→Z) ────────────────────────────────────────── */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Documentos Clínicos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {tools.map(({ path, icon: Icon, label, desc, color }) => (
          <button key={path} onClick={() => navigate(path)}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3.5 text-left transition-all group shadow-sm hover:bg-gray-50 hover:border-brasil-blue/30 hover:shadow cursor-pointer">
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">{label}</p>
              <p className="text-xs text-gray-500 truncate">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brasil-blue transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex h-0.5 w-24 rounded-full overflow-hidden">
          <div className="flex-1 bg-brasil-green" />
          <div className="flex-1 bg-brasil-yellow" />
          <div className="flex-1 bg-brasil-blue" />
        </div>
        <p className="text-center text-xs text-gray-400">
          <span className="font-bold text-brasil-blue">Internos</span><span className="font-bold text-brasil-green">Med</span><span className="font-bold text-brasil-yellow-dark">BR</span>
          {" "}· HC-UFG · Documentos gerados localmente
        </p>
        <p className="text-center text-xs text-gray-300">ArztWeg Company - O Caminho Médico</p>
      </div>
    </div>
  );
}
