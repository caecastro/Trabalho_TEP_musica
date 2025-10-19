import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import playlistReducer from "./slices/playlistsSlice";
import musicReducer from "./slices/musicSlice";
import playerReducer from "./slices/playerSlice"; // ← ADICIONAR ESTA LINHA

export const store = configureStore({
  reducer: {
    auth: authReducer,
    playlists: playlistReducer,
    music: musicReducer,
    player: playerReducer, // ← ADICIONAR ESTA LINHA
  },
});

export default store;
