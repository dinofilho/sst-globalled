import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Companies from "./pages/Companies";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<Home />} />

        {/* Cadastro de empresas */}
        <Route path="/companies" element={<Companies />} />
      </Routes>
    </HashRouter>
  );
}