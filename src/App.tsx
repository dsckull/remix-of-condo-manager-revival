import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AiAssistantFab } from "@/components/AiAssistantFab";
import Landing from "./pages/Landing";
import Reservar from "./pages/Reservar";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Moradores from "./pages/Moradores";
import Encomendas from "./pages/Encomendas";
import Visitantes from "./pages/Visitantes";
import Ocorrencias from "./pages/Ocorrencias";
import Financeiro from "./pages/Financeiro";
import Assembleias from "./pages/Assembleias";
import Reservas from "./pages/Reservas";
import Juridico from "./pages/Juridico";
import DefCom from "./pages/DefCom";
import Votacao from "./pages/Votacao";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function PublicShell({ children }: { children: React.ReactNode }) {
  return <>
    {children}
    <AiAssistantFab />
  </>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/reservar" element={<Reservar />} />
      <Route path="/pre-venda" element={<Navigate to="/reservar" replace />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<PublicShell><Index /></PublicShell>} />
      <Route path="/moradores" element={<PublicShell><Moradores /></PublicShell>} />
      <Route path="/encomendas" element={<PublicShell><Encomendas /></PublicShell>} />
      <Route path="/visitantes" element={<PublicShell><Visitantes /></PublicShell>} />
      <Route path="/ocorrencias" element={<PublicShell><Ocorrencias /></PublicShell>} />
      <Route path="/financeiro" element={<PublicShell><Financeiro /></PublicShell>} />
      <Route path="/assembleias" element={<PublicShell><Assembleias /></PublicShell>} />
      <Route path="/reservas" element={<PublicShell><Reservas /></PublicShell>} />
      <Route path="/juridico" element={<PublicShell><Juridico /></PublicShell>} />
      <Route path="/defcom" element={<PublicShell><DefCom /></PublicShell>} />
      <Route path="/votacao" element={<PublicShell><Votacao /></PublicShell>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
