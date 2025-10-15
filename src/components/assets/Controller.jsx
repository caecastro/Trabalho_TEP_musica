import {
  FaSignOutAlt,
  FaSearch,
  FaPlay,
  FaStepForward,
  FaStepBackward,
  FaMusic,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Controller() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Tem certeza que deseja sair?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 text-white px-6 py-4 rounded-lg shadow-md w-full max-w-4xl mx-auto mb-8">
      {/* Logout */}
      <button
        className="flex items-center gap-2 hover:text-red-400 transition-colors"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>

      {/* Playlist */}
      <button
        className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        onClick={handleLogout}
      >
        <FaMusic />
        <span>Playlists</span>
      </button>

      {/* Pesquisa */}
      <div className="flex items-center bg-gray-700 rounded-md px-3 py-1 gap-2">
        <FaSearch />
        <input
          type="text"
          placeholder="Pesquisar..."
          className="bg-transparent outline-none text-white placeholder-gray-400"
        />
      </div>

      {/* Música */}
      <div className="flex items-center gap-3">
        <FaStepBackward className="hover:text-blue-400 cursor-pointer" />
        <FaPlay className="hover:text-green-400 cursor-pointer" />
        <FaStepForward className="hover:text-blue-400 cursor-pointer" />
      </div>
    </div>
  );
}

export default Controller;
