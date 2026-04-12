import { useState, useEffect, useCallback } from "react";
import { StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "internosmed_notepad";

export default function BlocoNotas() {
  const [content, setContent] = useState("");

  // Carregar nota salva
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setContent(data.content || "");
      }
    } catch { /* vazio */ }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (newContent.trim()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ content: newContent }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function handleClear() {
    setContent("");
    localStorage.removeItem(STORAGE_KEY);
    toast.info("Bloco de notas limpo.");
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <StickyNote className="w-6 h-6 text-amber-600" />
          <h1 className="text-2xl font-bold text-gray-800">Bloco de Notas</h1>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Anotações temporárias — salvas enquanto sua sessão estiver ativa. O timer no header mostra o tempo restante.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
        <textarea
          className="w-full min-h-[400px] p-4 border border-amber-200 rounded-lg bg-amber-50/30 text-sm leading-relaxed resize-y outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all font-mono"
          placeholder={"Digite suas anotações aqui...\n\n• Pendências do plantão\n• Resultados de exames\n• Lembretes\n• Evolução do paciente\n\nAs notas serão apagadas automaticamente quando a sessão expirar (timer no header)."}
          value={content}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleClear}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg border border-red-200 transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" /> Limpar Notas
        </button>
        <p className="text-xs text-gray-400">
          {content.length > 0 ? `${content.length} caracteres` : "Vazio"}
        </p>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700 text-center">
          🔒 As notas ficam salvas apenas no seu navegador. Quando o timer de sessão expirar (visível no header), 
          as notas são apagadas automaticamente junto com a sessão. Nenhum dado é enviado a servidores.
        </p>
      </div>
    </div>
  );
}
