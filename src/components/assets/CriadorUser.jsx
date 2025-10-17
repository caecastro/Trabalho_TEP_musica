import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function CriadorUser() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    console.log("Novo usuário criado:", { nome, email, senha });
    alert("Usuário criado com sucesso (simulação)!");
    navigate("/"); // retorna à tela inicial após o cadastro
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 relative">
      {/* Botão de voltar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-blue-400"
      >
        <FaArrowLeft />
        <span>Voltar</span>
      </button>

      <h1 className="text-3xl font-bold mb-6">Criar Novo Usuário</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg space-y-4"
      >
        {/* Nome */}
        <div>
          <label className="block mb-2">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome..."
            className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email..."
            className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
            required
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block mb-2">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha..."
            className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
            required
          />
        </div>

        {/* Confirmar senha */}
        <div>
          <label className="block mb-2">Confirmar Senha</label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Confirme sua senha..."
            className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
            required
          />
        </div>

        {/* Botão de criar */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-800 rounded-lg font-semibold"
        >
          Criar Usuário
        </button>
      </form>
    </div>
  );
}

export default CriadorUser;
