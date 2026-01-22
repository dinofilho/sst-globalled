import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>
        SST GLOBALLED
      </h1>

      <p style={{ opacity: 0.75, maxWidth: 520, marginBottom: 32 }}>
        Plataforma inteligente de Gestão de Saúde e Segurança do Trabalho,
        integrada ao eSocial e normas regulamentadoras.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
          maxWidth: 320,
        }}
      >
        <Link to="/companies" style={btnPrimary}>
          Cadastrar Empresas
        </Link>

        <Link to="/employees" style={btn}>
          Funcionários
        </Link>

        <Link to="/dashboard" style={btn}>
          Dashboard
        </Link>

        <Link to="/validate-certificate" style={btn}>
          Validar Certificado
        </Link>

        <a
          href="https://wa.me/55SEUNUMEROAQUI"
          target="_blank"
          rel="noreferrer"
          style={btnWhats}
        >
          Falar com a GLOBALLED
        </a>
      </div>

      <p style={{ marginTop: 40, fontSize: 12, opacity: 0.4 }}>
        Deploy OK — Vercel funcionando
      </p>
    </div>
  );
}

/* ===== estilos ===== */

const btn: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid #2a2a2a",
  background: "#151515",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 500,
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: "#0a7a33",
  border: "none",
};

const btnWhats: React.CSSProperties = {
  ...btn,
  background: "#25D366",
  color: "#000",
  fontWeight: 600,
};