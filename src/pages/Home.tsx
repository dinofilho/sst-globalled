import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <h1 style={styles.h1}>SST GLOBALLED</h1>

        <p style={styles.p}>
          Plataforma inteligente de <b>Gestão de Saúde e Segurança do Trabalho</b>,
          integrada ao <b>eSocial</b>.
        </p>

        <ul style={styles.ul}>
          <li>✅ Gestão de documentos SST</li>
          <li>✅ Controle de NR (NR-01, NR-10, NR-20, NR-35)</li>
          <li>✅ Auditorias e fiscalizações</li>
          <li>✅ Base pronta para integração com eSocial</li>
        </ul>

        <button style={styles.btn} onClick={() => nav("/companies")}>
          Entrar no Sistema
        </button>

        <button style={styles.btnGhost} onClick={() => nav("/auth")}>
          Login / Cadastro
        </button>
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
  box: {
    width: "100%",
    maxWidth: 640,
    border: "1px solid #222",
    background: "#111",
    borderRadius: 16,
    padding: 18,
  },
  h1: { margin: 0, fontSize: 34, letterSpacing: 1 },
  p: { marginTop: 10, color: "#cfcfcf", lineHeight: 1.6 },
  ul: { marginTop: 12, color: "#cfcfcf", lineHeight: 1.8 },
  btn: {
    width: "100%",
    marginTop: 14,
    padding: "14px 16px",
    borderRadius: 12,
    border: "none",
    background: "#00c853",
    color: "#0b0b0b",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 16,
  },
  btnGhost: {
    width: "100%",
    marginTop: 10,
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #222",
    background: "transparent",
    color: "#cfcfcf",
    fontWeight: 900,
    cursor: "pointer",
  },
};