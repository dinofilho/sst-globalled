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
        <Route path="/" element={<Home />} />

        {/* Telas */}
        <Route path="/companies" element={<Companies />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </HashRouter>
  );
}