import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularTracks } from "../store/slices/musicSlice";
import {
  populateDefaultPlaylist,
  setCurrentPlaylist,
} from "../store/slices/playlistsSlice";
import Controller from "../components/assets/Controller";
import Musicas from "../components/assets/Musicas";
import { getFromLocalStorage } from "../utils/localStorage";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Home() {
  // ===== HOOKS =====
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===== STATE =====
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMusica, setSelectedMusica] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // ===== REDUX STATE =====
  const { popularTracks, loading, error, searchResults, searchQuery } =
    useSelector((state) => state.music);
  const { currentPlaylist, playlists } = useSelector(
    (state) => state.playlists
  );
  const { user } = useSelector((state) => state.auth);

  // ===== CONSTANTES DERIVADAS =====
  const itemsPerPage = 10;
  const musicas = searchQuery
    ? searchResults
    : currentPlaylist?.musicas?.length > 0
    ? currentPlaylist.musicas
    : popularTracks;

  const musicasFiltradas = searchTerm
    ? musicas.filter(
        (musica) =>
          musica.nome.toLowerCase().includes(searchTerm) ||
          musica.artista.toLowerCase().includes(searchTerm) ||
          musica.genero.toLowerCase().includes(searchTerm)
      )
    : musicas;

  const musicasParaMostrar = searchTerm ? musicasFiltradas : musicas;
  const totalPages = Math.ceil(musicasParaMostrar.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const musicasPaginadas = musicasParaMostrar.slice(startIndex, endIndex);

  // ===== EFEITOS =====

  // Carregar dados iniciais
  useEffect(() => {
    dispatch(fetchPopularTracks());
    carregarUsuarioLogado();
  }, [dispatch, user]);

  // Popular playlist padrão no primeiro carregamento
  useEffect(() => {
    if (isFirstLoad && popularTracks.length > 0) {
      popularPlaylistPadrao();
      setIsFirstLoad(false);
    }
  }, [popularTracks, isFirstLoad]);

  // Popular playlist padrão em carregamentos subsequentes
  useEffect(() => {
    if (!isFirstLoad && popularTracks.length > 0) {
      dispatch(populateDefaultPlaylist(popularTracks));
    }
  }, [popularTracks, dispatch, isFirstLoad]);

  // Resetar página quando mudar a busca ou playlist
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, currentPlaylist]);

  // ===== FUNÇÕES AUXILIARES =====

  const carregarUsuarioLogado = useCallback(() => {
    const usuariosFromStorage = getFromLocalStorage("usuarios");
    let usuarioLogado = null;

    if (usuariosFromStorage?.length > 0) {
      usuarioLogado = usuariosFromStorage.find(
        (usuario) =>
          usuario.logado === true ||
          usuario.isLogged === true ||
          usuario.isAuthenticated === true
      );
    }

    if (usuarioLogado) {
      setCurrentUser(usuarioLogado);
    } else if (user) {
      setCurrentUser(user);
    } else if (usuariosFromStorage?.length > 0) {
      setCurrentUser(usuariosFromStorage[usuariosFromStorage.length - 1]);
    }
  }, [user]);

  const popularPlaylistPadrao = useCallback(() => {
    dispatch(populateDefaultPlaylist(popularTracks));

    const defaultPlaylist = {
      id: "default_top_10",
      nome: "Top 10 da Semana",
      usuarioId: "system",
      musicas: popularTracks,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(setCurrentPlaylist(defaultPlaylist));
  }, [dispatch, popularTracks]);

  // ===== HANDLERS =====

  const handleClickMusica = (musica) => {
    setSelectedMusica(musica);
  };

  const handleCloseMusica = () => {
    setSelectedMusica(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
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

  const loadImageWithFallback = (src, alt) => {
    return (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleImageError}
        loading="lazy"
      />
    );
  };

  const getTituloDinamico = () => {
    if (searchQuery) return `Resultados para: "${searchQuery}"`;
    if (currentPlaylist && !currentPlaylist.isDefault)
      return currentPlaylist.nome.toUpperCase();
    return "TOP 10 DA SEMANA!";
  };

  // ===== RENDER CONDICIONAL =====

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-2xl">Carregando músicas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-2xl text-red-500">Erro: {error}</div>
        <button
          onClick={() => dispatch(fetchPopularTracks())}
          className="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-black pb-32">
      {/* Header */}
      <header className="flex items-center justify-between w-full max-w-6xl px-4 mt-8">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/react.svg"
            alt="React Music Logo"
            className="h-12 w-12"
          />
          <h1 className="text-3xl font-semibold text-blue-500">React Music</h1>
        </div>

        {/* Info do Usuário Logado */}
        {currentUser && (
          <button
            onClick={() => navigate("/editar-user")}
            className="text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span className="text-gray-400">Logado como: </span>
            <span className="font-semibold text-blue-400">
              {currentUser.nome ||
                currentUser.username ||
                currentUser.email ||
                "Usuário"}
            </span>
          </button>
        )}
      </header>

      {/* Separador Visual */}
      <div className="w-full max-w-xl h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8" />

      {/* Título Dinâmico */}
      <div className="text-white text-2xl mb-6">{getTituloDinamico()}</div>

      {/* Container Principal com Botões de Navegação */}
      <div className="relative w-full max-w-6xl mb-8">
        {/* Botão Anterior */}
        {totalPages > 1 && currentPage > 0 && (
          <button
            onClick={handlePrevPage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <FaChevronLeft size={20} />
          </button>
        )}

        {/* Grid de Músicas */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4">
          {musicasPaginadas.map((musica) => (
            <div
              key={musica.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleClickMusica(musica)}
            >
              {/* Thumbnail com Fallback */}
              <div className="h-32 bg-gray-200 relative">
                {loadImageWithFallback(musica.thumbnail, musica.nome)}
              </div>

              {/* Informações da Música */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 truncate">
                  {musica.nome}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  <span className="font-medium">Artista:</span> {musica.artista}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  <span className="font-medium">Gênero:</span> {musica.genero}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  <span className="font-medium">Álbum:</span> {musica.album}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {musica.ano} • {musica.duracao}
                </p>
              </div>
            </div>
          ))}

          {/* Estados Vazios */}
          {searchQuery && musicasParaMostrar.length === 0 && (
            <div className="col-span-full text-center text-white py-8">
              Nenhuma música encontrada para &quot;{searchQuery}&quot;
            </div>
          )}

          {musicasParaMostrar.length === 0 && !loading && !searchQuery && (
            <div className="col-span-full text-center text-white py-8">
              Nenhuma música disponível no momento
            </div>
          )}
        </main>

        {/* Botão Próximo */}
        {totalPages > 1 && currentPage < totalPages - 1 && (
          <button
            onClick={handleNextPage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <FaChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Indicador de Página */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-white text-sm">
            Página {currentPage + 1} de {totalPages}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage ? "bg-blue-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Controller Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 pt-4 pb-6">
        <Controller onSearch={handleSearch} />
      </div>

      {/* Modal de Música */}
      {selectedMusica && (
        <Musicas musica={selectedMusica} onClose={handleCloseMusica} />
      )}
    </div>
  );
}

export default Home;
