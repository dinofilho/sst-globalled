import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Companies from "@/pages/Companies";
import Employees from "@/pages/Employees";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin */}
        <Route path="/companies" element={<Companies />} />
        <Route path="/employees" element={<Employees />} />

        {/* se alguém digitar rota errada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}