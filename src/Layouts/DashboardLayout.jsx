// src/layouts/DashboardLayout.jsx
import React, { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import "./DashboardLayout.css";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const contentAreaRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleScroll = () => {
    const currentScrollTop = contentAreaRef.current.scrollTop;

    // Si on est tout en haut ou si on scrolle vers le haut
    if (currentScrollTop < lastScrollTop.current || currentScrollTop <= 0) {
      setIsHeaderVisible(true);
    } else {
      // Si on scrolle vers le bas
      setIsHeaderVisible(false);
    }
    lastScrollTop.current = currentScrollTop;
  };

  return (
    <div className="dashboard-layout">
      {/* Fonction 'toggleSidebar' en prop au composant Sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      {/* Overlay qui n'est visible que si la sidebar est ouverte */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* On sépare le header et le contenu scrollable */}
      <div className="main-content-wrapper">
        <div
          className={`header-container ${
            isHeaderVisible ? "visible" : "hidden"
          }`}
        >
          {/* On passe la fonction toggleSidebar au Header */}
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <main
          className="content-area"
          ref={contentAreaRef}
          onScroll={handleScroll}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
