/**
 * PrintHeader – Cabeçalho padronizado para todos os documentos impressos.
 * Exibe o logotipo UFG/HC/EBSERH e abaixo o nome do tipo de documento.
 * Visível apenas na impressão (use dentro de divs com classe print-only).
 */
import headerImg from "@/assets/header-hcufg.jpg";

interface PrintHeaderProps {
  title: string; // Ex: "Pedido de Exames", "Prescrição Médica", "APAC"
}

export default function PrintHeader({ title }: PrintHeaderProps) {
  return (
    <div className="text-center mb-4 border-b-2 border-gray-700 pb-3">
      <img
        src={headerImg}
        alt="UFG – Hospital das Clínicas – EBSERH"
        style={{ maxWidth: "100%", height: "auto", maxHeight: "64px", display: "block", margin: "0 auto 8px auto" }}
      />
      <h2
        style={{
          fontSize: "13pt",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#111",
          margin: 0,
          textAlign: "center",
        }}
      >
        {title}
      </h2>
    </div>
  );
}
