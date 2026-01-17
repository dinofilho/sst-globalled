// src/pages/Auth.tsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      setMsg({ type: "err", text: error.message });
      return;
    }

    setMsg({ type: "ok", text: "Login OK! Indo para o painel..." });
    setTimeout(() => navigate("/dashboard"), 600);
  }

  return (
    <div className="container">
      <h1>Login — SST GLOBALLED</h1>

      <form onSubmit={entrar}>
        <label>E-mail</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

        <label>Senha</label>
        <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" required />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {msg && <div className={msg.type}>{msg.text}</div>}

        <small>
          Ainda não tem usuário? (a gente cria depois, se você quiser)
        </small>
      </form>
    </div>
  );
}
