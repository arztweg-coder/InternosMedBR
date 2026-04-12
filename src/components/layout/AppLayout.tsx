import { Outlet, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import { Menu, Home, Clock } from "lucide-react";
import { clearUser } from "@/lib/auth";
import { useInactivityTimer, formatTimeLeft, getTimerColor } from "@/lib/useInactivityTimer";
import { toast } from "sonner";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleExpire = useCallback(() => {
    clearUser();
    toast.error("Sessão expirada por inatividade.");
    navigate("/login?timeout=true");
  }, [navigate]);

  const { secondsLeft } = useInactivityTimer(handleExpire);
  const timerColor = getTimerColor(secondsLeft);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3 no-print flex-shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="p-1.5 rounded-md text-gray-500 hover:bg-blue-50 hover:text-brand-blue-600 transition-colors"
            title="Início"
          >
            <Home className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brasil-green"></span>
            <span className="text-xs text-gray-500 hidden sm:block">Hospital das Clínicas – UFG</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Timer de inatividade */}
            <div className={`flex items-center gap-1.5 text-xs font-mono ${timerColor}`} title="Tempo restante antes do logout automático">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimeLeft(secondsLeft)}</span>
            </div>
            <div className="w-px h-5 bg-gray-200 hidden sm:block" />
            <img src="./favicon-512.png" alt="InternosMed" className="w-7 h-7 object-contain" />
            <span className="text-xs font-semibold text-brand-blue-600 hidden sm:inline">
              Internos<span className="text-teal-500">Med</span>
            </span>
            <span className="text-xs text-gray-400 hidden sm:block">© {new Date().getFullYear()}</span>
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
