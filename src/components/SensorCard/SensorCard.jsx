// src/components/SensorCard/SensorCard.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/api"; // Note the path is now one level deeper
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import the default styles
import "./SensorCard.css"; // Import our custom styles

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
        ) : measurement ? (
          <>
            <div className="gauge-wrapper">
              <CircularProgressbar
                value={measurement.temperature}
                maxValue={50} // Set a realistic max temp
                text={`${measurement.temperature}°C`}
                styles={buildStyles({
                  pathColor: "#ff6b6b",
                  textColor: "#333",
                })}
              />
              <span className="gauge-label">Temperature</span>
            </div>
            <div className="gauge-wrapper">
              <CircularProgressbar
                value={measurement.humidity}
                maxValue={100}
                text={`${measurement.humidity}%`}
                styles={buildStyles({
                  pathColor: "#4d96ff",
                  textColor: "#333",
                })}
              />
              <span className="gauge-label">Humidity</span>
            </div>
          </>
        ) : (
          <p>No data available for this sensor.</p>
        )}
      </div>
    </div>
  );
}

export default SensorCard;
