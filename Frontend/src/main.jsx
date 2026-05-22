import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./page/Login/context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={2000} />
    </AuthProvider>
    <style>{`
      .ant-select-item-option-active { background-color: #e6f4ff !important; }
      .ant-select-item-option:hover { background-color: #e6f4ff !important; }
    `}</style>
  </React.StrictMode>
);