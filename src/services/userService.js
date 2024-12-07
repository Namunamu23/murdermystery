import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api";

class UserService {
  getCurrentUserData() {
    return axios.get(`${API_URL}/auth/me`, {
      headers: authService.authHeader(),
    });
  }

  updateUser(userId, userData) {
    return axios.put(`${API_URL}/v1/users/${userId}`, userData, {
      headers: authService.authHeader(),
    });
  }
}

export default new UserService();
