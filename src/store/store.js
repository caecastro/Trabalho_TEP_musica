// src/store/redux.js (ou store.js)
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import musicReducer from "./slices/musicSlice";
import playlistsReducer from "./slices/playlistsSlice";
import playerReducer from "./slices/playerSlice"; // ← ADICIONAR ESTE

export const store = configureStore({
  reducer: {
    auth: authReducer,
    music: musicReducer,
    playlists: playlistsReducer,
    player: playerReducer, // ← ADICIONAR ESTE
  },
});
