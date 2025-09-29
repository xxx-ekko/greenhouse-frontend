// src/pages/Dashboard/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/api";
import SensorCard from "../../components/SensorCard/SensorCard";
import "./Dashboard.css";

function DashboardPage() {
  // --- Tous les états ---
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // --- Un useEffect pour récupérer les données ---
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/sensors");
        setSensors(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch sensors.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSensors();
  }, []); // Se lance une seule fois au chargement

  // --- La logique de filtrage ---
  const filteredSensors = sensors.filter((sensor) => {
    if (activeFilter === "all") {
      return true; // Si le filtre est 'all', on garde tous les capteurs
    }
    // Note: l'ID du capteur est un nombre, on le compare à la valeur du filtre
    return sensor.id === parseInt(activeFilter);
  });

  // --- Les returns pour les cas de chargement et d'erreur ---
  if (loading) {
    return (
      <main className="dashboard-main">
        <p>Loading your sensors...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-main">
        <p>{error}</p>
      </main>
    );
  }

  // --- Le rendu final de la page ---
  return (
    <main className="dashboard-main">
      <h2>Dashboard Overview</h2>

      <div className="filter-bar">
        <button
          className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All Sensors
        </button>
        {sensors.map((sensor) => (
          <button
            key={sensor.id}
            className={`filter-btn ${
              activeFilter === sensor.id ? "active" : ""
            }`}
            onClick={() => setActiveFilter(sensor.id)}
          >
            {sensor.name}
          </button>
        ))}
      </div>

      <div className="sensor-grid">
        {/* On utilise la liste FILTRÉE pour l'affichage */}
        {filteredSensors.length > 0 ? (
          filteredSensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))
        ) : (
          <p>You haven't added any sensors yet, or none match the filter.</p>
        )}
      </div>
    </main>
  );
}

export default DashboardPage;
