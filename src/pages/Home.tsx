import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.h1}>SST GLOBALLED</h1>
        <p style={styles.p}>
          Painel ADMIN para cadastrar Empresas e Colaboradores.
          (Somente você usa — clientes não precisam acessar.)
        </p>

        <div style={styles.grid}>
          <button style={styles.btn} onClick={() => nav("/companies")}>
            Empresas (Cadastrar / Listar)
          </button>

          <button style={styles.btn} onClick={() => nav("/employees")}>
            Colaboradores (Cadastrar / Importar CSV)
          </button>
        </div>

        <p style={styles.small}>
          Dica: abra direto: <b>/companies</b> e <b>/employees</b>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: 16, fontFamily: "Arial" },
  wrap: { maxWidth: 920, margin: "0 auto", display: "grid", gap: 14 },
  h1: { margin: "10px 0 0", fontSize: 34, letterSpacing: 1 },
  p: { margin: 0, color: "#cfcfcf", lineHeight: 1.6 },
  small: { margin: 0, color: "#9f9f9f", fontSize: 12, lineHeight: 1.6 },
  grid: { display: "grid", gap: 10, marginTop: 10 },
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
};