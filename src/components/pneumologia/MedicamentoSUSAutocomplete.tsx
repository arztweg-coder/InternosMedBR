import { useState, useRef, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { MEDICAMENTOS_SUS } from '../../constants/medicamentosSUS';

export interface MedicamentoItem {
  id: string;
  nome: string;
  dose: string;
  quantidade: string;
  frequencia: string;
}

interface Props {
  value: MedicamentoItem[];
  onChange: (items: MedicamentoItem[]) => void;
}

export default function MedicamentoSUSAutocomplete({ value, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.length >= 2
    ? MEDICAMENTOS_SUS.filter(m => m.toLowerCase().includes(query.toLowerCase())).slice(0, 12)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function addMedicamento(nome: string) {
    const novo: MedicamentoItem = {
      id: `med-${Date.now()}`,
      nome,
      dose: '',
      quantidade: '',
      frequencia: '',
    };
    onChange([...value, novo]);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeMedicamento(id: string) {
    onChange(value.filter(m => m.id !== id));
  }

  function updateField(id: string, field: keyof Omit<MedicamentoItem, 'id' | 'nome'>, val: string) {
    onChange(value.map(m => m.id === id ? { ...m, [field]: val } : m));
  }

  return (
    <div className="space-y-2">
      {/* Lista de medicamentos adicionados */}
      {value.length > 0 && (
        <div className="space-y-2 mb-3">
          {value.map(med => (
            <div key={med.id} className="border border-teal-200 rounded-lg p-3 bg-teal-50">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-teal-800">{med.nome}</span>
                <button
                  type="button"
                  onClick={() => removeMedicamento(med.id)}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Remover"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Dose</label>
                  <input
                    type="text"
                    value={med.dose}
                    onChange={e => updateField(med.id, 'dose', e.target.value)}
                    placeholder="Ex: 1 comp"
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Quantidade</label>
                  <input
                    type="text"
                    value={med.quantidade}
                    onChange={e => updateField(med.id, 'quantidade', e.target.value)}
                    placeholder="Ex: 30 cp"
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Frequência</label>
                  <input
                    type="text"
                    value={med.frequencia}
                    onChange={e => updateField(med.id, 'frequencia', e.target.value)}
                    placeholder="Ex: 1×/dia"
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input de busca */}
      <div ref={containerRef} className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-teal-400">
          <Search className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar medicamento SUS..."
            className="flex-1 px-2 py-2.5 text-sm bg-transparent focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setOpen(false); }} className="mr-2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {open && filtered.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
            {filtered.map(nome => (
              <button
                key={nome}
                type="button"
                onMouseDown={() => addMedicamento(nome)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-gray-50 last:border-0"
              >
                {nome}
              </button>
            ))}
          </div>
        )}

        {open && query.length >= 2 && filtered.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="px-3 py-2 text-sm text-gray-500">Nenhum medicamento encontrado</div>
            <button
              type="button"
              onMouseDown={() => { addMedicamento(query); }}
              className="w-full text-left px-3 py-2 text-sm text-teal-600 hover:bg-teal-50 border-t border-gray-100 flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar "{query}" manualmente
            </button>
          </div>
        )}
      </div>

      {value.length === 0 && (
        <p className="text-xs text-gray-400 mt-1">Digite ao menos 2 letras para buscar. Medicamentos não encontrados podem ser adicionados manualmente.</p>
      )}
    </div>
  );
}
