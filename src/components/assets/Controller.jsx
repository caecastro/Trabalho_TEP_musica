import {
  FaSignOutAlt,
  FaSearch,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaMusic,
  FaPlus,
  FaListUl,
  FaEdit,
  FaTrash,
  FaRandom,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  setCurrentPlaylist,
  deletePlaylist,
} from "../../store/slices/playlistsSlice";
import {
  setCurrentTrack,
  togglePlay,
  nextTrack,
  previousTrack,
  toggleShuffle,
  setCurrentTime,
  setDuration,
} from "../../store/slices/playerSlice";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

function Controller({ onSearch }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const progressIntervalRef = useRef(null);
  const playlistsRef = useRef(null);
  const playlistButtonRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { playlists, currentPlaylist } = useSelector(
    (state) => state.playlists
  );

  const playerState = useSelector((state) => state.player);
  const { currentTrack, isPlaying, currentTime, duration, shuffle } =
    playerState || {};

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se clicou no botão de playlist, não fecha (o toggle vai lidar com isso)
      if (
        playlistButtonRef.current &&
        playlistButtonRef.current.contains(event.target)
      ) {
        return;
      }

      // Se clicou fora do menu e do botão, fecha o menu
      if (
        playlistsRef.current &&
        !playlistsRef.current.contains(event.target)
      ) {
        setShowPlaylists(false);
      }
    };

    if (showPlaylists) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPlaylists]);

  // Efeito para controlar o avanço do tempo quando a música está tocando
  useEffect(() => {
    if (isPlaying && currentTrack) {
      // Limpa qualquer intervalo existente
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Inicia um novo intervalo para atualizar o tempo a cada segundo
      progressIntervalRef.current = setInterval(() => {
        const newTime = currentTime + 1;
        dispatch(setCurrentTime(newTime));

        // Se chegou ao final da música, vai para a próxima
        if (newTime >= duration - 1) {
          dispatch(nextTrack());
        }
      }, 1000);
    } else {
      // Pausa o intervalo quando a música não está tocando
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    // Limpeza do intervalo quando o componente desmontar ou dependências mudarem
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, currentTime, duration, currentTrack, dispatch]);

  // Efeito para definir a duração real quando uma nova música começa
  useEffect(() => {
    if (currentTrack && currentTrack.duracao) {
      // Converte a duração do formato "mm:ss" para segundos
      const [minutes, seconds] = currentTrack.duracao.split(":").map(Number);
      const realDuration = minutes * 60 + seconds;
      dispatch(setDuration(realDuration));
    }
  }, [currentTrack, dispatch]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Tem certeza que deseja sair?");
    if (confirmLogout) {
      dispatch(logout());
      navigate("/");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSelectPlaylist = (playlist) => {
    dispatch(setCurrentPlaylist(playlist));
    // Atualiza o player com a nova playlist
    if (playlist.musicas?.length > 0) {
      dispatch(
        setCurrentTrack({
          track: playlist.musicas[0],
          playlist: playlist.musicas,
        })
      );
    }
    setShowPlaylists(false);
  };

  const handleDeletePlaylist = (playlist, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a playlist "${playlist.nome}"?`
    );

    if (confirmDelete) {
      dispatch(deletePlaylist(playlist.id));
    }
  };

  const handleEditPlaylist = (playlist, e) => {
    e.stopPropagation();
    navigate(`/criador/${playlist.id}`);
  };

  const handlePlayPause = () => {
    if (!currentTrack && currentPlaylist?.musicas?.length > 0) {
      const firstTrack = currentPlaylist.musicas[0];
      dispatch(
        setCurrentTrack({
          track: firstTrack,
          playlist: currentPlaylist.musicas,
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

  const handleShuffle = () => {
    dispatch(toggleShuffle());
  };

  // Função para clicar na barra de progresso e buscar um tempo específico
  const handleProgressClick = (e) => {
    if (!duration || !currentTrack) return;

    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const clickPercentage = clickPosition / progressBarWidth;
    const newTime = Math.floor(duration * clickPercentage);

    dispatch(setCurrentTime(newTime));
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const userPlaylists = playlists.filter(
    (playlist) => playlist.usuarioId === user?.id || playlist.isDefault
  );

  // Função toggle para o menu de playlists
  const togglePlaylists = () => {
    setShowPlaylists((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Barra principal */}
      <div className="flex items-center justify-between bg-gray-800 text-white px-6 py-4 rounded-lg shadow-md w-full max-w-6xl mx-auto">
        {/* Logout */}
        <button
          className="flex items-center gap-2 hover:text-red-400 transition-colors"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

        {/* Playlist */}
        <div className="flex items-center gap-4">
          <button
            ref={playlistButtonRef}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            onClick={togglePlaylists}
          >
            <FaMusic />
            <span>Playlists</span>
          </button>
        </div>

        {/* Pesquisa */}
        <div className="flex items-center bg-gray-700 rounded-md px-3 py-1 gap-2">
          <FaSearch />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-transparent outline-none text-white placeholder-gray-400 w-48"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Player */}
        <div className="flex items-center gap-4">
          {/* Informações da música atual */}
          {currentTrack && (
            <div className="flex items-center gap-3 mr-4">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.nome}
                className="w-8 h-8 object-cover rounded"
                onError={(e) => {
                  e.target.src = "/src/assets/react.svg";
                }}
              />
              <div className="text-xs max-w-32">
                <div className="font-semibold truncate">
                  {currentTrack.nome}
                </div>
                <div className="text-gray-400 truncate">
                  {currentTrack.artista}
                </div>
              </div>
            </div>
          )}

          {/* Controles do player */}
          <div className="flex items-center gap-2">
            {/* Botão Shuffle */}
            <button
              onClick={handleShuffle}
              className={`p-2 rounded-full transition-colors ${
                shuffle
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
              }`}
              title="Embaralhar"
            >
              <FaRandom size={16} />
            </button>

            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Anterior"
            >
              <FaStepBackward />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              title={isPlaying ? "Pausar" : "Tocar"}
            >
              {isPlaying ? (
                <FaPause className="text-sm" />
              ) : (
                <FaPlay className="text-sm ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Próxima"
            >
              <FaStepForward />
            </button>
          </div>

          {/* Barra de progresso */}
          {currentTrack && (
            <div className="flex items-center gap-2 w-48">
              <span className="text-xs text-gray-400 min-w-10">
                {formatTime(currentTime)}
              </span>
              <div
                className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-1 bg-blue-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 min-w-10">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Submenu Playlists */}
      <div
        ref={playlistsRef}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showPlaylists ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        } w-full max-w-4xl`}
      >
        <div className="bg-gray-700 rounded-lg shadow-md p-4 flex flex-col gap-3">
          {/* Header do submenu - SEM BOTÃO X */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Suas Playlists</h3>
            {/* Botão X removido conforme solicitado */}
          </div>

          {/* Lista de Playlists */}
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {userPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className={`flex items-center justify-between gap-2 cursor-pointer p-2 rounded hover:bg-gray-600 ${
                  currentPlaylist?.id === playlist.id
                    ? "bg-gray-600 text-blue-400"
                    : ""
                }`}
                onClick={() => handleSelectPlaylist(playlist)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <FaListUl />
                  <span className="flex-1">{playlist.nome}</span>
                  {playlist.isDefault && (
                    <span className="text-xs bg-blue-500 px-1 rounded">
                      Padrão
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {playlist.musicas?.length || 0} músicas
                  </span>

                  {!playlist.isDefault && playlist.usuarioId === user?.id && (
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={(e) => handleDeletePlaylist(playlist, e)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Excluir playlist"
                      >
                        <FaTrash size={14} />
                      </button>
                      <button
                        onClick={(e) => handleEditPlaylist(playlist, e)}
                        className="text-yellow-400 hover:text-yellow-300 p-1"
                        title="Editar playlist"
                      >
                        <FaEdit size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Nova Playlist */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-green-400 pt-2 border-t border-gray-600"
            onClick={() => {
              navigate("/criador");
              setShowPlaylists(false);
            }}
          >
            <FaPlus />
            <span>Nova Playlist</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Controller.propTypes = {
  onSearch: PropTypes.func,
};

export default Controller;
