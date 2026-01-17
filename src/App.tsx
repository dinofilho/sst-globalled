import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";

function Home() {
  return <h1>SST GLOBALLED – Sistema ativo</h1>;
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
