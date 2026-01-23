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
  role: string;
  email: string;
  phone: string;
  admissionDate: string; // yyyy-mm-dd
  notes: string;
  createdAt: string;
};

const STORAGE_COMPANIES = "sst_globalled_companies_v1";
const STORAGE_SELECTED_COMPANY = "sst_globalled_selected_company_v1";
const STORAGE_EMPLOYEES = "sst_globalled_employees_v1";

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
    const raw = localStorage.getItem(STORAGE_COMPANIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function loadEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_EMPLOYEES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveEmployees(items: Employee[]) {
  localStorage.setItem(STORAGE_EMPLOYEES, JSON.stringify(items));
}
function getSelectedCompanyId(): string | null {
  try {
    return localStorage.getItem(STORAGE_SELECTED_COMPANY);
  } catch {
    return null;
  }
}

export default function Employees() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Employee, "id" | "createdAt" | "companyId">>({
    name: "",
    cpf: "",
    role: "",
    email: "",
    phone: "",
    admissionDate: "",
    notes: "",
  });

  useEffect(() => {
    setCompanies(loadCompanies());
    setSelectedCompanyId(getSelectedCompanyId());
    setEmployees(loadEmployees());
  }, []);

  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return companies.find((c) => c.id === selectedCompanyId) || null;
  }, [companies, selectedCompanyId]);

  const employeesOfCompany = useMemo(() => {
    if (!selectedCompanyId) return [];
    return employees.filter((e) => e.companyId === selectedCompanyId);
  }, [employees, selectedCompanyId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employeesOfCompany;
    return employeesOfCompany.filter((e) => {
      const hay = `${e.name} ${e.cpf} ${e.role} ${e.email} ${e.phone} ${e.admissionDate}`.toLowerCase();
      return hay.includes(q);
    });
  }, [employeesOfCompany, query]);

  function resetForm() {
    setForm({
      name: "",
      cpf: "",
      role: "",
      email: "",
      phone: "",
      admissionDate: "",
      notes: "",
    });
    setEditingId(null);
  }

  function onChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!selectedCompanyId) return "Selecione uma empresa antes.";
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
    if (!selectedCompanyId) return;

    if (editingId) {
      setEmployees((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? { ...it, ...form, cpf: formatCPF(form.cpf), phone: formatPhoneBR(form.phone) }
            : it
        )
      );
      return resetForm();
    }

    const item: Employee = {
      id: uid(),
      companyId: selectedCompanyId,
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
      name: e.name,
      cpf: e.cpf,
      role: e.role,
      email: e.email,
      phone: e.phone,
      admissionDate: e.admissionDate,
      notes: e.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeEmployee(id: string) {
    if (!confirm("Excluir este funcionário?")) return;
    setEmployees((prev) => prev.filter((x) => x.id !== id));
    if (editingId === id) resetForm();
  }

  function clearCompanyEmployees() {
    if (!selectedCompanyId) return;
    if (!confirm("Apagar TODOS os funcionários desta empresa (neste dispositivo)?")) return;
    setEmployees((prev) => prev.filter((x) => x.companyId !== selectedCompanyId));
    resetForm();
  }

  if (!selectedCompanyId) {
    return (
      <div style={page}>
        <div style={card}>
          <h1 style={title}>Funcionários</h1>
          <p style={subtitle}>Você precisa selecionar uma empresa primeiro.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <Link to="/" style={btn}>Voltar Home</Link>
            <Link to="/companies" style={btn}>Empresas</Link>
            <Link to="/select-business" style={btnPrimary}>Selecionar Empresa</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Cadastro de Funcionários</h1>
        <p style={subtitle}>
          Empresa ativa: <b>{selectedCompany ? selectedCompany.name : selectedCompanyId}</b>
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <Link to="/" style={btn}>Home</Link>
          <Link to="/select-business" style={btn}>Trocar Empresa</Link>
          <Link to="/companies" style={btn}>Empresas</Link>
          <Link to="/exams" style={btn}>Exames</Link>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 14 }}>
          <div style={grid2}>
            <Field label="Funcionário *" value={form.name} onChange={(v) => onChange("name", v)} placeholder="Nome completo" />
            <Field label="CPF *" value={form.cpf} onChange={(v) => onChange("cpf", formatCPF(v))} placeholder="000.000.000-00" />
          </div>

          <div style={grid2}>
            <Field label="Cargo / Função" value={form.role} onChange={(v) => onChange("role", v)} placeholder="Ex: Técnico de Segurança" />
            <Field label="Admissão (yyyy-mm-dd)" value={form.admissionDate} onChange={(v) => onChange("admissionDate", v)} placeholder="2026-01-22" />
          </div>

          <div style={grid2}>
            <Field label="E-mail" value={form.email} onChange={(v) => onChange("email", v)} placeholder="email@empresa.com.br" />
            <Field label="Telefone" value={form.phone} onChange={(v) => onChange("phone", formatPhoneBR(v))} placeholder="(11) 99999-9999" />
          </div>

          <TextArea label="Observações" value={form.notes} onChange={(v) => onChange("notes", v)} placeholder="NRs, ASO, restrições, etc." />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            <button type="submit" style={editingId ? btnPrimaryAlt : btnPrimary}>
              {editingId ? "Salvar Alteração" : "Cadastrar Funcionário"}
            </button>
            <button type="button" onClick={resetForm} style={btnAction}>Limpar</button>
            <button type="button" onClick={clearCompanyEmployees} style={btnDanger}>Apagar Funcionários da Empresa</button>
          </div>
        </form>
      </div>

      <div style={card}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>Funcionários</h2>
          <span style={pill}>{employeesOfCompany.length} cadastrados</span>
          <div style={{ flex: 1 }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome, CPF, cargo..." style={search} />
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
                    <b>CPF:</b> {e.cpf} {e.role ? <>• <b>Cargo:</b> {e.role}</> : null}
                  </div>
                  <div style={rowSub}>
                    {e.admissionDate ? <><b>Admissão:</b> {e.admissionDate} • </> : null}
                    {e.email ? <><b>E-mail:</b> {e.email} • </> : null}
                    {e.phone ? <><b>Tel:</b> {e.phone}</> : null}
                  </div>
                  {e.notes ? <div style={rowNotes}>{e.notes}</div> : null}
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => editEmployee(e)} style={btnSmall}>Editar</button>
                  <button onClick={() => removeEmployee(e.id)} style={btnSmallDanger}>Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/** ===== Components ===== */
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
      <textarea value={props.value} onChange={(e) => props.onChange(e.target.value)} placeholder={props.placeholder} style={{ ...input, minHeight: 90, resize: "vertical", paddingTop: 10 }} />
    </label>
  );
}

/** ===== Styles ===== */
const page: React.CSSProperties = { minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: 16, display: "grid", gap: 14, alignContent: "start" };
const card: React.CSSProperties = { background: "#111", border: "1px solid #222", borderRadius: 12, padding: 16, boxShadow: "0 10px 30px rgba(0,0,0,.25)" };
const title: React.CSSProperties = { margin: 0, fontSize: 22 };
const subtitle: React.CSSProperties = { marginTop: 6, opacity: 0.75 };

const grid2: React.CSSProperties = { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" };
const labelWrap: React.CSSProperties = { display: "grid", gap: 6 };
const labelText: React.CSSProperties = { fontSize: 12, opacity: 0.75 };

const input: React.CSSProperties = { width: "100%", padding: "12px 12px", borderRadius: 10, border: "1px solid #2a2a2a", background: "#0c0c0c", color: "#fff", outline: "none" };
const search: React.CSSProperties = { ...input, maxWidth: 320, padding: "10px 12px" };

const btnBase: React.CSSProperties = { padding: "12px 14px", borderRadius: 10, border: "1px solid #2a2a2a", background: "#151515", color: "#fff", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" };
const btn: React.CSSProperties = { ...btnBase };
const btnAction: React.CSSProperties = { ...btnBase };
const btnPrimary: React.CSSProperties = { ...btnBase, background: "#0a7a33", border: "none" };
const btnPrimaryAlt: React.CSSProperties = { ...btnBase, background: "#0a6a7a", border: "none" };
const btnDanger: React.CSSProperties = { ...btnBase, background: "#7a0a0a", border: "none" };

const pill: React.CSSProperties = { fontSize: 12, padding: "4px 10px", border: "1px solid #2a2a2a", borderRadius: 999, opacity: 0.85 };

const row: React.CSSProperties = { border: "1px solid #222", background: "#0c0c0c", borderRadius: 12, padding: 14, display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between" };
const rowTitle: React.CSSProperties = { fontWeight: 800, marginBottom: 4 };
const rowSub: React.CSSProperties = { fontSize: 12, opacity: 0.8, lineHeight: 1.5 };
const rowNotes: React.CSSProperties = { marginTop: 8, fontSize: 12, opacity: 0.75, borderTop: "1px dashed #222", paddingTop: 8 };
const empty: React.CSSProperties = { padding: 14, borderRadius: 12, border: "1px dashed #333", opacity: 0.7 };

const btnSmall: React.CSSProperties = { padding: "10px 12px", borderRadius: 10, border: "1px solid #2a2a2a", background: "#151515", color: "#fff", fontWeight: 800 };
const btnSmallDanger: React.CSSProperties = { ...btnSmall, background: "#2a0c0c", border: "1px solid #4a1b1b" };