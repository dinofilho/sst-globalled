import { useEffect, useMemo, useState } from "react";

type Employee = {
  id: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
};

const STORAGE_KEY = "sst_globalled_employees_v1";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadEmployees(): Employee[] {
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

function saveEmployees(list: Employee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setEmployees(loadEmployees());
  }, []);

  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
    );
  }, [employees, query]);

  function addEmployee() {
    const n = name.trim();
    const r = role.trim();
    if (!n) return;

    const newItem: Employee = {
      id: uid(),
      name: n,
      role: r || "—",
      active: true,
      createdAt: new Date().toISOString(),
    };

    setEmployees((prev) => [newItem, ...prev]);
    setName("");
    setRole("");
  }

  function toggleActive(id: string) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
    );
  }

  function removeEmployee(id: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  function clearAll() {
    setEmployees([]);
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginBottom: 6 }}>Funcionários</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Cadastro local (salva no navegador). Depois a gente liga no banco.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: 10,
          marginTop: 16,
          alignItems: "center",
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do funcionário"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #333" }}
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Função (ex: Técnico SST)"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #333" }}
        />
        <button
          onClick={addEmployee}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #2b7",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          + Adicionar
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 14,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome/função/id..."
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #333",
            flex: "1 1 280px",
          }}
        />
        <button
          onClick={clearAll}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #a33",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Limpar tudo
        </button>
      </div>

      <div style={{ marginTop: 18, opacity: 0.85 }}>
        Total: <b>{employees.length}</b> — Exibindo: <b>{filtered.length}</b>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px dashed #444",
              opacity: 0.85,
            }}
          >
            Nenhum funcionário ainda. Adicione o primeiro acima.
          </div>
        ) : (
          filtered.map((e) => (
            <div
              key={e.id}
              style={{
                padding: 14,
                borderRadius: 12,
                border: "1px solid #333",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>
                  {e.name}{" "}
                  <span style={{ fontWeight: 600, opacity: 0.7 }}>
                    — {e.role}
                  </span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  ID: {e.id} • Criado: {new Date(e.createdAt).toLocaleString()}
                </div>
                <div style={{ marginTop: 6 }}>
                  Status:{" "}
                  <b style={{ color: e.active ? "#2b7" : "#c55" }}>
                    {e.active ? "ATIVO" : "INATIVO"}
                  </b>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => toggleActive(e.id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #555",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {e.active ? "Desativar" : "Ativar"}
                </button>
                <button
                  onClick={() => removeEmployee(e.id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #a33",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}