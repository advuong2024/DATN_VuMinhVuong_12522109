import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "@/page/User/Home/View/HomePage";
import BookingPage from "@/page/User/Booking/View/BookingPage";
import SpecialtyPage from "@/page/User/Specialty/View/SpecialtyPage";
import SpecialtyDetailPage from "@/page/User/Specialty/Detail/SpecialtyDetailPage";
import ServicesPage from "@/page/User/Service/View/ServicePage";
import ServiceDetailPage from "@/page/User/Service/Detail/ServiceDetailPage";
import UserDoctorPage from "@/page/User/Doctor/View/DoctorPage";
import MyselfPage from "@/page/User/Myself/View/MyselfPage";

import UserLayout from "@/components/layout/User/UseLayout";
import MainLayout from "@/components/layout/Admin/MainLayout";
import DashboardPage from "@/page/Admin/Dashboard/View/DashboardPage";
import LoginForm from "@/page/Login/Views/loginView";
import BookPage from "@/page/Admin/Booking/View/BookPage";
import AccountPage from "@/page/Admin/Account/View/AccountPage";
import CustomerPage from "@/page/Admin/Customer/View/CustomerPage";
import DoctorPage from "@/page/Admin/Doctor/View/DoctorPage";
import ServicePage from "@/page/Admin/Services/View/ServicePage";
import EncounterPage from "@/page/Admin/Encounter/View/EncounterPage";
import EncounterDetail from "@/page/Admin/Encounter/View/EncounterDetail/EncounterDetail";
import MedicinePage from "@/page/Admin/Medicines/View/MedicinePage";
import CategoryPage from "@/page/Admin/Category/View/CategoryPage";
import BillPage from "@/page/Admin/Bill/View/BillPage";
import HistoryPage from "@/page/Admin/Customer/View/CustomerHistory/CustomerHistoryForm";
import ProfilePage from "@/page/Admin/Profile/View/ProfilePage";
import ServiceExecutionPage from "@/page/Admin/ServiceExecution/View/ServiceExecutionPage";

import {
  loginUrl,
  error403Url,
  error404Url,
  BookUrl, MyUrl, DoctorUrl, SpecialtyUrl, specialtyDetailUrl, ServiceUrl, serviceDetailUrl,
  BookingUrl, doctorUrl, customerUrl, encounterUrl, serviceUrl, accountUrl, MedicineUrl, categoryUrl, billUrl
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
      { index: true, element: <HomePage /> },
      { path: BookUrl, element: <BookingPage />},
      { path: SpecialtyUrl, element: <SpecialtyPage/>},
      { path: specialtyDetailUrl, element: <SpecialtyDetailPage/>},
      { path: ServiceUrl, element: <ServicesPage/>},
      { path: serviceDetailUrl, element: <ServiceDetailPage/>},
      { path: DoctorUrl, element: <UserDoctorPage/>},
      { path: MyUrl, element: <MyselfPage/>},
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
      { index: true, element: <DashboardPage /> },
      { path: BookingUrl, element: <BookPage /> },
      { path: accountUrl, element: <AccountPage /> },
      { path: serviceUrl, element: <ServicePage /> },
      { path: encounterUrl, element: <EncounterPage /> },
      { path: `${encounterUrl}/:id`, element: <EncounterDetail /> },
      { path: customerUrl, element: <CustomerPage /> },
      { path: doctorUrl, element: <DoctorPage /> },
      { path: MedicineUrl, element: <MedicinePage /> },
      { path: categoryUrl, element: <CategoryPage /> },
      { path: billUrl, element: <BillPage /> },
      { path: "service-execution", element: <ServiceExecutionPage /> },
      { path: `${customerUrl}/:id`, element: <HistoryPage /> },
      { path: "profile", element: <ProfilePage /> },
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