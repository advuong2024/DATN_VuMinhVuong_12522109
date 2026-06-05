import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginUrl } from "./urls";
import { useAuth } from "@/page/Login/context/AuthContext";

export const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to={loginUrl} replace />;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.clear();
      return <Navigate to={loginUrl} replace />;
    }
    return children;
  } catch {
    localStorage.removeItem("accessToken");
    return <Navigate to={loginUrl} replace />;
  }
};

export const ProtectedUserRoute = ({ children }) => {
  return children;
};
