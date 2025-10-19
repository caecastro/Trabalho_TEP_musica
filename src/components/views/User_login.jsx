import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/slices/authSlice";

function User_login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispara a ação de login do Redux
    const result = await dispatch(login({ email, password }));

    // Se o login for bem-sucedido, redireciona para /home
    if (result.type === "auth/loginSuccess") {
      navigate("/home");
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Login
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" // ← Adicione text-black aqui
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" // ← Adicione text-black aqui
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-md transition-colors"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Informações de login para teste */}
      <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-600">
        <p className="font-semibold">Credenciais para teste:</p>
        <p>Email: usuario@example.com</p>
        <p>Senha: senha123</p>
      </div>
    </div>
  );
}

export default User_login;
