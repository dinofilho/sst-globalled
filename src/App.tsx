import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Companies from "./pages/Companies";
import Employees from "./pages/Employees";
import Dashboard from "./pages/Dashboard";
import ValidateCertificate from "./pages/ValidateCertificate";
import ValidateDocument from "./pages/ValidateDocument";
import PublicAssessment from "./pages/PublicAssessment";
import Auth from "./pages/Auth";
import SelectBusiness from "./pages/SelectBusiness";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* ✅ Rotas principais */}
      <Route path="/companies" element={<Companies />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/validate-certificate" element={<ValidateCertificate />} />
      <Route path="/validate-document" element={<ValidateDocument />} />
      <Route path="/public-assessment" element={<PublicAssessment />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/select-business" element={<SelectBusiness />} />

      {/* ✅ opcional: se alguém cair em /home */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}