import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Company = {
  id: string;
  name: string;
  trade_name: string | null;
  cnpj: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
};

export default function Companies() {
  const [items, setItems] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [stateUf, setStateUf] = useState("");

  async function load() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    setItems((data as Company[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addCompany(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      name: name.trim(),
      trade_name: tradeName.trim() || null,
      cnpj: cnpj.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      city: city.trim() || null,
      state: stateUf.trim() || null,
    };

    if (!payload.name) {
      setError("Nome da empresa é obrigatório.");
      return;
    }

    const { error } = await supabase.from("companies").insert(payload);

    if (error) {
      setError(error.message);
      return;
    }

    setName("");
    setTradeName("");
    setCnpj("");
    setPhone("");
    setEmail("");
    setCity("");
    setStateUf("");

    await load();
  }

  async function removeCompany(id: string) {
    if (!confirm("Excluir esta empresa?")) return;
    setError(null);

    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) setError(error.message);

    await load();
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.h1}>Empresas</h1>
        <p style={styles.p}>
          Cadastre seus clientes (empresas). Depois ligamos funcionários, ASO,
          documentos (PGR/PCMSO/LTCAT/PPP), EPIs e riscos.
        </p>

        <form onSubmit={addCompany} style={styles.card}>
          <div style={styles.grid}>
            <Field label="Nome da empresa *">
              <input
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: GLOBALLED SST"
              />
            </Field>

            <Field label="Nome fantasia">
              <input
                style={styles.input}
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                placeholder="Ex: GLOBALLED"
              />
            </Field>

            <Field label="CNPJ">
              <input
                style={styles.input}
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </Field>

            <Field label="Telefone">
              <input
                style={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(xx) xxxxx-xxxx"
              />
            </Field>

            <Field label="E-mail">
              <input
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com"
                type="email"
              />
            </Field>

            <Field label="Cidade">
              <input
                style={styles.input}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ourinhos"
              />
            </Field>

            <Field label="UF">
              <input
                style={styles.input}
                value={stateUf}
                onChange={(e) => setStateUf(e.target.value)}
                placeholder="SP"
                maxLength={2}
              />
            </Field>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button style={styles.btn} type="submit">
            Salvar empresa
          </button>
        </form>

        <div style={styles.card}>
          <div style={styles.rowBetween}>
            <h2 style={styles.h2}>Lista</h2>
            <button style={styles.btnGhost} onClick={load} type="button">
              Atualizar
            </button>
          </div>

          {loading ? (
            <div style={styles.p}>Carregando...</div>
          ) : items.length === 0 ? (
            <div style={styles.p}>Nenhuma empresa cadastrada ainda.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((c) => (
                <div key={c.id} style={styles.item}>
                  <div>
                    <div style={styles.itemTitle}>{c.name}</div>
                    <div style={styles.itemSub}>
                      {[
                        c.trade_name,
                        c.cnpj,
                        c.city && c.state ? `${c.city}-${c.state}` : c.city || c.state,
                        c.phone,
                        c.email,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  </div>
                  <button
                    style={styles.btnDanger}
                    onClick={() => removeCompany(c.id)}
                    type="button"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={styles.label}>
      <span style={styles.labelText}>{label}</span>
      {children}
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0b0b0b",
    color: "#fff",
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: 16,
  },
  wrap: {
    maxWidth: 980,
    margin: "0 auto",
    display: "grid",
    gap: 14,
  },
  h1: { margin: "8px 0 0", fontSize: 26 },
  h2: { margin: 0, fontSize: 18 },
  p: { margin: 0, color: "#cfcfcf", lineHeight: 1.6 },
  card: {
    border: "1px solid #222",
    background: "#111",
    borderRadius: 12,
    padding: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
    marginBottom: 12,
  },
  label: { display: "grid", gap: 6 },
  labelText: { fontSize: 12, color: "#d6d6d6" },
  input: {
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid #222",
    background: "#0f0f0f",
    color: "#fff",
    outline: "none",
  },
  btn: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    background: "#00c853",
    color: "#0b0b0b",
    fontWeight: 900,
    cursor: "pointer",
  },
  btnGhost: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #222",
    background: "transparent",
    color: "#cfcfcf",
    fontWeight: 800,
    cursor: "pointer",
  },
  btnDanger: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #3a1212",
    background: "#1a0b0b",
    color: "#ffb3b3",
    fontWeight: 900,
    cursor: "pointer",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    border: "1px solid #222",
    background: "#0f0f0f",
    borderRadius: 12,
    padding: 12,
  },
  itemTitle: { fontWeight: 900, fontSize: 14 },
  itemSub: { color: "#bdbdbd", fontSize: 12, marginTop: 4, lineHeight: 1.4 },
  error: {
    margin: "8px 0 12px",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #3a1212",
    background: "#1a0b0b",
    color: "#ffb3b3",
    fontWeight: 700,
  },
};