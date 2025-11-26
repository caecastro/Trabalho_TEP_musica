// src/store/slices/authSlice.js
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

// ===== INITIAL STATE =====
const initialState = {
  user: getFromSessionStorage("user") || null,
  isAuthenticated: !!getFromSessionStorage("user"),
  loading: false,
  error: null,
  lastPlaylist: getFromSessionStorage("lastPlaylist") || null,
};

// ===== VALIDAÇÕES =====
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const findUserByEmail = (email, usuarios) => {
  return usuarios.find((user) => user.email === email);
};

// ===== SLICE =====
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

      // Limpar session storage
      removeFromSessionStorage("user");
      removeFromSessionStorage("lastPlaylist");
      removeFromSessionStorage("lastLogin");

      // Marcar todos os usuários como não logados no localStorage
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

    resetPlaylistOnLogin: (state) => {
      state.lastPlaylist = null;
      removeFromSessionStorage("lastPlaylist");
    },
  },
});

// ===== THUNKS =====
export const login = (credentials) => (dispatch) => {
  const { email, password } = credentials;
  dispatch(authSlice.actions.loginStart());

  // Validações
  if (!validateEmail(email)) {
    dispatch(authSlice.actions.loginFailure("Email inválido"));
    return;
  }

  if (!validatePassword(password)) {
    dispatch(
      authSlice.actions.loginFailure("Senha deve ter pelo menos 6 caracteres")
    );
    return;
  }

  const usuarios = getFromLocalStorage("usuarios") || [];
  const usuarioEncontrado = findUserByEmail(email, usuarios);

  if (usuarioEncontrado) {
    // Login existente
    if (usuarioEncontrado.senha === password) {
      const user = {
        id: usuarioEncontrado.id,
        email: usuarioEncontrado.email,
        nome: usuarioEncontrado.nome,
        lastLogin: new Date().toISOString(),
      };

      // Atualizar estado de login no localStorage
      const usuariosAtualizados = usuarios.map((usuario) => ({
        ...usuario,
        logado: usuario.id === usuarioEncontrado.id,
      }));
      saveToLocalStorage("usuarios", usuariosAtualizados);

      dispatch(authSlice.actions.resetPlaylistOnLogin());
      dispatch(authSlice.actions.loginSuccess(user));
    } else {
      dispatch(authSlice.actions.loginFailure("Senha incorreta"));
    }
  } else {
    // Criar novo usuário
    const novoUsuario = {
      id: Date.now().toString(),
      email,
      nome: email.split("@")[0],
      senha: password,
      createdAt: new Date().toISOString(),
      logado: true,
    };

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

    dispatch(authSlice.actions.resetPlaylistOnLogin());
    dispatch(authSlice.actions.loginSuccess(user));
  }
};

export const registerUser = (userData) => (dispatch) => {
  const { email, password, nome } = userData;

  if (!validateEmail(email)) {
    dispatch(authSlice.actions.loginFailure("Email inválido"));
    return;
  }

  if (!validatePassword(password)) {
    dispatch(
      authSlice.actions.loginFailure("Senha deve ter pelo menos 6 caracteres")
    );
    return;
  }

  const usuarios = getFromLocalStorage("usuarios") || [];

  if (findUserByEmail(email, usuarios)) {
    dispatch(authSlice.actions.loginFailure("Email já cadastrado"));
    return;
  }

  const novoUsuario = {
    id: Date.now().toString(),
    email,
    nome: nome || email.split("@")[0],
    senha: password,
    createdAt: new Date().toISOString(),
    logado: true,
  };

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

  dispatch(authSlice.actions.resetPlaylistOnLogin());
  dispatch(authSlice.actions.loginSuccess(user));
};

// ===== EXPORTS =====
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setLastPlaylist,
  clearError,
  setCurrentUser,
  resetPlaylistOnLogin,
} = authSlice.actions;

export default authSlice.reducer;
