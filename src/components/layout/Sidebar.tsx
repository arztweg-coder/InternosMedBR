import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FlaskConical, FileText, Pill, ClipboardList,
  FilePlus2, LogOut, ScrollText, HeartPulse, Send, CalendarClock,
  User, Clock, Calculator, Shield, Crown, Star, Hospital,
} from "lucide-react";
import { PrivacyBadge } from "@/components/PrivacyBanner";
import { clearUser, getInitials, getStoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo-internosmed.png";

interface NavItemDef {
  path: string;
  label: string;
  icon: React.ElementType;
  featureId?: string;
  exact?: boolean;
}

const navItems: NavItemDef[] = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/anamnese", label: "Anamnese 📋", icon: ClipboardList, featureId: "anamnese" },
  { path: "/calculadoras", label: "Calculadoras 🧮", icon: Calculator, featureId: "calculadoras" },
  { path: "/aih", label: "AIH", icon: Hospital, featureId: "aih" },
  { path: "/alta", label: "Alta Hospitalar", icon: ClipboardList, featureId: "alta" },
  { path: "/apac", label: "APAC", icon: HeartPulse, featureId: "apac" },
  { path: "/atestado", label: "Atestado Médico", icon: FileText, featureId: "atestado" },
  { path: "/encaminhamento", label: "Encaminhamento", icon: Send, featureId: "encaminhamento" },
  { path: "/lme", label: "LME", icon: FilePlus2, featureId: "lme" },
  { path: "/exames", label: "Pedido de Exames", icon: FlaskConical, featureId: "exames" },
  { path: "/receita-controlada", label: "Receita Controlada", icon: ScrollText, featureId: "receita-controlada" },
  { path: "/receita-simples", label: "Receita Simples", icon: Pill, featureId: "receita-simples" },
  { path: "/retorno", label: "Retorno / SAMIS", icon: CalendarClock, featureId: "retorno" },
];

const bottomItems: NavItemDef[] = [
  { path: "/admin", label: "Admin", icon: Shield },
  { path: "/historico", label: "Histórico", icon: Clock, featureId: "historico" },
  { path: "/perfil", label: "Meu Perfil", icon: User, featureId: "perfil" },
];

interface SidebarProps {
  collapsed: boolean;
}

const roleBadge: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  premium: { label: "Premium", icon: Crown, color: "bg-brasil-yellow/20 text-amber-600 border-brasil-yellow/40" },
  ambassador: { label: "Embaixador", icon: Star, color: "bg-purple-900/40 text-purple-300 border-purple-700/40" },
  admin: { label: "Admin", icon: Shield, color: "bg-red-900/40 text-red-300 border-red-700/40" },
  free: { label: "Interno", icon: User, color: "bg-white/10 text-blue-200 border-white/10" },
  interno: { label: "Interno", icon: User, color: "bg-white/10 text-blue-200 border-white/10" },
  medico: { label: "Médico", icon: User, color: "bg-teal-900/40 text-teal-300 border-teal-700/40" },
  preceptor: { label: "Preceptor", icon: Shield, color: "bg-blue-900/40 text-blue-300 border-blue-700/40" },
};

export default function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const effectiveCollapsed = collapsed && !isHovered;
  const user = getStoredUser();
  const userRole = user?.role || "free";

  function handleLogout() {
    clearUser();
    navigate("/login");
  }

  const badge = roleBadge[userRole] || roleBadge.free;
  const BadgeIcon = badge.icon;

  const NavItem = ({ path, label, icon: Icon, exact }: NavItemDef) => {
    return (
      <NavLink
        to={path}
        end={exact}
        title={effectiveCollapsed ? label : undefined}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 relative group",
            effectiveCollapsed ? "justify-center" : "",
            isActive
              ? "bg-white/15 text-white font-medium"
              : "text-blue-100/80 hover:bg-white/10 hover:text-white"
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute left-0 top-0 h-full w-0.5 bg-brasil-yellow rounded-r" />
            )}
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!effectiveCollapsed && <span className="truncate flex-1">{label}</span>}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col transition-all duration-300 overflow-hidden no-print flex-shrink-0",
        effectiveCollapsed ? "w-16" : "w-56"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brazilian flag top stripe */}
      <div className="flex h-1">
        <div className="flex-1 bg-brasil-green" />
        <div className="flex-1 bg-brasil-yellow" />
        <div className="flex-1 bg-white/30" />
      </div>

      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-3 py-3 border-b border-white/10", effectiveCollapsed && "justify-center")}>
        <img src={logoSrc} alt="InternosMed" className="w-9 h-9 object-contain flex-shrink-0 rounded-md" />
        {!effectiveCollapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight tracking-wide">
              Internos<span className="text-teal-400">Med</span>
            </p>
            <p className="text-blue-200 text-xs leading-tight">Portal do Interno · HC-UFG</p>
          </div>
        )}
      </div>

      {/* User avatar + role badge */}
      <div className={cn("flex items-center gap-2.5 px-3 py-3 border-b border-white/10", effectiveCollapsed && "justify-center")}>
        <div className="w-7 h-7 rounded-full bg-brasil-blue flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
          {user ? getInitials(user.name) : "?"}
        </div>
        {!collapsed && user && (
          <div className="overflow-hidden flex-1">
            <p className="text-white text-xs font-semibold truncate">{user.name.split(" ")[0]}</p>
            <p className="text-blue-300 text-xs truncate">{user.specialty || "Interno"}</p>
          </div>
        )}
        {!effectiveCollapsed && (
          <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.color}`}>
            <BadgeIcon className="w-2.5 h-2.5" />
            {badge.label}
          </span>
        )}
      </div>

      {/* Nav principal */}
      <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin">
        {!collapsed && <p className="px-4 py-1.5 text-blue-300/50 text-xs font-semibold uppercase tracking-wider">Documentos</p>}
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}

        {!collapsed && <p className="px-4 py-1.5 mt-2 text-blue-300/50 text-xs font-semibold uppercase tracking-wider">Ferramentas</p>}
        {bottomItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* Badge LGPD */}
      {!effectiveCollapsed && (
        <div className="px-3 py-2 border-t border-white/10">
          <PrivacyBadge />
        </div>
      )}

      {/* Logout */}
      <div className="flex h-1">
        <div className="flex-1 bg-white/10" />
        <div className="flex-1 bg-brasil-green/40" />
        <div className="flex-1 bg-brasil-yellow/40" />
      </div>
      <div className="px-4 py-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          title={effectiveCollapsed ? "Sair" : undefined}
          className={cn(
            "flex items-center gap-3 text-blue-200 hover:text-white text-sm transition-colors w-full",
            effectiveCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!effectiveCollapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
