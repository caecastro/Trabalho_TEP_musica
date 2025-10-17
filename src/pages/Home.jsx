import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Controller from "../components/assets/Controller";

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleClickMusica = (index) => {
    navigate(`/musicas/${index + 1}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  // Criar array de 10 músicas
  const todasMusicas = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    nome: `Música ${index + 1}`,
  }));

  // Filtrar músicas baseado no termo de pesquisa
  const musicasFiltradas = todasMusicas.filter((musica) =>
    musica.nome.toLowerCase().includes(searchTerm)
  );

  // Usar músicas filtradas se houver pesquisa, senão usar todas
  const musicasParaMostrar = searchTerm ? musicasFiltradas : todasMusicas;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-black">
      {/* Header */}
      <header className="flex items-center gap-4 mt-8">
        <img
          src="/src/assets/react.svg"
          alt="React logo"
          className="h-12 w-12"
        />
        <h1 className="text-3xl font-semibold text-blue-500">React Music</h1>
      </header>

      {/* Separator */}
      <div className="w-full max-w-xl h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8" />

      {/* Título - SEMPRE "TOP 10 DA SEMANA!" */}
      <div className="text-white text-2xl mb-6">TOP 10 DA SEMANA!</div>

      {/* Main Content */}
      <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 w-full max-w-6xl">
        {musicasParaMostrar.map((musica) => (
          <div
            key={musica.id}
            className="bg-white h-32 rounded-lg shadow-md flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleClickMusica(musica.id - 1)}
          >
            <span className="text-gray-700 font-medium">{musica.nome}</span>
          </div>
        ))}

        {/* Mensagem quando não há resultados */}
        {searchTerm && musicasFiltradas.length === 0 && (
          <div className="col-span-full text-center text-white py-8">
            Nenhuma música encontrada para &quot;{searchTerm}&quot;
          </div>
        )}
      </main>

      <div className="my-8" />
      {/* Controller */}
      <Controller onSearch={handleSearch} />
    </div>
  );
}

export default Home;
