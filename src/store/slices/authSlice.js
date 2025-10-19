import { createSlice } from "@reduxjs/toolkit";
import {
  saveToSessionStorage,
  getFromSessionStorage,
  removeFromSessionStorage,
} from "../../utils/sessionStorage";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../utils/localStorage";

const initialState = {
  user: getFromSessionStorage("user") || null,
  isAuthenticated: !!getFromSessionStorage("user"),
  loading: false,
  error: null,
  lastPlaylist: getFromSessionStorage("lastPlaylist") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      saveToSessionStorage("user", action.payload);
      saveToSessionStorage("lastLogin", new Date().toISOString());
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.lastPlaylist = null;
      removeFromSessionStorage("user");
      removeFromSessionStorage("lastPlaylist");
      removeFromSessionStorage("lastLogin");

      // NOVO: Remover marcação de usuário logado no localStorage
      const usuarios = getFromLocalStorage("usuarios") || [];
      const usuariosAtualizados = usuarios.map((usuario) => ({
        ...usuario,
        logado: false,
      }));
      saveToLocalStorage("usuarios", usuariosAtualizados);
    },
    setLastPlaylist: (state, action) => {
      state.lastPlaylist = action.payload;
      saveToSessionStorage("lastPlaylist", action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveToSessionStorage("user", action.payload);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setLastPlaylist,
  clearError,
  setCurrentUser,
} = authSlice.actions;

// Thunk para login - ATUALIZADO
export const login = (credentials) => (dispatch) => {
  const { email, password } = credentials;
  dispatch(loginStart());

  // Validação do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    dispatch(loginFailure("Email inválido"));
    return;
  }

  // Validação da senha
  if (password.length < 6) {
    dispatch(loginFailure("Senha deve ter pelo menos 6 caracteres"));
    return;
  }

  // Buscar usuários no localStorage
  const usuarios = getFromLocalStorage("usuarios") || [];

  // Verificar se existe usuário com este email
  const usuarioEncontrado = usuarios.find((user) => user.email === email);

  if (usuarioEncontrado) {
    // Verificar senha
    if (usuarioEncontrado.senha === password) {
      const user = {
        id: usuarioEncontrado.id,
        email: usuarioEncontrado.email,
        nome: usuarioEncontrado.nome,
        lastLogin: new Date().toISOString(),
      };

      // NOVO: Marcar este usuário como logado no localStorage
      const usuariosAtualizados = usuarios.map((usuario) => ({
        ...usuario,
        logado: usuario.id === usuarioEncontrado.id, // marca apenas este usuário como logado
      }));
      saveToLocalStorage("usuarios", usuariosAtualizados);

      dispatch(loginSuccess(user));
    } else {
      dispatch(loginFailure("Senha incorreta"));
    }
  } else {
    // Se não encontrar, criar novo usuário automaticamente
    const novoUsuario = {
      id: Date.now().toString(),
      email: email,
      nome: email.split("@")[0], // Usa parte do email como nome
      senha: password,
      createdAt: new Date().toISOString(),
      logado: true, // NOVO: Já marca como logado
    };

    // Adicionar novo usuário ao array e marcar todos os outros como não logados
    const usuariosAtualizados = usuarios.map((usuario) => ({
      ...usuario,
      logado: false,
    }));
    usuariosAtualizados.push(novoUsuario);

    saveToLocalStorage("usuarios", usuariosAtualizados);

    const user = {
      id: novoUsuario.id,
      email: novoUsuario.email,
      nome: novoUsuario.nome,
      lastLogin: new Date().toISOString(),
    };

    dispatch(loginSuccess(user));
    console.log("Novo usuário criado automaticamente:", novoUsuario);
  }
};

// Thunk para registro de usuário (opcional) - ATUALIZADO
export const registerUser = (userData) => (dispatch) => {
  const { email, password, nome } = userData;

  // Validação do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    dispatch(loginFailure("Email inválido"));
    return;
  }

  // Validação da senha
  if (password.length < 6) {
    dispatch(loginFailure("Senha deve ter pelo menos 6 caracteres"));
    return;
  }

  // Buscar usuários existentes
  const usuarios = getFromLocalStorage("usuarios") || [];

  // Verificar se email já existe
  const usuarioExistente = usuarios.find((user) => user.email === email);
  if (usuarioExistente) {
    dispatch(loginFailure("Email já cadastrado"));
    return;
  }

  // Criar novo usuário
  const novoUsuario = {
    id: Date.now().toString(),
    email: email,
    nome: nome || email.split("@")[0],
    senha: password,
    createdAt: new Date().toISOString(),
    logado: true, // NOVO: Marca como logado
  };

  // NOVO: Salvar no localStorage marcando todos os outros como não logados
  const usuariosAtualizados = usuarios.map((usuario) => ({
    ...usuario,
    logado: false,
  }));
  usuariosAtualizados.push(novoUsuario);
  saveToLocalStorage("usuarios", usuariosAtualizados);

  const user = {
    id: novoUsuario.id,
    email: novoUsuario.email,
    nome: novoUsuario.nome,
    lastLogin: new Date().toISOString(),
  };

  dispatch(loginSuccess(user));
};

export default authSlice.reducer;
