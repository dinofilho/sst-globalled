import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>SST GLOBALLED</h1>

        <p style={styles.subtitle}>
          Plataforma inteligente de <b>Gestão de Saúde e Segurança do Trabalho</b>, integrada ao{" "}
          <b>eSocial</b>, normas regulamentadoras e controle técnico.
        </p>

        <ul style={styles.list}>
          <li style={styles.li}>✅ Gestão de documentos SST</li>
          <li style={styles.li}>✅ Controle de NR (NR-01, NR-10, NR-20, NR-35)</li>
          <li style={styles.li}>✅ Organização para auditorias e fiscalizações</li>
          <li style={styles.li}>✅ Base preparada para integração com eSocial</li>
        </ul>

        <div style={styles.buttons}>
          <Link to="/companies" style={styles.btn}>
            Abrir cadastro de Empresas
          </Link>
        </div>
      </div>
    <div style={styles.buttons}>
  <Link to="/companies" style={styles.btn}>
    Abrir cadastro de Empresas
  </Link>

  <a
    href="/#/companies"
    style={styles.btnGhost}
  >
    Abrir cadastro de Empresas (fallback)
  </a>

  <a
    href="https://wa.me/55SEUNUMEROAQUI"
    target="_blank"
    rel="noreferrer"
    style={styles.btnGhost}
  >
    Falar com a GLOBALLED
  </a>
</div>
  );
}

const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    background: "#0b0b0b",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 520,
    textAlign: "center",
  },
  title: {
    margin: "0 0 14px",
    fontSize: 44,
    letterSpacing: 1,
  },
  subtitle: {
    margin: "0 auto 20px",
    lineHeight: 1.5,
    opacity: 0.85,
    fontSize: 16,
    maxWidth: 480,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "0 auto 22px",
    textAlign: "left",
    maxWidth: 420,
    opacity: 0.8,
  },
  li: {
    marginBottom: 10,
    fontSize: 16,
  },
  buttons: {
    display: "grid",
    gap: 10,
    marginTop: 14,
    justifyItems: "center",
  },
  btn: {
    display: "inline-block",
    padding: "14px 18px",
    borderRadius: 10,
    background: "#16a34a",
    color: "#000",
    textDecoration: "none",
    fontWeight: 800,
    width: "100%",
    maxWidth: 360,
    textAlign: "center",
  },
};