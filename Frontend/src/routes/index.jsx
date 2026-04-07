import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spin } from "antd";

import MainLayout from "@/components/layout/MainLayout";

import LoginForm from "@/page/Login/Views/loginView";

import {
  loginUrl,
  layoutUrl,
  error403Url,
  error404Url,
} from "./urls";

const Home = () => <h2>Home ✅</h2>;
const Error403 = () => <h1>403 Forbidden</h1>;
const NotFound = () => <h1>404 Not Found</h1>;


const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "100px auto" }}
      />
    );
  }

  const user = localStorage.getItem("user");

  if (!user) return <Navigate to={loginUrl} replace />;

  return children;
};


const router = createBrowserRouter([
  {
    path: loginUrl,
    element: <LoginForm />,
  },

  {
    path: layoutUrl,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
    ],
  },

  { path: error403Url, element: <Error403 /> },
  { path: error404Url, element: <NotFound /> },
  { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}