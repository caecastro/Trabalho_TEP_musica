import { useNavigate } from "react-router-dom";
import Controller from "../components/assets/Controller";

function Home() {
  const navigate = useNavigate();

  const handleClickMusica = (index) => {
    navigate(`/musicas/${index + 1}`); // envia o número da música como parâmetro
  };

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

      {/* Título */}
      <div className="text-white text-2xl mb-6">TOP 10 DA SEMANA!</div>

      {/* Main Content */}
      <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 w-full max-w-6xl">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="bg-white h-32 rounded-lg shadow-md flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleClickMusica(index)}
          >
            <span className="text-gray-700 font-medium">
              Música {index + 1}
            </span>
          </div>
        ))}
      </main>

      <div className="my-8" />
      {/* Controller */}
      <Controller />
    </div>
  );
}

export default Home;
