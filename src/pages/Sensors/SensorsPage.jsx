// src/pages/Sensors/SensorsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./SensorsPage.css";

function SensorsPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [feedback, setFeedback] = useState({
    message: "",
    isError: false,
    key: 0,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/sensors", { name, type, location });
      setFeedback({
        message: "Sensor added successfully! Redirecting...",
        isError: false,
        key: feedback.key + 1,
      });

      // Redirect to the main dashboard after a short delay to show the message
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add sensor.";
      setFeedback({
        message: errorMessage,
        isError: true,
        key: feedback.key + 1,
      });
    }
  };

  return (
    <div className="page-content">
      <h1>Manage Sensors</h1>

      <div className="form-container">
        <h2>Add a New Sensor</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Sensor Name (Required)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Sensor Type (e.g., DHT22)</label>
            <input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit">Add Sensor</button>
        </form>
        {feedback.message && (
          <p
            key={feedback.key}
            className={
              feedback.isError
                ? "feedback-message error shake-error"
                : "feedback-message success"
            }
          >
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default SensorsPage;
