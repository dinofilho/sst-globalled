import React, { useEffect, useMemo, useState } from "react";

type Company = {
  id: string;
  name: string;
};

type Employee = {
  id: string;
  companyId: string;
  name: string;
  cpf: string;
  role: string;
  sector: string;
  admission: string;
  notes: string;
  createdAt: string;
};

const EMP_KEY = "sst_globalled_employees_v1";
const COMP_KEY = "sst_globalled_companies_v1";

const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);
const digits = (v: string) => v.replace(/\D/g, "");

const formatCPF = (v: string) => {
  const d = digits(v).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

export default function Employees() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [form, setForm] = useState({
    companyId: "",
    name: "",
    cpf: "",
    role: "",
    sector: "",
    admission: "",
    notes: "",
  });

  useEffect(() => {
    setCompanies(JSON.parse(localStorage.getItem(COMP_KEY) || "[]"));
    setEmployees(JSON.parse(localStorage.getItem(EMP_KEY) || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem(EMP_KEY, JSON.stringify(employees));
  }, [employees]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return employees.filter(e =>
      `${e.name} ${e.cpf} ${e.role}`.toLowerCase().includes(q)
    );
  }, [employees, query]);

  function reset() {
    setForm({
      companyId: "",
      name: "",
      cpf: "",
      role: "",
      sector: "",
      admission: "",
      notes: "",
    });
    setEditing(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.companyId || digits(form.cpf).length !== 11) {
      alert("Preencha empresa, nome e CPF corretamente.");
      return;
    }

    if (editing) {
      setEmployees(prev =>
        prev.map(e =>
          e.id === editing ? { ...e, ...form, cpf: formatCPF(form.cpf) } : e
        )
      );
    } else {
      setEmployees(prev => [
        {
          id: uid(),
          createdAt: new Date().toISOString(),
          ...form,
          cpf: formatCPF(form.cpf),
        },
        ...prev,
      ]);
    }
    reset();
  }

  function edit(e: Employee) {
    setEditing(e.id);
    setForm(e);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function del(id: string) {
    if (confirm("Excluir funcionário?")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h1>Funcionários</h1>

        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <select
            value={form.companyId}
            onChange={e => setForm({ ...form, companyId: e.target.value })}
            style={input}
          >
            <option value="">Selecione a empresa *</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input placeholder="Nome do funcionário *" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} style={input} />

          <input placeholder="CPF *" value={form.cpf}
            onChange={e => setForm({ ...form, cpf: formatCPF(e.target.value) })} style={input} />

          <input placeholder="Cargo" value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })} style={input} />

          <input placeholder="Setor" value={form.sector}
            onChange={e => setForm({ ...form, sector: e.target.value })} style={input} />

          <input type="date" value={form.admission}
            onChange={e => setForm({ ...form, admission: e.target.value })} style={input} />

          <textarea placeholder="Observações"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            style={{ ...input, minHeight: 80 }} />

          <button style={btnPrimary}>{editing ? "Salvar" : "Cadastrar"}</button>
        </form>
      </div>

      <div style={card}>
        <input
          placeholder="Buscar funcionário..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={input}
        />

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {filtered.map(e => (
            <div key={e.id} style={row}>
              <div>
                <b>{e.name}</b><br />
                CPF: {e.cpf}<br />
                Cargo: {e.role || "-"}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => edit(e)} style={btn}>Editar</button>
                <button onClick={() => del(e.id)} style={btnDanger}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== estilos ===== */
const page = { background: "#0b0b0b", minHeight: "100vh", padding: 16, color: "#fff" };
const card = { background: "#111", borderRadius: 12, padding: 16, marginBottom: 14 };
const input = { padding: 12, borderRadius: 10, border: "1px solid #333", background: "#0c0c0c", color: "#fff" };
const btnPrimary = { padding: 12, background: "#0a7a33", border: "none", borderRadius: 10, color: "#fff" };
const btn = { padding: "8px 10px", background: "#222", borderRadius: 8, color: "#fff" };
const btnDanger = { ...btn, background: "#7a0a0a" };
const row = { display: "flex", justifyContent: "space-between", background: "#0c0c0c", padding: 12, borderRadius: 10 };