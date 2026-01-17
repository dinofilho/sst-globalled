// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
      if (!data.session) navigate("/auth");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) navigate("/auth");
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function sair() {
    await supabase.auth.signOut();
  }

  if (loading) return <div className="container">Carregando...</div>;

  return (
    <div className="container">
      <h1>Painel — SST GLOBALLED</h1>
      <small>Logado como: <b>{session?.user.email}</b></small>

      <button onClick={sair} style={{ marginTop: 16 }}>
        Sair
      </button>
    </div>
  );
}
