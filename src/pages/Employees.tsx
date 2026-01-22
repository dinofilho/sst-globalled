import { useNavigate } from "react-router-dom";

export default function Employees() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Funcionários</h1>
      <p style={{ opacity: 0.75, marginTop: 8 }}>
        Tela OK — /employees carregou corretamente.
      </p>

      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          ← Voltar Home
        </button>

        <button
          onClick={() => navigate("/companies")}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(34,197,94,0.45)",
            background: "rgba(34,197,94,0.18)",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Ir para Empresas
        </button>
      </div>

      <div style={{ marginTop: 28, opacity: 0.7, fontSize: 13 }}>
        Se esta tela abriu, o problema NÃO é rota — era código antigo do Employees.
      </div>
    </div>
  );
}