import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return <h1>SST GLOBALLED – Sistema ativo</h1>;
}

function Auth() {
  return <h1>Página de Login</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
