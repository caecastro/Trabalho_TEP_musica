import { useParams, useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaStepForward,
  FaStepBackward,
  FaArrowLeft,
} from "react-icons/fa";

function Musicas() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 relative">
      {/* Botão de voltar */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-white text-2xl hover:text-blue-400 flex items-center gap-2"
      >
        <FaArrowLeft />
        <span className="text-sm">Voltar</span>
      </button>

      {/* Capa do álbum */}
      <div className="w-64 h-64 bg-gray-800 rounded-lg shadow-lg mb-8 flex items-center justify-center">
        <span className="text-gray-400">Capa do Álbum</span>
      </div>

      {/* Informações da música */}
      <h2 className="text-2xl font-semibold mb-2">Música {id}</h2>
      <p className="text-sm text-gray-400 mb-6">Artista Genérico</p>

      {/* Controles de reprodução */}
      <div className="flex items-center gap-8">
        <FaStepBackward className="text-2xl cursor-pointer hover:text-blue-400" />
        <FaPlay className="text-3xl cursor-pointer hover:text-green-400" />
        <FaStepForward className="text-2xl cursor-pointer hover:text-blue-400" />
      </div>

      {/* Barra de progresso */}
      <div className="w-full max-w-md mt-8">
        <div className="h-1 bg-gray-700 rounded-full">
          <div className="h-1 bg-blue-500 rounded-full w-1/6"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1:00</span>
          <span>6:38</span>
        </div>
      </div>
    </div>
  );
}

export default Musicas;
