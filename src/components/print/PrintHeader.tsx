/**
 * PrintHeader – Cabeçalho padronizado para todos os documentos impressos.
 * Exibe o logotipo UFG/HC/EBSERH e abaixo o nome do tipo de documento.
 * Visível apenas na impressão (use dentro de divs com classe print-only).
 * 
 * NOTA: O cabeçalho deve ser o PRIMEIRO elemento dentro do bloco de impressão.
 * Use page-break-before: always no container para garantir posicionamento.
 */
import headerImg from "@/assets/header-hcufg.jpg";

interface PrintHeaderProps {
  title: string;
}

export default function PrintHeader({ title }: PrintHeaderProps) {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: "12px",
        borderBottom: "2px solid #333",
        paddingBottom: "8px",
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
    >
      <img
        src={headerImg}
        alt="UFG – Hospital das Clínicas – EBSERH"
        style={{
          maxWidth: "100%",
          height: "auto",
          maxHeight: "64px",
          display: "block",
          margin: "0 auto 8px auto",
        }}
      />
      <h2
        style={{
          fontSize: "13pt",
          fontWeight: 700,
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
