import { Navigate } from "react-router-dom";
import { loginUrl, error403Url } from "./urls";

export const ProtectedAdminRoute = ({ children }) => {
    // const user = JSON.parse(localStorage.getItem("user"));

    // if (!user) return <Navigate to={loginUrl} replace />;

    // if (user.role !== "admin") {
    //     return <Navigate to = {error403Url} replace />;
    // }

    return children;
}

export const ProtectedUserRoute =({ children }) => {
    return children;
};