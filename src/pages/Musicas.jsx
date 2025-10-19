import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaArrowLeft,
} from "react-icons/fa";
import {
  setCurrentTrack,
  togglePlay,
  nextTrack,
  previousTrack,
  setCurrentTime,
} from "../store/slices/playerSlice";

function Musicas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const progressInterval = useRef(null);

  const { popularTracks } = useSelector((state) => state.music);
  const playerState = useSelector((state) => state.player);
  const { currentTrack, isPlaying, currentTime, duration } = playerState;

  const musica = popularTracks.find((track) => track.id === id);

  // Sincronizar quando a música muda
  useEffect(() => {
    if (musica && (!currentTrack || currentTrack.id !== musica.id)) {
      dispatch(
        setCurrentTrack({
          track: musica,
          playlist: popularTracks,
        })
      );
    }
  }, [musica, currentTrack, popularTracks, dispatch]);

  // Efeito para controlar o avanço do tempo
  useEffect(() => {
    if (isPlaying && currentTrack && currentTrack.id === musica?.id) {
      progressInterval.current = setInterval(() => {
        dispatch(setCurrentTime(currentTime + 1));

        // Se chegou ao final da música, vai para a próxima
        if (currentTime >= duration - 1) {
          dispatch(nextTrack());
        }
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTime, duration, currentTrack, musica, dispatch]);

  const togglePlayPause = () => {
    if (!currentTrack && musica) {
      dispatch(
        setCurrentTrack({
          track: musica,
          playlist: popularTracks,
        })
      );
    } else {
      dispatch(togglePlay());
    }
  };

  const handleNext = () => {
    dispatch(nextTrack());
  };

  const handlePrevious = () => {
    dispatch(previousTrack());
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Converter duração do formato "mm:ss" para segundos para display
  const musicaDurationInSeconds = musica
    ? parseInt(musica.duracao.split(":")[0]) * 60 +
      parseInt(musica.duracao.split(":")[1])
    : 0;

  if (!musica) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="text-2xl">Música não encontrada</div>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 relative">
      <button
        onClick={() => navigate("/home")}
        className="absolute top-4 left-4 text-white text-2xl hover:text-blue-400 flex items-center gap-2 transition-colors"
      >
        <FaArrowLeft />
        <span className="text-sm">Voltar</span>
      </button>

      {/* Capa do álbum */}
      <div className="w-64 h-64 bg-gray-800 rounded-lg shadow-lg mb-8 flex items-center justify-center overflow-hidden relative">
        <img
          src={musica.thumbnail}
          alt={musica.nome}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{musica.nome}</h2>
        <p className="text-xl text-gray-300 mb-1">{musica.artista}</p>
        <p className="text-lg text-gray-400 mb-4">{musica.album}</p>

        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <span>Gênero: {musica.genero}</span>
          <span>Ano: {musica.ano}</span>
          <span>Duração: {musica.duracao}</span>
        </div>
      </div>

      <div className="flex items-center gap-8 mb-8">
        <button
          onClick={handlePrevious}
          className="text-2xl cursor-pointer hover:text-blue-400 transition-colors"
        >
          <FaStepBackward />
        </button>
        <button
          onClick={togglePlayPause}
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          {isPlaying && currentTrack?.id === musica.id ? (
            <FaPause className="text-2xl" />
          ) : (
            <FaPlay className="text-2xl ml-1" />
          )}
        </button>
        <button
          onClick={handleNext}
          className="text-2xl cursor-pointer hover:text-blue-400 transition-colors"
        >
          <FaStepForward />
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="h-1 bg-gray-700 rounded-full mb-1">
          <div
            className="h-1 bg-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default Musicas;
