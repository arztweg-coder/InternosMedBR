import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, Clock, AlertCircle } from "lucide-react";
import { getStoredUser } from "@/lib/auth";

interface Message {
  id: string;
  autor: string;
  email: string;
  conteudo: string;
  timestamp: number; // Unix timestamp em ms
  tipo: "discussao" | "elogio" | "duvida";
}

const STORAGE_KEY = "internosmed_forum_messages";
const AUTO_DELETE_HOURS = 72;

export default function ForumPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [novoConteudo, setNovoConteudo] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState<"discussao" | "elogio" | "duvida">("discussao");
  const user = getStoredUser();

  // Carregar mensagens do localStorage
  useEffect(() => {
    loadMessages();
    // Verificar e limpar mensagens expiradas a cada minuto
    const interval = setInterval(() => {
      removeExpiredMessages();
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, []);

  function loadMessages() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Message[] = JSON.parse(stored);
        setMessages(parsed.sort((a, b) => b.timestamp - a.timestamp)); // Mais recentes primeiro
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  }

  function saveMessages(msgs: Message[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
      setMessages(msgs.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Erro ao salvar mensagens:", error);
    }
  }

  function removeExpiredMessages() {
    const now = Date.now();
    const expireTime = AUTO_DELETE_HOURS * 60 * 60 * 1000; // 72h em ms
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Message[] = JSON.parse(stored);
        const filtered = parsed.filter(msg => (now - msg.timestamp) < expireTime);
        
        // Só atualiza se houver mudança
        if (filtered.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
          setMessages(filtered.sort((a, b) => b.timestamp - a.timestamp));
        }
      }
    } catch (error) {
      console.error("Erro ao remover mensagens expiradas:", error);
    }
  }

  function handleEnviar() {
    if (!user) {
      alert("Você precisa estar logado para enviar mensagens.");
      return;
    }

    if (!novoConteudo.trim()) {
      alert("Digite uma mensagem antes de enviar.");
      return;
    }

    if (novoConteudo.length > 1000) {
      alert("Mensagem muito longa. Máximo de 1000 caracteres.");
      return;
    }

    const novaMensagem: Message = {
      id: crypto.randomUUID(),
      autor: user.name,
      email: user.email,
      conteudo: novoConteudo.trim(),
      timestamp: Date.now(),
      tipo: tipoSelecionado,
    };

    const updated = [novaMensagem, ...messages];
    saveMessages(updated);
    setNovoConteudo("");
  }

  function handleDeletar(id: string) {
    if (!user) return;

    const msg = messages.find(m => m.id === id);
    if (!msg) return;

    // Apenas o autor pode deletar sua própria mensagem
    if (msg.email !== user.email) {
      alert("Você só pode deletar suas próprias mensagens.");
      return;
    }

    if (confirm("Deseja realmente excluir esta mensagem?")) {
      const updated = messages.filter(m => m.id !== id);
      saveMessages(updated);
    }
  }

  function getTempoRestante(timestamp: number): string {
    const now = Date.now();
    const expireTime = AUTO_DELETE_HOURS * 60 * 60 * 1000;
    const tempoPassado = now - timestamp;
    const tempoRestante = expireTime - tempoPassado;

    if (tempoRestante <= 0) return "Expirando...";

    const horasRestantes = Math.floor(tempoRestante / (60 * 60 * 1000));
    const minutosRestantes = Math.floor((tempoRestante % (60 * 60 * 1000)) / (60 * 1000));

    if (horasRestantes >= 24) {
      const dias = Math.floor(horasRestantes / 24);
      return `${dias}d ${horasRestantes % 24}h`;
    }

    return `${horasRestantes}h ${minutosRestantes}m`;
  }

  function formatarData(timestamp: number): string {
    const data = new Date(timestamp);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    if (data.toDateString() === hoje.toDateString()) {
      return `Hoje às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (data.toDateString() === ontem.toDateString()) {
      return `Ontem às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return data.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  }

  const tipoConfig = {
    discussao: { label: "💬 Discussão", cor: "border-blue-400 bg-blue-50 text-blue-700" },
    elogio: { label: "⭐ Elogio", cor: "border-green-400 bg-green-50 text-green-700" },
    duvida: { label: "❓ Dúvida", cor: "border-amber-400 bg-amber-50 text-amber-700" },
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <MessageSquare className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">Fórum InternosMed</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Espaço para discussões, dúvidas e elogios. Mensagens são automaticamente excluídas após 72 horas.
      </p>

      {/* Aviso de auto-exclusão */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-900 mb-1">
            ⏳ Mensagens temporárias
          </p>
          <p className="text-xs text-yellow-800">
            Todas as mensagens são <strong>automaticamente excluídas após 72 horas</strong> para 
            evitar sobrecarga do sistema. Use este espaço para discussões pontuais e dúvidas rápidas.
          </p>
        </div>
      </div>

      {/* Formulário de nova mensagem */}
      {user ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Nova Mensagem</h2>

          {/* Tipo de mensagem */}
          <div className="flex gap-2 mb-4">
            {(Object.keys(tipoConfig) as Array<keyof typeof tipoConfig>).map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoSelecionado(tipo)}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg border-2 transition-colors ${
                  tipoSelecionado === tipo
                    ? tipoConfig[tipo].cor
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tipoConfig[tipo].label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={novoConteudo}
            onChange={(e) => setNovoConteudo(e.target.value)}
            placeholder="Escreva sua mensagem aqui..."
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">
              {novoConteudo.length}/1000 caracteres
            </span>
            <button
              onClick={handleEnviar}
              disabled={!novoConteudo.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Você precisa estar <strong>logado</strong> para enviar mensagens no fórum.
          </p>
        </div>
      )}

      {/* Lista de mensagens */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-800 mb-3">
          Mensagens Recentes ({messages.length})
        </h2>

        {messages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma mensagem ainda. Seja o primeiro a participar!</p>
          </div>
        ) : (
          messages.map(msg => {
            const config = tipoConfig[msg.tipo];
            const isAutor = user?.email === msg.email;

            return (
              <div
                key={msg.id}
                className={`bg-white rounded-xl border-2 ${config.cor} p-4 transition-all hover:shadow-md`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm">{msg.autor}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${config.cor}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{formatarData(msg.timestamp)}</p>
                  </div>

                  {isAutor && (
                    <button
                      onClick={() => handleDeletar(msg.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
                      title="Excluir mensagem"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </button>
                  )}
                </div>

                {/* Conteúdo */}
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
                  {msg.conteudo}
                </p>

                {/* Tempo restante */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Expira em {getTempoRestante(msg.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Informações sobre o fórum */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
        <p className="text-xs font-bold text-purple-900 mb-2">
          📌 Regras do Fórum
        </p>
        <ul className="text-xs text-purple-800 space-y-1">
          <li>• Mensagens são <strong>públicas</strong> e visíveis para todos os usuários</li>
          <li>• Auto-exclusão após <strong>72 horas</strong> (3 dias)</li>
          <li>• Você pode deletar apenas suas <strong>próprias mensagens</strong></li>
          <li>• Máximo de <strong>1000 caracteres</strong> por mensagem</li>
          <li>• Mantenha o respeito e profissionalismo</li>
        </ul>
      </div>
    </div>
  );
}
