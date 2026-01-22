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
  createdAt: string;
};

const LS_KEY = "sst_globalled_companies_v1";

function safeLoad(): Company[] {
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

function safeSave(list: Company[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    // se o navegador bloquear, só ignora sem quebrar a tela
  }
}

function onlyDigits(v: string) {
  return v.replace(/\D+/g, "");
}

function maskCnpj(v: string) {
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

export default function Companies() {
  const nav = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [responsible, setResponsible] = useState("");
  const [cnae, setCnae] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    setCompanies(safeLoad());
  }, []);

  const canSave = useMemo(() => {
    return name.trim().length >= 2 && onlyDigits(cnpj).length === 14;
  }, [name, cnpj]);

  function resetForm() {
    setName("");
    setCnpj("");
    setEmail("");
    setPhone("");
    setResponsible("");
    setCnae("");
    setAddress("");
    setNotes("");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const cleanCnpj = onlyDigits(cnpj);
    if (name.trim().length < 2) {
      setMsg("⚠️ Informe o nome da empresa.");
      return;
    }
    if (cleanCnpj.length !== 14) {
      setMsg("⚠️ CNPJ incompleto. Digite 14 números.");
      return;
    }

    const newCompany: Company = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      name: name.trim(),
      cnpj: maskCnpj(cleanCnpj),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      responsible: responsible.trim() || undefined,
      cnae: cnae.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const next = [newCompany, ...companies];
    setCompanies(next);
    safeSave(next);
    resetForm();
    setMsg("✅ Empresa salva no navegador (LocalStorage).");
  }

  function remove(id: string) {
    const next = companies.filter((c) => c.id !== id);
    setCompanies(next);
    safeSave(next);
  }

  const page = {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: 16,
    fontFamily: "serif",
  } as const;

  const card = {
    maxWidth: 520,
    margin: "0 auto",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 16,
    padding: 18,
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 12px 35px rgba(0,0,0,0.6)",
  } as const;

  const label = { display: "block", marginTop: 12, marginBottom: 6, opacity: 0.9 } as const;

  const input = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    outline: "none",
  } as const;

  const btn = {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,255,120,0.25)",
    background: "linear-gradient(180deg, #0b3d1a, #063112)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 18,
    cursor: "pointer",
  } as const;

  const btnGhost = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "transparent",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 10,
  } as const;

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={{ margin: 0, fontSize: 30 }}>Cadastro de Empresas</h1>
        <p style={{ marginTop: 6, opacity: 0.7 }}>
          Salva localmente no navegador (LocalStorage). Depois integra com banco (Supabase/Firebase).
        </p>

        <form onSubmit={onSubmit}>
          <label style={label}>Empresa *</label>
          <input
            style={input}
            placeholder="Ex: GLOBALLED SST"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label style={label}>CNPJ *</label>
          <input
            style={input}
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChange={(e) => setCnpj(maskCnpj(e.target.value))}
            inputMode="numeric"
          />

          <label style={label}>E-mail</label>
          <input style={input} placeholder="contato@empresa.com.br" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label style={label}>Telefone</label>
          <input style={input} placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <label style={label}>Responsável</label>
          <input style={input} placeholder="Nome do responsável" value={responsible} onChange={(e) => setResponsible(e.target.value)} />

          <label style={label}>CNAE</label>
          <input style={input} placeholder="Ex: 4120-4/00" value={cnae} onChange={(e) => setCnae(e.target.value)} />

          <label style={label}>Endereço</label>
          <input style={input} placeholder="Rua, número, cidade - UF" value={address} onChange={(e) => setAddress(e.target.value)} />

          <label style={label}>Observações</label>
          <input style={input} placeholder="Opcional" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div style={{ marginTop: 14 }}>
            <button style={{ ...btn, opacity: canSave ? 1 : 0.55 }} disabled={!canSave} type="submit">
              Salvar Empresa
            </button>

            <button type="button" style={btnGhost} onClick={() => nav("/")}>
              Voltar para Home
            </button>
          </div>

          {msg ? (
            <div style={{ marginTop: 12, opacity: 0.9 }}>
              {msg}
            </div>
          ) : null}
        </form>

        <div style={{ marginTop: 18 }}>
          <h2 style={{ margin: "10px 0", fontSize: 18, opacity: 0.9 }}>Empresas salvas ({companies.length})</h2>

          {companies.length === 0 ? (
            <div style={{ opacity: 0.6 }}>Nenhuma empresa cadastrada ainda.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {companies.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    padding: 12,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>{c.name}</div>
                  <div style={{ opacity: 0.8, marginTop: 4 }}>{c.cnpj}</div>
                  {(c.email || c.phone) ? (
                    <div style={{ opacity: 0.7, marginTop: 6 }}>
                      {c.email ? <div>{c.email}</div> : null}
                      {c.phone ? <div>{c.phone}</div> : null}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    style={{
                      marginTop: 10,
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "transparent",
                      color: "#fff",
                      cursor: "pointer",
                      opacity: 0.9,
                    }}
                  >
                    Remover
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