// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
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
      <div className="logo">Greenhouse Dashboard</div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </header>
  );
}

export default Header;
