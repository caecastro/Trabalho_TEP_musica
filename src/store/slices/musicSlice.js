// src/store/slices/musicSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { searchTracks, getPopularTracks } from "../../services/api";

// ===== INITIAL STATE =====
const initialState = {
  popularTracks: [],
  searchResults: [],
  loading: false,
  error: null,
  searchQuery: "",
  currentTrack: null,
};

// ===== SLICE =====
const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    fetchPopularStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPopularSuccess: (state, action) => {
      state.loading = false;
      state.popularTracks = action.payload;
      state.error = null;
    },
    fetchPopularFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    searchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    searchSuccess: (state, action) => {
      state.loading = false;
      state.searchResults = action.payload.tracks;
      state.searchQuery = action.payload.query;
      state.error = null;
    },
    searchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    setPopularTracks: (state, action) => {
      state.popularTracks = action.payload;
    },
  },
});

// ===== THUNKS =====

/**
 * Busca músicas populares da API
 */
export const fetchPopularTracks = () => async (dispatch) => {
  dispatch(musicSlice.actions.fetchPopularStart());

  try {
    const tracks = await getPopularTracks();
    dispatch(musicSlice.actions.fetchPopularSuccess(tracks));
  } catch (error) {
    console.error("Erro ao buscar músicas populares:", error);
    dispatch(musicSlice.actions.fetchPopularFailure(error.message));
  }
};

/**
 * Busca músicas por query
 * @param {string} query - Termo de busca
 */
export const searchTracksByQuery = (query) => async (dispatch) => {
  if (!query.trim()) {
    dispatch(musicSlice.actions.clearSearch());
    return;
  }

  dispatch(musicSlice.actions.searchStart());

  try {
    const tracks = await searchTracks(query);
    dispatch(musicSlice.actions.searchSuccess({ tracks, query }));
  } catch (error) {
    console.error("Erro na busca de músicas:", error);
    dispatch(musicSlice.actions.searchFailure(error.message));
  }
};

// ===== EXPORTS =====
export const {
  fetchPopularStart,
  fetchPopularSuccess,
  fetchPopularFailure,
  searchStart,
  searchSuccess,
  searchFailure,
  setCurrentTrack,
  clearSearch,
  clearError,
  setPopularTracks,
} = musicSlice.actions;

export default musicSlice.reducer;
