import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import AuthErrorHandler from "@/components/AuthErrorHandler";

import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import SelectBusiness from "@/pages/SelectBusiness";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

export default function App() {
  // 🔴 TESTE FORÇADO — SEM ROUTER / SEM AUTH / SEM NADA
  if (
    typeof window !== "undefined" &&
    window.location.pathname === "/teste"
  ) {
    return (
      <div
        style={{
          padding: 40,
          fontSize: 26,
          fontWeight: "bold",
          color: "#00ff88",
          background: "#000",
          minHeight: "100vh",
        }}
      >
        TESTE OK — APP CARREGOU FORA DO ROUTER
      </div>
    );
  }

  // 🔵 APP NORMAL
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
              </Routes>
            </BusinessProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
