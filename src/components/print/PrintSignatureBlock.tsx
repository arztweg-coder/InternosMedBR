/**
 * PrintSignatureBlock – Bloco de assinatura para documentos impressos.
 * 
 * Para Residente/Preceptor: exibe carimbo automático com nome, CRM/RQE.
 * Para outros cargos: exibe apenas linha para assinatura.
 */

import { getStoredUser } from "@/lib/auth";

export type SignerRole = "interno" | "medico" | "ambos" | "nenhum";

interface PrintSignatureBlockProps {
  role?: SignerRole;
  date: string;
  internName?: string;
  columns?: boolean;
}

export default function PrintSignatureBlock({ date }: PrintSignatureBlockProps) {
  const user = getStoredUser();
  const cargo = user?.cargo;
  const showStamp = cargo === "residente" || cargo === "preceptor";

  if (showStamp && user?.name) {
    return (
      <div className="mt-8 pt-3 border-t border-gray-400">
        <div className="max-w-sm mx-auto text-center text-xs">
          {/* Linha para assinatura */}
          <div className="h-10 border-b border-gray-800 mb-1" />
          {/* Carimbo automático */}
          <p className="font-bold text-gray-900">{user.name}</p>
          {user.crm && <p className="text-gray-700">CRM/GO: {user.crm}</p>}
          {user.rqe && <p className="text-gray-700">RQE: {user.rqe}</p>}
          {user.specialty && <p className="text-gray-600">{user.specialty}</p>}
          <p className="text-gray-500 mt-1">Goiânia, {date}</p>
        </div>
      </div>
    );
  }

  // Sem carimbo — apenas linha de assinatura
  return (
    <div className="mt-8 pt-3 border-t border-gray-400">
      <div className="max-w-sm mx-auto text-center text-xs">
        <div className="h-12 border-b border-gray-500 mb-1" />
        <p className="font-semibold text-gray-700">Assinatura e Carimbo</p>
        <p className="text-gray-500 mt-1">Goiânia, {date}</p>
      </div>
    </div>
  );
}
