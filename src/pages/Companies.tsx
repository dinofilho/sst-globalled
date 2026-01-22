import React, { useEffect, useMemo, useState } from "react";

type Company = {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  responsible: string;
  cnae: string;
  address: string;
  notes: string;
  createdAt: string;
};

const STORAGE_KEY = "sst_globalled_companies_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

function formatCNPJ(value: string) {
  const v = onlyDigits(value).slice(0, 14);
  // 00.000.000/0000-00
  const p1 = v.slice(0, 2);
  const p2 = v.slice(2, 5);
  const p3 = v.slice(5, 8);
  const p4 = v.slice(8, 12);
  const p5 = v.slice(12, 14);

  let out = p1;
  if (p2) out += "." + p2;
  if (p3) out += "." + p3;
  if (p4) out += "/" + p4;
  if (p5) out += "-" + p5;
  return out;
}

function formatPhoneBR(value: string) {
  const v = onlyDigits(value).slice(0, 11); // (11) 99999-9999
  const ddd = v.slice(0, 2);
  const p1 = v.slice(2, 7);
  const p2 = v.slice(7, 11);

  if (!ddd) return v;
  if (v.length <= 10) {
    // (11) 9999-9999
    const a = v.slice(2, 6);
    const b = v.slice(6, 10);
    let out = `(${ddd})`;
    if (a) out += ` ${a}`;
    if (b) out += `-${b}`;
    return out;
  }

  let out = `(${ddd})`;
  if (p1) out += ` ${p1}`;
  if (p2) out += `-${p2}`;
  return out;
}

function loadCompanies(): Company[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveCompanies(items: Company[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Company, "id" | "createdAt">>({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    responsible: "",
    cnae: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    setCompanies(loadCompanies());
  }, []);

  useEffect(() => {
    saveCompanies(companies);
  }, [companies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) => {
      const hay =
        `${c.name} ${c.cnpj} ${c.email} ${c.phone} ${c.responsible} ${c.cnae} ${c.address}`
          .toLowerCase();
      return hay.includes(q);
    });
  }, [companies, query]);

  function resetForm() {
    setForm({
      name: "",
      cnpj: "",
      email: "",
      phone: "",
      responsible: "",
      cnae: "",
      address: "",
      notes: "",
    });
    setEditingId(null);
  }

  function onChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.name.trim()) return "Informe o nome da empresa.";
    const cnpjDigits = onlyDigits(form.cnpj);
    if (cnpjDigits.length !== 14) return "CNPJ incompleto (precisa de 14 dígitos).";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      return "E-mail inválido.";
    const phoneDigits = onlyDigits(form.phone);
    if (form.phone && (phoneDigits.length < 10 || phoneDigits.length > 11))
      return "Telefone inválido (use DDD).";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    if (editingId) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...form,
                cnpj: formatCNPJ(form.cnpj),
                phone: formatPhoneBR(form.phone),
              }
            : c
        )
      );
      resetForm();
      return;
    }

    const item: Company = {
      id: uid(),
      createdAt: new Date().toISOString(),
      ...form,
      cnpj: formatCNPJ(form.cnpj),
      phone: formatPhoneBR(form.phone),
    };

    setCompanies((prev) => [item, ...prev]);
    resetForm();
  }

  function editCompany(c: Company) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      cnpj: c.cnpj,
      email: c.email,
      phone: c.phone,
      responsible: c.responsible,
      cnae: c.cnae,
      address: c.address,
      notes: c.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeCompany(id: string) {
    if (!confirm("Excluir esta empresa?")) return;
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) resetForm();
  }

  function clearAll() {
    if (!confirm("Apagar TODAS as empresas salvas neste dispositivo?")) return;
    setCompanies([]);
    resetForm();
  }

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Cadastro de Empresas</h1>
        <p style={subtitle}>
          Salva localmente no seu navegador (LocalStorage). Depois a gente integra com banco (Supabase/Firebase).
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div style={grid2}>
            <Field
              label="Empresa *"
              placeholder="Ex: GLOBALLED SST"
              value={form.name}
              onChange={(v) => onChange("name", v)}
            />
            <Field
              label="CNPJ *"
              placeholder="00.000.000/0000-00"
              value={form.cnpj}
              onChange={(v) => onChange("cnpj", formatCNPJ(v))}
            />
          </div>

          <div style={grid2}>
            <Field
              label="E-mail"
              placeholder="contato@empresa.com.br"
              value={form.email}
              onChange={(v) => onChange("email", v)}
            />
            <Field
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={form.phone}
              onChange={(v) => onChange("phone", formatPhoneBR(v))}
            />
          </div>

          <div style={grid2}>
            <Field
              label="Responsável"
              placeholder="Nome do responsável"
              value={form.responsible}
              onChange={(v) => onChange("responsible", v)}
            />
            <Field
              label="CNAE"
              placeholder="Ex: 4120-4/00"
              value={form.cnae}
              onChange={(v) => onChange("cnae", v)}
            />
          </div>

          <Field
            label="Endereço"
            placeholder="Rua, número, cidade - UF"
            value={form.address}
            onChange={(v) => onChange("address", v)}
          />

          <TextArea
            label="Observações"
            placeholder="Anotações internas, detalhes de SST, PGR, PCMSO, etc."
            value={form.notes}
            onChange={(v) => onChange("notes", v)}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            <button type="submit" style={editingId ? btnPrimaryAlt : btnPrimary}>
              {editingId ? "Salvar Alteração" : "Cadastrar Empresa"}
            </button>
            <button type="button" onClick={resetForm} style={btn}>
              Limpar
            </button>
            <button type="button" onClick={clearAll} style={btnDanger}>
              Apagar Tudo
            </button>
          </div>
        </form>
      </div>

      <div style={card}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>Empresas</h2>
          <span style={pill}>{companies.length} cadastradas</span>
          <div style={{ flex: 1 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, CNPJ, e-mail..."
            style={search}
          />
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={empty}>Nenhuma empresa encontrada.</div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} style={row}>
                <div style={{ minWidth: 0 }}>
                  <div style={rowTitle}>{c.name}</div>
                  <div style={rowSub}>
                    <b>CNPJ:</b> {c.cnpj}{" "}
                    {c.cnae ? (
                      <>
                        • <b>CNAE:</b> {c.cnae}
                      </>
                    ) : null}
                  </div>
                  <div style={rowSub}>
                    {c.responsible ? (
                      <>
                        <b>Resp.:</b> {c.responsible} •{" "}
                      </>
                    ) : null}
                    {c.email ? (
                      <>
                        <b>E-mail:</b> {c.email} •{" "}
                      </>
                    ) : null}
                    {c.phone ? (
                      <>
                        <b>Tel:</b> {c.phone}
                      </>
                    ) : null}
                  </div>
                  {c.address ? <div style={rowSub}><b>Endereço:</b> {c.address}</div> : null}
                  {c.notes ? <div style={rowNotes}>{c.notes}</div> : null}
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => editCompany(c)} style={btnSmall}>
                    Editar
                  </button>
                  <button onClick={() => removeCompany(c.id)} style={btnSmallDanger}>
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <p style={{ marginTop: 16, fontSize: 12, opacity: 0.55 }}>
          Dica: quando você quiser “cadastro de verdade”, a gente liga isso no banco e cada empresa vira registro
          com login/usuários.
        </p>
      </div>
    </div>
  );
}

/* ===== componentes simples ===== */

function Field(props: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={labelWrap}>
      <span style={labelText}>{props.label}</span>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        style={input}
      />
    </label>
  );
}

function TextArea(props: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={labelWrap}>
      <span style={labelText}>{props.label}</span>
      <textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        style={{ ...input, minHeight: 90, resize: "vertical", paddingTop: 10 }}
      />
    </label>
  );
}

/* ===== estilos ===== */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0b0b0b",
  color: "#fff",
  padding: 16,
  display: "grid",
  gap: 14,
  alignContent: "start",
};

const card: React.CSSProperties = {
  background: "#111",
  border: "1px solid #222",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,.25)",
};

const title: React.CSSProperties = { margin: 0, fontSize: 22 };
const subtitle: React.CSSProperties = { marginTop: 6, opacity: 0.75 };

const grid2: React.CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
};

const labelWrap: React.CSSProperties = { display: "grid", gap: 6 };
const labelText: React.CSSProperties = { fontSize: 12, opacity: 0.75 };

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #2a2a2a",
  background: "#0c0c0c",
  color: "#fff",
  outline: "none",
};

const btnBase: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #2a2a2a",
  background: "#151515",
  color: "#fff",
  fontWeight: 600,
};

const btn: React.CSSProperties = { ...btnBase };
const btnPrimary: React.CSSProperties = { ...btnBase, background: "#0a7a33", border: "none" };
const btnPrimaryAlt: React.CSSProperties = { ...btnBase, background: "#0a6a7a", border: "none" };

const btnDanger: React.CSSProperties = {
  ...btnBase,
  background: "#7a0a0a",
  border: "none",
};

const search: React.CSSProperties = {
  ...input,
  maxWidth: 320,
  padding: "10px 12px",
};

const pill: React.CSSProperties = {
  fontSize: 12,
  padding: "4px 10px",
  border: "1px solid #2a2a2a",
  borderRadius: 999,
  opacity: 0.8,
};

const row: React.CSSProperties = {
  border: "1px solid #222",
  background: "#0c0c0c",
  borderRadius: 12,
  padding: 14,
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  justifyContent: "space-between",
};

const rowTitle: React.CSSProperties = { fontWeight: 800, marginBottom: 4 };
const rowSub: React.CSSProperties = { fontSize: 12, opacity: 0.8, lineHeight: 1.5 };
const rowNotes: React.CSSProperties = {
  marginTop: 8,
  fontSize: 12,
  opacity: 0.75,
  borderTop: "1px dashed #222",
  paddingTop: 8,
};

const empty: React.CSSProperties = {
  padding: 14,
  borderRadius: 12,
  border: "1px dashed #333",
  opacity: 0.7,
};

const btnSmall: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #2a2a2a",
  background: "#151515",
  color: "#fff",
  fontWeight: 700,
};

const btnSmallDanger: React.CSSProperties = {
  ...btnSmall,
  background: "#2a0c0c",
  border: "1px solid #4a1b1b",
};