export default function Auth() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Página de Login</h1>
        <p>Entre para acessar o SST GLOBALLED</p>

        <form className="auth-form">
          <label>
            E-mail
            <input type="email" placeholder="seuemail@empresa.com" />
          </label>

          <label>
            Senha
            <input type="password" placeholder="********" />
          </label>

          <button type="button">Entrar</button>
        </form>

        <small className="auth-footer">
          Em breve: login real com Supabase.
        </small>
      </div>
    </div>
  );
}
