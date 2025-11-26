import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaTimes,
} from "react-icons/fa";
import {
  setCurrentTrack,
  togglePlay,
  nextTrack,
  previousTrack,
  setCurrentTime,
} from "../../store/slices/playerSlice";

function Musicas({ musica, onClose }) {
  // ===== HOOKS E REFS =====
  const dispatch = useDispatch();
  const progressIntervalRef = useRef(null);

  // ===== REDUX STATE =====
  const { popularTracks } = useSelector((state) => state.music);
  const playerState = useSelector((state) => state.player);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    shuffle,
    currentPlaylist,
  } = playerState;

  // ===== CONSTANTES DERIVADAS =====
  const musicaAtual = currentTrack || musica;
  const playlistAtiva =
    currentPlaylist.length > 0 ? currentPlaylist : popularTracks;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ===== EFEITOS =====

  // Sincronizar música quando o modal abre
  useEffect(() => {
    if (musica && (!currentTrack || currentTrack.id !== musica.id)) {
      dispatch(
        setCurrentTrack({
          track: musica,
          playlist: playlistAtiva,
        })
      );
    }
  }, [musica, currentTrack, playlistAtiva, dispatch]);

  // Controlar progresso da música
  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressIntervalRef.current = setInterval(() => {
        const novoTime = currentTime + 1;
        dispatch(setCurrentTime(novoTime));

        // Avançar para próxima música ao finalizar
        if (novoTime >= duration - 1) {
          dispatch(nextTrack());
        }
      }, 1000);
    } else {
      clearInterval(progressIntervalRef.current);
    }

    return () => clearInterval(progressIntervalRef.current);
  }, [isPlaying, currentTime, duration, currentTrack, dispatch]);

  // ===== HANDLERS =====

  const handlePlayPause = () => {
    if (!currentTrack && musica) {
      // Iniciar reprodução da música do modal
      dispatch(
        setCurrentTrack({
          track: musica,
          playlist: playlistAtiva,
        })
      );
    } else {
      // Play/Pause normal
      dispatch(togglePlay());
    }
  };

  const handleNext = () => {
    dispatch(nextTrack());
  };

  const handlePrevious = () => {
    dispatch(previousTrack());
  };

  const handleImageError = (e) => {
    const fallbacks = [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      "https://via.placeholder.com/300x300/4f46e5/ffffff?text=Music",
      "/src/assets/react.svg",
    ];

    const currentSrc = e.target.src;
    const currentIndex = fallbacks.findIndex((fallback) =>
      currentSrc.includes(fallback)
    );

    if (currentIndex === -1) {
      e.target.src = fallbacks[0];
    } else if (currentIndex < fallbacks.length - 1) {
      e.target.src = fallbacks[currentIndex + 1];
    }
  };

  // ===== FUNÇÕES AUXILIARES =====

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ===== RENDER CONDICIONAL =====

  if (!musicaAtual) {
    return null;
  }

  // ===== RENDER PRINCIPAL =====

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header do Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Reprodutor de Música
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
            aria-label="Fechar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-8">
          {/* Capa do Álbum */}
          <div className="w-48 h-48 bg-gray-700 rounded-lg shadow-lg mx-auto mb-8 flex items-center justify-center overflow-hidden">
            <img
              src={musicaAtual.thumbnail}
              alt={`Capa do álbum ${musicaAtual.album}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>

          {/* Informações da Música */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">
              {musicaAtual.nome}
            </h2>
            <p className="text-xl text-gray-300 mb-1">{musicaAtual.artista}</p>
            <p className="text-lg text-gray-400 mb-4">{musicaAtual.album}</p>

            {/* Metadados */}
            <div className="flex justify-center gap-6 text-sm text-gray-400 flex-wrap">
              <span>Gênero: {musicaAtual.genero}</span>
              <span>Ano: {musicaAtual.ano}</span>
              <span>Duração: {musicaAtual.duracao}</span>
              {shuffle && (
                <span className="text-green-400">🔀 Shuffle Ativo</span>
              )}
            </div>
          </div>

          {/* Controles de Reprodução */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <button
              onClick={handlePrevious}
              className="text-2xl text-gray-400 hover:text-white transition-colors"
              aria-label="Música anterior"
            >
              <FaStepBackward />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
            >
              {isPlaying ? (
                <FaPause className="text-2xl text-white" />
              ) : (
                <FaPlay className="text-2xl ml-1 text-white" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-2xl text-gray-400 hover:text-white transition-colors"
              aria-label="Próxima música"
            >
              <FaStepForward />
            </button>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full max-w-md mx-auto">
            <div className="h-2 bg-gray-700 rounded-full mb-2">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Musicas;
