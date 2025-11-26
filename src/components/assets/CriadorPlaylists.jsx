import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaCheck, FaMusic, FaSave } from "react-icons/fa";
import {
  createPlaylist,
  updatePlaylist,
  setCurrentPlaylist,
} from "../../store/slices/playlistsSlice";
import { fetchPopularTracks } from "../../store/slices/musicSlice";

function CriadorPlaylists() {
  // ===== HOOKS E STATE =====
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State local
  const [nome, setNome] = useState("");
  const [musicasSelecionadas, setMusicasSelecionadas] = useState([]);
  const [playlistOriginal, setPlaylistOriginal] = useState(null);

  // Redux state
  const { user } = useSelector((state) => state.auth);
  const { popularTracks, loading } = useSelector((state) => state.music);
  const { playlists } = useSelector((state) => state.playlists);

  // ===== CONSTANTES DERIVADAS =====
  const isEditMode = Boolean(id);
  const todasSelecionadas = musicasSelecionadas.length === popularTracks.length;
  const podeSalvar = nome.trim() && musicasSelecionadas.length > 0;

  // ===== EFEITOS =====

  // Carregar dados iniciais
  useEffect(() => {
    dispatch(fetchPopularTracks());

    if (isEditMode) {
      carregarPlaylistParaEdicao();
    }
  }, [dispatch, id, isEditMode, playlists, user, navigate]);

  // ===== HANDLERS =====

  const carregarPlaylistParaEdicao = () => {
    const playlist = playlists.find((p) => p.id === id);

    if (!playlist) {
      alert("Playlist não encontrada!");
      navigate("/home");
      return;
    }

    const podeEditar = playlist.usuarioId === user?.id || playlist.isDefault;
    if (!podeEditar) {
      alert("Você não tem permissão para editar esta playlist!");
      navigate("/home");
      return;
    }

    setPlaylistOriginal(playlist);
    setNome(playlist.nome);
    setMusicasSelecionadas(playlist.musicas || []);
  };

  const handleSelectMusica = (musica) => {
    setMusicasSelecionadas(
      (prev) =>
        prev.find((m) => m.id === musica.id)
          ? prev.filter((m) => m.id !== musica.id) // Remove se já existe
          : [...prev, musica] // Adiciona se não existe
    );
  };

  const handleSelectAll = () => {
    setMusicasSelecionadas(todasSelecionadas ? [] : [...popularTracks]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    if (isEditMode) {
      atualizarPlaylist();
    } else {
      criarPlaylist();
    }
  };

  const validarFormulario = () => {
    if (!nome.trim()) {
      alert("Digite um nome para a playlist!");
      return false;
    }

    if (musicasSelecionadas.length === 0) {
      alert("Selecione pelo menos uma música!");
      return false;
    }

    if (isEditMode && !playlistOriginal) {
      alert("Erro: Playlist original não encontrada!");
      return false;
    }

    return true;
  };

  const atualizarPlaylist = () => {
    const playlistData = {
      ...playlistOriginal,
      nome: nome.trim(),
      musicas: musicasSelecionadas,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updatePlaylist(playlistData));
    dispatch(setCurrentPlaylist(playlistData));

    alert(`Playlist "${nome}" atualizada com sucesso!`);
    navigate("/home");
  };

  const criarPlaylist = () => {
    const playlistData = {
      nome: nome.trim(),
      musicas: musicasSelecionadas,
    };

    dispatch(createPlaylist(playlistData));
    alert(`Playlist "${nome}" criada com sucesso!`);
    navigate("/home");
  };

  const handleImageError = (e) => {
    e.target.src = "/src/assets/react.svg";
  };

  // ===== RENDER CONDICIONAL =====

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-2xl">Carregando músicas da API...</div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 relative">
      {/* Header e Navegação */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
      >
        <FaArrowLeft />
        <span>Voltar</span>
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Editar Playlist" : "Criar Nova Playlist"}
      </h1>

      {/* Formulário Principal */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-4xl space-y-6"
      >
        {/* Campo Nome da Playlist */}
        <div>
          <label className="block mb-2 text-lg">Nome da Playlist</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome da sua playlist..."
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={50}
          />
          <div className="text-right text-sm text-gray-400 mt-1">
            {nome.length}/50 caracteres
          </div>
        </div>

        {/* Informações do Usuário */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <label className="block mb-2 text-sm text-gray-400">Criado por</label>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <span>{user?.email || "Usuário"}</span>
          </div>
        </div>

        {/* Seletor de Músicas */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-lg">Selecionar Músicas da API</label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded transition-colors"
            >
              {todasSelecionadas ? "Desmarcar Todas" : "Selecionar Todas"}
            </button>
          </div>

          {/* Lista de Músicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {popularTracks.map((musica) => {
              const estaSelecionada = musicasSelecionadas.find(
                (m) => m.id === musica.id
              );

              return (
                <label
                  key={musica.id}
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all ${
                    estaSelecionada
                      ? "border-blue-500 bg-blue-500 bg-opacity-10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  {/* Checkbox Customizado */}
                  <input
                    type="checkbox"
                    checked={estaSelecionada}
                    onChange={() => handleSelectMusica(musica)}
                    className="hidden"
                  />
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      estaSelecionada
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-400"
                    }`}
                  >
                    {estaSelecionada && (
                      <FaCheck className="text-white text-xs" />
                    )}
                  </div>

                  {/* Thumbnail da Música */}
                  <img
                    src={musica.thumbnail}
                    alt={musica.nome}
                    className="w-12 h-12 object-cover rounded"
                    onError={handleImageError}
                  />

                  {/* Informações da Música */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{musica.nome}</div>
                    <div className="text-sm text-gray-400 truncate">
                      {musica.artista}
                    </div>
                  </div>

                  {/* Metadados */}
                  <div className="text-xs text-gray-400 text-right">
                    <div>{musica.duracao}</div>
                    <div>{musica.ano}</div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Contador de Músicas Selecionadas */}
          <div className="text-sm text-gray-400 mt-2">
            {musicasSelecionadas.length} música(s) selecionada(s) de{" "}
            {popularTracks.length} disponíveis
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!podeSalvar}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              isEditMode
                ? "bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            } disabled:cursor-not-allowed`}
          >
            {isEditMode ? <FaSave /> : <FaMusic />}
            {isEditMode ? "Atualizar Playlist" : "Criar Playlist"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CriadorPlaylists;
