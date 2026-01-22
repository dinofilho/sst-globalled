import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Company = {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  responsible?: string;
  cnae?: string;
  address?: string;
  notes?: string;
  createdAt: number;
};

const LS_KEY = "sst_globalled_companies_v1";

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

function formatCNPJ(v: string) {
  const d = onlyDigits(v).slice(0, 14);
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 5);
  const p3 = d.slice(5, 8);
  const p4 = d.slice(8, 12);
  const p5 = d.slice(12, 14);
  let out = p1;
  if (p2) out += "." + p2;
  if (p3) out += "." + p3;
  if (p4) out += "/" + p4;
  if (p5) out += "-" + p5;
  return out;
}

function formatPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function readCompanies(): Company[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Company[];
  } catch {
    return [];
  }
}

function saveCompanies(list: Company[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "28px 16px",
    display: "flex",
    justifyContent: "center",
  } as const,
  container: {
    width: "100%",
    maxWidth: 760,
  } as const,
  card: {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 18,
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  } as const,
  title: {
    fontSize: 34,
    margin: 0,
    letterSpacing: 1,
    fontWeight: 800,
  } as const,
  subtitle: {
    marginTop: 8,
    opacity: 0.75,
    lineHeight: 1.35,
  } as const,
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
    marginTop: 16,
  } as const,
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  } as const,
  label: { fontSize: 13, opacity: 0.8, marginBottom: 6 } as const,
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    outline: "none",
  } as const,
  textarea: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    outline: "none",
    minHeight: 90,
    resize: "vertical" as const,
  },
  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap" as const,
    marginTop: 14,
  },
  btnGreen: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(34,197,94,0.45)",
    background: "rgba(34,197,94,0.18)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  } as const,
  btnGhost: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  } as const,
  hr: {
    height: 1,
    background: "rgba(255,255,255,0.10)",
    border: 0,
    margin: "18px 0",
  } as const,
  listTitle: { fontSize: 18, margin: 0, opacity: 0.9 } as const,
  item: {
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    padding: 12,
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  } as const,
  small: { fontSize: 12, opacity: 0.7 } as const,
  danger: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,0.35)",
    background: "rgba(239,68,68,0.12)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  } as const,
};

export default function Companies() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [responsible, setResponsible] = useState("");
  const [cnae, setCnae] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [companies, setCompanies] = useState<Company[]>([]);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    setCompanies(readCompanies());
  }, []);

  const canSave = useMemo(() => {
    return name.trim().length >= 2 && onlyDigits(cnpj).length === 14;
  }, [name, cnpj]);

  function clearForm() {
    setName("");
    setCnpj("");
    setEmail("");
    setPhone("");
    setResponsible("");
    setCnae("");
    setAddress("");
    setNotes("");
  }

  function onSave() {
    setMsg("");

    if (!canSave) {
      setMsg("⚠️ Preencha Empresa e CNPJ corretamente (14 dígitos).");
      return;
    }

    const now = Date.now();
    const item: Company = {
      id: String(now),
      name: name.trim(),
      cnpj: formatCNPJ(cnpj),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      responsible: responsible.trim() || undefined,
      cnae: cnae.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: now,
    };

    const next = [item, ...companies];
    setCompanies(next);
    saveCompanies(next);
    setMsg("✅ Empresa cadastrada e salva no navegador (LocalStorage).");
    clearForm();
  }

  function onRemove(id: string) {
    const next = companies.filter((c) => c.id !== id);
    setCompanies(next);
    saveCompanies(next);
    setMsg("🗑️ Empresa removida.");
  }

  function onClearAll() {
    setCompanies([]);
    saveCompanies([]);
    setMsg("🧹 Lista zerada.");
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Cadastro de Empresas</h1>
          <div style={styles.subtitle}>
            Salva localmente no seu navegador (LocalStorage). Depois a gente integra com banco (Supabase/Firebase).
          </div>

          <div style={styles.grid}>
            <div>
              <div style={styles.label}>Empresa *</div>
              <input
                style={styles.input}
                placeholder="Ex: GLOBALLED SST"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={styles.row2}>
              <div>
                <div style={styles.label}>CNPJ *</div>
                <input
                  style={styles.input}
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                  inputMode="numeric"
                />
              </div>

              <div>
                <div style={styles.label}>Telefone</div>
                <input
                  style={styles.input}
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  inputMode="numeric"
                />
              </div>
            </div>

            <div style={styles.row2}>
              <div>
                <div style={styles.label}>E-mail</div>
                <input
                  style={styles.input}
                  placeholder="contato@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div style={styles.label}>Responsável</div>
                <input
                  style={styles.input}
                  placeholder="Nome do responsável"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.row2}>
              <div>
                <div style={styles.label}>CNAE</div>
                <input
                  style={styles.input}
                  placeholder="Ex: 4120-4/00"
                  value={cnae}
                  onChange={(e) => setCnae(e.target.value)}
                />
              </div>

              <div>
                <div style={styles.label}>Endereço</div>
                <input
                  style={styles.input}
                  placeholder="Rua, número, cidade - UF"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div style={styles.label}>Observações</div>
              <textarea
                style={styles.textarea}
                placeholder="Observações internas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {msg ? (
              <div style={{ marginTop: 6, opacity: 0.9, fontSize: 13 }}>{msg}</div>
            ) : null}

            <div style={styles.actions}>
              <button style={styles.btnGreen} onClick={onSave}>
                Salvar Empresa
              </button>
              <button style={styles.btnGhost} onClick={clearForm}>
                Limpar
              </button>
              <button style={styles.btnGhost} onClick={() => navigate("/")}>
                ← Voltar Home
              </button>
            </div>
          </div>

          <hr style={styles.hr} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h3 style={styles.listTitle}>Empresas salvas</h3>
            <button style={styles.danger} onClick={onClearAll} title="Remove todas">
              Limpar tudo
            </button>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {companies.length === 0 ? (
              <div style={{ opacity: 0.65, fontSize: 13 }}>
                Nenhuma empresa salva ainda. Cadastre a primeira acima.
              </div>
            ) : (
              companies.map((c) => (
                <div key={c.id} style={styles.item}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{c.name}</div>
                    <div style={styles.small}>
                      CNPJ: {c.cnpj}
                      {c.email ? ` • ${c.email}` : ""}
                      {c.phone ? ` • ${c.phone}` : ""}
                    </div>
                  </div>
                  <button style={styles.danger} onClick={() => onRemove(c.id)}>
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ marginTop: 14, opacity: 0.6, fontSize: 12, textAlign: "center" }}>
          SST GLOBALLED • Deploy Vercel
        </div>
      </div>
    </div>
  );
}