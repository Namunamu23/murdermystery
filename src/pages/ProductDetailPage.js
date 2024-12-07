// src/pages/ProductDetailPage.js

import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import productService from "../services/productService";
import cartService from "../services/cartService";
import {
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  HeartIcon,
} from "@heroicons/react/solid";
import { CartContext } from "../contexts/CartContext";
import "../styles/ProductDetailPage.css"; // Import your custom CSS

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // 'success' or 'error'
  const [loading, setLoading] = useState(true); // Loading state
  const [isAdding, setIsAdding] = useState(false); // State for add-to-cart action
  const [isWishlisted, setIsWishlisted] = useState(false); // Wishlist state

  const { loadCart } = useContext(CartContext);

  useEffect(() => {
    // Fetch product details
    productService
      .getProductById(id)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch product:", error);
        setMessage("Failed to load product details.");
        setMessageType("error");
        setLoading(false);
      });

    // Fetch cart items
    loadCartItems();

    // Fetch wishlist status (if applicable)
    checkWishlistStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCartItems = () => {
    cartService
      .getCart()
      .then((response) => {
        setCartItems(response.data);
      })
      .catch((error) => console.error("Failed to load cart items:", error));
  };

  const checkWishlistStatus = () => {
    // Implement wishlist status check if your application supports wishlists
    // Example:
    // wishlistService.isProductWishlisted(id).then(setIsWishlisted).catch(console.error);
    // For now, we'll default to false
    setIsWishlisted(false);
  };

  const toggleWishlist = () => {
    // Implement wishlist toggle functionality
    // Example:
    // if (isWishlisted) {
    //   wishlistService.removeFromWishlist(id).then(() => setIsWishlisted(false)).catch(console.error);
    // } else {
    //   wishlistService.addToWishlist(id).then(() => setIsWishlisted(true)).catch(console.error);
    // }
    // For now, we'll just toggle the state
    setIsWishlisted((prev) => !prev);
    setMessage(isWishlisted ? "Removed from wishlist." : "Added to wishlist.");
    setMessageType("success");
    setTimeout(() => {
      setMessage("");
      setMessageType("success");
    }, 3000);
  };

  const addToCart = () => {
    if (!product) return;

    setIsAdding(true);

    // Check if the product already exists in the cart
    const existingCartItem = cartItems.find(
      (item) => item.productId === product.productId
    );

    // Check if stock is sufficient
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > product.stockQuantity) {
        setMessage("Cannot add more. Not enough stock available.");
        setMessageType("error");
        setIsAdding(false);
        return;
      }

      // Product exists, so just increase quantity
      cartService
        .addToCart(product.productId, quantity)
        .then(() => {
          setMessage("Quantity updated in your cart.");
          setMessageType("success");
          loadCartItems(); // Refresh cart items to reflect changes
        })
        .catch((error) => {
          setMessage("Failed to add product to cart.");
          setMessageType("error");
          console.error("Error adding product to cart:", error);
        })
        .finally(() => {
          setIsAdding(false);
          setTimeout(() => {
            setMessage("");
            setMessageType("success");
          }, 3000);
        });
    } else {
      // Product doesn't exist, add it as a new item
      if (quantity > product.stockQuantity) {
        setMessage("Cannot add more. Not enough stock available.");
        setMessageType("error");
        setIsAdding(false);
        return;
      }

      cartService
        .addToCart(product.productId, quantity)
        .then(() => {
          setMessage("Product added to cart!");
          setMessageType("success");
          loadCartItems(); // Refresh cart items to reflect changes
        })
        .catch((error) => {
          setMessage("Failed to add product to cart.");
          setMessageType("error");
          console.error("Error adding product to cart:", error);
        })
        .finally(() => {
          setIsAdding(false);
          setTimeout(() => {
            setMessage("");
            setMessageType("success");
          }, 3000);
        });
    }
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  if (loading)
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <div className="spinner"></div>
        <div className="loading-message">Loading product details...</div>
      </div>
    );

  if (!product)
    return (
      <div className="product-detail-container">
        <div className="message-box error">
          <p>Product not found.</p>
          <Link to="/products" className="back-to-products-button">
            &larr; Back to Products
          </Link>
        </div>
      </div>
    );

  return (
    <div className="product-detail-container">
      {message && (
        <div className={`message-box ${messageType}`} role="alert">
          <p>{message}</p>
        </div>
      )}
      <div className="product-detail-content">
        {/* Product Image */}
        <div className="product-image-container">
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          {/* Wishlist Toggle */}
          <button
            className="wishlist-button"
            onClick={toggleWishlist}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
          >
            <HeartIcon
              className={`wishlist-icon ${isWishlisted ? "filled" : ""}`}
            />
          </button>
        </div>
        {/* Product Details */}
        <div className="product-info-container">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-stock">
            Available Stock: {product.stockQuantity}
          </p>
          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label htmlFor="quantity" className="quantity-label">
              Quantity:
            </label>
            <div className="quantity-controls">
              <button
                onClick={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
                className="quantity-button decrease-button"
                aria-label="Decrease quantity"
                disabled={isAdding || quantity <= 1}
              >
                <MinusIcon className="quantity-icon" />
              </button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={product.stockQuantity}
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
                aria-label="Quantity input"
              />
              <button
                onClick={() =>
                  setQuantity((prev) =>
                    prev < product.stockQuantity ? prev + 1 : prev
                  )
                }
                className={`quantity-button increase-button ${
                  quantity >= product.stockQuantity ? "disabled-button" : ""
                }`}
                aria-label="Increase quantity"
                disabled={isAdding || quantity >= product.stockQuantity}
              >
                <PlusIcon className="quantity-icon" />
              </button>
            </div>
          </div>
          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            className="add-to-cart-button"
            disabled={isAdding || product.stockQuantity === 0}
            aria-disabled={isAdding || product.stockQuantity === 0}
          >
            <ShoppingCartIcon className="add-to-cart-icon" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
      {/* Back to Products */}
      <div className="back-to-products">
        <Link to="/products" className="back-link">
          &larr; Back to Products
        </Link>
      </div>
    </div>
  );
}

export default ProductDetailPage;
