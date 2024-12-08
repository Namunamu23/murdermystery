// src/pages/LoginPage.js

import React, { useState, useContext } from "react";
import authService from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { LockClosedIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { CartContext } from "../contexts/CartContext";
import "../styles/LoginPage.css"; // Import LoginPage CSS

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const navigate = useNavigate();

  const { loadCart } = useContext(CartContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await authService.login(username, password);
      await loadCart();
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <div className="login-card" data-aos="fade-up">
        <div className="icon-container">
          <LockClosedIcon className="icon" />
        </div>
        <h2 className="login-title">Login to Your Account</h2>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        <form
          onSubmit={handleLogin}
          className="login-form"
          aria-label="Login Form"
        >
          {/* Username or Email */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              className="input-field"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or email"
              aria-required="true"
            />
          </div>
          {/* Password */}
          <div className="form-group password-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="input-field"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                aria-required="true"
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="toggle-password-icon" />
                ) : (
                  <EyeIcon className="toggle-password-icon" />
                )}
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="button-loading">Logging in...</span>
            ) : (
              <>
                <LockClosedIcon className="button-icon" />
                Login
              </>
            )}
          </button>
        </form>
        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
