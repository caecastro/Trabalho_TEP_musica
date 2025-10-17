import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  popularTracks: [],
  searchResults: [],
  loading: false,
  error: null,
};

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    setPopularTracks: (state, action) => {
      state.popularTracks = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setPopularTracks, setSearchResults, setLoading, setError } =
  musicSlice.actions;
export default musicSlice.reducer;
