import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import User_login from "./components/views/User_login";

function Tela_inicial() {
  // ===== REDUX STATE =====
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ===== EFEITOS =====

  // Redirecionar se estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  // ===== RENDER CONDICIONAL =====

  // Não renderizar nada se estiver autenticado (será redirecionado)
  if (isAuthenticated) {
    return null;
  }

  // ===== RENDER =====
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center gap-4 mt-8">
        <img
          src="/src/assets/react.svg"
          alt="React Music Logo"
          className="h-12 w-12"
        />
        <h1 className="text-3xl font-semibold text-blue-500">React Music</h1>
      </header>

      {/* Separador Visual */}
      <div className="w-full max-w-xl h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8" />

      {/* Conteúdo Principal */}
      <main className="flex flex-col items-center w-full gap-4">
        {/* Componente de Login */}
        <User_login />

        {/* Botão de Criação de Usuário */}
        <button
          onClick={() => navigate("/register")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Criar novo usuário
        </button>
      </main>
    </div>
  );
}

export default Tela_inicial;
