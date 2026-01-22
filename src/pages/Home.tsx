import { Link } from "react-router-dom";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>SST GLOBALLED</h1>

        <p style={styles.subtitle}>
          Plataforma inteligente de Gestão de Saúde e Segurança do Trabalho,
          integrada ao eSocial e normas regulamentadoras.
        </p>

        <div style={styles.actions}>
          <Link to="/companies" style={styles.btnPrimary}>
            Cadastrar Empresas
          </Link>

          {/* ✅ CORREÇÃO: rota de Funcionários */}
          <Link to="/employees" style={styles.btnGhost}>
            Funcionários
          </Link>

          <Link to="/dashboard" style={styles.btnGhost}>
            Dashboard
          </Link>

          <Link to="/validate-certificate" style={styles.btnGhost}>
            Validar Certificado
          </Link>

          {/* Botão WhatsApp (troque o número) */}
          <a
            href="https://wa.me/55SEUNUMEROAQUI"
            target="_blank"
            rel="noreferrer"
            style={styles.btnPrimary}
          >
            Falar com a GLOBALLED
          </a>

          {/* Fallback (caso algum ambiente não resolva Link corretamente) */}
          <a href="/#/employees" style={styles.linkFallback}>
            (Se “Funcionários” não abrir, toque aqui)
          </a>
        </div>

        <div style={styles.footer}>Deploy OK — Vercel funcionando • {year}</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  container: {
    width: "100%",
    maxWidth: 520,
    textAlign: "center",
    padding: 18,
  },
  title: {
    color: "#fff",
    fontSize: 44,
    letterSpacing: 1,
    margin: "14px 0 10px",
    fontFamily:
      'ui-serif, Georgia, "Times New Roman", Times, serif',
    fontWeight: 800,
  },
  subtitle: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 18,
    lineHeight: 1.45,
    margin: "0 auto 18px",
    maxWidth: 460,
    fontFamily:
      'ui-serif, Georgia, "Times New Roman", Times, serif',
  },
  actions: {
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  btnPrimary: {
    display: "block",
    padding: "16px 18px",
    borderRadius: 14,
    textDecoration: "none",
    textAlign: "center",
    background: "#0a5a16",
    color: "#fff",
    fontSize: 22,
    fontFamily:
      'ui-serif, Georgia, "Times New Roman", Times, serif',
    fontWeight: 700,
    boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  btnGhost: {
    display: "block",
    padding: "16px 18px",
    borderRadius: 14,
    textDecoration: "none",
    textAlign: "center",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    fontSize: 22,
    fontFamily:
      'ui-serif, Georgia, "Times New Roman", Times, serif',
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.18)",
  },
  linkFallback: {
    marginTop: 4,
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    textDecoration: "underline",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
  },
  footer: {
    marginTop: 18,
    color: "rgba(255,255,255,0.30)",
    fontSize: 14,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
  },
};