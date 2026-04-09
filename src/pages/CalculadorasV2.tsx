/**
 * CalculadorasV2.tsx — Sistema de Calculadoras Clínicas HC-UFG
 * 44 calculadoras em 13 especialidades com formulário dinâmico
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Search, Printer, Info, BookOpen, ChevronRight, ChevronDown, CheckCircle2,
  AlertCircle, AlertTriangle, XCircle, RotateCcw, Menu, X,
  ClipboardList, Stethoscope,
} from 'lucide-react';
import type { Calculator as CalcType, CalculatorResult, CalculatorField } from '../lib/calculators/types';
import InlineRadio from '../components/forms/InlineRadio';
import ScaleButtons from '../components/forms/ScaleButtons';
import { CARDIOLOGY_CALCULATORS } from '../lib/calculators/cardiology-calculators';
import { NEUROLOGY_CALCULATORS } from '../lib/calculators/neurology-calculators';
import { VASCULAR_CALCULATORS } from '../lib/calculators/vascular-calculators';
import { ICU_CALCULATORS } from '../lib/calculators/icu-calculators';
import { UROLOGY_CALCULATORS } from '../lib/calculators/urology-calculators';
import { INFECTOLOGY_CALCULATORS } from '../lib/calculators/infectology-calculators';
import { RHEUMATOLOGY_CALCULATORS } from '../lib/calculators/rheumatology-calculators';
import { SURGERY_CALCULATORS } from '../lib/calculators/surgery-calculators';
import { NEPHROLOGY_CALCULATORS } from '../lib/calculators/nephrology-calculators';
import { GERIATRICS_CALCULATORS } from '../lib/calculators/geriatrics-calculators';
import { GERIATRICS_EXTENDED_CALCULATORS } from '../lib/calculators/geriatrics-extended';
import { ENDOCRINOLOGY_CALCULATORS } from '../lib/calculators/endocrinology-calculators';
import { PNEUMOLOGY_CALCULATORS } from '../lib/calculators/pneumology-calculators';
import { CAT_CALCULATORS } from '../lib/calculators/cat-dpoc';
import { POCUS_PROTOCOLS } from '../lib/calculators/pocus-protocols';

// ── Dados ────────────────────────────────────────────────────────────────────

const ALL_CALCULATORS: CalcType[] = [
  ...CARDIOLOGY_CALCULATORS,
  ...NEUROLOGY_CALCULATORS,
  ...VASCULAR_CALCULATORS,
  ...ICU_CALCULATORS,
  ...NEPHROLOGY_CALCULATORS,
  ...PNEUMOLOGY_CALCULATORS,
  ...CAT_CALCULATORS,
  ...INFECTOLOGY_CALCULATORS,
  ...GERIATRICS_CALCULATORS,
  ...GERIATRICS_EXTENDED_CALCULATORS,
  ...ENDOCRINOLOGY_CALCULATORS,
  ...UROLOGY_CALCULATORS,
  ...RHEUMATOLOGY_CALCULATORS,
  ...SURGERY_CALCULATORS,
  ...POCUS_PROTOCOLS,
];

const SPECIALTY_ORDER = [
  'Cardiologia', 'Neurologia', 'Vascular', 'UTI/Sepse',
  'Nefrologia', 'Pneumologia', 'Infectologia', 'Geriatria',
  'Endocrinologia', 'Urologia', 'Reumatologia', 'Cirurgia', 'POCUS',
];

const CATEGORY_LABELS: Record<string, string> = {
  formula: 'Fórmula', score: 'Escore', assessment: 'Avaliação',
};

const CATEGORY_COLORS: Record<string, string> = {
  formula: 'bg-blue-100 text-blue-700',
  score: 'bg-purple-100 text-purple-700',
  assessment: 'bg-teal-100 text-teal-700',
};

// ── Tipos ─────────────────────────────────────────────────────────────────────

type FormValues = Record<string, string | number | boolean>;
type Severity = 'low' | 'moderate' | 'high' | 'critical';

// ── Utilitários ───────────────────────────────────────────────────────────────

function initValues(calc: CalcType): FormValues {
  const vals: FormValues = {};
  calc.fields.forEach(f => {
    if (f.type === 'checkbox') {
      vals[f.id] = false;
    } else if ((f.type === 'radio' || f.type === 'select') && f.options?.length) {
      vals[f.id] = f.options[0].value as string | number;
    } else {
      vals[f.id] = '';
    }
  });
  return vals;
}

function getSeverityStyles(sev: Severity) {
  switch (sev) {
    case 'low':      return { bg: 'bg-green-50',  border: 'border-green-300',  badge: 'bg-green-100 text-green-800',  label: 'Baixo Risco'     };
    case 'moderate': return { bg: 'bg-amber-50',  border: 'border-amber-300',  badge: 'bg-amber-100 text-amber-800',  label: 'Risco Moderado'  };
    case 'high':     return { bg: 'bg-orange-50', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-800', label: 'Alto Risco'     };
    case 'critical': return { bg: 'bg-red-50',    border: 'border-red-300',    badge: 'bg-red-100 text-red-800',      label: 'Crítico'         };
  }
}

// ── Componentes auxiliares ────────────────────────────────────────────────────

function SeverityIcon({ sev }: { sev: Severity }) {
  if (sev === 'low')      return <CheckCircle2  className="w-6 h-6 text-green-600"  />;
  if (sev === 'moderate') return <AlertCircle   className="w-6 h-6 text-amber-600"  />;
  if (sev === 'high')     return <AlertTriangle className="w-6 h-6 text-orange-600" />;
  return <XCircle className="w-6 h-6 text-red-600" />;
}

function DynamicField({ field, value, onChange }: {
  field: CalculatorField;
  value: string | number | boolean;
  onChange: (id: string, val: string | number | boolean) => void;
}) {
  const { id, label, type, min, max, step, required, options, unit, info } = field;

  if (type === 'checkbox') {
    return (
      <div className="flex items-start gap-3 py-2.5">
        <input
          type="checkbox" id={id}
          checked={Boolean(value)}
          onChange={e => onChange(id, e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor={id} className="flex-1 cursor-pointer text-sm text-gray-700">
          {label}
          {info && <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">{info}</span>}
        </label>
      </div>
    );
  }

  if (type === 'radio' && options) {
    const isNumericScale = options.length >= 4 && options.every(o => typeof o.value === 'number');

    if (isNumericScale) {
      const scaleLabel = `${label}${required ? ' *' : ''}${info ? ` — ${info}` : ''}`;
      const numVal = typeof value === 'number' ? value : Number(value);
      return (
        <div className="py-2">
          <ScaleButtons
            label={scaleLabel}
            min={options[0].value as number}
            max={options[options.length - 1].value as number}
            value={isNaN(numVal) ? options[0].value as number : numVal}
            onChange={v => onChange(id, v)}
          />
        </div>
      );
    }

    const inlineLabel = `${label}${required ? ' *' : ''}`;
    return (
      <div className="py-2">
        <InlineRadio
          label={inlineLabel}
          options={options as Array<{ value: any; label: string }>}
          value={value}
          onChange={v => onChange(id, v)}
          name={id}
        />
      </div>
    );
  }

  if (type === 'select' && options) {
    return (
      <div className="py-2.5">
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-800">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <select
          id={id} value={String(value)}
          onChange={e => onChange(id, e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {options.map(opt => (
            <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
          ))}
        </select>
        {info && <p className="mt-1 text-xs text-gray-500">{info}</p>}
      </div>
    );
  }

  // type === 'number'
  return (
    <div className="py-2.5">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number" id={id}
          min={min} max={max} step={step ?? 1}
          value={value === '' ? '' : String(value)}
          onChange={e => onChange(id, e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={[min, max].filter(n => n !== undefined).join(' – ') || ''}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {unit && <span className="shrink-0 text-sm text-gray-500">{unit}</span>}
      </div>
      {info && <p className="mt-1 text-xs text-gray-500">{info}</p>}
    </div>
  );
}

function ResultCard({ result, calc, onPrint }: {
  result: CalculatorResult;
  calc: CalcType;
  onPrint: () => void;
}) {
  const sev = (result.severity as Severity) ?? 'low';
  const styles = getSeverityStyles(sev);

  return (
    <div className={`rounded-xl border-2 p-6 ${styles.bg} ${styles.border}`} id="print-result">
      {/* Value + severity badge */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <SeverityIcon sev={sev} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Resultado</p>
            <p className="text-3xl font-bold text-gray-900">{String(result.value)}</p>
          </div>
        </div>
        <span className={`mt-1 shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}>
          {styles.label}
        </span>
      </div>

      {/* Category */}
      <div className="mb-4 rounded-lg bg-white/70 px-4 py-3">
        <p className="text-sm font-semibold text-gray-800">{result.category}</p>
      </div>

      {/* Interpretation */}
      <div className="mb-5">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Interpretação</h4>
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
          {result.interpretation}
        </pre>
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <ClipboardList className="h-3.5 w-3.5" />
            Recomendações Clínicas
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* References */}
      {calc.references.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <BookOpen className="h-3.5 w-3.5" />
            Referências
          </h4>
          <ol className="space-y-1">
            {calc.references.map((ref, i) => (
              <li key={i} className="text-xs text-gray-600">{i + 1}. {ref}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Print */}
      <div className="mt-5 flex justify-end print:hidden">
        <button
          onClick={onPrint}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-700 shadow-sm transition-colors hover:bg-white hover:shadow"
        >
          <Printer className="h-4 w-4" />
          Imprimir / Salvar PDF
        </button>
      </div>
    </div>
  );
}

function WelcomeScreen({ totalCalcs }: { totalCalcs: number }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100">
        <Stethoscope className="h-10 w-10 text-blue-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-800">Calculadoras Clínicas</h2>
      <p className="mb-1 text-gray-600">
        {totalCalcs} calculadoras e protocolos em 13 especialidades
      </p>
      <p className="text-sm text-gray-400">Selecione uma calculadora no painel lateral para começar</p>
      <div className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {['Evidência Baseada', 'Diretrizes Brasileiras', 'Impressão PDF', 'Uso Clínico'].map(tag => (
          <span key={tag} className="rounded-lg bg-gray-100 px-3 py-2 text-gray-600">✓ {tag}</span>
        ))}
      </div>
      <p className="mt-8 max-w-md text-xs text-gray-400">
        ⚠️ Ferramenta de apoio à decisão clínica. Não substitui o julgamento médico.
        Resultados devem ser interpretados no contexto clínico individual do paciente.
      </p>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function CalculadorasV2() {
  const [selectedCalcId, setSelectedCalcId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm]         = useState('');
  const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(null);
  const calcMainRef = useRef<HTMLDivElement>(null);
  const [formValues, setFormValues]         = useState<FormValues>({});
  const [result, setResult]                 = useState<CalculatorResult | null>(null);
  const [showTooltip, setShowTooltip]       = useState(false);
  const [showHowTo, setShowHowTo]           = useState(false);
  const [mobileSidebar, setMobileSidebar]   = useState(false);

  const selectedCalc = useMemo(
    () => ALL_CALCULATORS.find(c => c.id === selectedCalcId) ?? null,
    [selectedCalcId],
  );

  // Specialties derived from data in SPECIALTY_ORDER
  const specialties = useMemo(() => {
    const map: Record<string, { count: number; emoji: string }> = {};
    ALL_CALCULATORS.forEach(c => {
      if (!map[c.specialty]) map[c.specialty] = { count: 0, emoji: c.emoji };
      map[c.specialty].count++;
    });
    const ordered = SPECIALTY_ORDER.filter(s => map[s]).map(s => ({ name: s, ...map[s] }));
    // append any specialty not in SPECIALTY_ORDER
    Object.keys(map).forEach(s => {
      if (!SPECIALTY_ORDER.includes(s)) ordered.push({ name: s, ...map[s] });
    });
    return ordered;
  }, []);

  const sortedSpecialties = useMemo(() => {
    return [...specialties].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [specialties]);

  const searchTerm_lc = searchTerm.toLowerCase().trim();

  const calcsForSpecialty = useCallback((specName: string) => {
    return ALL_CALCULATORS.filter(c => {
      if (c.specialty !== specName) return false;
      if (!searchTerm_lc) return true;
      return (
        c.name.toLowerCase().includes(searchTerm_lc) ||
        c.description.toLowerCase().includes(searchTerm_lc) ||
        c.id.toLowerCase().includes(searchTerm_lc)
      );
    });
  }, [searchTerm_lc]);

  const isValid = useMemo(() => {
    if (!selectedCalc) return false;
    return selectedCalc.fields.every(f => {
      if (f.type !== 'number' || !f.required) return true;
      const v = formValues[f.id];
      return v !== '' && v !== undefined && v !== null && !Number.isNaN(Number(v));
    });
  }, [selectedCalc, formValues]);

  const handleSelectCalc = useCallback((calc: CalcType) => {
    setSelectedCalcId(calc.id);
    setFormValues(initValues(calc));
    setResult(null);
    setShowTooltip(false);
    setShowHowTo(false);
    setMobileSidebar(false);
    setTimeout(() => {
      calcMainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, []);

  const handleChange = useCallback((id: string, val: string | number | boolean) => {
    setFormValues(prev => ({ ...prev, [id]: val }));
    setResult(null);
  }, []);

  const handleCalculate = useCallback(() => {
    if (!selectedCalc || !isValid) return;
    try {
      setResult(selectedCalc.calculate(formValues));
    } catch {
      setResult({
        value: 'Erro', category: 'Erro no cálculo',
        interpretation: 'Verifique os valores informados e tente novamente.',
        severity: 'low',
        recommendations: ['Confirme que todos os campos obrigatórios foram preenchidos corretamente.'],
      });
    }
  }, [selectedCalc, formValues, isValid]);

  const handleReset = useCallback(() => {
    if (selectedCalc) setFormValues(initValues(selectedCalc));
    setResult(null);
  }, [selectedCalc]);

  const handlePrint = useCallback(() => window.print(), []);

  // ── Render ─────────────────────────────────────────────────────────────────

  const SidebarContent = (
    <>
      {/* Search */}
      <div className="border-b border-gray-100 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar calculadora..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Accordion: Especialidade → Calculadoras (ordem alfabética) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {sortedSpecialties.map(s => {
          const specCalcs = calcsForSpecialty(s.name);
          if (searchTerm_lc && specCalcs.length === 0) return null;
          const isExpanded = expandedSpecialty === s.name || (!!searchTerm_lc && specCalcs.length > 0);
          return (
            <div key={s.name}>
              <button
                onClick={() => setExpandedSpecialty(isExpanded && !searchTerm_lc ? null : s.name)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  expandedSpecialty === s.name
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{s.emoji}</span>
                  <span>{s.name}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`text-xs font-medium ${expandedSpecialty === s.name ? 'text-blue-200' : 'text-gray-400'}`}>
                    {specCalcs.length}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {isExpanded && (
                <div className="ml-3 mt-0.5 mb-1 border-l border-blue-200 pl-2 space-y-0.5">
                  {specCalcs.map(calc => (
                    <button
                      key={calc.id}
                      onClick={() => handleSelectCalc(calc)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                        selectedCalcId === calc.id
                          ? 'bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="shrink-0">{calc.emoji}</span>
                      <span className="truncate">{calc.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {sortedSpecialties.every(s => calcsForSpecialty(s.name).length === 0) && (
          <p className="py-8 text-center text-sm text-gray-400">Nenhuma calculadora encontrada</p>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-full flex-col bg-gray-50 print:bg-white">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setMobileSidebar(v => !v)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Calculadoras Clínicas</h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              HC-UFG · {ALL_CALCULATORS.length} ferramentas em 13 especialidades
            </p>
          </div>
        </div>
        {selectedCalc && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hidden sm:inline">{selectedCalc.emoji} {selectedCalc.specialty}</span>
            <ChevronRight className="h-4 w-4 hidden sm:block text-gray-300" />
            <span className="font-medium text-gray-800 truncate max-w-[200px]">{selectedCalc.name}</span>
          </div>
        )}
      </header>

      {/* ── Layout ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar — desktop ──────────────────────────────────────────── */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-gray-200 bg-white print:hidden lg:flex lg:flex-col">
          {SidebarContent}
        </aside>

        {/* ── Sidebar — mobile overlay ───────────────────────────────────── */}
        {mobileSidebar && (
          <div className="fixed inset-0 z-50 flex lg:hidden print:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebar(false)} />
            <aside className="relative z-10 w-72 overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 p-3">
                <span className="font-semibold text-gray-800">Calculadoras</span>
                <button onClick={() => setMobileSidebar(false)} className="rounded p-1 hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              {SidebarContent}
            </aside>
          </div>
        )}

        {/* ── Main content ───────────────────────────────────────────────── */}
        <main ref={calcMainRef as React.RefObject<HTMLDivElement>} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6">

            {!selectedCalc ? (
              <WelcomeScreen totalCalcs={ALL_CALCULATORS.length} />
            ) : (
              <div>
                {/* ── Calculator header ─────────────────────────────────── */}
                <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm print:shadow-none">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-4xl leading-none">{selectedCalc.emoji}</span>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedCalc.name}</h2>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                            {selectedCalc.specialty}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[selectedCalc.category] ?? 'bg-gray-100 text-gray-600'}`}>
                            {CATEGORY_LABELS[selectedCalc.category] ?? selectedCalc.category}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{selectedCalc.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3 print:hidden">
                    <button
                      onClick={() => setShowTooltip(v => !v)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        showTooltip ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Info className="h-3.5 w-3.5" />
                      Referência rápida
                    </button>
                    {(selectedCalc as CalcType & { howToPerform?: string }).howToPerform && (
                      <button
                        onClick={() => setShowHowTo(v => !v)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          showHowTo ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Como Realizar
                      </button>
                    )}
                  </div>

                  {/* Tooltip */}
                  {showTooltip && (
                    <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-1">Referência Rápida</p>
                      <p className="text-sm text-blue-900 leading-relaxed">{selectedCalc.tooltip}</p>
                    </div>
                  )}

                  {/* How to perform */}
                  {showHowTo && (selectedCalc as CalcType & { howToPerform?: string }).howToPerform && (
                    <div className="mt-3 rounded-lg bg-teal-50 border border-teal-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-2">Como Realizar</p>
                      <p className="text-sm text-teal-900 whitespace-pre-line leading-relaxed">
                        {(selectedCalc as CalcType & { howToPerform?: string }).howToPerform}
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Dynamic form ──────────────────────────────────────── */}
                <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm print:shadow-none print:border-0">
                  <h3 className="mb-1 text-base font-semibold text-gray-800">Dados do Paciente</h3>
                  {selectedCalc.fields.some(f => f.required) && (
                    <p className="mb-3 text-xs text-gray-400">Campos com <span className="text-red-500">*</span> são obrigatórios</p>
                  )}

                  <div className="divide-y divide-gray-100">
                    {selectedCalc.fields.map(field => (
                      <DynamicField
                        key={field.id}
                        field={field}
                        value={formValues[field.id] ?? (field.type === 'checkbox' ? false : '')}
                        onChange={handleChange}
                      />
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 print:hidden">
                    <button
                      onClick={handleCalculate}
                      disabled={!isValid}
                      className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all ${
                        isValid
                          ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                          : 'cursor-not-allowed bg-gray-300'
                      }`}
                    >
                      Calcular
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Limpar
                    </button>
                    {!isValid && (
                      <p className="text-xs text-amber-600">
                        Preencha os campos obrigatórios para calcular
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Result ────────────────────────────────────────────── */}
                {result && (
                  <ResultCard result={result} calc={selectedCalc} onPrint={handlePrint} />
                )}

                {/* Disclaimer */}
                <p className="mt-4 text-center text-xs text-gray-400 print:hidden">
                  Ferramenta de apoio à decisão clínica — não substitui avaliação médica individualizada
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Print styles ───────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          #print-result { border: 2px solid #ccc; page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
