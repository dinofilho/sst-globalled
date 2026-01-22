import { Link } from "react-router-dom";

export default function Home() {
  const styles: Record<string, React.CSSProperties> = {
    wrap: {
      minHeight: "100vh",
      background: "#0b0b0b",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    card: {
      width: "min(720px, 100%)",
      background: "#111",
      border: "1px solid rgba(255,255,255,.08)",
      borderRadius: 16,
      padding: 24,
      boxShadow: "0 10px 40px rgba(0,0,0,.35)",
    },
    h1: { margin: 0, fontSize: 44, letterSpacing: 1 },
    p: { marginTop: 10, opacity: 0.75, fontSize: 18, lineHeight: 1.5 },
    ul: { marginTop: 16, opacity: 0.85, fontSize: 16, lineHeight: 1.8 },
    btn: {
      display: "block",
      textAlign: "center",
      textDecoration: "none",
      padding: "14px 16px",
      borderRadius: 12,
      background: "#1b5cff",
      color: "#fff",
      fontWeight: 700,
      fontSize: 16,
      border: "1px solid rgba(255,255,255,.12)",
    },
    btnGhost: {
      display: "block",
      textAlign: "center",
      textDecoration: "none",
      padding: "14px 16px",
      borderRadius: 12,
      background: "transparent",
      color: "#fff",
      fontWeight: 700,
      fontSize: 16,
      border: "1px solid rgba(255,255,255,.18)",
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.h1}>SST GLOBALLED</h1>

        <p style={styles.p}>
          Plataforma inteligente de Gestão de Saúde e Segurança do Trabalho,
          integrada ao eSocial, normas regulamentadoras e controle técnico.
        </p>

        <ul style={styles.ul}>
          <li>✅ Gestão de documentos SST</li>
          <li>✅ Controle de NR (NR-01, NR-10, NR-20, NR-35)</li>
          <li>✅ Organização para auditorias e fiscalizações</li>
          <li>✅ Base preparada para integração com eSocial</li>
        </ul>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <Link to="/companies" style={styles.btn}>
            Abrir cadastro de Empresas
          </Link>

          <a href="https://wa.me/55SEUNUMEROAQUI" style={styles.btnGhost}>
            Falar com a GLOBALLED
          </a>
        </div>
      </div>
    </div>
  );
}