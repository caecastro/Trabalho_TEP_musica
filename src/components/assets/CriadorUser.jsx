import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "../../utils/localStorage";
import { setCurrentUser } from "../../store/slices/authSlice";

function CriadorUser() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Verificar se está no modo edição (usuário logado)
  useEffect(() => {
    if (user) {
      setModoEdicao(true);
      // Buscar dados completos do usuário
      const usuarios = getFromLocalStorage("usuarios") || [];
      const usuarioCompleto = usuarios.find((u) => u.id === user.id);

      if (usuarioCompleto) {
        setNome(usuarioCompleto.nome || user.nome || "");
        setEmail(usuarioCompleto.email || user.email || "");
      } else {
        // Fallback para dados do Redux
        setNome(user.nome || "");
        setEmail(user.email || "");
      }
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    if (modoEdicao) {
      // MODO EDIÇÃO - Atualizar usuário existente
      if (!nome || !email) {
        setErro("Nome e email são obrigatórios!");
        return;
      }

      if (senha && senha.length < 6) {
        setErro("A senha deve ter pelo menos 6 caracteres!");
        return;
      }

      if (senha && senha !== confirmarSenha) {
        setErro("As senhas não coincidem!");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErro("Email inválido!");
        return;
      }

      // Buscar usuários existentes
      const usuariosExistentes = getFromLocalStorage("usuarios") || [];

      // Verificar se email já existe (excluindo o usuário atual)
      const usuarioExistente = usuariosExistentes.find(
        (u) => u.email === email && u.id !== user.id
      );

      if (usuarioExistente) {
        setErro("Já existe um usuário com este email!");
        return;
      }

      // Atualizar usuário
      const usuariosAtualizados = usuariosExistentes.map((usuario) => {
        if (usuario.id === user.id) {
          return {
            ...usuario,
            nome,
            email,
            ...(senha && { senha }), // Atualiza senha apenas se foi informada
            dataAtualizacao: new Date().toISOString(),
          };
        }
        return usuario;
      });

      // Salvar no localStorage
      saveToLocalStorage("usuarios", usuariosAtualizados);

      // Atualizar no Redux
      const usuarioAtualizado = {
        ...user,
        nome,
        email,
      };
      dispatch(setCurrentUser(usuarioAtualizado));

      console.log("Usuário atualizado:", usuarioAtualizado);

      // Redirecionar para home SEM MENSAGEM
      navigate("/home");
    } else {
      // MODO CRIAÇÃO - Criar novo usuário
      if (!nome || !email || !senha || !confirmarSenha) {
        setErro("Todos os campos são obrigatórios!");
        return;
      }

      if (senha !== confirmarSenha) {
        setErro("As senhas não coincidem!");
        return;
      }

      if (senha.length < 6) {
        setErro("A senha deve ter pelo menos 6 caracteres!");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErro("Email inválido!");
        return;
      }

      // Verificar se usuário já existe
      const usuariosExistentes = getFromLocalStorage("usuarios") || [];
      const usuarioExistente = usuariosExistentes.find(
        (user) => user.email === email
      );

      if (usuarioExistente) {
        setErro("Já existe um usuário com este email!");
        return;
      }

      // Criar novo usuário
      const novoUsuario = {
        id: Date.now().toString(),
        nome,
        email,
        senha,
        dataCriacao: new Date().toISOString(),
      };

      // Salvar no localStorage
      const novosUsuarios = [...usuariosExistentes, novoUsuario];
      saveToLocalStorage("usuarios", novosUsuarios);

      console.log("Novo usuário criado:", novoUsuario);

      // Limpar formulário e redirecionar SEM MENSAGEM
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 relative">
      {/* Botão de voltar */}
      <button
        onClick={() => navigate(modoEdicao ? "/home" : "/")}
        className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
      >
        <FaArrowLeft />
        <span>Voltar</span>
      </button>

      <header className="flex items-center gap-4 mt-8 mb-8">
        <img
          src="/src/assets/react.svg"
          alt="React logo"
          className="h-12 w-12"
        />
        <h1 className="text-3xl font-semibold text-blue-500">
          {modoEdicao ? "Editar Perfil" : "Criar Usuário"}
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg space-y-6"
      >
        {erro && (
          <div className="p-3 bg-red-600 text-white rounded-md text-center">
            {erro}
          </div>
        )}

        {/* Nome */}
        <div>
          <label className="block mb-2 text-gray-300">Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome completo..."
            className="w-full px-4 py-3 rounded bg-gray-700 text-white outline-none border border-gray-600 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email..."
            className="w-full px-4 py-3 rounded bg-gray-700 text-white outline-none border border-gray-600 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block mb-2 text-gray-300">
            {modoEdicao ? "Nova Senha " : "Senha "}
            {modoEdicao && (
              <span className="text-gray-500 text-sm">(opcional)</span>
            )}
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder={
              modoEdicao
                ? "Deixe em branco para manter a senha atual..."
                : "Digite sua senha (mínimo 6 caracteres)..."
            }
            className="w-full px-4 py-3 rounded bg-gray-700 text-white outline-none border border-gray-600 focus:border-blue-500 transition-colors"
            required={!modoEdicao}
          />
        </div>

        {/* Confirmar senha */}
        <div>
          <label className="block mb-2 text-gray-300">
            {modoEdicao ? "Confirmar Nova Senha " : "Confirmar Senha "}
            {modoEdicao && (
              <span className="text-gray-500 text-sm">(opcional)</span>
            )}
          </label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder={
              modoEdicao ? "Confirme a nova senha..." : "Confirme sua senha..."
            }
            className="w-full px-4 py-3 rounded bg-gray-700 text-white outline-none border border-gray-600 focus:border-blue-500 transition-colors"
            required={!modoEdicao}
          />
        </div>

        {/* Botão de criar/atualizar */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-colors"
        >
          {modoEdicao ? "Atualizar Perfil" : "Criar Usuário"}
        </button>
      </form>

      {/* Informações adicionais */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg max-w-lg w-full">
        <h3 className="text-blue-400 mb-2">Informações:</h3>
        <p className="text-gray-400 text-sm">
          {modoEdicao ? (
            <>
              • Você está editando seu perfil
              <br />
              • Email deve ser único
              <br />
              • Deixe a senha em branco para manter a atual
              <br />• Senha mínima: 6 caracteres
            </>
          ) : (
            <>
              • O usuário será salvo no localStorage
              <br />
              • Email deve ser único
              <br />• Senha mínima: 6 caracteres
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default CriadorUser;
