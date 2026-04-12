import { ExternalLink, Monitor, FileSearch, ImageIcon, Bot, HardDrive, StickyNote, FileText, Sparkles } from "lucide-react";

const links = [
  {
    title: "AGHUX (Sistema HC-UFG)",
    description: "Sistema de gestão hospitalar do HC-UFG",
    url: "https://10.50.0.35/aghu/pages/casca/casca.xhtml",
    icon: Monitor,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    title: "Busca Laudos Online",
    description: "Consulta de laudos laboratoriais",
    url: "https://hcufg.buscalaudos.com.br/login-cliente",
    icon: FileSearch,
    color: "bg-green-50 text-green-700 border-green-200",
    iconColor: "text-green-600",
  },
  {
    title: "Vivace (Exames de Imagem)",
    description: "Visualização de exames de imagem",
    url: "https://connect.hc.ufg.br/entrySignIn",
    icon: ImageIcon,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    iconColor: "text-purple-600",
  },
  {
    title: "Google Drive",
    description: "Armazenamento e documentos na nuvem",
    url: "https://drive.google.com/",
    icon: HardDrive,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-600",
  },
  {
    title: "Google Keep",
    description: "Notas e lembretes rápidos",
    url: "https://keep.google.com/",
    icon: StickyNote,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    title: "InverTexto",
    description: "Notepad online minimalista",
    url: "https://www.invertexto.com/notepad",
    icon: FileText,
    color: "bg-gray-50 text-gray-700 border-gray-200",
    iconColor: "text-gray-600",
  },
  {
    title: "Gemini AI",
    description: "Assistente de IA do Google",
    url: "https://gemini.google.com/app",
    icon: Sparkles,
    color: "bg-sky-50 text-sky-700 border-sky-200",
    iconColor: "text-sky-600",
  },
  {
    title: "IA QWEN (Grátis)",
    description: "Assistente de inteligência artificial gratuito",
    url: "https://chat.qwen.ai/",
    icon: Bot,
    color: "bg-orange-50 text-orange-700 border-orange-200",
    iconColor: "text-orange-600",
  },
];

export default function LinksUteis() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Links Úteis</h1>
      <p className="text-sm text-gray-500 mb-6">Acesso rápido a sistemas e ferramentas do HC-UFG.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 bg-white border rounded-xl p-5 transition-all hover:shadow-md hover:scale-[1.01] group ${link.color}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${link.color}`}>
                <Icon className={`w-6 h-6 ${link.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{link.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
            </a>
          );
        })}
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800 text-center">
          ⚠️ Alguns links são acessíveis apenas na rede interna do HC-UFG (Intranet).
        </p>
      </div>
    </div>
  );
}
