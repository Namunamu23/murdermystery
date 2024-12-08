// src/pages/ProfilePage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import authService from "../services/authService";
import { UserCircleIcon } from "@heroicons/react/solid"; // You can replace this with any icon library or an SVG
import "../styles/ProfilePage.css"; // Import ProfilePage CSS

function ProfilePage() {
  const [userData, setUserData] = useState({
    user_id: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "", // Add profile picture URL
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); // Optional: For changing password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [isEditing, setIsEditing] = useState(false); // Edit mode state

  useEffect(() => {
    // Fetch user data on component mount
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/me", {
        headers: authService.authHeader(),
      });
      console.log("Backend Response:", response.data);
      setUserData(response.data); // Ensure `user_id` and `profilePicture` are included
      setError("");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files.length > 0) {
      // Handle profile picture upload
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      if (!userData.user_id) {
        throw new Error("User ID is missing. Cannot update the profile.");
      }

      // Update user profile in the backend
      await axios.put(
        `http://localhost:8080/api/v1/users/${userData.user_id}`,
        {
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          profilePicture: userData.profilePicture, // Include profile picture if applicable
        },
        {
          headers: authService.authHeader(),
        }
      );

      // Re-authenticate the user to refresh the token
      await authService.login(userData.username, currentPassword);

      // Optionally, handle password change
      if (newPassword) {
        await axios.put(
          `http://localhost:8080/api/v1/users/${userData.user_id}/password`,
          {
            currentPassword,
            newPassword,
          },
          {
            headers: authService.authHeader(),
          }
        );
        setMessage(
          "Profile and password updated successfully! You are still logged in."
        );
      } else {
        setMessage("Profile updated successfully! You are still logged in.");
      }

      setError("");
      setIsEditing(false);
      setCurrentPassword("");
      setNewPassword("");
      loadUserData(); // Refresh user data
    } catch (error) {
      console.error("Error updating profile:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
      setMessage("");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setError("");
    setMessage("");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <UserCircleIcon className="profile-icon" />
          <h2 className="profile-title">Your Profile</h2>
        </div>
        <button onClick={handleEditToggle} className="edit-button">
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>
      {message && (
        <div className={`profile-message success`} role="alert">
          {message}
        </div>
      )}
      {error && (
        <div className={`profile-message error`} role="alert">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={`profile-form ${isEditing ? "editing" : "viewing"}`}
      >
        {/* Profile Picture */}
        <div className="form-group profile-picture-group">
          <label htmlFor="profilePicture">Profile Picture</label>
          <div className="profile-picture-container">
            {userData.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="profile-picture"
              />
            ) : (
              <div className="placeholder-picture">No Image</div>
            )}
            {isEditing && (
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleInputChange}
                className="form-input-file"
              />
            )}
          </div>
        </div>
        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter username"
            disabled={!isEditing}
            required
          />
        </div>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter email"
            disabled={!isEditing}
            required
          />
        </div>
        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter phone number"
            disabled={!isEditing}
            required
          />
        </div>
        {/* Address */}
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter address"
            disabled={!isEditing}
            required
          />
        </div>
        {/* Current Password */}
        <div className="form-group">
          <label htmlFor="currentPassword">
            Current Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            className="form-input"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            disabled={!isEditing}
          />
        </div>
        {/* New Password (Optional) */}
        {isEditing && (
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (optional)"
              disabled={!isEditing}
            />
          </div>
        )}
        {/* Submit Button */}
        {isEditing && (
          <button type="submit" className="form-button" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        )}
      </form>
    </div>
  );
}

export default ProfilePage;
