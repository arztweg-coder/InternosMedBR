import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(true);

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
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brasil-green"></span>
            <span className="text-xs text-gray-500 hidden sm:block">Hospital das Clínicas – UFG</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
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
