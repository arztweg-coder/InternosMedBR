import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, getInitials } from "@/lib/auth";
import { todayBR } from "@/lib/utils";
import {
  FlaskConical, Pill, ScrollText, FileText, ClipboardList, FilePlus2,
  HeartPulse, ChevronRight, Send, CalendarClock, Calculator, Clock,
  User, Crown, Star, Lock, StickyNote, Link2, GripVertical,
} from "lucide-react";

// ── Item definitions ──────────────────────────────────────────────────────────

const ALL_ITEMS = [
  // Ferramentas
  { id: "/calculadoras",      icon: Calculator,  label: "Calculadoras Clínicas", desc: "Ferramentas de apoio clínico",              color: "bg-gray-50 text-gray-700 border-gray-200",        type: "utility" as const },
  { id: "/historico",         icon: Clock,       label: "Histórico",             desc: "Documentos gerados neste dispositivo",      color: "bg-gray-50 text-gray-700 border-gray-200",        type: "utility" as const },
  { id: "/notas",             icon: StickyNote,  label: "Bloco de Notas",        desc: "Anotações rápidas do plantão",              color: "bg-gray-50 text-gray-700 border-gray-200",        type: "utility" as const },
  { id: "/links",             icon: Link2,       label: "Links Úteis",           desc: "AGHUX, Laudos, Vivace, QWEN",              color: "bg-gray-50 text-gray-700 border-gray-200",        type: "utility" as const },
  { id: "/perfil",            icon: User,        label: "Meu Perfil",            desc: "Nome, CRM e dados do médico",              color: "bg-gray-50 text-gray-700 border-gray-200",        type: "utility" as const },
  // Documentos Clínicos
  { id: "/alta",              icon: ClipboardList, label: "Alta do Paciente",    desc: "Resumo de alta hospitalar",                color: "bg-teal-50 text-teal-700 border-teal-100",         type: "tool" as const },
  { id: "/apac",              icon: HeartPulse,    label: "APAC",                desc: "Laudo para Autorização de Procedimento",   color: "bg-rose-50 text-rose-700 border-rose-100",         type: "tool" as const },
  { id: "/atestado",          icon: FileText,      label: "Atestado Médico",     desc: "Afastamento com CID-10",                   color: "bg-purple-50 text-purple-700 border-purple-100",   type: "tool" as const },
  { id: "/encaminhamento",    icon: Send,          label: "Encaminhamento",      desc: "Interconsulta – 2 vias",                   color: "bg-indigo-50 text-indigo-700 border-indigo-100",   type: "tool" as const },
  { id: "/lme",               icon: FilePlus2,     label: "LME",                 desc: "Laudo Médico Especializado (CEAF/SUS)",    color: "bg-orange-50 text-orange-700 border-orange-100",   type: "tool" as const },
  { id: "/exames",            icon: FlaskConical,  label: "Pedido de Exames",    desc: "Rotina, risco cirúrgico e personalizados", color: "bg-blue-50 text-blue-700 border-blue-100",         type: "tool" as const },
  { id: "/receita-controlada",icon: ScrollText,    label: "Receita Controlada",  desc: "Controle especial, duas vias",             color: "bg-amber-50 text-amber-700 border-amber-100",      type: "tool" as const },
  { id: "/receita-simples",   icon: Pill,          label: "Receita Simples",     desc: "Medicamentos de uso comum",                color: "bg-green-50 text-green-700 border-green-100",      type: "tool" as const },
  { id: "/retorno",           icon: CalendarClock, label: "Retorno / SAMIS",     desc: "Agendamento ambulatorial – 2 vias",        color: "bg-cyan-50 text-cyan-700 border-cyan-100",         type: "tool" as const },
];

const ITEM_MAP = Object.fromEntries(ALL_ITEMS.map(i => [i.id, i]));

function loadOrder(email: string) {
  try {
    const raw = localStorage.getItem(`dashboard_order_${email}`);
    if (!raw) return ALL_ITEMS;
    const ids: string[] = JSON.parse(raw);
    const ordered = ids.map(id => ITEM_MAP[id]).filter(Boolean);
    // append any new items not yet in saved order
    const saved = new Set(ids);
    ALL_ITEMS.forEach(item => { if (!saved.has(item.id)) ordered.push(item); });
    return ordered;
  } catch {
    return ALL_ITEMS;
  }
}

function saveOrder(email: string, items: typeof ALL_ITEMS) {
  localStorage.setItem(`dashboard_order_${email}`, JSON.stringify(items.map(i => i.id)));
}

// ── Role display ──────────────────────────────────────────────────────────────

const roleDisplay = {
  free:       { label: "Plano Free",    icon: Lock,  color: "text-gray-500",   bg: "bg-gray-100" },
  premium:    { label: "Premium ✦",     icon: Crown, color: "text-amber-700",  bg: "bg-brasil-yellow/20" },
  ambassador: { label: "Embaixador ✦",  icon: Star,  color: "text-purple-700", bg: "bg-purple-50" },
  admin:      { label: "Administrador", icon: Crown, color: "text-red-700",    bg: "bg-red-50" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const role = user?.role || "free";
  const rd = roleDisplay[role] || roleDisplay.free;
  const RoleIcon = rd.icon;

  const [items, setItems] = useState(() =>
    user ? loadOrder(user.email) : ALL_ITEMS
  );

  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    if (user) saveOrder(user.email, items);
  }, [items]);

  function handleDragStart(i: number) {
    dragIndex.current = i;
  }

  function handleDragEnter(i: number) {
    if (dragIndex.current === null || dragIndex.current === i) return;
    setDragOver(i);
    const next = [...items];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(i, 0, moved);
    dragIndex.current = i;
    setItems(next);
  }

  function handleDragEnd() {
    dragIndex.current = null;
    setDragOver(null);
  }

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

      {/* ── Cards (draggable) ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Ferramentas &amp; Documentos
        </h2>
        <span className="text-[10px] text-gray-300 flex items-center gap-1">
          <GripVertical className="w-3 h-3" /> arraste para reorganizar
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item, i) => {
          const Icon = item.icon;
          const isDragging = dragIndex.current === i;
          const isOver = dragOver === i;
          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
              className={`flex items-center gap-3 bg-white border rounded-xl p-3.5 text-left transition-all group shadow-sm cursor-grab active:cursor-grabbing select-none
                ${isDragging ? "opacity-40 scale-95" : "opacity-100"}
                ${isOver ? "border-brasil-blue/40 shadow-md" : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"}
              `}
              onClick={() => dragIndex.current === null && navigate(item.id)}
            >
              <GripVertical className="w-4 h-4 text-gray-200 flex-shrink-0 group-hover:text-gray-300 transition-colors" />
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 truncate">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brasil-blue transition-colors flex-shrink-0" />
            </div>
          );
        })}
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
