import { Printer } from 'lucide-react';

interface Props {
  titulo?: string;
}

export default function BotaoImprimir({ titulo = 'Imprimir formulário' }: Props) {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 bg-white text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors no-print"
    >
      <Printer className="w-4 h-4" />
      {titulo}
    </button>
  );
}
