import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Companies from "./pages/Companies";
import NotFound from "./pages/NotFound";

// Se você ainda não criou essas telas, deixa comentado.
// import Dashboard from "./pages/Dashboard";
// import Auth from "./pages/Auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Empresas */}
        <Route path="/companies" element={<Companies />} />

        {/* Se quiser forçar /dashboard para depois */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
  