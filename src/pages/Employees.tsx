export default function Employees() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Funcionários</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Tela OK — carregou /employees.
      </p>

      <div style={{ marginTop: 18 }}>
        <a href="/" style={{ color: "#22c55e", fontWeight: 700 }}>
          ← Voltar para Home
        </a>
      </div>
    </div>
  );
}