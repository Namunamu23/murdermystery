// src/pages/RegisterPage.js

import React, { useState, useContext } from "react";
import authService from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { UserAddIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { CartContext } from "../contexts/CartContext";
import "../styles/RegisterPage.css";

function RegisterPage() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const navigate = useNavigate();

  const { loadCart } = useContext(CartContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await authService.register(user);
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="register-container">
      <div className="register-card" data-aos="fade-up">
        <div className="icon-container">
          <UserAddIcon className="icon" />
        </div>
        <h2 className="register-title">Create Your Account</h2>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        <form
          onSubmit={handleRegister}
          className="register-form"
          aria-label="Register Form"
        >
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="input-field"
              required
              value={user.username}
              onChange={handleChange}
              placeholder="Enter username"
              aria-required="true"
            />
          </div>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="input-field"
              required
              value={user.email}
              onChange={handleChange}
              placeholder="Enter email"
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
                name="password"
                id="password"
                className="input-field"
                required
                value={user.password}
                onChange={handleChange}
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
          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="input-field"
              required
              value={user.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              aria-required="true"
            />
          </div>
          {/* Address */}
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              className="input-field"
              required
              value={user.address}
              onChange={handleChange}
              placeholder="Enter address"
              aria-required="true"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="button-loading">Registering...</span>
            ) : (
              <>
                <UserAddIcon className="button-icon" />
                Register
              </>
            )}
          </button>
        </form>
        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
