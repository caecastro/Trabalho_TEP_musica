// src/store/slices/playlistsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "../../utils/localStorage";

// Playlist padrão "Top 10 da Semana"
const DEFAULT_PLAYLIST = {
  id: "default_top_10",
  nome: "Top 10 da Semana",
  usuarioId: "system",
  musicas: [],
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Funções auxiliares para gerenciamento do localStorage
const PlaylistManager = {
  // Buscar todas as playlists
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

  // Buscar playlist atual
  getCurrentPlaylist: () => {
    const current = getFromLocalStorage("currentPlaylist");
    return current || DEFAULT_PLAYLIST;
  },

  // Salvar playlists
  savePlaylists: (playlists) => {
    saveToLocalStorage("playlists", playlists);
  },

  // Salvar playlist atual
  saveCurrentPlaylist: (playlist) => {
    saveToLocalStorage("currentPlaylist", playlist);
  },

  // Gerar ID único para nova playlist
  generateId: () => {
    return `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Validar dados da playlist
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

const initialState = {
  playlists: PlaylistManager.getPlaylists(),
  currentPlaylist: PlaylistManager.getCurrentPlaylist(),
  loading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    // Create
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

    // Read
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
      PlaylistManager.saveCurrentPlaylist(action.payload);
    },

    // Update
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
        if (
          state.currentPlaylist &&
          state.currentPlaylist.id === action.payload.id
        ) {
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

    // Delete
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

      // Remover a playlist
      state.playlists = state.playlists.filter(
        (p) => p.id !== deletedPlaylistId
      );
      PlaylistManager.savePlaylists(state.playlists);

      // Se a playlist deletada era a atual, voltar para a padrão
      if (
        state.currentPlaylist &&
        state.currentPlaylist.id === deletedPlaylistId
      ) {
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

    // Musicas nas playlists
    addMusicToPlaylist: (state, action) => {
      const { playlistId, music } = action.payload;

      if (!playlistId || !music) {
        state.error = "Playlist ID e música são obrigatórios";
        return;
      }

      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.isDefault) {
        // Verificar se a música já existe na playlist
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

          if (
            state.currentPlaylist &&
            state.currentPlaylist.id === playlistId
          ) {
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

        if (state.currentPlaylist && state.currentPlaylist.id === playlistId) {
          state.currentPlaylist = playlist;
          PlaylistManager.saveCurrentPlaylist(playlist);
        }
      }
    },

    // Clear
    clearError: (state) => {
      state.error = null;
    },

    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = DEFAULT_PLAYLIST;
      PlaylistManager.saveCurrentPlaylist(DEFAULT_PLAYLIST);
    },

    // Popular playlist padrão com músicas populares
    populateDefaultPlaylist: (state, action) => {
      const defaultPlaylistIndex = state.playlists.findIndex(
        (p) => p.id === "default_top_10"
      );

      if (defaultPlaylistIndex !== -1) {
        state.playlists[defaultPlaylistIndex].musicas = action.payload;
        state.playlists[defaultPlaylistIndex].updatedAt =
          new Date().toISOString();

        if (
          state.currentPlaylist &&
          state.currentPlaylist.id === "default_top_10"
        ) {
          state.currentPlaylist = state.playlists[defaultPlaylistIndex];
          PlaylistManager.saveCurrentPlaylist(state.currentPlaylist);
        }
      } else {
        // Se não existe, criar a playlist padrão
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

    // Reset para estado inicial (útil para desenvolvimento)
    resetPlaylists: (state) => {
      state.playlists = [DEFAULT_PLAYLIST];
      state.currentPlaylist = DEFAULT_PLAYLIST;
      state.loading = false;
      state.error = null;
      PlaylistManager.savePlaylists(state.playlists);
      PlaylistManager.saveCurrentPlaylist(DEFAULT_PLAYLIST);
    },

    // Export/Import playlists
    exportPlaylists: (state) => {
      const data = {
        playlists: state.playlists,
        currentPlaylist: state.currentPlaylist,
        exportedAt: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    },

    importPlaylists: (state, action) => {
      try {
        const data = JSON.parse(action.payload);
        if (data.playlists && Array.isArray(data.playlists)) {
          state.playlists = data.playlists;
          state.currentPlaylist = data.currentPlaylist || DEFAULT_PLAYLIST;
          PlaylistManager.savePlaylists(state.playlists);
          PlaylistManager.saveCurrentPlaylist(state.currentPlaylist);
        } else {
          throw new Error("Dados de importação inválidos");
        }
      } catch (error) {
        state.error = `Erro na importação: ${error.message}`;
      }
    },
  },
});

// Thunks melhorados
export const createPlaylist = (playlistData) => (dispatch, getState) => {
  dispatch(createPlaylistStart());
  try {
    const { auth } = getState();
    const playlistWithUser = {
      ...playlistData,
      usuarioId: auth.user?.id || "anonymous",
      musicas: playlistData.musicas || [],
      isDefault: false,
    };
    dispatch(createPlaylistSuccess(playlistWithUser));
  } catch (error) {
    dispatch(createPlaylistFailure(error.message));
  }
};

export const updatePlaylist = (playlistData) => (dispatch) => {
  dispatch(updatePlaylistStart());
  try {
    dispatch(updatePlaylistSuccess(playlistData));
  } catch (error) {
    dispatch(updatePlaylistFailure(error.message));
  }
};

export const deletePlaylist = (playlistId) => (dispatch) => {
  dispatch(deletePlaylistStart());
  try {
    dispatch(deletePlaylistSuccess(playlistId));
  } catch (error) {
    dispatch(deletePlaylistFailure(error.message));
  }
};

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
  exportPlaylists,
  importPlaylists,
} = playlistSlice.actions;

export default playlistSlice.reducer;
