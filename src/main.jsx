import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TelaInicial from "./Tela_inicial.jsx";
import Home from "./pages/Home.jsx";
import CriadorPlaylists from "./components/assets/CriadorPlaylists.jsx";
import CriadorUser from "./components/assets/CriadorUser.jsx";
import PrivateRoute from "./components/views/PrivateRoute.jsx";
import "./index.css";

// ✅ Melhor prática: agrupar rotas privadas e públicas de forma clara
const privateRoutes = [
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/criador",
    element: <CriadorPlaylists />,
  },
  {
    path: "/criador/:id",
    element: <CriadorPlaylists />,
  },
  {
    path: "/editar-user",
    element: <CriadorUser />,
  },
];

const publicRoutes = [
  {
    path: "/",
    element: <TelaInicial />,
  },
  {
    path: "/register", // cadastro de usuário é público
    element: <CriadorUser />,
  },
];

// Envolvidas todas rotas privadas com PrivateRoute de forma centralizada
const router = createBrowserRouter([
  ...publicRoutes,
  ...privateRoutes.map((route) => ({
    ...route,
    element: <PrivateRoute>{route.element}</PrivateRoute>,
  })),
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
