// src/components/views/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para a página inicial se o usuário não estiver autenticado
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
