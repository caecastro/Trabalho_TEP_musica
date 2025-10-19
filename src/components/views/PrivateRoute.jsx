// src/components/views/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
