// src/pages/CartPage.js

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/solid";
import { CartContext } from "../contexts/CartContext"; // Import CartContext

import "../styles/CartPage.css"; // Import your custom CSS

function CartPage() {
  const {
    cartItems,
    cartItemCount,
    addToCart,
    removeFromCart,
    clearCart,
    loadCart,
  } = useContext(CartContext);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // 'success' or 'error'
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIncrease = (productId, currentQuantity, stockQuantity) => {
    if (currentQuantity < stockQuantity) {
      addToCart(productId, 1)
        .then(() => {
          setMessageType("success");
        })
        .catch((error) => {
          setMessage("Failed to update the cart.");
          setMessageType("error");
          console.error(error);
        });
    } else {
      setMessage("Cannot add more. Not enough stock available.");
      setMessageType("error");
    }

    // Hide message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("success");
    }, 3000);
  };

  const handleDecrease = (productId, currentQuantity) => {
    if (currentQuantity === 1) {
      removeFromCart(productId, currentQuantity)
        .then(() => {
          setMessage("Item removed from the cart.");
          setMessageType("success");
        })
        .catch((error) => {
          setMessage("Failed to update the cart.");
          setMessageType("error");
          console.error(error);
        });
    } else {
      removeFromCart(productId, 1)
        .then(() => {
          setMessageType("success");
        })
        .catch((error) => {
          setMessage("Failed to update the cart.");
          setMessageType("error");
          console.error(error);
        });
    }

    // Hide message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("success");
    }, 3000);
  };

  const handleDeleteItem = (productId, currentQuantity) => {
    removeFromCart(productId, currentQuantity)
      .then(() => {
        setMessage("Item removed from the cart.");
        setMessageType("success");
      })
      .catch((error) => {
        console.error("Failed to delete the item:", error);
        setMessage("Failed to delete the item. Please try again.");
        setMessageType("error");
      });

    // Hide message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("success");
    }, 3000);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart()
        .then(() => {
          setMessage("Your cart has been cleared.");
          setMessageType("success");
        })
        .catch((error) => {
          console.error("Failed to clear the cart:", error);
          setMessage("Failed to clear your cart. Please try again.");
          setMessageType("error");
        });

      // Hide message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("success");
      }, 3000);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const totalCost = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  return (
    <div className="cart-page-container">
      <h2 className="cart-page-title">Your Cart</h2>

      {/* Message Box */}
      {message && (
        <div className={`cart-message-box ${messageType}`}>
          <p>{message}</p>
        </div>
      )}

      {/* Loading Spinner */}
      {/* Assuming CartContext handles loading, you can conditionally render based on loading */}
      {/* If not, you can manage loading here similarly */}

      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is empty.</p>
          <button
            onClick={() => navigate("/products")}
            className="browse-products-button"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* Cart Table */}
          <div className="cart-table-container">
            <table className="cart-table">
              <thead className="cart-table-header">
                <tr>
                  <th className="cart-table-header-cell">Product</th>
                  <th className="cart-table-header-cell">Price</th>
                  <th className="cart-table-header-cell">Quantity</th>
                  <th className="cart-table-header-cell">Total</th>
                  <th className="cart-table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.productId} className="cart-table-row">
                    <td className="cart-table-cell">{item.name}</td>
                    <td className="cart-table-cell">
                      ${item.soloPrice.toFixed(2)}
                    </td>
                    <td className="cart-table-cell quantity-cell">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleDecrease(item.productId, item.quantity)
                          }
                          className="quantity-button decrease-button"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="quantity-icon" />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleIncrease(
                              item.productId,
                              item.quantity,
                              item.stockQuantity
                            )
                          }
                          className={`quantity-button increase-button ${
                            item.quantity >= item.stockQuantity
                              ? "disabled-button"
                              : ""
                          }`}
                          aria-label="Increase quantity"
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          <PlusIcon className="quantity-icon" />
                        </button>
                      </div>
                    </td>
                    <td className="cart-table-cell">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                    <td className="cart-table-cell actions-cell">
                      <button
                        onClick={() =>
                          handleDeleteItem(item.productId, item.quantity)
                        }
                        className="delete-item-button"
                        aria-label={`Delete ${item.name} from cart`}
                      >
                        <TrashIcon className="delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary and Actions */}
          <div className="cart-summary-actions">
            <div className="cart-total">Total: ${totalCost.toFixed(2)}</div>
            <div className="cart-action-buttons">
              <button onClick={handleClearCart} className="clear-cart-button">
                <TrashIcon className="clear-cart-icon" />
                Clear Cart
              </button>
              <button onClick={handleCheckout} className="checkout-button">
                Proceed to Checkout
                {/* Optionally add an icon here */}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
