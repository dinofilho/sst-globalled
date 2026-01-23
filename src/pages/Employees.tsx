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

type Employee = {
  id: string;
  companyId: string;
  name: string;
  cpf: string;
  role: string;
  email: string;
  phone: string;
  admissionDate: string; // YYYY-MM-DD
  status: "ATIVO" | "INATIVO";
  notes: string;
  createdAt: string;
};

const COMPANIES_KEY = "sst_globalled_companies_v1";
const EMPLOYEES_KEY = "sst_globalled_employees_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

function formatCPF(value: string) {
  const v = onlyDigits(value).slice(0, 11);
  const p1 = v.slice(0, 3);
  const p2 = v.slice(3, 6);
  const p3 = v.slice(6, 9);
  const p4 = v.slice(9, 11);
  let out = p1;
  if (p2) out += "." + p2;
  if (p3) out += "." + p3;
  if (p4) out += "-" + p4;
  return out;
}

function formatPhoneBR(value: string) {
  const v = onlyDigits(value).slice(0, 11); // (11) 99999-9999
  const ddd = v.slice(0, 2);

  if (!ddd) return v;

  if (v.length <= 10) {
    const a = v.slice(2, 6);
    const b = v.slice(6, 10);
    let out = `(${ddd})`;
    if (a) out += ` ${a}`;
    if (b) out += `-${b}`;
    return out;
  }

  const p1 = v.slice(2, 7);
  const p2 = v.slice(7, 11);
  let out = `(${ddd})`;
  if (p1) out += ` ${p1}`;
  if (p2) out += `-${p2}`;
  return out;
}

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function safeSave(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Employees() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [items, setItems] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Employee, "id" | "createdAt">>({
    companyId: "",
    name: "",
    cpf: "",
    role: "",
    email: "",
    phone: "",
    admissionDate: "",
    status: "ATIVO",
    notes: "",
  });

  useEffect(() => {
    const cs = safeLoad<Company[]>(COMPANIES_KEY, []);
    const es = safeLoad<Employee[]>(EMPLOYEES_KEY, []);
    setCompanies(cs);
    setItems(es);

    // se tiver empresa, já seleciona a primeira
    if (cs.length && !form.companyId) {
      setForm((p) => ({ ...p, companyId: cs[0].id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    safeSave(EMPLOYEES_KEY, items);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    const companyMap = new Map(companies.map((c) => [c.id, c.name]));
    return items.filter((e) => {
      const hay = `${e.name} ${e.cpf} ${e.role} ${e.email} ${e.phone} ${companyMap.get(e.companyId) || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, companies]);

  function onChange<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm((prev) => ({
      companyId: companies[0]?.id || prev.companyId || "",
      name: "",
      cpf: "",
      role: "",
      email: "",
      phone: "",
      admissionDate: "",
      status: "ATIVO",
      notes: "",
    }));
  }

  function validate() {
    if (!companies.length) return "Cadastre pelo menos 1 empresa primeiro.";
    if (!form.companyId) return "Selecione a empresa.";
    if (!form.name.trim()) return "Informe o nome do funcionário.";
    const cpfDigits = onlyDigits(form.cpf);
    if (cpfDigits.length !== 11) return "CPF incompleto (precisa de 11 dígitos).";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "E-mail inválido.";
    const phoneDigits = onlyDigits(form.phone);
    if (form.phone && (phoneDigits.length < 10 || phoneDigits.length > 11)) return "Telefone inválido (use DDD).";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    if (editingId) {
      setItems((prev) =>
        prev.map((x) =>
          x.id === editingId
            ? {
                ...x,
                ...form,
                cpf: formatCPF(String(form.cpf)),
                phone: formatPhoneBR(String(form.phone)),
              }
            : x
        )
      );
      resetForm();
      return;
    }

    const item: Employee = {
      id: uid(),
      createdAt: new Date().toISOString(),
      ...form,
      cpf: formatCPF(String(form.cpf)),
      phone: formatPhoneBR(String(form.phone)),
    };

    setItems((prev) => [item, ...prev]);
    resetForm();
  }

  function editOne(e: Employee) {
    setEditingId(e.id);
    setForm({
      companyId: e.companyId,
      name: e.name,
      cpf: e.cpf,
      role: e.role,
      email: e.email,
      phone: e.phone,
      admissionDate: e.admissionDate || "",
      status: e.status,
      notes: e.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeOne(id: string) {
    if (!confirm("Excluir este funcionário?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
    if (editingId === id) resetForm();
  }

  const companyNameById = useMemo(() => {
    const map = new Map(companies.map((c) => [c.id, c.name]));
    return (id: string) => map.get(id) || "—";
  }, [companies]);

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Funcionários</h1>
        <p style={subtitle}>Cadastro local (LocalStorage) — depois integra com banco.</p>

        {!companies.length ? (
          <div style={warn}>
            Você ainda não tem empresa cadastrada. Vá em <b>Empresas</b> e cadastre uma primeiro.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 10 }}>
          <label style={labelWrap}>
            <span style={labelText}>Empresa *</span>
            <select
              value={form.companyId}
              onChange={(e) => onChange("companyId", e.target.value)}
              style={input}
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.cnpj}
                </option>
              ))}
            </select>
          </label>

          <div style={grid2}>
            <Field
              label="Nome *"
              placeholder="Ex: João da Silva"
              value={form.name}
              onChange={(v) => onChange("name", v)}
            />
            <Field
              label="CPF *"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(v) => onChange("cpf", formatCPF(v))}
            />
          </div>

          <div style={grid2}>
            <Field label="Cargo/Função" placeholder="Ex: Operador" value={form.role} onChange={(v) => onChange("role", v)} />
            <Field
              label="Data de admissão"
              placeholder="YYYY-MM-DD"
              value={form.admissionDate}
              onChange={(v) => onChange("admissionDate", v)}
            />
          </div>

          <div style={grid2}>
            <Field label="E-mail" placeholder="nome@empresa.com.br" value={form.email} onChange={(v) => onChange("email", v)} />
            <Field
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={form.phone}
              onChange={(v) => onChange("phone", formatPhoneBR(v))}
            />
          </div>

          <label style={labelWrap}>
            <span style={labelText}>Status</span>
            <select value={form.status} onChange={(e) => onChange("status", e.target.value as any)} style={input}>
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
            </select>
          </label>

          <TextArea
            label="Observações"
            placeholder="Ex: setor, restrições, EPI, treinamentos, etc."
            value={form.notes}
            onChange={(v) => onChange("notes", v)}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            <button type="submit" style={editingId ? btnPrimaryAlt : btnPrimary}>
              {editingId ? "Salvar Alteração" : "Cadastrar Funcionário"}
            </button>
            <button type="button" onClick={resetForm} style={btn}>
              Limpar
            </button>
          </div>
        </form>
      </div>

      <div style={card}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>Lista</h2>
          <span style={pill}>{items.length} cadastrados</span>
          <div style={{ flex: 1 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, CPF, empresa..."
            style={search}
          />
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={empty}>Nenhum funcionário encontrado.</div>
          ) : (
            filtered.map((e) => (
              <div key={e.id} style={row}>
                <div style={{ minWidth: 0 }}>
                  <div style={rowTitle}>{e.name}</div>
                  <div style={rowSub}>
                    <b>Empresa:</b> {companyNameById(e.companyId)} • <b>CPF:</b> {e.cpf}
                  </div>
                  <div style={rowSub}>
                    {e.role ? (
                      <>
                        <b>Função:</b> {e.role} •{" "}
                      </>
                    ) : null}
                    <b>Status:</b> {e.status}
                  </div>
                  {(e.email || e.phone) ? (
                    <div style={rowSub}>
                      {e.email ? (
                        <>
                          <b>E-mail:</b> {e.email} •{" "}
                        </>
                      ) : null}
                      {e.phone ? (
                        <>
                          <b>Tel:</b> {e.phone}
                        </>
                      ) : null}
                    </div>
                  ) : null}
                  {e.notes ? <div style={rowNotes}>{e.notes}</div> : null}
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => editOne(e)} style={btnSmall}>
                    Editar
                  </button>
                  <button onClick={() => removeOne(e.id)} style={btnSmallDanger}>
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <p style={{ marginTop: 16, fontSize: 12, opacity: 0.55 }}>
          Próximo passo: ligar “Exames” e “ASO” por funcionário com vencimentos.
        </p>
      </div>
    </div>
  );
}

/* ===== componentes ===== */

function Field(props: { label: string; placeholder?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={labelWrap}>
      <span style={labelText}>{props.label}</span>
      <input value={props.value} onChange={(e) => props.onChange(e.target.value)} placeholder={props.placeholder} style={input} />
    </label>
  );
}

function TextArea(props: { label: string; placeholder?: string; value: string; onChange: (v: string) => void }) {
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

const warn: React.CSSProperties = {
  marginTop: 10,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #3a2a2a",
  background: "#1a1010",
  opacity: 0.95,
  fontSize: 13,
};

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

const search: React.CSSProperties = { ...input, maxWidth: 320, padding: "10px 12px" };

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