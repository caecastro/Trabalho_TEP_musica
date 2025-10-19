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

const initialState = {
  playlists: getFromLocalStorage("playlists") || [DEFAULT_PLAYLIST],
  currentPlaylist: getFromLocalStorage("currentPlaylist") || DEFAULT_PLAYLIST,
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
      const newPlaylist = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.playlists.push(newPlaylist);
      saveToLocalStorage("playlists", state.playlists);
    },
    createPlaylistFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Read
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
      saveToLocalStorage("currentPlaylist", action.payload);
      // Salvar última playlist acessada no sessionStorage
      sessionStorage.setItem("lastPlaylist", JSON.stringify(action.payload));
    },

    // Update
    updatePlaylistStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePlaylistSuccess: (state, action) => {
      state.loading = false;
      const index = state.playlists.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.playlists[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        saveToLocalStorage("playlists", state.playlists);

        if (
          state.currentPlaylist &&
          state.currentPlaylist.id === action.payload.id
        ) {
          state.currentPlaylist = state.playlists[index];
          saveToLocalStorage("currentPlaylist", state.playlists[index]);
        }
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
      state.playlists = state.playlists.filter((p) => p.id !== action.payload);
      saveToLocalStorage("playlists", state.playlists);

      if (
        state.currentPlaylist &&
        state.currentPlaylist.id === action.payload
      ) {
        // Se deletar a playlist atual, voltar para a padrão
        state.currentPlaylist = DEFAULT_PLAYLIST;
        saveToLocalStorage("currentPlaylist", DEFAULT_PLAYLIST);
      }
    },
    deletePlaylistFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Musicas nas playlists
    addMusicToPlaylist: (state, action) => {
      const { playlistId, music } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.isDefault) {
        // Verificar se a música já existe na playlist
        const musicExists = playlist.musicas.some((m) => m.id === music.id);
        if (!musicExists) {
          const newMusic = {
            ...music,
            id: music.id || Date.now().toString(),
            addedAt: new Date().toISOString(),
          };
          playlist.musicas.push(newMusic);
          playlist.updatedAt = new Date().toISOString();
          saveToLocalStorage("playlists", state.playlists);

          if (
            state.currentPlaylist &&
            state.currentPlaylist.id === playlistId
          ) {
            state.currentPlaylist = playlist;
            saveToLocalStorage("currentPlaylist", playlist);
          }
        }
      }
    },

    removeMusicFromPlaylist: (state, action) => {
      const { playlistId, musicId } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.isDefault) {
        playlist.musicas = playlist.musicas.filter((m) => m.id !== musicId);
        playlist.updatedAt = new Date().toISOString();
        saveToLocalStorage("playlists", state.playlists);

        if (state.currentPlaylist && state.currentPlaylist.id === playlistId) {
          state.currentPlaylist = playlist;
          saveToLocalStorage("currentPlaylist", playlist);
        }
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = DEFAULT_PLAYLIST;
      saveToLocalStorage("currentPlaylist", DEFAULT_PLAYLIST);
    },

    // Popular playlist padrão com músicas populares
    populateDefaultPlaylist: (state, action) => {
      const defaultPlaylist = state.playlists.find(
        (p) => p.id === "default_top_10"
      );
      if (defaultPlaylist) {
        defaultPlaylist.musicas = action.payload;
        defaultPlaylist.updatedAt = new Date().toISOString();
        saveToLocalStorage("playlists", state.playlists);

        if (
          state.currentPlaylist &&
          state.currentPlaylist.id === "default_top_10"
        ) {
          state.currentPlaylist = defaultPlaylist;
          saveToLocalStorage("currentPlaylist", defaultPlaylist);
        }
      }
    },
  },
});

// Thunks
export const createPlaylist = (playlistData) => (dispatch, getState) => {
  dispatch(createPlaylistStart());
  try {
    const { auth } = getState();
    const playlistWithUser = {
      ...playlistData,
      usuarioId: auth.user.id,
      musicas: playlistData.musicas || [],
      isDefault: false,
    };
    dispatch(createPlaylistSuccess(playlistWithUser));

    // Definir a nova playlist como atual
    const newPlaylist = {
      ...playlistWithUser,
      id: Date.now().toString(),
    };
    dispatch(setCurrentPlaylist(newPlaylist));
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
} = playlistSlice.actions;

export default playlistSlice.reducer;
