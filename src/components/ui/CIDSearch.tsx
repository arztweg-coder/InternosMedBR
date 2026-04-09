/**
 * CIDSearch – Campo de busca CID-10 com filtro por capítulo e descrição completa ao selecionar.
 * ~500 códigos organizados em 19 capítulos clínicos.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { searchCID, CID10_CHAPTERS, type CIDEntry } from "@/constants/cid10";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, X, BookOpen } from "lucide-react";

interface CIDSearchProps {
  value: string;
  codeName: string;
  onSelect: (code: string, name: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CIDSearch({ value, codeName, onSelect, placeholder, className }: CIDSearchProps) {
  const [query, setQuery] = useState(value ? `${value} – ${codeName}` : "");
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState("all");
  const [chapterOpen, setChapterOpen] = useState(false);
  const [results, setResults] = useState<CIDEntry[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [selectedEntry, setSelectedEntry] = useState<CIDEntry | null>(
    value && codeName ? { code: value, name: codeName, chapter: "" } : null
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chapterRef = useRef<HTMLDivElement>(null);

  const updateResults = useCallback((q: string, ch: string) => {
    const r = searchCID(q, ch);
    setResults(r);
    setActiveIdx(-1);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setChapterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    setSelectedEntry(null);
    if (!v) {
      onSelect("", "");
      setResults([]);
      setOpen(false);
      return;
    }
    updateResults(v, chapter);
    setOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); selectEntry(results[activeIdx]); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  function selectEntry(entry: CIDEntry) {
    onSelect(entry.code, entry.name);
    setQuery(`${entry.code} – ${entry.name}`);
    setSelectedEntry(entry);
    setOpen(false);
    setResults([]);
  }

  function handleClear() {
    setQuery("");
    setSelectedEntry(null);
    onSelect("", "");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleChapterChange(ch: string) {
    setChapter(ch);
    setChapterOpen(false);
    if (query.length >= 2) {
      updateResults(query, ch);
      setOpen(true);
    }
  }

  const currentChapterLabel = CID10_CHAPTERS.find(c => c.id === chapter)?.label || "Todos";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Chapter filter + Search input row */}
      <div className="flex gap-2 mb-1">
        {/* Chapter selector */}
        <div ref={chapterRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setChapterOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:border-brand-blue-400 hover:text-brand-blue-600 transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-3 h-3" />
            <span className="max-w-[110px] truncate">{currentChapterLabel}</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform", chapterOpen && "rotate-180")} />
          </button>
          {chapterOpen && (
            <div className="absolute z-50 top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-y-auto">
              {CID10_CHAPTERS.map(ch => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleChapterChange(ch.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-brand-blue-50 hover:text-brand-blue-700 transition-colors border-b border-gray-50 last:border-0",
                    chapter === ch.id && "bg-brand-blue-50 text-brand-blue-700 font-semibold"
                  )}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
              else if (query.length >= 2) { updateResults(query, chapter); setOpen(true); }
            }}
            placeholder={placeholder || "Buscar por código ou nome..."}
            className={cn(
              "form-input pl-9 pr-8",
              selectedEntry && "border-brand-blue-400 bg-brand-blue-50"
            )}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors"
            >
              <X className="w-2.5 h-2.5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Selected entry description card */}
      {selectedEntry && (
        <div className="mb-1 px-3 py-2 bg-brand-blue-50 border border-brand-blue-200 rounded-lg text-xs">
          <span className="font-bold text-brand-blue-700">{selectedEntry.code}</span>
          <span className="text-brand-blue-600"> – {selectedEntry.name}</span>
          {selectedEntry.chapter && (
            <span className="ml-2 text-brand-blue-400">
              ({CID10_CHAPTERS.find(c => c.id === selectedEntry.chapter)?.label})
            </span>
          )}
        </div>
      )}

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div className="absolute z-40 left-0 right-0 mt-0 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 border-b border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
              {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
              {chapter !== "all" && ` em ${currentChapterLabel}`}
            </p>
          </div>
          {results.map((entry, idx) => {
            const chLabel = CID10_CHAPTERS.find(c => c.id === entry.chapter)?.label;
            return (
              <button
                key={entry.code}
                type="button"
                onMouseDown={e => { e.preventDefault(); selectEntry(entry); }}
                className={cn(
                  "w-full text-left px-3 py-2.5 hover:bg-brand-blue-50 transition-colors border-b border-gray-50 last:border-0 group",
                  activeIdx === idx && "bg-brand-blue-50"
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="inline-block min-w-[52px] text-center bg-brand-blue-100 group-hover:bg-brand-blue-200 text-brand-blue-700 text-xs font-bold px-1.5 py-0.5 rounded mt-0.5 transition-colors">
                    {entry.code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium leading-snug">{entry.name}</p>
                    {chLabel && (
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{chLabel}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No results message */}
      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-40 left-0 right-0 mt-0 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-center">
          <p className="text-sm text-gray-400">Nenhum código encontrado</p>
          <p className="text-xs text-gray-300 mt-0.5">Tente outro termo ou mude o filtro de capítulo</p>
        </div>
      )}
    </div>
  );
}
