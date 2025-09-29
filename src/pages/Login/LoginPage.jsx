// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    key: 0,
    text: "",
    isError: false,
  });

  const handleLogin = async (e) => {
    //debugger;
    e.preventDefault();
    try {
      // 1. Send login request to the backend
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      // 2. If login is successful, get the token from the response
      const { token } = response.data;

      // 3. Store the token in localStorage
      // localStorage is a simple way to keep data in the browser even after the page is refreshed.
      localStorage.setItem("token", token);

      setFeedback({
        key: 0,
        text: "Login successful! Redirecting...",
        isError: false,
      });

      // 4. Redirect to the dashboard page
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      // When an error occurs, update the message text and increment the key
      const errorMessage = error.response?.data?.message || "Login failed.";
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
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
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

export default LoginPage;
