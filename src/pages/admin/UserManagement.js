// src/pages/admin/UserManagement.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import authService from "../../services/authService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/users", {
        headers: authService.authHeader(),
      });
      setUsers(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users.");
    }
  };

  const handleDelete = async (userId) => {
    if (!userId) {
      console.error("User ID is undefined!");
      setError("Invalid user ID. Cannot delete user.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/users/${userId}`, {
          headers: authService.authHeader(),
        });
        setMessage(`User with ID ${userId} deleted successfully.`);
        loadUsers(); // Refresh user list
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">User Management</h2>
      {/* Message Alerts */}
      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>
      )}
      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-secondary text-textSecondary">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-center text-sm font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.user_id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
