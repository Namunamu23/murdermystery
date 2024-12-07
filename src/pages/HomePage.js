// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import { PlayIcon } from "@heroicons/react/solid";
import { Parallax } from "react-parallax";
import "../styles/HomePage.css"; // Import your custom CSS
import bannerImage2 from "../images/banner.jpg";
import bannerImage from "../images/banner1.jpeg";

function HomePage() {
  return (
    <div className="home-container">
      {/* Parallax Hero Section */}
      <Parallax
        bgImage={bannerImage}
        strength={300}
        bgImageStyle={{ maxHeight: "70vh" }}
      >
        <div className="hero-section">
          <div className="overlay"></div>
          <div className="hero-content">
            <h1 className="home-title">Welcome to Mystery City</h1>
            <p className="home-description">
              Unleash your inner detective. Solve thrilling mysteries and embark
              on an unforgettable adventure.
            </p>
            <Link to="/products" className="home-cta">
              <PlayIcon className="icon" />
              Explore Games
            </Link>
          </div>
        </div>
      </Parallax>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2 className="featured-title">Featured Cases</h2>
        <div className="featured-grid">
          {/* Example Featured Products */}
          <div className="featured-card">
            <img
              src="/images/featured-product1.jpg"
              alt="Case File: The Silent Witness"
              className="featured-image"
            />
            <div className="featured-info">
              <h3 className="featured-name">Case File: The Silent Witness</h3>
              <p className="featured-description">
                Delve into a mystery where every clue counts. Can you uncover
                the truth?
              </p>
              <Link to="/products/1" className="featured-cta">
                <PlayIcon className="icon" />
                View Details
              </Link>
            </div>
          </div>
          <div className="featured-card">
            <img
              src="/images/featured-product2.jpg"
              alt="Case File: Midnight Heist"
              className="featured-image"
            />
            <div className="featured-info">
              <h3 className="featured-name">Case File: Midnight Heist</h3>
              <p className="featured-description">
                Experience the thrill of solving a high-stakes heist. Are you up
                for the challenge?
              </p>
              <Link to="/products/2" className="featured-cta">
                <PlayIcon className="icon" />
                View Details
              </Link>
            </div>
          </div>
          {/* Add more featured products as needed */}
        </div>
      </section>

      {/* Optional: Additional Sections */}
      {/* Testimonials, Latest Releases, etc. */}
      <section className="testimonials">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "Mystery City has transformed my evenings! Each case file is more
              intriguing than the last."
            </p>
            <p className="testimonial-author">- Vigaca Vigacashvili</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "The attention to detail in each mystery is astounding. Highly
              recommend to fellow detectives."
            </p>
            <p className="testimonial-author">- Vigaca vigacovichi</p>
          </div>
          {/* Add more testimonials as needed */}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
