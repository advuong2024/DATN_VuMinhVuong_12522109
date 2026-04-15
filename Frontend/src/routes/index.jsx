import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserLayout from "@/components/layout/User/UseLayout";
import MainLayout from "@/components/layout/Admin/MainLayout";

import LoginForm from "@/page/Login/Views/loginView";
import BookingPage from "@/page/User/Booking/View/BookingPage";
import BookPage from "@/page/Admin/Booking/View/BookPage";

import {
  loginUrl,
  error403Url,
  error404Url,
  BookingUrl,
} from "@/routes/urls";

import { ProtectedAdminRoute, ProtectedUserRoute } from "@/routes/ProtectedRouter";

const Home = () => <h2>Home </h2>;
const Error403 = () => <h2>403 Forbidden</h2>;
const Error404 = () => <h2>404 Not Found</h2>;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedUserRoute>
        <UserLayout />
      </ProtectedUserRoute>
    ),
    children: [
      { index: true, element: <BookingPage /> },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <MainLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      { index: true, element: <h2>Admin Dashboard</h2> },
      { path: BookingUrl, element: <BookPage /> },
    ],
  },

  {
    path: loginUrl,
    element: <LoginForm />,
  },

  {
    path: "/test",
    element: <MainLayout />,
  },

  { path: error403Url, element: <Error403 /> },
  { path: error404Url, element: <Error404 /> },
  { path: "*", element: <Error404 /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}