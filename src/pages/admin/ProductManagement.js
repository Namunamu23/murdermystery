// src/pages/admin/ProductManagement.js

import React, { useEffect, useState } from "react";
import productService from "../../services/productService";


function ProductManagement() {
  const [products, setProducts] = useState([]);
  // State for product form
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categories: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    productService
      .getProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        setError("Failed to load products.");
        console.error(error);
      });
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (
      !productForm.name ||
      !productForm.description ||
      !productForm.price ||
      !productForm.stockQuantity
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Convert price and stockQuantity to numbers
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      stockQuantity: parseInt(productForm.stockQuantity, 10),
    };

    if (editingProductId) {
      productService
        .updateProduct(editingProductId, productData)
        .then(() => {
          setEditingProductId(null);
          setProductForm({
            name: "",
            description: "",
            price: "",
            stockQuantity: "",
            categories: "",
          });
          setSuccessMessage("Product updated successfully.");
          loadProducts();
        })
        .catch((error) => {
          setError("Failed to update product.");
          console.error(error);
        });
    } else {
      productService
        .createProduct(productData)
        .then(() => {
          setProductForm({
            name: "",
            description: "",
            price: "",
            stockQuantity: "",
            categories: "",
          });
          setSuccessMessage("Product added successfully.");
          loadProducts();
        })
        .catch((error) => {
          setError("Failed to add product.");
          console.error(error);
        });
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product.productId);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price.toString() || "",
      stockQuantity: product.stockQuantity.toString() || "",
      categories: product.categories || "",
    });
    setSuccessMessage("");
    setError("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      productService
        .deleteProduct(id)
        .then(() => {
          setSuccessMessage("Product deleted successfully.");
          loadProducts();
        })
        .catch((error) => {
          setError("Failed to delete product.");
          console.error(error);
        });
    }
  };

  return (
    <div className="product-management-container">
      <h2 className="product-management-title">Product Management</h2>
      {/* Form Section */}
      <div className="product-form-section">
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="product-form">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={productForm.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter product name"
              required
            />
          </div>
          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={productForm.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter product description"
              required
            ></textarea>
          </div>
          {/* Price */}
          <div className="form-group">
            <label className="form-label">
              Price ($) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={productForm.price}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter product price"
              step="0.01"
              required
            />
          </div>
          {/* Stock Quantity */}
          <div className="form-group">
            <label className="form-label">
              Stock Quantity <span className="required">*</span>
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={productForm.stockQuantity}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter stock quantity"
              required
            />
          </div>
          {/* Categories */}
          <div className="form-group">
            <label className="form-label">Categories</label>
            <input
              type="text"
              name="categories"
              value={productForm.categories}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter categories (e.g., Electronics;Mobile)"
            />
          </div>
          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {editingProductId ? "Update Product" : "Add Product"}
            </button>
            {editingProductId && (
              <button
                type="button"
                onClick={() => {
                  setEditingProductId(null);
                  setProductForm({
                    name: "",
                    description: "",
                    price: "",
                    stockQuantity: "",
                    categories: "",
                  });
                  setError("");
                  setSuccessMessage("");
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Product List Section */}
      <div className="product-list-section">
        <h3 className="product-list-title">Product List</h3>
        <div className="product-table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Description</th>
                <th className="table-header-cell">Price ($)</th>
                <th className="table-header-cell">Stock</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-table-message">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.productId} className="table-row">
                    <td className="table-cell">{product.name}</td>
                    <td className="table-cell">{product.description}</td>
                    <td className="table-cell">${product.price.toFixed(2)}</td>
                    <td className="table-cell">{product.stockQuantity}</td>
                    <td className="table-cell actions-cell">
                      <button
                        onClick={() => handleEdit(product)}
                        className="edit-button"
                        aria-label={`Edit ${product.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.productId)}
                        className="delete-button"
                        aria-label={`Delete ${product.name}`}
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
    </div>
  );
}

export default ProductManagement;
