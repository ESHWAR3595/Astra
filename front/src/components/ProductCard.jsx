import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { useImageLoader } from '../hooks/useImageLoader';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, formatProductName, truncateText, getStockStatus } from '../utils/formatters';
import '../styles/components/ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isValidImageUrl, handleImageError } = useImageLoader();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Default stock to 0 if not provided
  const stock = product.stock || 0;
  const stockStatus = getStockStatus(stock);
  
  const handleViewDetails = () => {
    navigate(`/view-details/${product.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (stockStatus.status === 'out') return;
    
    setIsAddingToCart(true);
    addToCart(product, 1);
    
    // Show feedback
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const imageUrl = isValidImageUrl(product.imageUrl) ? product.imageUrl : null;

  return (
    <Card className={`product-card ${stockStatus.status === 'out' ? 'out-of-stock' : ''}`}>
      <div className="image-container">
        <Card.Img
          variant="top"
          src={imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNmM3NTdkIj5QPC90ZXh0Pjwvc3ZnPg=='}
          alt={product.name}
          className="product-image"
          onError={(e) => handleImageError(e, product.name)}
          loading="lazy"
        />
        <Badge 
          bg={stockStatus.color} 
          className="stock-badge"
        >
          {stockStatus.text}
        </Badge>
        
        {/* Wishlist Button */}
        <Button
          variant="outline-light"
          size="sm"
          className={`wishlist-btn ${isInWishlist(product.id) ? 'liked' : ''}`}
          onClick={handleToggleWishlist}
          title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i className={`bi bi-heart${isInWishlist(product.id) ? '-fill' : ''}`}></i>
        </Button>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="product-title">
          {formatProductName(product.name)}
        </Card.Title>
        
        <Card.Text className="product-description flex-grow-1">
          {truncateText(product.description, 80)}
        </Card.Text>
        
        <div className="product-meta">
          <div className="price-rating">
            <span className="product-price">{formatPrice(product.price)}</span>
            {product.rating > 0 && (
              <span className="product-rating">
                ⭐ {product.rating.toFixed(1)}
              </span>
            )}
          </div>
          
          <div className="action-buttons">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={handleAddToCart}
              disabled={stockStatus.status === 'out' || isAddingToCart}
              className="add-to-cart-btn"
              title={isInCart(product.id) ? 'Already in cart' : 'Add to cart'}
            >
              {isAddingToCart ? (
                <>
                  <i className="bi bi-check-circle-fill me-1"></i>
                  Added!
                </>
              ) : isInCart(product.id) ? (
                <>
                  <i className="bi bi-cart-check me-1"></i>
                  In Cart
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-1"></i>
                  Add to Cart
                </>
              )}
            </Button>
            
            <Button 
              variant="primary" 
              onClick={handleViewDetails}
              disabled={stockStatus.status === 'out'}
              className="view-details-btn"
            >
              {stockStatus.status === 'out' ? 'Out of Stock' : 'View Details'}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard; 