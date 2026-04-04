import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
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
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
      <Route path="/moradores" element={<AuthGuard><Moradores /></AuthGuard>} />
      <Route path="/encomendas" element={<AuthGuard><Encomendas /></AuthGuard>} />
      <Route path="/visitantes" element={<AuthGuard><Visitantes /></AuthGuard>} />
      <Route path="/ocorrencias" element={<AuthGuard><Ocorrencias /></AuthGuard>} />
      <Route path="/financeiro" element={<AuthGuard><Financeiro /></AuthGuard>} />
      <Route path="/assembleias" element={<AuthGuard><Assembleias /></AuthGuard>} />
      <Route path="/reservas" element={<AuthGuard><Reservas /></AuthGuard>} />
      <Route path="/juridico" element={<AuthGuard><Juridico /></AuthGuard>} />
      <Route path="/defcom" element={<AuthGuard><DefCom /></AuthGuard>} />
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
