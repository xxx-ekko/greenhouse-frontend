// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState({
    key: 0,
    text: "",
    isError: false,
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Send registration request to the backend
      const response = await api.post("/auth/register", {
        email,
        password,
      });

      setFeedback({ key: 0, text: response.data.message, isError: false });

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Erreur complète interceptée par Axios :", error);
      // Display error message from the backend
      const errorMessage =
        error.response?.data?.message || "Registration failed.";
      setFeedback((prev) => ({
        key: prev.key + 1,
        text: errorMessage,
        isError: true,
      }));
    }
  };

  return (
    <div className="auth-container">
      <div className="form-card">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
        {feedback.text && (
          <p
            key={feedback.key}
            className={feedback.isError ? "shake-error" : ""}
            style={{ color: feedback.isError ? "#d93025" : "#28a745" }}
          >
            {feedback.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
