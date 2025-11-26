// src/store/slices/playlistsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "../../utils/localStorage";

// ===== CONSTANTES =====
const DEFAULT_PLAYLIST = {
  id: "default_top_10",
  nome: "Top 10 da Semana",
  usuarioId: "system",
  musicas: [],
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ===== GERENCIADOR DO LOCALSTORAGE =====
const PlaylistManager = {
  getPlaylists: () => {
    const playlists = getFromLocalStorage("playlists");
    if (!playlists || !Array.isArray(playlists)) {
      return [DEFAULT_PLAYLIST];
    }

    // Garantir que a playlist padrão existe
    const hasDefault = playlists.some((p) => p.id === "default_top_10");
    if (!hasDefault) {
      playlists.unshift(DEFAULT_PLAYLIST);
      saveToLocalStorage("playlists", playlists);
    }

    return playlists;
  },

  getCurrentPlaylist: () => {
    const current = getFromLocalStorage("currentPlaylist");
    return current || DEFAULT_PLAYLIST;
  },

  savePlaylists: (playlists) => {
    saveToLocalStorage("playlists", playlists);
  },

  saveCurrentPlaylist: (playlist) => {
    saveToLocalStorage("currentPlaylist", playlist);
  },

  generateId: () => {
    return `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  validatePlaylist: (playlist) => {
    if (!playlist.nome || !playlist.nome.trim()) {
      throw new Error("Nome da playlist é obrigatório");
    }
    if (!playlist.musicas || !Array.isArray(playlist.musicas)) {
      throw new Error("Playlist deve ter um array de músicas");
    }
    return true;
  },
};

// ===== INITIAL STATE =====
const initialState = {
  playlists: PlaylistManager.getPlaylists(),
  currentPlaylist: PlaylistManager.getCurrentPlaylist(),
  loading: false,
  error: null,
};

// ===== SLICE =====
const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    // CREATE
    createPlaylistStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPlaylistSuccess: (state, action) => {
      state.loading = false;
      try {
        PlaylistManager.validatePlaylist(action.payload);

        const newPlaylist = {
          ...action.payload,
          id: PlaylistManager.generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        state.playlists.push(newPlaylist);
        PlaylistManager.savePlaylists(state.playlists);
      } catch (error) {
        state.error = error.message;
      }
    },
    createPlaylistFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // READ
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
      PlaylistManager.saveCurrentPlaylist(action.payload);
    },

    // UPDATE
    updatePlaylistStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePlaylistSuccess: (state, action) => {
      state.loading = false;
      try {
        PlaylistManager.validatePlaylist(action.payload);

        const index = state.playlists.findIndex(
          (p) => p.id === action.payload.id
        );

        if (index === -1) {
          throw new Error("Playlist não encontrada");
        }

        state.playlists[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };

        PlaylistManager.savePlaylists(state.playlists);

        // Atualizar currentPlaylist se for a mesma
        if (state.currentPlaylist?.id === action.payload.id) {
          state.currentPlaylist = state.playlists[index];
          PlaylistManager.saveCurrentPlaylist(state.playlists[index]);
        }
      } catch (error) {
        state.error = error.message;
      }
    },
    updatePlaylistFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // DELETE
    deletePlaylistStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deletePlaylistSuccess: (state, action) => {
      state.loading = false;
      const deletedPlaylistId = action.payload;

      // Não permitir deletar playlist padrão
      if (deletedPlaylistId === "default_top_10") {
        state.error = "Não é possível deletar a playlist padrão";
        return;
      }

      // Remover playlist
      state.playlists = state.playlists.filter(
        (p) => p.id !== deletedPlaylistId
      );
      PlaylistManager.savePlaylists(state.playlists);

      // Se era a playlist atual, voltar para padrão
      if (state.currentPlaylist?.id === deletedPlaylistId) {
        const defaultPlaylist =
          state.playlists.find((p) => p.id === "default_top_10") ||
          DEFAULT_PLAYLIST;
        state.currentPlaylist = defaultPlaylist;
        PlaylistManager.saveCurrentPlaylist(defaultPlaylist);
      }
    },
    deletePlaylistFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // MÚSICAS NAS PLAYLISTS
    addMusicToPlaylist: (state, action) => {
      const { playlistId, music } = action.payload;

      if (!playlistId || !music) {
        state.error = "Playlist ID e música são obrigatórios";
        return;
      }

      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.isDefault) {
        const musicExists = playlist.musicas.some((m) => m.id === music.id);
        if (!musicExists) {
          const newMusic = {
            ...music,
            id: music.id || PlaylistManager.generateId(),
            addedAt: new Date().toISOString(),
          };
          playlist.musicas.push(newMusic);
          playlist.updatedAt = new Date().toISOString();
          PlaylistManager.savePlaylists(state.playlists);

          if (state.currentPlaylist?.id === playlistId) {
            state.currentPlaylist = playlist;
            PlaylistManager.saveCurrentPlaylist(playlist);
          }
        }
      }
    },

    removeMusicFromPlaylist: (state, action) => {
      const { playlistId, musicId } = action.payload;

      if (!playlistId || !musicId) {
        state.error = "Playlist ID e Music ID são obrigatórios";
        return;
      }

      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.isDefault) {
        playlist.musicas = playlist.musicas.filter((m) => m.id !== musicId);
        playlist.updatedAt = new Date().toISOString();
        PlaylistManager.savePlaylists(state.playlists);

        if (state.currentPlaylist?.id === playlistId) {
          state.currentPlaylist = playlist;
          PlaylistManager.saveCurrentPlaylist(playlist);
        }
      }
    },

    // CLEAR
    clearError: (state) => {
      state.error = null;
    },

    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = DEFAULT_PLAYLIST;
      PlaylistManager.saveCurrentPlaylist(DEFAULT_PLAYLIST);
    },

    // POPULAR PLAYLIST PADRÃO
    populateDefaultPlaylist: (state, action) => {
      const defaultPlaylistIndex = state.playlists.findIndex(
        (p) => p.id === "default_top_10"
      );

      if (defaultPlaylistIndex !== -1) {
        state.playlists[defaultPlaylistIndex].musicas = action.payload;
        state.playlists[defaultPlaylistIndex].updatedAt =
          new Date().toISOString();

        if (state.currentPlaylist?.id === "default_top_10") {
          state.currentPlaylist = state.playlists[defaultPlaylistIndex];
          PlaylistManager.saveCurrentPlaylist(state.currentPlaylist);
        }
      } else {
        // Criar playlist padrão se não existe
        const newDefaultPlaylist = {
          ...DEFAULT_PLAYLIST,
          musicas: action.payload,
        };
        state.playlists.unshift(newDefaultPlaylist);

        if (!state.currentPlaylist) {
          state.currentPlaylist = newDefaultPlaylist;
          PlaylistManager.saveCurrentPlaylist(newDefaultPlaylist);
        }
      }

      PlaylistManager.savePlaylists(state.playlists);
    },

    // RESET
    resetPlaylists: (state) => {
      state.playlists = [DEFAULT_PLAYLIST];
      state.currentPlaylist = DEFAULT_PLAYLIST;
      state.loading = false;
      state.error = null;
      PlaylistManager.savePlaylists(state.playlists);
      PlaylistManager.saveCurrentPlaylist(DEFAULT_PLAYLIST);
    },
  },
});

// ===== THUNKS =====
export const createPlaylist = (playlistData) => (dispatch, getState) => {
  dispatch(playlistSlice.actions.createPlaylistStart());

  try {
    const { auth } = getState();
    const playlistWithUser = {
      ...playlistData,
      usuarioId: auth.user?.id || "anonymous",
      musicas: playlistData.musicas || [],
      isDefault: false,
    };
    dispatch(playlistSlice.actions.createPlaylistSuccess(playlistWithUser));
  } catch (error) {
    dispatch(playlistSlice.actions.createPlaylistFailure(error.message));
  }
};

export const updatePlaylist = (playlistData) => (dispatch) => {
  dispatch(playlistSlice.actions.updatePlaylistStart());

  try {
    dispatch(playlistSlice.actions.updatePlaylistSuccess(playlistData));
  } catch (error) {
    dispatch(playlistSlice.actions.updatePlaylistFailure(error.message));
  }
};

export const deletePlaylist = (playlistId) => (dispatch) => {
  dispatch(playlistSlice.actions.deletePlaylistStart());

  try {
    dispatch(playlistSlice.actions.deletePlaylistSuccess(playlistId));
  } catch (error) {
    dispatch(playlistSlice.actions.deletePlaylistFailure(error.message));
  }
};

// ===== EXPORTS =====
export const {
  createPlaylistStart,
  createPlaylistSuccess,
  createPlaylistFailure,
  setCurrentPlaylist,
  updatePlaylistStart,
  updatePlaylistSuccess,
  updatePlaylistFailure,
  deletePlaylistStart,
  deletePlaylistSuccess,
  deletePlaylistFailure,
  addMusicToPlaylist,
  removeMusicFromPlaylist,
  clearError,
  clearCurrentPlaylist,
  populateDefaultPlaylist,
  resetPlaylists,
} = playlistSlice.actions;

export default playlistSlice.reducer;
