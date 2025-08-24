import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * A component that protects its children routes from unauthenticated access.
 * If no token is found in localStorage, it redirects the user to the /login page.
 * @param {{ children: React.ReactNode }} props
 */
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // This effect runs when the component first loads.
    // If there is no token, it immediately navigates to the login page.
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login");
    }
  }, [token, navigate]); // Re-run the effect if the token or navigate function ever changes.

  // If a token exists, we render the child component (the protected page).
  // If not, we render nothing (null) because the redirect is in progress.
  return token ? children : null;
}

export default ProtectedRoute;
