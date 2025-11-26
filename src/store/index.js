// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import playlistReducer from "./slices/playlistsSlice";
import musicReducer from "./slices/musicSlice";
import playerReducer from "./slices/playerSlice";

/**
 * Configuração centralizada da store do Redux
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    playlists: playlistReducer,
    music: musicReducer,
    player: playerReducer,
  },

  // Middleware padrão já inclui thunk e serializable check
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar ações não serializáveis específicas se necessário
        ignoredActions: [], //['player/setCurrentTrack'],
        ignoredPaths: [], //['player.currentTrack.thumbnail']
      },
    }),
});

export default store;
