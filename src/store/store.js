import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import playlistReducer from "./slices/playlistsSlice";
import musicReducer from "./slices/musicSlice";
import playerReducer from "./slices/playerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    playlists: playlistReducer,
    music: musicReducer,
    player: playerReducer,
  },
});

export default store;
