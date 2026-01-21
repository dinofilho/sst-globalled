import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.h1}>SST GLOBALLED</h1>

        <p style={styles.p}>
          Plataforma inteligente de Gestão de Saúde e Segurança do Trabalho,
          integrada ao eSocial, normas regulamentadoras e controle técnico.
        </p>

        <div style={styles.card}>
          <div style={styles.list}>
            <div>✅ Gestão de documentos SST</div>
            <div>✅ Controle de NR (NR-01, NR-10, NR-20, NR-35)</div>
            <div>✅ Organização para auditorias e fiscalizações</div>
            <div>✅ Base preparada para integração com eSocial</div>
          </div>
        </div>

        <div style={styles.grid}>
          <Link to="/companies" style={styles.btn}>
            Abrir Cadastro de Empresas
          </Link>

          <Link to="/employees" style={styles.btn}>
            Abrir Cadastro de Colaboradores
          </Link>

          <Link to="/dashboard" style={styles.btnGhost}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0b0b0b",
    color: "#fff",
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: 16,
    display: "flex",
    alignItems: "center",
  },
  wrap: {
    width: "100%",
    maxWidth: 880,
    margin: "0 auto",
    display: "grid",
    gap: 14,
  },
  h1: { margin: 0, fontSize: 34, fontWeight: 900, letterSpacing: 1 },
  p: { margin: 0, color: "#cfcfcf", lineHeight: 1.7 },
  card: {
    border: "1px solid #222",
    background: "#111",
    borderRadius: 14,
    padding: 14,
  },
  list: { display: "grid", gap: 10, color: "#d6d6d6" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  btn: {
    textDecoration: "none",
    textAlign: "center",
    padding: "14px 14px",
    borderRadius: 12,
    border: "none",
    background: "#00c853",
    color: "#0b0b0b",
    fontWeight: 900,
    cursor: "pointer",
  },
  btnGhost: {
    textDecoration: "none",
    textAlign: "center",
    padding: "14px 14px",
    borderRadius: 12,
    border: "1px solid #222",
    background: "transparent",
    color: "#cfcfcf",
    fontWeight: 900,
    cursor: "pointer",
  },
};