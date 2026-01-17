// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function Home() {
  return (
    <div className="container">
      <h1>SST GLOBALLED — Sistema ativo</h1>
      <small>
        Ir para: <Link to="/auth">Login</Link>
      </small>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
