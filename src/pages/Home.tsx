import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.h1}>SST GLOBALLED</h1>

        <p style={styles.p}>
          Plataforma inteligente de <b>Gestão de Saúde e Segurança do Trabalho</b>,
          integrada ao eSocial, normas regulamentadoras e controle técnico.
        </p>

        <ul style={styles.list}>
          <li>✅ Gestão de documentos SST</li>
          <li>✅ Controle de NR (NR-01, NR-10, NR-20, NR-35)</li>
          <li>✅ Organização para auditorias e fiscalizações</li>
          <li>✅ Base preparada para integração com eSocial</li>
        </ul>

        <div style={{ display: "grid", gap: 10 }}>
          <button style={styles.btn} onClick={() => nav("/companies")}>
            Acessar Cadastro de Empresas
          </button>

          <button
            style={styles.btnGhost}
            onClick={() =>
              window.open("https://wa.me/55SEU_NUMERO_AQUI", "_blank")
            }
          >
            Falar com a GLOBALLED
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
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: 16,
    display: "grid",
    placeItems: "center",
  },
  wrap: {
    width: "100%",
    maxWidth: 760,
    textAlign: "center",
    display: "grid",
    gap: 14,
  },
  h1: { margin: 0, fontSize: 34, fontWeight: 900, letterSpacing: 1 },
  p: { margin: 0, color: "#cfcfcf", lineHeight: 1.6, fontSize: 16 },
  list: {
    margin: "10px auto 0",
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: 8,
    color: "#bdbdbd",
    textAlign: "left",
    maxWidth: 520,
  },
  btn: {
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
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #222",
    background: "transparent",
    color: "#cfcfcf",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 16,
  },
};