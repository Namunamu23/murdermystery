import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api/auth/";

class CartService {
  addToCart(productId, quantity) {
    return axios.post(
      API_URL + "add-product-to-cart",
      { productId, quantity },
      { headers: authService.authHeader() }
    );
  }

  removeFromCart(productId, quantity) {
    return axios.post(
      API_URL + "remove-product-to-cart",
      { productId, quantity },
      { headers: authService.authHeader() }
    );
  }

  getCart() {
    return axios.get(API_URL + "get-product-to-cart", {
      headers: authService.authHeader(),
    });
  }

  clearCart() {
    return axios.delete(API_URL + "clear-cart", {
      headers: authService.authHeader(),
    });
  }
}

export default new CartService();
