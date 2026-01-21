import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.h1}>SST GLOBALLED</h1>

        <p style={styles.p}>
          Plataforma inteligente de <b>Gestão de Saúde e Segurança do Trabalho</b>, integrada ao{" "}
          <b>eSocial</b>, normas regulamentadoras e controle técnico.
        </p>

        <ul style={styles.list}>
          <li style={styles.li}>✅ Gestão de documentos SST</li>
          <li style={styles.li}>✅ Controle de NR (NR-01, NR-10, NR-20, NR-35)</li>
          <li style={styles.li}>✅ Organização para auditorias e fiscalizações</li>
          <li style={styles.li}>✅ Base preparada para integração com eSocial</li>
        </ul>

        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => navigate("/companies")}>
            Abrir Cadastro de Empresas
          </button>

          <button style={styles.btnGhost} onClick={() => navigate("/employees")}>
            Abrir Funcionários
          </button>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  wrap: {
    width: "100%",
    maxWidth: 720,
    border: "1px solid #222",
    background: "#111",
    borderRadius: 16,
    padding: 18,
  },
  h1: {
    margin: 0,
    textAlign: "center",
    fontSize: 36,
    letterSpacing: 2,
    fontWeight: 900,
  },
  p: {
    marginTop: 14,
    color: "#cfcfcf",
    lineHeight: 1.6,
    textAlign: "center",
  },
  list: {
    marginTop: 16,
    display: "grid",
    gap: 10,
    color: "#d8d8d8",
    paddingLeft: 18,
  },
  li: { lineHeight: 1.5 },
  actions: {
    marginTop: 18,
    display: "grid",
    gap: 10,
  },
  btn: {
    width: "100%",
    padding: "14px 14px",
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
    padding: "14px 14px",
    borderRadius: 12,
    border: "1px solid #222",
    background: "transparent",
    color: "#cfcfcf",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 16,
  },
};