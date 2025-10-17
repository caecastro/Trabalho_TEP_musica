import { createSlice } from "@reduxjs/toolkit";

const loadPlaylistsFromStorage = () => {
  try {
    const playlists = localStorage.getItem("playlists");
    return playlists ? JSON.parse(playlists) : [];
  } catch (error) {
    console.error("Failed to load playlists from storage:", error);
    return [];
  }
};

const initialState = {
  playlists: loadPlaylistsFromStorage(),
  currentPlaylist: null,
};

const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    addPlaylist: (state, action) => {
      const newPlaylist = {
        ...action.payload,
        id: Date.now().toString(),
        musicas: [],
      };
      state.playlists.push(newPlaylist);
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    updatePlaylist: (state, action) => {
      const index = state.playlists.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.playlists[index] = action.payload;
        localStorage.setItem("playlists", JSON.stringify(state.playlists));
      }
    },
    deletePlaylist: (state, action) => {
      state.playlists = state.playlists.filter((p) => p.id !== action.payload);
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    addMusicToPlaylist: (state, action) => {
      const { playlistId, music } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist) {
        const newMusic = {
          ...music,
          id: Date.now().toString(),
        };
        playlist.musicas.push(newMusic);
        localStorage.setItem("playlists", JSON.stringify(state.playlists));
      }
    },
    removeMusicFromPlaylist: (state, action) => {
      const { playlistId, musicId } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist) {
        playlist.musicas = playlist.musicas.filter((m) => m.id !== musicId);
        localStorage.setItem("playlists", JSON.stringify(state.playlists));
      }
    },
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
      if (action.payload) {
        sessionStorage.setItem("lastPlaylist", action.payload.id);
      }
    },
  },
});

export const {
  addPlaylist,
  updatePlaylist,
  deletePlaylist,
  addMusicToPlaylist,
  removeMusicFromPlaylist,
  setCurrentPlaylist,
} = playlistsSlice.actions;
export default playlistsSlice.reducer;
