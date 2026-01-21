import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Companies from "./pages/Companies";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}