import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.h1}>404</h1>
        <p style={styles.p}>Página não encontrada.</p>
        <button style={styles.btn} onClick={() => navigate("/")}>
          Voltar para Home
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    border: "1px solid #222",
    background: "#111",
    borderRadius: 16,
    padding: 18,
    textAlign: "center",
  },
  h1: { margin: 0, fontSize: 42, fontWeight: 900 },
  p: { marginTop: 10, color: "#cfcfcf" },
  btn: {
    marginTop: 16,
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
};
