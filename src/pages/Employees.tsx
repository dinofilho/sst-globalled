import { Link } from "react-router-dom";

export default function Employees() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 12 }}>Funcionários</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Página em construção (base funcionando). Depois colocamos o cadastro completo.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          to="/"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #333",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Voltar Home
        </Link>

        <Link
          to="/companies"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #333",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Empresas
        </Link>
      </div>
    </div>
  );
}