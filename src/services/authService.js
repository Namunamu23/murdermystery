// src/services/authService.js
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for jwtDecode

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  constructor() {
    // Setup Axios interceptor for global error handling
    axios.interceptors.response.use(
      (response) => response, // Pass successful responses
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          alert(
            "You are not authorized to access this resource. Redirecting to login."
          );
          this.logout();
          window.location.href = "/login"; // Redirect to login
        }
        return Promise.reject(error); // Let other errors propagate
      }
    );
  }

  login(username, password) {
    return axios
      .post(API_URL + "login", { username, password })
      .then((response) => {
        if (response.data) {
          // Store only the token in localStorage
          localStorage.setItem("user", response.data);
        }
        return response.data;
      });
  }

  authHeader() {
    const token = localStorage.getItem("user");
    if (token) {
      console.log("Token retrieved from localStorage:", token);
      return { Authorization: "Bearer " + token };
    } else {
      console.warn("No token found in localStorage.");
      return {};
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return axios.post(API_URL + "register", user);
  }

  getCurrentUser() {
    const token = localStorage.getItem("user");
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.warn("Token has expired.");
        this.logout();
        return null;
      }

      return { username: decodedToken.sub, role: decodedToken.role, token };
    } catch (e) {
      console.error("Invalid token format:", e);
      this.logout();
      return null;
    }
  }

  // Fetch user role from the backend
  getUserRole() {
    return axios
      .get(API_URL + "me", {
        headers: this.authHeader(),
      })
      .then((response) => response.data.role)
      .catch((error) => {
        console.error("Error fetching user role:", error);
        throw error;
      });
  }
}

export default new AuthService();
