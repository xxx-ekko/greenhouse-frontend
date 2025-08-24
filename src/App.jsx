// src/App.jsx
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Register/RegisterPage";
import LoginPage from "./pages/Login/LoginPage";
import DashboardLayout from "./Layouts/DashboardLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SensorsPage from "./pages/Sensors/SensorsPage";
import HistoryPage from "./pages/History/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes now live inside a parent route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* These are the "child" routes that will render inside the <Outlet /> */}
        <Route index element={<DashboardPage />} />
        <Route path="sensors" element={<SensorsPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
