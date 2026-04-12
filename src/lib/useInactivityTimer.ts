/**
 * useInactivityTimer.ts
 * Hook global de inatividade — controla logout automático e limpeza de dados.
 * 
 * - Reseta ao detectar: click, keydown, mousemove, scroll, touchstart
 * - Exibe tempo restante no header
 * - Ao expirar: limpa sessão, notas e redireciona para login
 * - Timeout padrão: 2 horas (7200 segundos)
 */

import { useState, useEffect, useCallback, useRef } from "react";

const TIMEOUT_SECONDS = 2 * 60 * 60; // 2 horas
const STORAGE_KEY_LAST_ACTIVITY = "internosmed_last_activity";
const NOTEPAD_KEY = "internosmed_notepad";

export function getLastActivity(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
    return raw ? parseInt(raw, 10) : Date.now();
  } catch {
    return Date.now();
  }
}

function setLastActivity() {
  localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, Date.now().toString());
}

export function useInactivityTimer(onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(TIMEOUT_SECONDS);
  const expireCalled = useRef(false);

  // Registrar atividade
  const resetTimer = useCallback(() => {
    setLastActivity();
    setSecondsLeft(TIMEOUT_SECONDS);
    expireCalled.current = false;
  }, []);

  // Escutar eventos de atividade
  useEffect(() => {
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"];
    
    const handler = () => resetTimer();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    
    // Inicializar
    setLastActivity();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [resetTimer]);

  // Tick a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const lastActivity = getLastActivity();
      const elapsed = Math.floor((Date.now() - lastActivity) / 1000);
      const remaining = Math.max(0, TIMEOUT_SECONDS - elapsed);
      setSecondsLeft(remaining);

      if (remaining <= 0 && !expireCalled.current) {
        expireCalled.current = true;
        // Limpar notas temporárias
        localStorage.removeItem(NOTEPAD_KEY);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpire]);

  return { secondsLeft, resetTimer };
}

/**
 * Formata segundos em "Xh XXmin" ou "XXmin XXs"
 */
export function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return "Expirado";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  }
  if (minutes > 0) {
    return `${minutes}min ${secs.toString().padStart(2, "0")}s`;
  }
  return `${secs}s`;
}

/**
 * Retorna a cor do timer baseado no tempo restante
 */
export function getTimerColor(seconds: number): string {
  if (seconds <= 300) return "text-red-500"; // < 5 min
  if (seconds <= 900) return "text-amber-500"; // < 15 min
  return "text-gray-400"; // normal
}
