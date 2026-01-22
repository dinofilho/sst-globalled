import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Companies from "./pages/Companies";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* FORÇADO: ao abrir o site, entra em Empresas */}
        <Route path="/" element={<Companies />} />

        {/* Home fica em /home */}
        <Route path="/home" element={<Home />} />

        {/* Empresas também continua em /companies */}
        <Route path="/companies" element={<Companies />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </HashRouter>
  );
}