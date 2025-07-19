// src/components/Carousel.js
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import '../styles/components/Carousel.css';

function ElectronicsCarousel() {
  return (
    <Carousel data-bs-theme="dark" className="custom-carousel">
      <Carousel.Item>
        <div className="carousel-slide independence-sale">
          <div className="carousel-content">
            <div className="carousel-text">
              <h1 className="carousel-title">
                <span className="independence-text">INDEPENDENCE</span>
                <span className="sale-text">UP TO 50% OFF</span>
              </h1>
              <p className="carousel-subtitle">Celebrate freedom with amazing deals</p>
              <Button variant="success" size="lg" className="shop-now-btn">
                SHOP NOW
              </Button>
            </div>
            <div className="carousel-decoration">
              <div className="independence-symbols">
                <div className="symbol">🇮🇳</div>
                <div className="symbol">🏛️</div>
                <div className="symbol">🎆</div>
              </div>
            </div>
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="carousel-slide tech-sale">
          <div className="carousel-content">
            <div className="carousel-text">
              <h1 className="carousel-title">
                <span className="tech-text">TECH SALE</span>
                <span className="discount-text">30% OFF</span>
              </h1>
              <p className="carousel-subtitle">Premium electronics at unbeatable prices</p>
              <Button variant="primary" size="lg" className="shop-now-btn">
                EXPLORE DEALS
              </Button>
            </div>
            <div className="carousel-decoration">
              <div className="tech-icons">
                <div className="tech-icon">🎧</div>
                <div className="tech-icon">⌚</div>
                <div className="tech-icon">📱</div>
              </div>
            </div>
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="carousel-slide new-arrivals">
          <div className="carousel-content">
            <div className="carousel-text">
              <h1 className="carousel-title">
                <span className="new-text">NEW ARRIVALS</span>
                <span className="featured-text">FEATURED</span>
              </h1>
              <p className="carousel-subtitle">Discover the latest in technology</p>
              <Button variant="warning" size="lg" className="shop-now-btn">
                VIEW NEW
              </Button>
            </div>
            <div className="carousel-decoration">
              <div className="product-highlights">
                <div className="highlight">Wireless Headphones</div>
                <div className="highlight">Smart Watches</div>
                <div className="highlight">Bluetooth Speakers</div>
              </div>
            </div>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default ElectronicsCarousel;
