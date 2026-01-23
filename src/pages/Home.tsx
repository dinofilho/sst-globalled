import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const whatsapp = "https://wa.me/55SEUNUMEROAQUI"; // <-- TROQUE AQUI (ex: https://wa.me/5511999999999)

  return (
    <div style={wrap}>
      <div style={container}>
        <div style={header}>
          <div style={badge}>SST • eSocial • NRs</div>
          <h1 style={title}>SST GLOBALLED</h1>
          <p style={subtitle}>
            Plataforma de Gestão de Saúde e Segurança do Trabalho.
            Cadastros e validações em um só lugar.
          </p>
        </div>

        <div style={grid}>
          <Link to="/companies" style={link}>
            <div style={cardPrimary}>
              <div style={cardTitle}>Cadastrar Empresas</div>
              <div style={cardDesc}>Salvar e gerenciar empresas (CNPJ, contato, CNAE, etc.)</div>
            </div>
          </Link>

          <Link to="/employees" style={link}>
            <div style={card}>
              <div style={cardTitle}>Funcionários</div>
              <div style={cardDesc}>Cadastro de colaboradores, função, setor e vínculos</div>
            </div>
          </Link>

          <Link to="/dashboard" style={link}>
            <div style={card}>
              <div style={cardTitle}>Dashboard</div>
              <div style={cardDesc}>Indicadores e atalhos (em construção)</div>
            </div>
          </Link>

          <Link to="/validate-certificate" style={link}>
            <div style={card}>
              <div style={cardTitle}>Validar Certificado</div>
              <div style={cardDesc}>Conferir autenticidade por código/QR</div>
            </div>
          </Link>

          <Link to="/validate-document" style={link}>
            <div style={card}>
              <div style={cardTitle}>Validar Documento</div>
              <div style={cardDesc}>Validação rápida de PDFs/relatórios</div>
            </div>
          </Link>

          <Link to="/exams" style={link}>
            <div style={card}>
              <div style={cardTitle}>Exames</div>
              <div style={cardDesc}>Controle de ASO e vencimentos (em construção)</div>
            </div>
          </Link>
        </div>

        <a href={whatsapp} target="_blank" rel="noreferrer" style={link}>
          <div style={whats}>
            <div style={{ fontWeight: 800 }}>Falar com a GLOBALLED</div>
            <div style={{ opacity: 0.9, fontSize: 13 }}>
              Suporte e implantação
            </div>
          </div>
        </a>

        <div style={footer}>
          <span style={{ opacity: 0.6 }}>Deploy OK —</span>{" "}
          <span style={{ opacity: 0.85 }}>Vercel</span>
        </div>
      </div>
    </div>
  );
}

/* =================== estilos =================== */

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(1200px 600px at 30% 10%, #0d2a1a 0%, #0b0b0b 45%, #050505 100%)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
};

const container: React.CSSProperties = {
  width: "100%",
  maxWidth: 980,
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  background: "rgba(0,0,0,0.55)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
  padding: 18,
};

const header: React.CSSProperties = {
  textAlign: "center",
  padding: "18px 12px 10px",
};

const badge: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  letterSpacing: 0.4,
  background: "rgba(37, 211, 102, 0.12)",
  border: "1px solid rgba(37, 211, 102, 0.25)",
  color: "#c7ffd9",
  marginBottom: 10,
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 38,
  letterSpacing: 1.2,
  fontWeight: 900,
};

const subtitle: React.CSSProperties = {
  margin: "10px auto 0",
  maxWidth: 640,
  opacity: 0.78,
  lineHeight: 1.5,
  fontSize: 15,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
  padding: 12,
};

const link: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const cardBase: React.CSSProperties = {
  borderRadius: 14,
  padding: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  transition: "transform .12s ease, border-color .12s ease, background .12s ease",
};

const card: React.CSSProperties = {
  ...cardBase,
};

const cardPrimary: React.CSSProperties = {
  ...cardBase,
  background: "linear-gradient(135deg, rgba(10,122,51,0.55), rgba(37,211,102,0.18))",
  border: "1px solid rgba(37, 211, 102, 0.35)",
};

const cardTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 850,
  marginBottom: 6,
};

const cardDesc: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.78,
  lineHeight: 1.35,
};

const whats: React.CSSProperties = {
  marginTop: 8,
  borderRadius: 14,
  padding: 16,
  background: "linear-gradient(135deg, rgba(37,211,102,0.85), rgba(0,0,0,0.1))",
  color: "#06150e",
  border: "1px solid rgba(37, 211, 102, 0.6)",
  textAlign: "center",
};

const footer: React.CSSProperties = {
  textAlign: "center",
  padding: "10px 8px 6px",
  fontSize: 12,
};