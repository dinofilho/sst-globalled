// src/pages/Employees.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Company = {
  id: string;
  name: string;
  cnpj?: string;
};

type Employee = {
  id: string;
  companyId: string;
  name: string;
  cpf?: string;
  role?: string;
  phone?: string;
  createdAt: string;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Employees() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === companyId) || null,
    [companies, companyId]
  );

  useEffect(() => {
    const c = readJSON<Company[]>("companies", []);
    const e = readJSON<Employee[]>("employees", []);
    setCompanies(c);
    setEmployees(e);

    // se existir pelo menos uma empresa, já seleciona a primeira
    if (c.length > 0) setCompanyId(c[0].id);
  }, []);

  function refreshFromStorage() {
    const c = readJSON<Company[]>("companies", []);
    const e = readJSON<Employee[]>("employees", []);
    setCompanies(c);
    setEmployees(e);
    if (c.length > 0 && !c.some((x) => x.id === companyId)) setCompanyId(c[0].id);
  }

  function addEmployee() {
    if (!companyId) {
      alert("Cadastre uma empresa primeiro em 'Cadastrar Empresas'.");
      return;
    }
    if (!name.trim()) {
      alert("Informe o nome do funcionário.");
      return;
    }

    const newEmp: Employee = {
      id: uid(),
      companyId,
      name: name.trim(),
      cpf: cpf.trim() || undefined,
      role: role.trim() || undefined,
      phone: phone.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const next = [newEmp, ...employees];
    setEmployees(next);
    writeJSON("employees", next);

    setName("");
    setCpf("");
    setRole("");
    setPhone("");

    alert("Funcionário cadastrado!");
  }

  function removeEmployee(id: string) {
    if (!confirm("Remover este funcionário?")) return;
    const next = employees.filter((e) => e.id !== id);
    setEmployees(next);
    writeJSON("employees", next);
  }

  const listFiltered = useMemo(() => {
    if (!companyId) return employees;
    return employees.filter((e) => e.companyId === companyId);
  }, [employees, companyId]);

  // estilos simples (igual seu padrão)
  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: "#0b0b0b",
    color: "#fff",
    padding: 18,
  };

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 720,
    margin: "0 auto",
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    background: "#111",
    padding: 16,
  };

  const row: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  };

  const input: React.CSSProperties = {
    flex: "1 1 220px",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    background: "#0f0f0f",
    color: "#fff",
    outline: "none",
  };

  const select: React.CSSProperties = {
    ...input,
    flex: "1 1 260px",
  };

  const btn: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    background: "#151515",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
  };

  const btnGreen: React.CSSProperties = {
    ...btn,
    background: "#25D366",
    color: "#000",
    border: "none",
  };

  const small: React.CSSProperties = { opacity: 0.75, fontSize: 12 };

  return (
    <div style={page}>
      <div style={{ maxWidth: 720, margin: "0 auto", marginBottom: 12 }}>
        <Link to="/" style={{ ...btn, display: "inline-block" }}>
          ← Voltar
        </Link>
        <button
          onClick={refreshFromStorage}
          style={{ ...btn, marginLeft: 10 }}
          title="Recarregar empresas/funcionários do localStorage"
        >
          Recarregar
        </button>
      </div>

      <div style={card}>
        <h2 style={{ margin: 0, marginBottom: 6 }}>Funcionários</h2>
        <div style={small}>
          Selecione a empresa e cadastre os funcionários. (Tudo fica salvo no navegador)
        </div>

        <div style={{ height: 14 }} />

        {companies.length === 0 ? (
          <div
            style={{
              border: "1px dashed #2a2a2a",
              borderRadius: 12,
              padding: 14,
              background: "#0f0f0f",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Nenhuma empresa cadastrada
            </div>
            <div style={{ opacity: 0.8, marginBottom: 10 }}>
              Vá em <b>Cadastrar Empresas</b> e crie pelo menos 1 empresa para poder
              cadastrar funcionários.
            </div>
            <Link to="/companies" style={{ ...btnGreen, display: "inline-block" }}>
              Ir para Cadastrar Empresas
            </Link>
          </div>
        ) : (
          <>
            <div style={row}>
              <select
                style={select}
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.cnpj ? ` — ${c.cnpj}` : ""}
                  </option>
                ))}
              </select>

              <input
                style={input}
                placeholder="Nome do funcionário *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                style={input}
                placeholder="CPF (opcional)"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <input
                style={input}
                placeholder="Função / Cargo (opcional)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <input
                style={input}
                placeholder="Telefone (opcional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button style={btnGreen} onClick={addEmployee}>
                + Cadastrar Funcionário
              </button>
            </div>

            {selectedCompany && (
              <div style={{ marginTop: 10, ...small }}>
                Empresa selecionada: <b>{selectedCompany.name}</b>
              </div>
            )}

            <div style={{ height: 16 }} />

            <h3 style={{ margin: 0, marginBottom: 8 }}>
              Lista ({listFiltered.length})
            </h3>

            {listFiltered.length === 0 ? (
              <div style={{ opacity: 0.75 }}>
                Nenhum funcionário cadastrado para esta empresa.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {listFiltered.map((e) => {
                  const comp = companies.find((c) => c.id === e.companyId);
                  return (
                    <div
                      key={e.id}
                      style={{
                        border: "1px solid #2a2a2a",
                        borderRadius: 12,
                        padding: 12,
                        background: "#0f0f0f",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>
                          {e.name}
                        </div>
                        <div style={small}>
                          Empresa: <b>{comp?.name || "—"}</b>
                          {e.role ? ` • Cargo: ${e.role}` : ""}
                          {e.cpf ? ` • CPF: ${e.cpf}` : ""}
                          {e.phone ? ` • Tel: ${e.phone}` : ""}
                        </div>
                      </div>

                      <button style={btn} onClick={() => removeEmployee(e.id)}>
                        Remover
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ height: 18 }} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/exams" style={btn}>
                Ir para Exames
              </Link>
              <Link to="/dashboard" style={btn}>
                Ir para Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}