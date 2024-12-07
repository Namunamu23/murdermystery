// /src/services/productService.js:

import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api/v1/products";

class ProductService {
  getProducts() {
    return axios.get(API_URL);
  }

  getProductById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  // Admin functions
  createProduct(product) {
    return axios.post(API_URL, product, {
      headers: authService.authHeader(),
    });
  }

  updateProduct(id, product) {
    return axios.put(`${API_URL}/${id}`, product, {
      headers: authService.authHeader(),
    });
  }

  deleteProduct(id) {
    return axios.delete(`${API_URL}/${id}`, {
      headers: authService.authHeader(),
    });
  }
}

export default new ProductService();
