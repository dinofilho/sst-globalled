import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname || "";
    const normalized = pathname.normalize('NFC').toLowerCase();

    // Forçar domínio público acessível quando estiver em pré-visualização
    const host = window.location.hostname;
    if (host.startsWith("id-preview--") && host.endsWith(".lovable.app")) {
      const targetHost = host.replace("id-preview--", "").replace(".lovable.app", ".lovableproject.com");
      const newUrl = `${window.location.protocol}//${targetHost}${window.location.pathname}${window.location.search}`;
      window.location.replace(newUrl);
      return;
    }

    // Redireciona automaticamente variações/erros de digitação de "avaliação"
    if (normalized.startsWith("/avalia")) {
      // preserva parâmetros, ex: ?nr=NR-20
      window.location.replace(`/avaliacoes${location.search || ""}`);
      return;
    }

    // Redireciona padrões como /nr-12 ou /nr12 para a rota pública
    const nrMatch = normalized.match(/^\/nr[-\s]?(\d+)$/i);
    if (nrMatch) {
      window.location.replace(`/avaliacoes?nr=NR-${nrMatch[1]}`);
      return;
    }

    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname, location.search]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
