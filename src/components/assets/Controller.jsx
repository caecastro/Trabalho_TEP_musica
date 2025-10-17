import {
  FaSignOutAlt,
  FaSearch,
  FaPlay,
  FaStepForward,
  FaStepBackward,
  FaMusic,
  FaPlus,
  FaListUl,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";

function Controller({ onSearch }) {
  const navigate = useNavigate();
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    const confirmLogout = window.confirm("Tem certeza que deseja sair?");
    if (confirmLogout) {
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

  return (
    <div className="flex flex-col items-center w-full">
      {/* Barra principal */}
      <div className="flex items-center justify-between bg-gray-800 text-white px-6 py-4 rounded-lg shadow-md w-full max-w-4xl mx-auto">
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
          onClick={() => setShowPlaylists(!showPlaylists)}
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
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Música */}
        <div className="flex items-center gap-3">
          <FaStepBackward className="hover:text-blue-400 cursor-pointer" />
          <FaPlay className="hover:text-green-400 cursor-pointer" />
          <FaStepForward className="hover:text-blue-400 cursor-pointer" />
        </div>
      </div>

      {/* Submenu Playlists */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showPlaylists ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        } w-full max-w-4xl`}
      >
        <div className="bg-gray-700 rounded-lg shadow-md p-4 flex flex-col gap-3">
          {/* Ver Playlists */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
              <FaListUl />
              <span>Playlist 1</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
              <FaListUl />
              <span>Playlist 2</span>
            </div>
          </div>

          {/* Nova Playlist */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-green-400"
            onClick={() => navigate("/criador")}
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
