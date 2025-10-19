import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TelaInicial from "./Tela_inicial.jsx";
import Home from "./pages/Home.jsx";
import Musicas from "./pages/Musicas.jsx";
import CriadorPlaylists from "./components/assets/CriadorPlaylists.jsx";
import CriadorUser from "./components/assets/CriadorUser.jsx";
import PrivateRoute from "./components/views/PrivateRoute.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TelaInicial />,
  },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: "/musicas/:id",
    element: (
      <PrivateRoute>
        <Musicas />
      </PrivateRoute>
    ),
  },
  {
    path: "/criador",
    element: (
      <PrivateRoute>
        <CriadorPlaylists />
      </PrivateRoute>
    ),
  },
  {
    path: "/criador/:id",
    element: (
      <PrivateRoute>
        <CriadorPlaylists />
      </PrivateRoute>
    ),
  },
  {
    path: "/register",
    element: <CriadorUser />,
  },
  {
    path: "/editar-user", // ← NOVA ROTA PARA EDITAR USUÁRIO
    element: (
      <PrivateRoute>
        <CriadorUser />
      </PrivateRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
