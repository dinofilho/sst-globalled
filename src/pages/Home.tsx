import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.h1}>SST GLOBALLED</h1>

        <p style={styles.p}>
          Plataforma inteligente de <b>Gestão de Saúde e Segurança do Trabalho</b>,
          integrada ao <b>eSocial</b>, normas regulamentadoras e controle técnico.
        </p>

        <ul style={styles.ul}>
          <li style={styles.li}>✅ Gestão de documentos SST</li>
          <li style={styles.li}>✅ Controle de NR (NR-01, NR-10, NR-20, NR-35)</li>
          <li style={styles.li}>✅ Organização para auditorias e fiscalizações</li>
          <li style={styles.li}>✅ Base preparada para integração com eSocial</li>
        </ul>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
  <a href="#/companies" style={styles.btn}>
    Abrir cadastro de Empresas
  </a>

  <a href="https://wa.me/55" style={styles.btnGhost}>
    Falar com a GLOBALLED (ajuste o número)
  </a>
</div>
          </Link>

          <a href="https://wa.me/55" style={styles.btnGhost}>
            Falar com a GLOBALLED (ajuste o número)
          </a>
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
    display: "grid",
    placeItems: "center",
    padding: 16,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    border: "1px solid #222",
    background: "#111",
    borderRadius: 14,
    padding: 18,
  },
  h1: { margin: 0, fontSize: 34, letterSpacing: 1 },
  p: { marginTop: 12, marginBottom: 12, color: "#cfcfcf", lineHeight: 1.6 },
  ul: { margin: 0, paddingLeft: 18, color: "#cfcfcf", lineHeight: 1.9 },
  li: { marginBottom: 6 },
  btn: {
    textDecoration: "none",
    textAlign: "center",
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    background: "#00c853",
    color: "#0b0b0b",
    fontWeight: 900,
  },
  btnGhost: {
    textDecoration: "none",
    textAlign: "center",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #222",
    background: "transparent",
    color: "#cfcfcf",
    fontWeight: 900,
  },
};
