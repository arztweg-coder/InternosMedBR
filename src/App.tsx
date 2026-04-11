import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Autenticação e privacidade LGPD
import { initActivityListener } from "@/lib/auth-v2";
import { setupPrivacyProtection } from "@/lib/privacy";
import { getStoredUser } from "@/lib/auth";

// Banner de privacidade LGPD
import PrivacyBanner from "@/components/PrivacyBanner";

// Páginas v2 (refatoradas)
import LoginV2 from "@/pages/LoginV2";
import AIH from "@/pages/AIH";
import LMEV2 from "@/pages/LMEV2";
import APACV2 from "@/pages/APACV2";
import AtestadoV2 from "@/pages/AtestadoV2";
import AltaHospitalarV2 from "@/pages/AltaHospitalarV2";

// Páginas existentes (mantidas)
import Dashboard from "@/pages/Dashboard";
import Encaminhamento from "@/pages/Encaminhamento";
import ReceitaSimples from "@/pages/ReceitaSimples";
import ReceitaControlada from "@/pages/ReceitaControlada";
import ExamesSolicitacao from "@/pages/ExamesSolicitacao";
import RetornoSAMIS from "@/pages/RetornoSAMIS";
import CalculadorasV2 from "@/pages/CalculadorasV2";
import AnamnesePage from "@/pages/AnamnesePage";
import Historico from "@/pages/Historico";
import Perfil from "@/pages/Perfil";
import Admin from "@/pages/Admin";
import AppLayout from "@/components/layout/AppLayout";

// Novas especialidades de calculadoras
import NeurocirurgiaCalculators from "@/pages/calculators/NeurocirurgiaCalculators";
import ReumatologiaCalculators from "@/pages/calculators/ReumatologiaCalculators";
import ExameFisicoCalculators from "@/pages/calculators/ExameFisicoCalculators";

// Termos de Uso
import TermsOfService from "@/pages/TermsOfService";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = getStoredUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  useEffect(() => {
    // Proteção de privacidade LGPD — limpa dados ao sair/fechar
    setupPrivacyProtection();
    // Timeout de sessão — 15 minutos de inatividade
    initActivityListener();

    console.log("✓ InternosMed v2.0 iniciado");
    console.log("✓ Proteção LGPD ativa (dados não persistidos)");
    console.log("✓ Timeout de sessão: 15 minutos");
  }, []);

  return (
    <BrowserRouter>
      {/* Banner de privacidade LGPD */}
      <PrivacyBanner />

      <Toaster richColors position="top-right" />

      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginV2 />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/termos" element={<TermsOfService />} />

        {/* Rotas de especialidades (full-page, fora do AppLayout) */}
        <Route
          path="/calculadoras/neurocirurgia"
          element={
            <RequireAuth>
              <NeurocirurgiaCalculators />
            </RequireAuth>
          }
        />
        <Route
          path="/calculadoras/reumatologia"
          element={
            <RequireAuth>
              <ReumatologiaCalculators />
            </RequireAuth>
          }
        />
        <Route
          path="/calculadoras/exame-fisico"
          element={
            <RequireAuth>
              <ExameFisicoCalculators />
            </RequireAuth>
          }
        />

        {/* Rotas protegidas com layout */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Documentos DATASUS v2 */}
          <Route path="aih" element={<AIH />} />
          <Route path="lme" element={<LMEV2 />} />
          <Route path="apac" element={<APACV2 />} />

          {/* Documentos clínicos v2 */}
          <Route path="atestado" element={<AtestadoV2 />} />
          <Route path="alta" element={<AltaHospitalarV2 />} />

          {/* Outros documentos (mantidos) */}
          <Route path="encaminhamento" element={<Encaminhamento />} />
          <Route path="receita-simples" element={<ReceitaSimples />} />
          <Route path="receita-controlada" element={<ReceitaControlada />} />
          <Route path="exames" element={<ExamesSolicitacao />} />
          <Route path="retorno" element={<RetornoSAMIS />} />

          {/* Ferramentas */}
          <Route path="anamnese" element={<AnamnesePage />} />
          <Route path="calculadoras" element={<CalculadorasV2 />} />
          <Route path="historico" element={<Historico />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
