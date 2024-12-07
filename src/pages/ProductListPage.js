// src/pages/ProductListPage.js

import React, { useEffect, useState } from "react";
import productService from "../services/productService";
import { Link } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/solid";
import ProductCard from "../components/ProductCard"; // Reusable Product Card Component

import "../styles/ProductListPage.css"; // Import your custom CSS

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(""); // State for error handling

  useEffect(() => {
    productService
      .getProducts()
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Our Products</h2>
      {loading ? (
        <div className="loading-spinner" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="error-message" role="alert">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="no-products-message">
          <p>No products available at the moment.</p>
          <Link to="/" className="back-to-home-button">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductListPage;
