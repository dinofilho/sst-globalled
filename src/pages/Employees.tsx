import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
  role: string; // função
  sector: string; // setor
  admissionDate: string; // YYYY-MM-DD
  phone: string;
  email: string;

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

function loadCompanies(): Company[] {
  try {
    const raw = localStorage.getItem(COMPANIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(EMPLOYEES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEmployees(items: Employee[]) {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(items));
}

export default function Employees() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Employee, "id" | "createdAt">>({
    companyId: "",
    name: "",
    cpf: "",
    role: "",
    sector: "",
    admissionDate: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    setCompanies(loadCompanies());
    setEmployees(loadEmployees());
  }, []);

  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      if (companyFilter && e.companyId !== companyFilter) return false;
      if (!q) return true;
      const c = companies.find((x) => x.id === e.companyId);
      const hay = `${e.name} ${e.cpf} ${e.role} ${e.sector} ${e.email} ${e.phone} ${c?.name || ""}`
        .toLowerCase();
      return hay.includes(q);
    });
  }, [employees, query, companyFilter, companies]);

  function onChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({
      companyId: "",
      name: "",
      cpf: "",
      role: "",
      sector: "",
      admissionDate: "",
      phone: "",
      email: "",
      notes: "",
    });
    setEditingId(null);
  }

  function validate() {
    if (!companies.length) return "Cadastre uma empresa antes de cadastrar funcionários.";
    if (!form.companyId) return "Selecione a empresa.";
    if (!form.name.trim()) return "Informe o nome do funcionário.";
    const cpfDigits = onlyDigits(form.cpf);
    if (cpfDigits.length !== 11) return "CPF incompleto (precisa de 11 dígitos).";
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

  function editEmployee(e: Employee) {
    setEditingId(e.id);
    setForm({
      companyId: e.companyId,
      name: e.name,
      cpf: e.cpf,
      role: e.role,
      sector: e.sector,
      admissionDate: e.admissionDate,
      phone: e.phone,
      email: e.email,
      notes: e.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeEmployee(id: string) {
    if (!confirm("Excluir este funcionário?")) return;
    setEmployees((prev) => prev.filter((x) => x.id !== id));
    if (editingId === id) resetForm();
  }

  function clearAll() {
    if (!confirm("Apagar TODOS os funcionários salvos neste dispositivo?")) return;
    setEmployees([]);
    resetForm();
  }

  return (
    <div style={page}>
      <div style={{ ...card, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={title}>Cadastro de Funcionários</h1>
          <p style={subtitle}>
            Vincula funcionário à empresa (LocalStorage). Próximo passo: exames e ASO.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Link to="/" style={linkBtn}>Home</Link>
          <Link to="/companies" style={linkBtn}>Empresas</Link>
          <Link to="/exams" style={linkBtn}>Exames</Link>
        </div>
      </div>

      <div style={card}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div style={grid2}>
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
                    {c.name} — {c.cnpj}
                  </option>
                ))}
              </select>
            </label>

            <Field
              label="Funcionário *"
              placeholder="Nome completo"
              value={form.name}
              onChange={(v) => onChange("name", v)}
            />
          </div>

          <div style={grid2}>
            <Field
              label="CPF *"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(v) => onChange("cpf", formatCPF(v))}
            />
            <Field
              label="Data de Admissão"
              placeholder="YYYY-MM-DD"
              value={form.admissionDate}
              onChange={(v) => onChange("admissionDate", v)}
              type="date"
            />
          </div>

          <div style={grid2}>
            <Field label="Função" placeholder="Ex: Eletricista" value={form.role} onChange={(v) => onChange("role", v)} />
            <Field label="Setor" placeholder="Ex: Manutenção" value={form.sector} onChange={(v) => onChange("sector", v)} />
          </div>

          <div style={grid2}>
            <Field
              label="E-mail"
              placeholder="funcionario@empresa.com.br"
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

          <TextArea
            label="Observações"
            placeholder="Restrições, riscos, histórico, etc."
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
            <button type="button" onClick={clearAll} style={btnDanger}>
              Apagar Tudo
            </button>
          </div>
        </form>
      </div>

      <div style={card}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>Funcionários</h2>
          <span style={pill}>{employees.length} cadastrados</span>

          <div style={{ flex: 1 }} />

          <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} style={{ ...input, maxWidth: 320 }}>
            <option value="">Todas as empresas</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, CPF, função..."
            style={search}
          />
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={empty}>
              {companies.length ? "Nenhum funcionário encontrado." : "Cadastre uma empresa primeiro em /companies."}
            </div>
          ) : (
            filtered.map((e) => {
              const c = companies.find((x) => x.id === e.companyId);
              return (
                <div key={e.id} style={row}>
                  <div style={{ minWidth: 0 }}>
                    <div style={rowTitle}>{e.name}</div>
                    <div style={rowSub}>
                      <b>CPF:</b> {e.cpf} • <b>Empresa:</b> {c?.name || "—"}
                    </div>
                    <div style={rowSub}>
                      {e.role ? (
                        <>
                          <b>Função:</b> {e.role} •{" "}
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
                    {e.admissionDate ? <div style={rowSub}><b>Admissão:</b> {e.admissionDate}</div> : null}
                    {e.notes ? <div style={rowNotes}>{e.notes}</div> : null}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                    <button onClick={() => editEmployee(e)} style={btnSmall}>Editar</button>
                    <Link
                      to={`/exams?employeeId=${encodeURIComponent(e.id)}`}
                      style={{ ...btnSmall, textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                    >
                      Exames
                    </Link>
                    <button onClick={() => removeEmployee(e.id)} style={btnSmallDanger}>Excluir</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
  type?: string;
}) {
  return (
    <label style={labelWrap}>
      <span style={labelText}>{props.label}</span>
      <input
        type={props.type || "text"}
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

const linkBtn: React.CSSProperties = {
  ...btnSmall,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};