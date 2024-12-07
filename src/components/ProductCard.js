// src/components/ProductCard.js

import React from "react";
import { Link } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/solid";

function ProductCard({ product }) {
  return (
    <div className="product-card" data-aos="fade-up">
      <Link
        to={`/products/${product.productId}`}
        className="product-image-link"
      >
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </Link>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <Link
          to={`/products/${product.productId}`}
          className="view-details-button"
          aria-label={`View details of ${product.name}`}
        >
          <EyeIcon className="eye-icon" />
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
