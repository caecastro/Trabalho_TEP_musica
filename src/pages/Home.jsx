import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularTracks } from "../store/slices/musicSlice";
import { populateDefaultPlaylist } from "../store/slices/playlistsSlice";
import Controller from "../components/assets/Controller";
import { getFromLocalStorage } from "../utils/localStorage";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const { popularTracks, loading, error } = useSelector((state) => state.music);
  const { currentPlaylist } = useSelector((state) => state.playlists);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPopularTracks());

    // Buscar usuário do localStorage na chave "usuarios" - OPÇÃO 1 (usuário marcado como logado)
    const usuariosFromStorage = getFromLocalStorage("usuarios");
    let usuarioLogado = null;

    if (usuariosFromStorage && Array.isArray(usuariosFromStorage)) {
      // Encontrar o usuário marcado como logado
      usuarioLogado = usuariosFromStorage.find(
        (usuario) =>
          usuario.logado === true ||
          usuario.isLogged === true ||
          usuario.isAuthenticated === true
      );
    }

    // Prioridade: usuário marcado como logado -> user do Redux -> último usuário como fallback
    if (usuarioLogado) {
      setCurrentUser(usuarioLogado);
    } else if (user) {
      setCurrentUser(user);
    } else if (usuariosFromStorage && usuariosFromStorage.length > 0) {
      // Fallback: se não encontrou usuário logado, pega o último
      setCurrentUser(usuariosFromStorage[usuariosFromStorage.length - 1]);
    }
  }, [dispatch, user]);

  // Popular a playlist padrão quando as músicas carregarem
  useEffect(() => {
    if (popularTracks.length > 0) {
      dispatch(populateDefaultPlaylist(popularTracks));
    }
  }, [popularTracks, dispatch]);

  const handleClickMusica = (musicaId) => {
    navigate(`/musicas/${musicaId}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  // Usar músicas da playlist atual ou das populares
  const musicas =
    currentPlaylist?.musicas?.length > 0
      ? currentPlaylist.musicas
      : popularTracks;

  const musicasFiltradas = musicas.filter(
    (musica) =>
      musica.nome.toLowerCase().includes(searchTerm) ||
      musica.artista.toLowerCase().includes(searchTerm) ||
      musica.genero.toLowerCase().includes(searchTerm)
  );

  const musicasParaMostrar = searchTerm ? musicasFiltradas : musicas;

  // Função para verificar se a imagem existe - COM FALLBACK
  const handleImageError = (e) => {
    console.log("Erro ao carregar imagem:", e.target.src);
    e.target.src = "/src/assets/react.svg";
  };

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

        {/* Mostrar usuário logado - AGORA CLICÁVEL */}
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
        {currentPlaylist
          ? currentPlaylist.nome.toUpperCase()
          : "TOP 10 DA SEMANA!"}
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4 w-full max-w-6xl mb-8">
        {musicasParaMostrar.slice(0, 10).map((musica, index) => (
          <div
            key={musica.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleClickMusica(musica.id)}
          >
            {/* Thumbnail com fallback */}
            <div className="h-32 bg-gray-200 relative">
              <img
                src={musica.thumbnail}
                alt={musica.nome}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
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

        {searchTerm && musicasFiltradas.length === 0 && (
          <div className="col-span-full text-center text-white py-8">
            Nenhuma música encontrada para &quot;{searchTerm}&quot;
          </div>
        )}

        {musicas.length === 0 && !loading && (
          <div className="col-span-full text-center text-white py-8">
            Nenhuma música disponível no momento
          </div>
        )}
      </main>

      {/* Controller fixo na parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 pt-4 pb-6">
        <Controller onSearch={handleSearch} />
      </div>
    </div>
  );
}

export default Home;
