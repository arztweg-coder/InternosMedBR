/**
 * PrintSignatureBlock – Bloco de assinatura configurável para documentos impressos.
 * Exibe assinatura de Interno, Médico ou ambos conforme seleção do usuário.
 */
import { getStamp } from "@/lib/stamp";

export type SignerRole = "interno" | "medico" | "ambos" | "nenhum";

interface PrintSignatureBlockProps {
  role: SignerRole;
  date: string; // Já formatado: "17/03/2026"
  internName?: string; // Nome do interno (lido do perfil por padrão)
  columns?: boolean; // Se true, exibe lado a lado quando "ambos"
}

export default function PrintSignatureBlock({ role, date, columns = true }: PrintSignatureBlockProps) {
  if (role === "nenhum") return null;

  const stamp = getStamp();

  const InternoBlock = () => (
    <div className="text-center text-xs">
      <div className="h-10 border-b border-gray-500 mb-1" />
      <p className="font-bold">{stamp.name || "Médico Interno"}</p>
      {stamp.crm && <p>CRM/GO: {stamp.crm}</p>}
      {stamp.rqe && <p>RQE: {stamp.rqe}</p>}
      {stamp.specialty && <p>{stamp.specialty}</p>}
      <p className="text-gray-500 italic text-xs">Interno(a) – Medicina Interna</p>
      {stamp.institution && <p className="text-gray-500">{stamp.institution}</p>}
      <p>Goiânia, {date}</p>
    </div>
  );

  const MedicoBlock = () => (
    <div className="text-center text-xs">
      <div className="h-10 border-b border-gray-500 mb-1" />
      <p className="font-bold">{stamp.name || "Médico Assistente"}</p>
      {stamp.crm && <p>CRM/GO: {stamp.crm}</p>}
      {stamp.rqe && <p>RQE: {stamp.rqe}</p>}
      {stamp.specialty && <p>{stamp.specialty}</p>}
      {stamp.institution && <p className="text-gray-500">{stamp.institution}</p>}
      <p>Goiânia, {date}</p>
    </div>
  );

  const AmbosSupervisorBlock = () => (
    <div className="text-center text-xs">
      <div className="h-10 border-b border-gray-500 mb-1" />
      <p className="font-bold text-gray-400">Preceptor / Médico Supervisor</p>
      <p className="text-gray-400">CRM/GO: _______________</p>
      <p className="text-gray-400">Especialidade: _______________</p>
      <p>Goiânia, {date}</p>
    </div>
  );

  if (role === "interno") {
    return (
      <div className="mt-8 pt-3 border-t border-gray-400">
        <div className="max-w-xs mx-auto">
          <InternoBlock />
        </div>
      </div>
    );
  }

  if (role === "medico") {
    return (
      <div className="mt-8 pt-3 border-t border-gray-400">
        <div className="max-w-xs mx-auto">
          <MedicoBlock />
        </div>
      </div>
    );
  }

  // ambos
  return (
    <div className="mt-8 pt-3 border-t border-gray-400">
      {columns ? (
        <div className="grid grid-cols-2 gap-8">
          <InternoBlock />
          <AmbosSupervisorBlock />
        </div>
      ) : (
        <div className="space-y-6">
          <InternoBlock />
          <AmbosSupervisorBlock />
        </div>
      )}
    </div>
  );
}
