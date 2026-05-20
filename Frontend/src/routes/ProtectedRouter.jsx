import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginUrl, error403Url } from "./urls";

export const ProtectedAdminRoute = ({
  children,
}) => {
  const token =
    localStorage.getItem("accessToken");

  if (!token) {
    return (
      <Navigate
        to={loginUrl}
        replace
      />
    );
  }

  try {
    const decoded = jwtDecode(token);

    const currentTime =
      Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.clear();

      return (
        <Navigate
          to={loginUrl}
          replace
        />
      );
    }

    return children;
  } catch (error) {
    localStorage.removeItem("accessToken");

    return (
      <Navigate
        to={loginUrl}
        replace
      />
    );
  }
};

export const ProtectedUserRoute =({ children }) => {
    return children;
};