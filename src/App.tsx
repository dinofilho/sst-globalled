import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "./hooks/useAuth";
import { BusinessProvider } from "./hooks/useBusiness";
import { AuthErrorHandler } from "./components/AuthErrorHandler";

// Páginas (ajuste se algum nome estiver diferente no seu projeto)
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import SelectBusiness from "./pages/SelectBusiness";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import ValidateCertificate from "./pages/ValidateCertificate";
import ValidateDocument from "./pages/ValidateDocument";
import PublicAssessment from "./pages/PublicAssessment";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <BusinessProvider>
              <AuthErrorHandler />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />

                <Route
                  path="/select-business"
                  element={
                    <ProtectedRoute>
                      <SelectBusiness />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />

                <Route path="/validate/:code" element={<ValidateCertificate />} />
                <Route path="/validate-doc/:code" element={<ValidateDocument />} />

                <Route path="/avaliacoes" element={<PublicAssessment />} />
                <Route path="/avaliações" element={<PublicAssessment />} />
                <Route path="/avaliacao" element={<PublicAssessment />} />
                <Route path="/avaliação" element={<PublicAssessment />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BusinessProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;