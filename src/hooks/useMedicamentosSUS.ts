import { MEDICAMENTOS_SUS } from '@/constants/medicamentosSUS';

export function useMedicamentosSUS() {
  function searchMedicamento(query: string): string[] {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return MEDICAMENTOS_SUS.filter(m => m.toLowerCase().includes(q)).slice(0, 10);
  }

  return { searchMedicamento, medicamentosSUS: MEDICAMENTOS_SUS };
}
