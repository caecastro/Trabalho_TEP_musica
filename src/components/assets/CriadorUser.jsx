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
  // ===== HOOKS E STATE =====
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // State local
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);

  // ===== CONSTANTES DERIVADAS =====
  const senhaOpcional = modoEdicao;
  const formularioValido = validarCamposObrigatorios();

  // ===== EFEITOS =====

  // Carregar dados do usuário no modo edição
  useEffect(() => {
    if (user) {
      setModoEdicao(true);
      carregarDadosUsuario();
    }
  }, [user]);

  // ===== FUNÇÕES AUXILIARES =====

  function validarCamposObrigatorios() {
    if (!nome.trim() || !email.trim()) return false;
    if (!modoEdicao && (!senha || !confirmarSenha)) return false;
    return true;
  }

  function carregarDadosUsuario() {
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

  // ===== VALIDAÇÕES =====

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarSenha = (senha) => {
    return senha.length >= 6;
  };

  const validarConfirmacaoSenha = (senha, confirmarSenha) => {
    return senha === confirmarSenha;
  };

  const verificarEmailExistente = (email, usuarioId = null) => {
    const usuariosExistentes = getFromLocalStorage("usuarios") || [];
    return usuariosExistentes.find(
      (u) => u.email === email && u.id !== usuarioId
    );
  };

  // ===== HANDLERS PRINCIPAIS =====

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    if (modoEdicao) {
      editarUsuario();
    } else {
      criarUsuario();
    }
  };

  const editarUsuario = () => {
    // Validações
    if (!validarCamposBasicos()) return;
    if (senha && !validarCamposSenha()) return;
    if (!validarEmail(email)) {
      setErro("Email inválido!");
      return;
    }

    const usuarioExistente = verificarEmailExistente(email, user.id);
    if (usuarioExistente) {
      setErro("Já existe um usuário com este email!");
      return;
    }

    // Atualizar usuário
    const usuarioAtualizado = atualizarUsuarioNoStorage();
    dispatch(setCurrentUser(usuarioAtualizado));

    navigate("/home");
  };

  const criarUsuario = () => {
    // Validações
    if (!validarCamposBasicos() || !validarCamposSenha()) return;
    if (!validarEmail(email)) {
      setErro("Email inválido!");
      return;
    }

    const usuarioExistente = verificarEmailExistente(email);
    if (usuarioExistente) {
      setErro("Já existe um usuário com este email!");
      return;
    }

    // Criar novo usuário
    criarUsuarioNoStorage();
    limparFormulario();
    navigate("/");
  };

  const validarCamposBasicos = () => {
    if (!nome.trim() || !email.trim()) {
      setErro("Nome e email são obrigatórios!");
      return false;
    }
    return true;
  };

  const validarCamposSenha = () => {
    if (senha && !validarSenha(senha)) {
      setErro("A senha deve ter pelo menos 6 caracteres!");
      return false;
    }

    if (senha && !validarConfirmacaoSenha(senha, confirmarSenha)) {
      setErro("As senhas não coincidem!");
      return false;
    }

    if (!modoEdicao && (!senha || !confirmarSenha)) {
      setErro("Todos os campos são obrigatórios!");
      return false;
    }

    return true;
  };

  // ===== OPERAÇÕES NO STORAGE =====

  const atualizarUsuarioNoStorage = () => {
    const usuariosExistentes = getFromLocalStorage("usuarios") || [];

    const usuariosAtualizados = usuariosExistentes.map((usuario) =>
      usuario.id === user.id
        ? {
            ...usuario,
            nome,
            email,
            ...(senha && { senha }), // Atualiza senha apenas se foi informada
            dataAtualizacao: new Date().toISOString(),
          }
        : usuario
    );

    saveToLocalStorage("usuarios", usuariosAtualizados);

    return {
      ...user,
      nome,
      email,
    };
  };

  const criarUsuarioNoStorage = () => {
    const usuariosExistentes = getFromLocalStorage("usuarios") || [];

    const novoUsuario = {
      id: Date.now().toString(),
      nome,
      email,
      senha,
      dataCriacao: new Date().toISOString(),
    };

    const novosUsuarios = [...usuariosExistentes, novoUsuario];
    saveToLocalStorage("usuarios", novosUsuarios);

    return novoUsuario;
  };

  const limparFormulario = () => {
    setNome("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
  };

  // ===== RENDER =====

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 relative">
      {/* Navegação */}
      <button
        onClick={() => navigate(modoEdicao ? "/home" : "/")}
        className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
      >
        <FaArrowLeft />
        <span>Voltar</span>
      </button>

      {/* Header */}
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

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg space-y-6"
      >
        {/* Mensagem de Erro */}
        {erro && (
          <div className="p-3 bg-red-600 text-white rounded-md text-center">
            {erro}
          </div>
        )}

        {/* Campo Nome */}
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

        {/* Campo Email */}
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

        {/* Campo Senha */}
        <div>
          <label className="block mb-2 text-gray-300">
            {modoEdicao ? "Nova Senha " : "Senha "}
            {senhaOpcional && (
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
            required={!senhaOpcional}
          />
        </div>

        {/* Campo Confirmar Senha */}
        <div>
          <label className="block mb-2 text-gray-300">
            {modoEdicao ? "Confirmar Nova Senha " : "Confirmar Senha "}
            {senhaOpcional && (
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
            required={!senhaOpcional}
          />
        </div>

        {/* Botão de Ação */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-colors"
        >
          {modoEdicao ? "Atualizar Perfil" : "Criar Usuário"}
        </button>
      </form>

      {/* Informações Adicionais */}
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
