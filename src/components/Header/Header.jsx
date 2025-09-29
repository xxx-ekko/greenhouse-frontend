// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

// 'toggleSidebar' en prop
function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Remove the token from local storage
    localStorage.removeItem("token");
    console.log("User logged out, token removed.");

    // 2. Redirect the user to the login page
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-column header-left">
        <button className="hamburger-menu" onClick={toggleSidebar}>
          ☰
        </button>
      </div>

      <div className="header-column header-center">
        <div className="logo">
          Le Pouls <span className="logo-highlight">Vert</span>
        </div>
      </div>

      <div className="header-column header-right">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
