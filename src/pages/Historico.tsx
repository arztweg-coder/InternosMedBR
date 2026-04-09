import { useState } from "react";
import { Trash2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getHistory, clearHistory, deleteHistoryEntry } from "@/lib/history";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  exames: { label: "Pedido de Exames", color: "bg-brand-blue-100 text-brand-blue-700" },
  receita_simples: { label: "Receita Simples", color: "bg-green-100 text-green-700" },
  receita_controlada: { label: "Rec. Controlada", color: "bg-amber-100 text-amber-700" },
  atestado: { label: "Atestado", color: "bg-purple-100 text-purple-700" },
  alta: { label: "Alta Hospitalar", color: "bg-teal-100 text-teal-700" },
  lme: { label: "LME", color: "bg-orange-100 text-orange-700" },
  apac: { label: "APAC", color: "bg-rose-100 text-rose-700" },
  encaminhamento: { label: "Encaminhamento", color: "bg-indigo-100 text-indigo-700" },
  retorno: { label: "Ret. Ambulatorial", color: "bg-cyan-100 text-cyan-700" },
};

function formatCreatedAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function Historico() {
  const [entries, setEntries] = useState(() => getHistory());

  function handleDelete(id: string) {
    deleteHistoryEntry(id);
    setEntries(getHistory());
    toast.success("Registro removido.");
  }

  function handleClearAll() {
    if (!window.confirm("Limpar todo o histórico?")) return;
    clearHistory();
    setEntries([]);
    toast.info("Histórico limpo.");
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Histórico de Documentos</h1>
          <p className="text-sm text-gray-500">
            {entries.length} registro{entries.length !== 1 ? "s" : ""} encontrado{entries.length !== 1 ? "s" : ""}
          </p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Limpar tudo
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhum documento gerado ainda</p>
          <p className="text-sm text-gray-400 mt-1">
            O histórico é salvo automaticamente ao imprimir um documento.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const meta = TYPE_LABELS[entry.type] || { label: entry.type, color: "bg-gray-100 text-gray-700" };
            return (
              <div
                key={entry.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition-colors"
              >
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${meta.color}`}>
                  {meta.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{entry.patientName || "—"}</p>
                  <p className="text-xs text-gray-400">{formatCreatedAt(entry.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Remover registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3 border border-gray-100">
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <p>O histórico é armazenado apenas neste navegador e não contém dados sensíveis dos pacientes, apenas tipo do documento e nome.</p>
      </div>
    </div>
  );
}
