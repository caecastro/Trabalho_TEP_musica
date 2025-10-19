import { createSlice } from "@reduxjs/toolkit";
import { searchTracks, getPopularTracks } from "../../services/audioDBApi";

const initialState = {
  popularTracks: [],
  searchResults: [],
  loading: false,
  error: null,
  searchQuery: "",
  currentTrack: null,
};

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
  },
});

// Thunks
export const fetchPopularTracks = () => async (dispatch) => {
  dispatch(fetchPopularStart());
  try {
    const tracks = await getPopularTracks();
    dispatch(fetchPopularSuccess(tracks));
  } catch (error) {
    dispatch(fetchPopularFailure(error.message));
  }
};

export const searchTracksByQuery = (query) => async (dispatch) => {
  if (!query.trim()) {
    dispatch(clearSearch());
    return;
  }

  dispatch(searchStart());
  try {
    const tracks = await searchTracks(query);
    dispatch(searchSuccess({ tracks, query }));
  } catch (error) {
    dispatch(searchFailure(error.message));
  }
};

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
} = musicSlice.actions;

export default musicSlice.reducer;
