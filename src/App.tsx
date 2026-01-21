import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./hooks/useAuth";
import { BusinessProvider } from "./hooks/useBusiness";
import { AuthErrorHandler } from "./components/AuthErrorHandler";

import Home from "./pages/Home";
import SelectBusiness from "./pages/SelectBusiness";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ValidateDocument from "./pages/ValidateDocument";
import ValidateCertificate from "./pages/ValidateCertificate";
import PublicAssessment from "./pages/PublicAssessment";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./components/AdminPanel";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("SUPABASE SESSION:", data);
      console.log("SUPABASE ERROR:", error);
      console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    })();
  }, []);

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
<Route path="/teste" element={<div style={{ padding: 20 }}>TESTE OK</div>} />
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

                <Route path="/validate/:code" element={<ValidateCertificate />} />
                <Route path="/validate-doc/:code" element={<ValidateDocument />} />

                <Route path="/avaliacoes" element={<PublicAssessment />} />
                <Route path="/avaliações" element={<PublicAssessment />} />
                <Route path="/avaliacao" element={<PublicAssessment />} />
                <Route path="/avaliação" element={<PublicAssessment />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
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

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BusinessProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
