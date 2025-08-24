// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ key: 0, text: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Send login request to the backend
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email,
          password,
        }
      );

      // 2. If login is successful, get the token from the response
      const { token } = response.data;

      // 3. Store the token in localStorage
      // localStorage is a simple way to keep data in the browser
      // even after the page is refreshed.
      localStorage.setItem("token", token);

      setMessage("Login successful! Redirecting...");

      // 4. Redirect to the dashboard page
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      // When an error occurs, update the message text and increment the key
      const errorMessage = error.response?.data?.message || "Login failed.";
      setFeedback((prev) => ({ key: prev.key + 1, text: errorMessage }));
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
          <p key={feedback.key} className="shake-error">
            {feedback.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
