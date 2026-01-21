import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Companies from "@/pages/Companies";
import Dashboard from "@/pages/Dashboard";
import SelectBusiness from "@/pages/SelectBusiness";
import ValidateCertificate from "@/pages/ValidateCertificate";
import ValidateDocument from "@/pages/ValidateDocument";
import PublicAssessment from "@/pages/PublicAssessment";
import NotFound from "@/pages/NotFound";

import { AuthProvider } from "@/hooks/useAuth";
import { BusinessProvider } from "@/hooks/useBusiness";

import AuthErrorHandler from "@/components/AuthErrorHandler";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BusinessProvider>
          <AuthErrorHandler />
          <Routes>
            {/* Público */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/public-assessment" element={<PublicAssessment />} />
            <Route path="/validate-certificate" element={<ValidateCertificate />} />
            <Route path="/validate-document" element={<ValidateDocument />} />

            {/* Protegido */}
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
              path="/companies"
              element={
                <ProtectedRoute>
                  <Companies />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BusinessProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}