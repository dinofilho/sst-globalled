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
  sector: string;
  email: string;
  phone: string;
  admissionDate: string; // YYYY-MM-DD
  status: "ATIVO" | "INATIVO";
  notes: string;
  createdAt: string;
};

const COMPANIES_KEY = "sst_globalled_companies_v1"; // NÃO muda (é o seu Companies.tsx)
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
  const v = onlyDigits(value).slice(0, 11);
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

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Employees() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Employee, "id" | "createdAt">>({
    companyId: "",
    name: "",
    cpf: "",
    role: "",
    sector: "",
    email: "",
    phone: "",
    admissionDate: "",
    status: "ATIVO",
    notes: "",
  });

  useEffect(() => {
    const c = loadJSON<Company[]>(COMPANIES_KEY, []);
    setCompanies(Array.isArray(c) ? c : []);
    const e = loadJSON<Employee[]>(EMPLOYEES_KEY, []);
    setEmployees(Array.isArray(e) ? e : []);
  }, []);

  useEffect(() => {
    saveJSON(EMPLOYEES_KEY, employees);
  }, [employees]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;

    return employees.filter((e) => {
      const companyName = companies.find((c) => c.id === e.companyId)?.name || "";
      const hay = `${companyName} ${e.name} ${e.cpf} ${e.role} ${e.sector} ${e.email} ${e.phone} ${e.status}`
        .toLowerCase();
      return hay.includes(q);
    });
  }, [employees, query, companies]);

  function onChange<K extends keyof typeof form>(key: K, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({
      companyId: "",
      name: "",
      cpf: "",
      role: "",
      sector: "",
      email: "",
      phone: "",
      admissionDate: "",
      status: "ATIVO",
      notes: "",
    });
    setEditingId(null);
  }

  function validate() {
    if (!form.companyId) return "Selecione a empresa.";
    if (!form.name.trim()) return "Informe o nome do funcionário.";
    const cpfDigits = onlyDigits(form.cpf);
    if (cpfDigits.length !== 11) return "CPF incompleto (11 dígitos).";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "E-mail inválido.";
    const phoneDigits = onlyDigits(form.phone);
    if (form.phone && (phoneDigits.length < 10 || phoneDigits.length > 11))
      return "Telefone inválido (use DDD).";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    if (editingId) {
      setEmployees((prev) =>
        prev.map((x) =>
          x.id === editingId
            ? {
                ...x,
                ...form,
                cpf: formatCPF(form.cpf),
                phone: formatPhoneBR(form.phone),
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
      cpf: formatCPF(form.cpf),
      phone: formatPhoneBR(form.phone),
    };
    setEmployees((prev) => [item, ...prev]);
    resetForm();
  }

  function editEmployee(emp: Employee) {
    setEditingId(emp.id);
    setForm({
      companyId: emp.companyId,
      name: emp.name,
      cpf: emp.cpf,
      role: emp.role,
      sector: emp.sector,
      email: emp.email,
      phone: emp.phone,
      admissionDate: emp.admissionDate,
      status: emp.status,
      notes: emp.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeEmployee(id: string) {
    if (!confirm("Excluir este funcionário?")) return;
    setEmployees((prev) => prev.filter((x) => x.id !== id));
    if (editingId === id) resetForm();
  }

  const companyLabel = (id: string) => companies.find((c) => c.id === id)?.name || "Empresa (desconhecida)";

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Cadastro de Funcionários</h1>
        <p style={subtitle}>
          Salvo no navegador (LocalStorage). Já usa as empresas do seu cadastro.
        </p>

        {companies.length === 0 ? (
          <div style={warn}>
            Nenhuma empresa cadastrada. Cadastre em <b>/companies</b> primeiro.
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
              <option value="">Selecione...</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.cnpj})
                </option>
              ))}
            </select>
          </label>

          <div style={grid2}>
            <Field
              label="Funcionário *"
              placeholder="Nome completo"
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
            <Field
              label="Cargo"
              placeholder="Ex: Técnico de Segurança"
              value={form.role}
              onChange={(v) => onChange("role", v)}
            />
            <Field
              label="Setor"
              placeholder="Ex: Produção"
              value={form.sector}
              onChange={(v) => onChange("sector", v)}
            />
          </div>

          <div style={grid2}>
            <Field
              label="E-mail"
              placeholder="func@empresa.com.br"
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
            <label style={labelWrap}>
              <span style={labelText}>Data de admissão</span>
              <input
                type="date"
                value={form.admissionDate}
                onChange={(e) => onChange("admissionDate", e.target.value)}
                style={input}
              />
            </label>

            <label style={labelWrap}>
              <span style={labelText}>Status</span>
              <select
                value={form.status}
                onChange={(e) => onChange("status", e.target.value as any)}
                style={input}
              >
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </label>
          </div>

          <TextArea
            label="Observações"
            placeholder="Ex: restrições, funções, treinamentos, etc."
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
          <h2 style={{ margin: 0 }}>Funcionários</h2>
          <span style={pill}>{employees.length} cadastrados</span>
          <div style={{ flex: 1 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por empresa, nome, CPF..."
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
                    <b>Empresa:</b> {companyLabel(e.companyId)} • <b>CPF:</b> {e.cpf} •{" "}
                    <b>Status:</b> {e.status}
                  </div>
                  <div style={rowSub}>
                    {e.role ? (
                      <>
                        <b>Cargo:</b> {e.role} •{" "}
                      </>
                    ) : null}
                    {e.sector ? (
                      <>
                        <b>Setor:</b> {e.sector}
                      </>
                    ) : null}
                  </div>
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
                  {e.admissionDate ? (
                    <div style={rowSub}>
                      <b>Admissão:</b> {e.admissionDate}
                    </div>
                  ) : null}
                  {e.notes ? <div style={rowNotes}>{e.notes}</div> : null}
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => editEmployee(e)} style={btnSmall}>
                    Editar
                  </button>
                  <button onClick={() => removeEmployee(e.id)} style={btnSmallDanger}>
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== componentes ===== */

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

/* ===== estilos (igual vibe do Companies) ===== */

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

const warn: React.CSSProperties = {
  marginTop: 10,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #3b2f00",
  background: "#1a1400",
  color: "#ffd57a",
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