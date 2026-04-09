/**
 * types.ts — Interfaces TypeScript para sistema de calculadoras
 * InterNACIONAL HC-UFG v2.0
 */

export type FieldType = 'number' | 'radio' | 'checkbox' | 'select';
export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';
export type CategoryType = 'formula' | 'score' | 'questionnaire' | 'assessment';

export interface FieldOption {
  value: string | number;
  label: string;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: FieldType;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  options?: FieldOption[];
  unit?: string;
  info?: string;
}

export interface CalculatorResult {
  value: number | string;
  category: string;
  interpretation: string;
  severity: SeverityLevel;
  recommendations: string[];
}

export interface Calculator {
  id: string;
  name: string;
  specialty: string;
  emoji: string;
  description: string;
  tooltip: string;
  category: CategoryType;
  fields: CalculatorField[];
  calculate: (values: Record<string, unknown>) => CalculatorResult;
  references: string[];
  howToPerform?: string;
}
