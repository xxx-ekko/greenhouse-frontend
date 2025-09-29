// src/components/Sidebar/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ toggleSidebar }) {
  return (
    <aside className="sidebar">
      <button className="close-btn" onClick={toggleSidebar}>
        &times;
      </button>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/sensors"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Sensors
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Data History
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
