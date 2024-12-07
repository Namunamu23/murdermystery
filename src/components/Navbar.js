// src/components/Navbar.js

import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { CartContext } from "../contexts/CartContext"; // Import CartContext
import ThemeToggle from "./ThemeToggle";
import {
  MenuIcon,
  XIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  SearchIcon,
} from "@heroicons/react/outline";

import "../styles/Navbar.css"; // Import your custom CSS

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopProfileDropdownOpen, setIsDesktopProfileDropdownOpen] =
    useState(false);
  const [isMobileProfileDropdownOpen, setIsMobileProfileDropdownOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const desktopProfileDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);

  // Consume CartContext
  const { cartItemCount, loadCart } = useContext(CartContext);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  // Function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Refresh cart count when location changes (e.g., after adding to cart)
  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Close desktop profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideDesktop = (event) => {
      if (
        desktopProfileDropdownRef.current &&
        !desktopProfileDropdownRef.current.contains(event.target)
      ) {
        setIsDesktopProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideDesktop);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDesktop);
    };
  }, []);

  // Close mobile profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideMobile = (event) => {
      if (
        mobileProfileDropdownRef.current &&
        !mobileProfileDropdownRef.current.contains(event.target)
      ) {
        setIsMobileProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMobile);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMobile);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Optional: Add a logo image here */}
          {/* <img src="/path-to-logo.png" alt="Mystery City Logo" className="logo" /> */}
          <span className="logo-text">Mystery City</span>
        </Link>

        {/* Search Bar - Hidden on Mobile */}
        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
          <button type="submit" className="search-button" aria-label="Search">
            <SearchIcon className="search-icon" />
          </button>
        </form>

        {/* Desktop Menu */}
        <div className="navbar-links">
          <Link
            to="/products"
            className={`nav-link ${isActive("/products") ? "active-link" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/cart"
            className={`nav-link cart-link ${
              isActive("/cart") ? "active-link" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="View Cart"
          >
            <ShoppingCartIcon className="cart-icon" />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
          {currentUser ? (
            <div className="profile-menu" ref={desktopProfileDropdownRef}>
              <button
                onClick={() =>
                  setIsDesktopProfileDropdownOpen(!isDesktopProfileDropdownOpen)
                }
                className="profile-button"
                aria-haspopup="true"
                aria-expanded={isDesktopProfileDropdownOpen}
                aria-label="User menu"
              >
                <UserCircleIcon className="profile-icon" />
                <span className="username">{currentUser.username}</span>
                <svg
                  className={`dropdown-arrow ${
                    isDesktopProfileDropdownOpen ? "open" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Profile Dropdown */}
              {isDesktopProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-link"
                    onClick={() => setIsDesktopProfileDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  {currentUser.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="dropdown-link"
                      onClick={() => setIsDesktopProfileDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="dropdown-link logout-button"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${
                  isActive("/login") ? "active-link" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`nav-link ${
                  isActive("/register") ? "active-link" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
          {/* Theme Toggle */}
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-button">
          <button
            className="menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XIcon className="menu-icon" />
            ) : (
              <MenuIcon className="menu-icon" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mobile-search">
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button
              type="submit"
              className="mobile-search-button"
              aria-label="Search"
            >
              <SearchIcon className="mobile-search-icon" />
            </button>
          </form>

          {/* Mobile Navigation Links */}
          <Link
            to="/products"
            className={`mobile-nav-link ${
              isActive("/products") ? "active-mobile-link" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/cart"
            className={`mobile-nav-link ${
              isActive("/cart") ? "active-mobile-link" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="View Cart"
          >
            <ShoppingCartIcon className="mobile-cart-icon" />
            Cart
            {cartItemCount > 0 && (
              <span className="mobile-cart-count">{cartItemCount}</span>
            )}
          </Link>

          {currentUser ? (
            <div className="mobile-profile-menu" ref={mobileProfileDropdownRef}>
              <button
                onClick={() =>
                  setIsMobileProfileDropdownOpen(!isMobileProfileDropdownOpen)
                }
                className="mobile-profile-button"
                aria-haspopup="true"
                aria-expanded={isMobileProfileDropdownOpen}
                aria-label="User menu"
              >
                <UserCircleIcon className="mobile-profile-icon" />
                <span className="mobile-username">{currentUser.username}</span>
                <svg
                  className={`mobile-dropdown-arrow ${
                    isMobileProfileDropdownOpen ? "open" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Mobile Profile Dropdown */}
              {isMobileProfileDropdownOpen && (
                <div className="mobile-profile-dropdown">
                  <Link
                    to="/profile"
                    className="mobile-dropdown-link"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileProfileDropdownOpen(false);
                    }}
                  >
                    Profile
                  </Link>
                  {currentUser.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="mobile-dropdown-link"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileProfileDropdownOpen(false);
                      }}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                      setIsMobileProfileDropdownOpen(false);
                    }}
                    className="mobile-dropdown-link logout-button"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`mobile-nav-link ${
                  isActive("/login") ? "active-mobile-link" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`mobile-nav-link ${
                  isActive("/register") ? "active-mobile-link" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
          {/* Theme Toggle in Mobile Menu */}
          <div className="mobile-theme-toggle"></div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
