import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TelaInicial from "./Tela_inicial.jsx";
import Home from "./pages/Home.jsx";
import Musicas from "./pages/Musicas.jsx";
import CriadorPlaylists from "./components/assets/CriadorPlaylists.jsx";
import CriadorUser from "./components/assets/CriadorUser.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TelaInicial />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/musicas/:id",
    element: <Musicas />,
  },
  {
    path: "/criador",
    element: <CriadorPlaylists />,
  },
  {
    path: "/register", // <-- Nova rota para criação de usuário
    element: <CriadorUser />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
