// src/components/SensorCard/SensorCard.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./SensorCard.css";

// Objet de Configuration pour nos jauges
const gaugeConfig = {
  temperature: {
    label: "Air Temperature",
    unit: "°C",
    maxValue: 50,
    color: "#ff6b6b",
  },
  humidity: {
    label: "Air Humidity",
    unit: "%",
    maxValue: 100,
    color: "#4d96ff",
  },
  moisture_raw: {
    label: "Soil Moisture",
    unit: "",
    maxValue: 4095,
    color: "#8c5a3e",
  },
  battery_level: {
    label: "Battery Level",
    unit: "",
    maxValue: 4095,
    color: "#8c5a3e",
  },
  // On peut ajouter d'autres types ici
  default: { unit: "", maxValue: 100, color: "#cccccc" },
};

const getConfigForType = (type) =>
  gaugeConfig[type] || { ...gaugeConfig.default, label: type };

function SensorCard({ sensor }) {
  const [measurement, setMeasurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const POLLING_INTERVAL_MS = 2000; // Fetch new data every 2 seconds

  useEffect(() => {
    const fetchLatestMeasurement = async () => {
      try {
        // Fetch the latest measurement for this specific sensor
        const response = await api.get(`/sensors/${sensor.id}/measurements`);
        // The backend returns an array, we only want the most recent one (the first)
        if (response.data.length > 0) {
          setMeasurement(response.data[0]);
        }
      } catch (error) {
        console.error(
          `Failed to fetch measurements for sensor ${sensor.id}`,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    // Fetch data immediately when the component loads
    fetchLatestMeasurement();

    // Then, set up an interval to fetch data periodically
    const intervalId = setInterval(fetchLatestMeasurement, POLLING_INTERVAL_MS);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [sensor.id]); // Re-run effect if sensor.id ever changes

  return (
    <div className="sensor-card">
      <h3>{sensor.name}</h3>
      <p>{sensor.location || "No location set"}</p>
      <div className="gauges-container">
        {loading ? (
          <p>Loading data...</p>
        ) : measurement && measurement.data ? (
          // On boucle sur les GROUPES de l'objet data ('dht11', 'soil')
          Object.entries(measurement.data).map(([groupName, groupData]) => (
            <div key={groupName} className="sensor-group">
              <h4>{groupName}</h4>
              {groupData.status === "ok" ? (
                // Si le statut est OK, on boucle sur les mesures du groupe
                Object.entries(groupData).map(([type, value]) => {
                  if (type === "status") return null; // On n'affiche pas de jauge pour le statut

                  const config = getConfigForType(type);
                  const label = config.label || type.replace("_", " ");

                  return (
                    <div key={type} className="gauge-wrapper">
                      <CircularProgressbar
                        value={value || 0}
                        maxValue={config.maxValue}
                        text={`${value || "N/A"}${config.unit}`}
                        styles={buildStyles({
                          pathColor: config.color,
                          textColor: "#333",
                          trailColor: "#d6d6d6",
                        })}
                      />
                      <span className="gauge-label">{label}</span>
                    </div>
                  );
                })
              ) : (
                // Si le statut est 'error', on affiche un message d'erreur
                <div className="sensor-error">
                  <p>⚠️ Sensor Error</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No data available for this sensor.</p>
        )}
      </div>
    </div>
  );
}

export default SensorCard;
