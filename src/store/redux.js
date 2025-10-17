import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import playlistsReducer from "./slices/playlistsSlice";
import musicReducer from "./slices/musicSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    playlists: playlistsReducer,
    music: musicReducer,
  },
});
