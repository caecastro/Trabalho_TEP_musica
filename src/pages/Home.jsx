import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularTracks } from "../store/slices/musicSlice";
import {
  populateDefaultPlaylist,
  setCurrentPlaylist,
} from "../store/slices/playlistsSlice";
import Controller from "../components/assets/Controller";
import Musicas from "../components/assets/Musicas";
import { getFromLocalStorage } from "../utils/localStorage";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMusica, setSelectedMusica] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const { popularTracks, loading, error, searchResults, searchQuery } =
    useSelector((state) => state.music);
  const { currentPlaylist } = useSelector((state) => state.playlists);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPopularTracks());

    // Buscar usuário do localStorage
    const usuariosFromStorage = getFromLocalStorage("usuarios");
    let usuarioLogado = null;

    if (usuariosFromStorage && Array.isArray(usuariosFromStorage)) {
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
    } else if (usuariosFromStorage && usuariosFromStorage.length > 0) {
      setCurrentUser(usuariosFromStorage[usuariosFromStorage.length - 1]);
    }
  }, [dispatch, user]);

  // Efeito específico para garantir playlist padrão no primeiro carregamento após login
  useEffect(() => {
    if (isFirstLoad && popularTracks.length > 0) {
      // Popular a playlist padrão
      dispatch(populateDefaultPlaylist(popularTracks));

      // Garantir que a playlist atual seja a padrão
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
      setIsFirstLoad(false);
    }
  }, [popularTracks, dispatch, isFirstLoad]);

  // Popular a playlist padrão quando as músicas carregarem (apenas se não for o primeiro load)
  useEffect(() => {
    if (!isFirstLoad && popularTracks.length > 0) {
      dispatch(populateDefaultPlaylist(popularTracks));
    }
  }, [popularTracks, dispatch, isFirstLoad]);

  // DEBUG: Log das músicas carregadas
  useEffect(() => {
    console.log("🎵 Músicas carregadas:", popularTracks);
    if (popularTracks.length > 0) {
      console.log("📋 Primeira música:", popularTracks[0]);
    }
  }, [popularTracks]);

  const handleClickMusica = (musica) => {
    setSelectedMusica(musica);
  };

  const handleCloseMusica = () => {
    setSelectedMusica(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  // Função MELHORADA para verificar se a imagem existe
  const handleImageError = (e) => {
    console.log("❌ Erro ao carregar imagem:", e.target.src);

    const fallbacks = [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      "https://via.placeholder.com/300x300/4f46e5/ffffff?text=Music",
      "/src/assets/react.svg",
    ];

    const currentSrc = e.target.src;
    let currentIndex = fallbacks.findIndex((fallback) =>
      currentSrc.includes(fallback)
    );

    if (currentIndex === -1) {
      e.target.src = fallbacks[0];
    } else if (currentIndex < fallbacks.length - 1) {
      e.target.src = fallbacks[currentIndex + 1];
    }
  };

  // Função para carregar imagem com fallback
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

  // Usar músicas da busca ou da playlist atual ou das populares
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
          className="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-black pb-32">
      <header className="flex items-center justify-between w-full max-w-6xl px-4 mt-8">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/react.svg"
            alt="React logo"
            className="h-12 w-12"
          />
          <h1 className="text-3xl font-semibold text-blue-500">React Music</h1>
        </div>

        {/* Mostrar usuário logado */}
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

      <div className="w-full max-w-xl h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8" />

      {/* Título dinâmico baseado na playlist atual */}
      <div className="text-white text-2xl mb-6">
        {searchQuery
          ? `Resultados para: "${searchQuery}"`
          : currentPlaylist
          ? currentPlaylist.nome.toUpperCase()
          : "TOP 10 DA SEMANA!"}
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4 w-full max-w-6xl mb-8">
        {musicasParaMostrar.slice(0, 10).map((musica) => (
          <div
            key={musica.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleClickMusica(musica)}
          >
            {/* Thumbnail com fallback MELHORADO */}
            <div className="h-32 bg-gray-200 relative">
              {loadImageWithFallback(musica.thumbnail, musica.nome)}
            </div>

            {/* Informações da música */}
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

      {/* Controller fixo na parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 pt-4 pb-6">
        <Controller onSearch={handleSearch} />
      </div>

      {/* Modal Musicas */}
      {selectedMusica && (
        <Musicas musica={selectedMusica} onClose={handleCloseMusica} />
      )}
    </div>
  );
}

export default Home;
