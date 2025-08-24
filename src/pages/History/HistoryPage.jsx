// src/pages/History/HistoryPage.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./HistoryPage.css";

function HistoryPage() {
  // State for the list of all sensors
  const [sensors, setSensors] = useState([]);
  // State for the ID of the currently selected sensor
  const [selectedSensorId, setSelectedSensorId] = useState("");
  // State for the measurements of the selected sensor
  const [measurements, setMeasurements] = useState([]);

  // State for loading and error messages
  const [isLoadingSensors, setIsLoadingSensors] = useState(true);
  const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);
  const [error, setError] = useState(null);

  // First Effect: Fetch the list of sensors once, when the component mounts.
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await api.get("/sensors");
        setSensors(response.data);
      } catch (err) {
        setError("Could not fetch the list of sensors.");
        console.error(err);
      } finally {
        setIsLoadingSensors(false);
      }
    };
    fetchSensors();
  }, []); // Empty dependency array means this runs only once.

  // Second Effect: Fetch measurements whenever a new sensor is selected.
  useEffect(() => {
    // Don't fetch if no sensor is selected
    if (!selectedSensorId) {
      setMeasurements([]); // Clear any previous measurements
      return;
    }

    const fetchMeasurements = async () => {
      setIsLoadingMeasurements(true);
      setError(null);
      try {
        const response = await api.get(
          `/sensors/${selectedSensorId}/measurements`
        );
        setMeasurements(response.data);
      } catch (err) {
        setError(`Could not fetch measurements for the selected sensor.`);
        console.error(err);
      } finally {
        setIsLoadingMeasurements(false);
      }
    };

    fetchMeasurements();
  }, [selectedSensorId]); // This effect depends on selectedSensorId.

  return (
    <div className="page-content">
      <h1>Data History</h1>

      <div className="history-controls">
        <label htmlFor="sensor-select">Select a Sensor:</label>
        <select
          id="sensor-select"
          value={selectedSensorId}
          onChange={(e) => setSelectedSensorId(e.target.value)}
          disabled={isLoadingSensors}
        >
          <option value="">-- Please choose a sensor --</option>
          {sensors.map((sensor) => (
            <option key={sensor.id} value={sensor.id}>
              {sensor.name} ({sensor.location || "No location"})
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        {isLoadingMeasurements ? (
          <p>Loading measurements...</p>
        ) : measurements.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Temperature (°C)</th>
                <th>Humidity (%)</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m) => (
                <tr key={m.id}>
                  <td>{new Date(m.timestamp).toLocaleString()}</td>
                  <td>{m.temperature}</td>
                  <td>{m.humidity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          selectedSensorId && <p>No measurement data found for this sensor.</p>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
