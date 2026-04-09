/**
 * DoctorStamp – Rendered in print-only sections of all documents.
 * NOT shown on screen. Shows doctor name, CRM, RQE, specialty, institution.
 */
import { getStamp } from "@/lib/stamp";

interface DoctorStampProps {
  date?: string; // formatted BR date e.g. "17/03/2026"
  label?: string; // e.g. "Médico Assistente"
  centered?: boolean;
}

export default function DoctorStamp({ date, label, centered = true }: DoctorStampProps) {
  const stamp = getStamp();

  return (
    <div className="text-xs text-center">
      <div className="h-12 border-b border-gray-500 mb-1" />
      <p className="font-bold">{stamp.name || label || "Médico Assistente"}</p>
      {stamp.crm && <p>CRM/GO: {stamp.crm}</p>}
      {stamp.rqe && <p>RQE: {stamp.rqe}</p>}
      {stamp.specialty && <p>{stamp.specialty}</p>}
      {stamp.institution && <p className="text-gray-600">{stamp.institution}</p>}
      {stamp.phone && <p className="text-gray-600">Tel: {stamp.phone}</p>}
      {date && <p className="mt-0.5">Goiânia, {date}</p>}
    </div>
  );
}
