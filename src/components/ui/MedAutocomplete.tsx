/**
 * MedAutocomplete – Campo de autocomplete de medicamentos do SUS
 * Busca enquanto o usuário digita, mostrando nome genérico + comerciais
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { getMedAutocompleteSuggestions, type Medication } from "@/constants/medications";
import { cn } from "@/lib/utils";
import { Pill } from "lucide-react";

interface MedAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (med: Medication) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  id?: string;
}

export default function MedAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Ex: Dipirona, Amoxicilina...",
  className,
  inputClassName,
  id,
}: MedAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Medication[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateSuggestions = useCallback((q: string) => {
    const results = getMedAutocompleteSuggestions(q);
    setSuggestions(results);
    setOpen(results.length > 0);
    setActiveIdx(-1);
  }, []);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    onChange(v);
    updateSuggestions(v);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      selectMed(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function selectMed(med: Medication) {
    onChange(med.generic);
    onSelect?.(med);
    setOpen(false);
    setSuggestions([]);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => value.length >= 2 && updateSuggestions(value)}
        placeholder={placeholder}
        className={cn("form-input", inputClassName)}
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-72 overflow-y-auto">
          {suggestions.map((med, idx) => (
            <button
              key={med.generic}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); selectMed(med); }}
              className={cn(
                "w-full text-left px-4 py-2.5 hover:bg-brand-blue-50 transition-colors flex items-start gap-3 border-b border-gray-50 last:border-0",
                activeIdx === idx && "bg-brand-blue-50"
              )}
            >
              <div className="w-6 h-6 rounded-md bg-brand-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Pill className="w-3 h-3 text-brand-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{med.generic}</p>
                <p className="text-xs text-gray-400 truncate">
                  {med.commercial.slice(0, 3).join(", ")}
                  {med.commercial.length > 3 && "..."}
                </p>
                <p className="text-xs text-brand-blue-500 mt-0.5">{med.class}</p>
                {med.presentations && med.presentations.length > 0 && (
                  <p className="text-xs text-gray-300 truncate">{med.presentations.join(" · ")}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
