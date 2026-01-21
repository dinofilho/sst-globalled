import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Company = { id: string; name: string };
type Employee = {
  id: string;
  company_id: string;
  name: string;
  cpf: string | null;
  role: string | null;
  created_at: string;
};

export default function Employees() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [items, setItems] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [role, setRole] = useState("");

  const companyMap = useMemo(() => {
    const m = new Map<string, string>();
    companies.forEach(c => m.set(c.id, c.name));
    return m;
  }, [companies]);

  async function loadAll() {
    setLoading(true);
    setMsg(null);

    const c = await supabase.from("companies").select("id,name").order("name");
    const e = await supabase.from("employees").select("*").order("created_at", { ascending: false });

    if (c.error) setMsg(c.error.message);
    if (e.error) setMsg(e.error.message);

    setCompanies((c.data as Company[]) ?? []);
    setItems((e.data as Employee[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function addOne(ev: React.FormEvent) {
    ev.preventDefault();
    setMsg(null);

    if (!companyId) return setMsg("Selecione uma empresa.");
    if (!name.trim()) return setMsg("Nome do colaborador é obrigatório.");

    const payload = {
      company_id: companyId,
      name: name.trim(),
      cpf: cpf.trim() || null,
      role: role.trim() || null,
    };

    const res = await supabase.from("employees").insert(payload);
    if (res.error) return setMsg(res.error.message);

    setName(""); setCpf(""); setRole("");
    await loadAll();
    setMsg("✅ Colaborador salvo.");
  }

  async function removeOne(id: string) {
    if (!confirm("Excluir este colaborador?")) return;
    setMsg(null);
    const res = await supabase.from("employees").delete().eq("id", id);
    if (res.error) setMsg(res.error.message);
    await loadAll();
  }

  async function importCSV(file: File) {
    setMsg(null);
    const text = await file.text();

    // CSV: company_name, name, cpf, role
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return setMsg("CSV vazio ou sem linhas.");

    const header = lines[0].toLowerCase();
    if (!header.includes("company") || !header.includes("name")) {
      setMsg("Cabeçalho inválido. Use: company_name,name,cpf,role");
      return;
    }

    const rows = lines.slice(1).map(l => l.split(",").map(x => x.trim()));
    const payload: any[] = [];

    for (const r of rows) {
      const [company_name, emp_name, emp_cpf, emp_role] = r;
      if (!company_name || !emp_name) continue;

      const found = companies.find(c => c.name.toLowerCase() === company_name.toLowerCase());
      if (!found) {
        setMsg(`Empresa não encontrada no app: ${company_name}`);
        return;
      }

      payload.push({
        company_id: found.id,
        name: emp_name,
        cpf: emp_cpf || null,
        role: emp_role || null,
      });
    }

    if (payload.length === 0) return setMsg("Nada para importar.");

    const ins = await supabase.from("employees").insert(payload);
    if (ins.error) return setMsg(ins.error.message);

    await loadAll();
    setMsg(`✅ Importados: ${payload.length}`);
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.h1}>Colaboradores</h1>

        <div style={styles.card}>
          <h2 style={styles.h2}>Cadastrar</h2>

          <form onSubmit={addOne} style={{ display: "grid", gap: 10 }}>
            <label style={styles.label}>
              <span style={styles.labelText}>Empresa *</span>
              <select style={styles.input} value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                <option value="">Selecione…</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>Nome *</span>
              <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: João da Silva" />
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>CPF</span>
              <input style={styles.input} value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>Função/Cargo</span>
              <input style={styles.input} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex: Eletricista" />
            </label>

            {msg && <div style={styles.msg}>{msg}</div>}

            <button style={styles.btn} type="submit">Salvar colaborador</button>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.rowBetween}>
            <h2 style={styles.h2}>Importar CSV</h2>
            <button style={styles.btnGhost} type="button" onClick={loadAll}>Atualizar</button>
          </div>

          <p style={styles.p}>
            CSV (vírgula) com cabeçalho: <b>company_name,name,cpf,role</b>
            <br />
            Obs: a empresa precisa existir antes (cadastre em /companies).
          </p>

          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => e.target.files?.[0] && importCSV(e.target.files[0])}
          />
        </div>

        <div style={styles.card}>
          <h2 style={styles.h2}>Lista</h2>
          {loading ? (
            <div style={styles.p}>Carregando…</div>
          ) : items.length === 0 ? (
            <div style={styles.p}>Nenhum colaborador cadastrado.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {items.map(emp => (
                <div key={emp.id} style={styles.item}>
                  <div>
                    <div style={styles.itemTitle}>{emp.name}</div>
                    <div style={styles.itemSub}>
                      {(companyMap.get(emp.company_id) || "Empresa?") +
                        (emp.role ? ` • ${emp.role}` : "") +
                        (emp.cpf ? ` • ${emp.cpf}` : "")}
                    </div>
                  </div>
                  <button style={styles.btnDanger} type="button" onClick={() => removeOne(emp.id)}>Excluir</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: 16, fontFamily: "Arial" },
  wrap: { maxWidth: 980, margin: "0 auto", display: "grid", gap: 14 },
  h1: { margin: "8px 0 0", fontSize: 26 },
  h2: { margin: 0, fontSize: 18 },
  p: { margin: 0, color: "#cfcfcf", lineHeight: 1.6, fontSize: 12 },
  card: { border: "1px solid #222", background: "#111", borderRadius: 12, padding: 14 },
  label: { display: "grid", gap: 6 },
  labelText: { fontSize: 12, color: "#d6d6d6" },
  input: { padding: "12px 12px", borderRadius: 10, border: "1px solid #222", background: "#0f0f0f", color: "#fff", outline: "none" },
  btn: { padding: "12px 14px", borderRadius: 10, border: "none", background: "#00c853", color: "#0b0b0b", fontWeight: 900, cursor: "pointer" },
  btnGhost: { padding: "10px 12px", borderRadius: 10, border: "1px solid #222", background: "transparent", color: "#cfcfcf", fontWeight: 800, cursor: "pointer" },
  btnDanger: { padding: "10px 12px", borderRadius: 10, border: "1px solid #3a1212", background: "#1a0b0b", color: "#ffb3b3", fontWeight: 900, cursor: "pointer" },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  item: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", border: "1px solid #222", background: "#0f0f0f", borderRadius: 12, padding: 12 },
  itemTitle: { fontWeight: 900, fontSize: 14 },
  itemSub: { color: "#bdbdbd", fontSize: 12, marginTop: 4, lineHeight: 1.4 },
  msg: { marginTop: 8, padding: 10, borderRadius: 10, border: "1px solid #222", background: "#0f0f0f", color: "#cfcfcf", fontWeight: 700 },
};