// src/layouts/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="content-area">
        <Outlet />{" "}
        {/* Child pages like Dashboard, Sensors, etc., will be rendered here */}
      </div>
    </div>
  );
}

export default DashboardLayout;
