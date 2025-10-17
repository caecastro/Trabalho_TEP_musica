import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function CriadorPlaylists() {
  const [nome, setNome] = useState("");
  const [musicasSelecionadas, setMusicasSelecionadas] = useState([]);
  const [user] = useState("Usuário Genérico");
  const navigate = useNavigate();

  const handleSelectMusica = (musica) => {
    if (musicasSelecionadas.includes(musica)) {
      setMusicasSelecionadas(musicasSelecionadas.filter((m) => m !== musica));
    } else {
      setMusicasSelecionadas([...musicasSelecionadas, musica]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nova Playlist Criada:", {
      nome,
      musicasSelecionadas,
      user,
    });
    alert("Playlist criada (simulação)!");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 relative">
      {/* Botão de voltar */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-blue-400"
      >
        <FaArrowLeft />
        <span>Voltar</span>
      </button>

      <h1 className="text-3xl font-bold mb-6">Criar Nova Playlist</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg space-y-4"
      >
        {/* Nome da playlist */}
        <div>
          <label className="block mb-2">Nome da Playlist</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome..."
            className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
          />
        </div>

        {/* Músicas */}
        <div>
          <label className="block mb-2">Selecione as músicas</label>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 10 }).map((_, i) => {
              const musica = `Música ${i + 1}`;
              return (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={musicasSelecionadas.includes(musica)}
                    onChange={() => handleSelectMusica(musica)}
                  />
                  {musica}
                </label>
              );
            })}
          </div>
        </div>

        {/* Usuário */}
        <div>
          <label className="block mb-2">Criado por</label>
          <input
            type="text"
            value={user}
            disabled
            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-400 outline-none"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-800 rounded-lg font-semibold"
        >
          Criar Playlist
        </button>
      </form>
    </div>
  );
}

export default CriadorPlaylists;
