import React, { useState, useEffect } from "react";
import api from "../../api/api";
import Header from "../../components/Header/Header";
import SensorCard from "../../components/SensorCard/SensorCard";

import "./Dashboard.css";

function DashboardPage() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function runs once when the component loads
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/sensors"); // Use our API client
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
  }, []); // The empty array [] ensures this effect runs only once on mount

  if (loading)
    return (
      <>
        <Header />
        <p>Loading your sensors...</p>
      </>
    );
  if (error)
    return (
      <>
        <Header />
        <p>{error}</p>
      </>
    );

  return (
    <div className="dashboard-container">
      <Header />
      <main className="dashboard-main">
        <h1>Your Sensors</h1>
        <div className="sensor-grid">
          {sensors.length > 0 ? (
            sensors.map((sensor) => (
              <div key={sensor.id} className="">
                {/* <h3>{sensor.name}</h3>
                <p>{sensor.location || "No location set"}</p> */}
                <SensorCard key={sensor.id} sensor={sensor} />
              </div>
            ))
          ) : (
            <p>You haven't added any sensors yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
