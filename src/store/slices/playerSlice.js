// src/store/slices/playerSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Função para embaralhar array (Fisher-Yates)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

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

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      const { track, playlist } = action.payload;
      state.currentTrack = track;
      state.currentPlaylist = playlist || [];

      // Encontra o índice atual
      const currentIndex = state.currentPlaylist.findIndex(
        (t) => t.id === track?.id
      );
      state.currentTrackIndex = currentIndex !== -1 ? currentIndex : 0;

      // Se shuffle está ativo, cria playlist embaralhada
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

      // CORREÇÃO: Calcular duração de forma mais robusta
      if (track && track.duracao) {
        // Se já está no formato "mm:ss", converter para segundos
        if (typeof track.duracao === "string" && track.duracao.includes(":")) {
          const [minutes, seconds] = track.duracao.split(":").map(Number);
          state.duration = minutes * 60 + (seconds || 0);
        } else {
          // Se é número, assumir que está em ms e converter para segundos
          const durationMs = parseInt(track.duracao);
          state.duration = Math.floor(durationMs / 1000);
        }
      } else {
        state.duration = 180; // Fallback: 3 minutos
      }

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

    nextTrack: (state) => {
      const playlist = state.shuffle
        ? state.shuffledPlaylist
        : state.currentPlaylist;
      if (playlist.length === 0) return;

      let nextIndex;

      if (state.shuffle) {
        // Na shuffled playlist, vai para a próxima em ordem
        nextIndex = (state.currentTrackIndex + 1) % playlist.length;
      } else {
        // Na playlist normal, vai para a próxima
        nextIndex = (state.currentTrackIndex + 1) % playlist.length;
      }

      state.currentTrackIndex = nextIndex;
      state.currentTrack = playlist[nextIndex];

      // Calcula a duração real da nova música
      if (state.currentTrack && state.currentTrack.duracao) {
        if (
          typeof state.currentTrack.duracao === "string" &&
          state.currentTrack.duracao.includes(":")
        ) {
          const [minutes, seconds] = state.currentTrack.duracao
            .split(":")
            .map(Number);
          state.duration = minutes * 60 + (seconds || 0);
        } else {
          state.duration = 180; // Fallback
        }
      } else {
        state.duration = 180; // Fallback
      }

      state.currentTime = 0;
      state.isPlaying = true;
    },

    previousTrack: (state) => {
      const playlist = state.shuffle
        ? state.shuffledPlaylist
        : state.currentPlaylist;
      if (playlist.length === 0) return;

      // Se estiver nos primeiros 5 segundos, volta para música anterior
      if (state.currentTime > 5) {
        state.currentTime = 0;
        return;
      }

      let prevIndex;

      if (state.shuffle) {
        // Na shuffled playlist, volta para a anterior
        prevIndex =
          state.currentTrackIndex === 0
            ? playlist.length - 1
            : state.currentTrackIndex - 1;
      } else {
        // Na playlist normal, volta para a anterior
        prevIndex =
          state.currentTrackIndex === 0
            ? playlist.length - 1
            : state.currentTrackIndex - 1;
      }

      state.currentTrackIndex = prevIndex;
      state.currentTrack = playlist[prevIndex];

      // Calcula a duração real da nova música
      if (state.currentTrack && state.currentTrack.duracao) {
        if (
          typeof state.currentTrack.duracao === "string" &&
          state.currentTrack.duracao.includes(":")
        ) {
          const [minutes, seconds] = state.currentTrack.duracao
            .split(":")
            .map(Number);
          state.duration = minutes * 60 + (seconds || 0);
        } else {
          state.duration = 180; // Fallback
        }
      } else {
        state.duration = 180; // Fallback
      }

      state.currentTime = 0;
      state.isPlaying = true;
    },

    toggleShuffle: (state) => {
      const newShuffleState = !state.shuffle;

      if (newShuffleState && state.currentPlaylist.length > 0) {
        // Ativando shuffle - cria playlist embaralhada
        const currentTrackId = state.currentTrack?.id;
        const currentIndex = state.currentPlaylist.findIndex(
          (track) => track.id === currentTrackId
        );

        if (currentIndex !== -1) {
          // Mantém a música atual como primeira
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
        // Desativando shuffle - volta para playlist original
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
      // Se shuffle está ativo, recria a shuffled playlist
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
