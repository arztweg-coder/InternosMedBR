import { useState } from "react";
import { toast } from "sonner";
import { Save, User } from "lucide-react";
import { getStoredUser, storeUser, getInitials } from "@/lib/auth";
import logoSrc from "@/assets/logo-internosmed.png";

export default function Perfil() {
  const user = getStoredUser();

  const [name, setName] = useState(user?.name || "");
  const [crm, setCrm] = useState(user?.crm || "");
  const [specialty, setSpecialty] = useState(user?.specialty || "");
  const [turma, setTurma] = useState(user?.turma || "");
  const [institution, setInstitution] = useState(user?.institution || "HC-UFG – Hospital das Clínicas da UFG");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Informe seu nome."); return; }
    storeUser({ ...user!, name, crm, specialty, turma, institution, phone, address });
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
            {crm && <p className="text-xs text-brand-blue-600 font-medium mt-0.5">CRM/GO: {crm}</p>}
          </div>
          <img src={logoSrc} alt="InternosMed" className="w-14 h-14 object-contain hidden sm:block" />
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Basic info */}
          <div>
            <h3 className="text-sm font-semibold text-brand-blue-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="form-label">Nome Completo</label>
                <input
                  className="form-input"
                  placeholder="Dr(a). Nome Sobrenome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Turma</label>
                <input
                  className="form-input"
                  placeholder="Ex: LXIX"
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Telefone / Ramal</label>
                <input
                  className="form-input"
                  placeholder="(62) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="form-label">Endereço do consultório / serviço</label>
                <input
                  className="form-input"
                  placeholder="Rua, Nº, Bairro – Goiânia/GO"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
        <ul className="list-disc list-inside space-y-0.5 text-brand-blue-600">
          <li>CRM e especialidade aparecem nos documentos impressos</li>
          <li>A logo <strong>InternosMed</strong> aparece no portal mas NÃO é impressa nos documentos</li>
          <li>Dados salvos localmente no seu navegador (sem envio a servidores)</li>
        </ul>
      </div>
    </div>
  );
}
