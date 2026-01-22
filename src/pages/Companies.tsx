export default function Companies() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#00ff88",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 900,
        gap: 12,
      }}
    >
      ✅ VOCÊ ESTÁ NA ROTA /companies
      <div style={{ fontSize: 16, opacity: 0.8 }}>
        Se você estiver vendo isso, a rota está funcionando.
      </div>
    </div>
  );
}