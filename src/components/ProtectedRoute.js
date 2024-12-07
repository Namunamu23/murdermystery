import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authService";

function ProtectedRoute({ children, adminOnly = false }) {
  const currentUser = authService.getCurrentUser();
  const [accessDenied, setAccessDenied] = React.useState(false);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && currentUser.role !== "ADMIN") {
    setAccessDenied(true);
    return <Navigate to="/" />;
  }
  return (
    <>
      {accessDenied && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Access denied: You do not have the necessary permissions.
        </div>
      )}
      {children}
    </>
  );
}

export default ProtectedRoute;
