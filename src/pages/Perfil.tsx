import { useState } from "react";
import { toast } from "sonner";
import { Save, User } from "lucide-react";
import { getStoredUser, storeUser, getInitials } from "@/lib/auth";
import type { UserCargo } from "@/types";

const CARGO_OPTIONS: { value: UserCargo; label: string }[] = [
  { value: "interno", label: "Interno" },
  { value: "preceptor", label: "Preceptor" },
  { value: "residente", label: "Residente" },
  { value: "enfermagem", label: "Enfermagem" },
  { value: "colaborador", label: "Colaborador (outros)" },
];

export default function Perfil() {
  const user = getStoredUser();

  const [name, setName] = useState(user?.name || "");
  const [cargo, setCargo] = useState<UserCargo | "">(user?.cargo || "");
  const [matricula, setMatricula] = useState(user?.matricula || "");
  const [crm, setCrm] = useState(user?.crm || "");
  const [rqe, setRqe] = useState(user?.rqe || "");
  const [specialty, setSpecialty] = useState(user?.specialty || "");
  const [turma, setTurma] = useState(user?.turma || "");
  const [institution, setInstitution] = useState(user?.institution || "HC-UFG – Hospital das Clínicas da UFG");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dataNascimento, setDataNascimento] = useState(user?.dataNascimento || "");
  const [address, setAddress] = useState(user?.address || "");

  const showCRM = cargo === "residente" || cargo === "preceptor";
  const showRQE = cargo === "preceptor";
  const showMatricula = !!cargo;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Informe seu nome."); return; }
    if (!cargo) { toast.error("Selecione seu cargo/função."); return; }
    
    storeUser({
      ...user!,
      name,
      cargo,
      matricula,
      crm: showCRM ? crm : "",
      rqe: showRQE ? rqe : "",
      specialty,
      turma,
      institution,
      phone,
      dataNascimento,
      address,
      profileComplete: true,
    });
    toast.success("Perfil atualizado com sucesso!");
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Meu Perfil</h1>
      <p className="text-sm text-gray-500 mb-6">
        Seus dados aparecem automaticamente nos documentos impressos.
      </p>

      {/* Avatar + Logo area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {name ? getInitials(name) : <User className="w-8 h-8" />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-800 text-lg">{name || "Seu nome"}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {cargo && (
              <p className="text-xs text-brand-blue-600 font-medium mt-0.5">
                {CARGO_OPTIONS.find(c => c.value === cargo)?.label}
                {crm && showCRM ? ` · CRM/GO: ${crm}` : ""}
                {rqe && showRQE ? ` · RQE: ${rqe}` : ""}
              </p>
            )}
          </div>
          <img src="./favicon-512.png" alt="InternosMed" className="w-14 h-14 object-contain hidden sm:block" />
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Cargo/Função */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Cargo / Função</h3>
            <p className="text-xs text-gray-500 mb-3">Selecione sua função no HC-UFG (apenas uma opção):</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CARGO_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    cargo === opt.value
                      ? "border-brand-blue-600 bg-brand-blue-50 text-brand-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="cargo"
                    value={opt.value}
                    checked={cargo === opt.value}
                    onChange={(e) => setCargo(e.target.value as UserCargo)}
                    className="w-4 h-4 accent-brand-blue-600"
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dados Pessoais */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="form-label">Nome e Sobrenome</label>
                <input
                  className="form-input"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {showMatricula && (
                <div>
                  <label className="form-label">Matrícula</label>
                  <input
                    className="form-input"
                    placeholder="Nº matrícula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                  />
                </div>
              )}

              {showCRM && (
                <div>
                  <label className="form-label">CRM</label>
                  <input
                    className="form-input"
                    placeholder="Ex: 12345"
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                  />
                </div>
              )}

              {showRQE && (
                <div>
                  <label className="form-label">RQE</label>
                  <input
                    className="form-input"
                    placeholder="Ex: 6789"
                    value={rqe}
                    onChange={(e) => setRqe(e.target.value)}
                  />
                </div>
              )}

              {(cargo === "residente" || cargo === "preceptor") && (
                <div className={showRQE ? "" : "col-span-2 sm:col-span-1"}>
                  <label className="form-label">Especialidade</label>
                  <input
                    className="form-input"
                    placeholder="Ex: Clínica Médica"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  />
                </div>
              )}

              {cargo === "interno" && (
                <div>
                  <label className="form-label">Turma</label>
                  <input
                    className="form-input"
                    placeholder="Ex: LXIX"
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="form-label">Telefone</label>
                <input
                  className="form-input"
                  placeholder="(62) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  className="form-input"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="form-label">Instituição</label>
                <input
                  className="form-input"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" /> Salvar Perfil
            </button>
          </div>
        </form>
      </div>

      <div className="bg-brand-blue-50 border border-brand-blue-100 rounded-xl p-4 text-sm text-brand-blue-700">
        <p className="font-semibold mb-1">Como seus dados são usados:</p>
        <p className="text-brand-blue-600">
          CRM e especialidade aparecem nos documentos impressos (apenas para Residente e Preceptor). 
          A logo InternosMed aparece no portal mas NÃO é impressa nos documentos. 
          Dados salvos localmente no seu navegador — sem envio a servidores.
        </p>
      </div>
    </div>
  );
}
