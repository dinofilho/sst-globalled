import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.h1}>Dashboard</h1>
        <p style={styles.p}>Acesso rápido aos módulos.</p>

        <div style={styles.grid}>
          <Card title="Empresas" desc="Cadastrar e listar empresas">
            <Link style={styles.btn} to="/companies">Abrir</Link>
          </Card>

          <Card title="Colaboradores" desc="Em seguida vamos ligar por empresa">
            <span style={styles.tag}>Próximo passo</span>
          </Card>
        </div>

        <Link style={styles.btnGhost} to="/">Voltar</Link>
      </div>
    </div>
  );
}

function Card({ title, desc, children }: any) {
  return (
    <div style={styles.card}>
      <div>
        <div style={styles.cardTitle}>{title}</div>
        <div style={styles.cardDesc}>{desc}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: 16, fontFamily: "Arial" },
  wrap: { maxWidth: 900, margin: "0 auto", display: "grid", gap: 12 },
  h1: { margin: 0, fontSize: 26 },
  p: { margin: 0, color: "#cfcfcf" },
  grid: { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" },
  card: { border: "1px solid #222", background: "#111", borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 },
  cardTitle: { fontWeight: 900 },
  cardDesc: { color: "#bdbdbd", fontSize: 12, marginTop: 6 },
  btn: { padding: "10px 12px", borderRadius: 10, background: "#00c853", color: "#0b0b0b", fontWeight: 900, textDecoration: "none" },
  btnGhost: { padding: "10px 12px", borderRadius: 10, border: "1px solid #222", background: "transparent", color: "#cfcfcf", fontWeight: 900, textDecoration: "none", width: "fit-content" },
  tag: { padding: "6px 10px", border: "1px solid #222", borderRadius: 999, color: "#cfcfcf", fontWeight: 800, fontSize: 12 }
};
