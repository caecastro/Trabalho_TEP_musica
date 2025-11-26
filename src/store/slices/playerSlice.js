// src/store/slices/playerSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ===== FUNÇÕES AUXILIARES =====

/**
 * Embaralha array usando algoritmo Fisher-Yates
 * @param {Array} array - Array a ser embaralhado
 * @returns {Array} Array embaralhado
 */
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Calcula duração em segundos a partir de string "mm:ss"
 * @param {string} duration - Duração no formato "mm:ss"
 * @returns {number} Duração em segundos
 */
const parseDurationToSeconds = (duration) => {
  if (typeof duration === "string" && duration.includes(":")) {
    const [minutes, seconds] = duration.split(":").map(Number);
    return minutes * 60 + (seconds || 0);
  }
  return 180; // Fallback: 3 minutos
};

// ===== INITIAL STATE =====
const initialState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeat: false,
  currentPlaylist: [],
  shuffledPlaylist: [],
  currentTrackIndex: 0,
};

// ===== SLICE =====
const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    /**
     * Define a música atual e playlist
     */
    setCurrentTrack: (state, action) => {
      const { track, playlist } = action.payload;
      state.currentTrack = track;
      state.currentPlaylist = playlist || [];

      // Encontrar índice atual
      const currentIndex = state.currentPlaylist.findIndex(
        (t) => t.id === track?.id
      );
      state.currentTrackIndex = currentIndex !== -1 ? currentIndex : 0;

      // Criar playlist embaralhada se shuffle ativo
      if (state.shuffle && state.currentPlaylist.length > 0) {
        const otherTracks = state.currentPlaylist.filter(
          (_, index) => index !== currentIndex
        );
        const shuffledOthers = shuffleArray(otherTracks);
        state.shuffledPlaylist =
          currentIndex !== -1
            ? [state.currentPlaylist[currentIndex], ...shuffledOthers]
            : shuffledOthers;
      } else {
        state.shuffledPlaylist = [];
      }

      // Calcular duração
      state.duration = track?.duracao
        ? parseDurationToSeconds(track.duracao)
        : 180;
      state.currentTime = 0;
      state.isPlaying = true;
    },

    playTrack: (state) => {
      state.isPlaying = true;
    },

    pauseTrack: (state) => {
      state.isPlaying = false;
    },

    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },

    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },

    setDuration: (state, action) => {
      state.duration = action.payload;
    },

    /**
     * Avança para a próxima música
     */
    nextTrack: (state) => {
      const playlist = state.shuffle
        ? state.shuffledPlaylist
        : state.currentPlaylist;

      if (playlist.length === 0) return;

      const nextIndex = (state.currentTrackIndex + 1) % playlist.length;
      state.currentTrackIndex = nextIndex;
      state.currentTrack = playlist[nextIndex];
      state.duration = parseDurationToSeconds(state.currentTrack?.duracao);
      state.currentTime = 0;
      state.isPlaying = true;
    },

    /**
     * Volta para a música anterior
     */
    previousTrack: (state) => {
      const playlist = state.shuffle
        ? state.shuffledPlaylist
        : state.currentPlaylist;

      if (playlist.length === 0) return;

      // Se estiver nos primeiros 5 segundos, volta para anterior
      if (state.currentTime > 5) {
        state.currentTime = 0;
        return;
      }

      const prevIndex =
        state.currentTrackIndex === 0
          ? playlist.length - 1
          : state.currentTrackIndex - 1;

      state.currentTrackIndex = prevIndex;
      state.currentTrack = playlist[prevIndex];
      state.duration = parseDurationToSeconds(state.currentTrack?.duracao);
      state.currentTime = 0;
      state.isPlaying = true;
    },

    /**
     * Ativa/desativa modo shuffle
     */
    toggleShuffle: (state) => {
      const newShuffleState = !state.shuffle;

      if (newShuffleState && state.currentPlaylist.length > 0) {
        // Ativar shuffle - criar playlist embaralhada
        const currentTrackId = state.currentTrack?.id;
        const currentIndex = state.currentPlaylist.findIndex(
          (track) => track.id === currentTrackId
        );

        if (currentIndex !== -1) {
          const otherTracks = state.currentPlaylist.filter(
            (track, index) => index !== currentIndex
          );
          const shuffledOthers = shuffleArray(otherTracks);
          state.shuffledPlaylist = [
            state.currentPlaylist[currentIndex],
            ...shuffledOthers,
          ];
          state.currentTrackIndex = 0;
        }
      } else {
        // Desativar shuffle - voltar para playlist original
        if (state.currentTrack) {
          const originalIndex = state.currentPlaylist.findIndex(
            (track) => track.id === state.currentTrack.id
          );
          state.currentTrackIndex = originalIndex !== -1 ? originalIndex : 0;
        }
        state.shuffledPlaylist = [];
      }

      state.shuffle = newShuffleState;
    },

    toggleRepeat: (state) => {
      state.repeat = !state.repeat;
    },

    setPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;

      // Recriar shuffled playlist se shuffle ativo
      if (state.shuffle && action.payload.length > 0) {
        const currentTrackId = state.currentTrack?.id;
        const currentIndex = action.payload.findIndex(
          (track) => track.id === currentTrackId
        );

        if (currentIndex !== -1) {
          const otherTracks = action.payload.filter(
            (track, index) => index !== currentIndex
          );
          const shuffledOthers = shuffleArray(otherTracks);
          state.shuffledPlaylist = [
            action.payload[currentIndex],
            ...shuffledOthers,
          ];
          state.currentTrackIndex = 0;
        } else {
          state.shuffledPlaylist = shuffleArray([...action.payload]);
          state.currentTrackIndex = 0;
          state.currentTrack = state.shuffledPlaylist[0];
        }
      }
    },

    clearPlayer: (state) => {
      state.currentTrack = null;
      state.isPlaying = false;
      state.currentTime = 0;
      state.duration = 0;
      state.currentPlaylist = [];
      state.shuffledPlaylist = [];
      state.currentTrackIndex = 0;
    },
  },
});

// ===== EXPORTS =====
export const {
  setCurrentTrack,
  playTrack,
  pauseTrack,
  togglePlay,
  setCurrentTime,
  setDuration,
  nextTrack,
  previousTrack,
  toggleShuffle,
  toggleRepeat,
  setPlaylist,
  clearPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
