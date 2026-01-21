import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Companies from "./pages/Companies";
import Employees from "./pages/Employees";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Cadastros */}
        <Route path="/companies" element={<Companies />} />
        <Route path="/employees" element={<Employees />} />

        {/* Telas extras (se já existem no seu src/pages) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />

        {/* fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </HashRouter>
  );
}