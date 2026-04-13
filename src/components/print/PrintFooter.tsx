/**
 * PrintFooter.tsx
 * Rodapé removido a pedido — documentos oficiais não devem conter
 * identificação de sistema ou propaganda institucional.
 */

interface PrintFooterProps {
  showWatermark?: boolean;
  showArztWeg?: boolean;
  customText?: string;
}

// Retorna null — nenhum rodapé é exibido nos documentos impressos
export default function PrintFooter(_props: PrintFooterProps) {
  return null;
}

export function PrintFooterCompact(_props?: { showArztWeg?: boolean }) {
  return null;
}
