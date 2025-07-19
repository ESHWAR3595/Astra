import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useImageLoader } from '../hooks/useImageLoader';
import Navigation from '../layouts/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import StarRating from '../components/StarRating';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge,
  Alert,
  Form,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import { formatPrice, formatProductName, getStockStatus } from '../utils/formatters';
import '../styles/pages/ProductDetails.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart, isInCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isValidImageUrl, handleImageError } = useImageLoader();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShimmer, setShowShimmer] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Load mock reviews for demonstration
        loadMockReviews();
        
        // Add shimmer effect on load
        setShowShimmer(true);
        setTimeout(() => setShowShimmer(false), 1000);
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, getProductById]);

  // Update quantity when cart item quantity changes
  useEffect(() => {
    if (product && isInCart(product.id)) {
      setQuantity(getItemQuantity(product.id));
    }
  }, [product, isInCart, getItemQuantity]);

  const loadMockReviews = () => {
    // Mock reviews data - in a real app, this would come from an API
    const mockReviews = [
      {
        reviewerName: 'John Doe',
        rating: 5,
        comment: 'Excellent product! The sound quality is amazing and the build quality is top-notch. Highly recommended!',
        date: '2024-01-15T10:30:00Z'
      },
      {
        reviewerName: 'Sarah Smith',
        rating: 4,
        comment: 'Great headphones with good noise cancellation. Battery life could be better, but overall satisfied.',
        date: '2024-01-10T14:20:00Z'
      },
      {
        reviewerName: 'Mike Johnson',
        rating: 5,
        comment: 'Perfect for my daily commute. Comfortable to wear for long periods and the sound is crystal clear.',
        date: '2024-01-05T09:15:00Z'
      }
    ];
    setReviews(mockReviews);
  };

  const handleSubmitReview = async (reviewData) => {
    // In a real app, this would send the review to the backend
    console.log('Submitting review:', reviewData);
    
    // Add the new review to the list
    setReviews(prevReviews => [reviewData, ...prevReviews]);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddToCart = async () => {
    if (!product || stockStatus.status === 'out') return;
    
    setIsAddingToCart(true);
    
    // Always add the selected quantity to cart
    addToCart(product, quantity);
    
    // Show feedback
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    
    setIsTogglingWishlist(true);
    toggleWishlist(product);
    
    // Show feedback
    setTimeout(() => {
      setIsTogglingWishlist(false);
    }, 500);
  };

  const handleQuantityChange = (newQuantity) => {
    const qty = parseInt(newQuantity);
    if (qty >= 1 && qty <= 10 && qty <= product.stock) {
      setQuantity(qty);
      if (isInCart(product.id)) {
        updateQuantity(product.id, qty);
      }
    }
  };

  const handleRemoveFromCart = () => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
      setQuantity(1); // Reset to 1 for next add
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const handleImageZoom = () => {
    // In a real app, this would open a lightbox/modal
    alert('Image zoom feature coming soon!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this amazing ${product.name}!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="product-details-container">
          <LoadingSpinner message="Loading product details..." />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navigation />
        <div className="product-details-container">
          <ErrorMessage 
            message={error || 'Product not found'} 
            onRetry={() => window.location.reload()} 
          />
        </div>
      </>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const imageUrl = isValidImageUrl(product.imageUrl) ? product.imageUrl : null;
  const averageRating = calculateAverageRating();
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  return (
    <>
      <Navigation />
      <div className="product-details-container">
        {/* Hero Section with Back Button */}
        <div className="hero-section">
          <div className="hero-background"></div>
          <Container>
            <Button 
              variant="outline-light" 
              onClick={handleGoBack}
              className="back-button-hero"
              onMouseEnter={() => setHoveredElement('back')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <i className={`bi bi-arrow-left me-2 ${hoveredElement === 'back' ? 'animate-bounce' : ''}`}></i>
              Back to Products
            </Button>
          </Container>
        </div>

        {/* Main Product Section */}
        <Container className="main-content">
          <Row className={`product-hero-row ${showShimmer ? 'shimmer-effect' : ''}`}>
            {/* Product Image Gallery */}
            <Col lg={6} className="mb-4">
              <div className="product-gallery">
                <div className="main-image-container">
                  <img
                    src={imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNmM3NTdkIj5QPC90ZXh0Pjwvc3ZnPg=='}
                    alt={product.name}
                    className="main-product-image"
                    onError={(e) => handleImageError(e, product.name)}
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <div className="overlay-buttons">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Zoom Image</Tooltip>}
                      >
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="zoom-btn"
                          onClick={handleImageZoom}
                        >
                          <i className="bi bi-zoom-in"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Share Product</Tooltip>}
                      >
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="share-btn"
                          onClick={handleShare}
                        >
                          <i className="bi bi-share"></i>
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </div>
                </div>
                
                {/* Stock Status Badge */}
                <div className="stock-badge-floating">
                  <Badge bg={stockStatus.color} className="stock-badge-modern">
                    <i className="bi bi-check-circle me-1"></i>
                    {stockStatus.text}
                  </Badge>
                </div>
              </div>
            </Col>

            {/* Product Information */}
            <Col lg={6}>
              <div className="product-info-card">
                {/* Product Header */}
                <div className="product-header">
                  <div className="product-category-badge">
                    <Badge bg="info" className="category-badge-modern">
                      <i className="bi bi-tag me-1"></i>
                      {product.category}
                    </Badge>
                  </div>
                  
                  <h1 className="product-title-modern">{formatProductName(product.name)}</h1>
                  
                  <div className="product-rating-modern">
                    <StarRating 
                      rating={Math.round(averageRating)} 
                      readonly 
                      size="lg"
                      showValue
                    />
                    <span className="rating-text-modern">
                      ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="price-section">
                  <div className="price-display">
                    <span className="price-currency">$</span>
                    <span className="price-value">{formatPrice(product.price).replace('$', '')}</span>
                  </div>
                  <div className="price-badges">
                    <Badge bg="success" className="price-badge">
                      <i className="bi bi-truck me-1"></i>
                      Free Shipping
                    </Badge>
                    <Badge bg="warning" className="price-badge">
                      <i className="bi bi-shield-check me-1"></i>
                      Warranty
                    </Badge>
                  </div>
                </div>

                {/* Product Description */}
                <div className="product-description-modern">
                  <h5 className="description-title">
                    <i className="bi bi-info-circle me-2"></i>
                    About this product
                  </h5>
                  <p className="description-text">{product.description}</p>
                </div>

                {/* Quantity Controls */}
                <div className="quantity-section">
                  <label className="quantity-label">
                    <i className="bi bi-box me-2"></i>
                    Quantity
                  </label>
                  
                  {!inCart ? (
                    <div className="quantity-selector-modern">
                      <Form.Select
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="quantity-select-modern"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </Form.Select>
                    </div>
                  ) : (
                    <div className="quantity-controls-modern">
                      <div className="quantity-display-modern">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="quantity-btn-modern"
                        >
                          <i className="bi bi-dash"></i>
                        </Button>
                        
                        <span className="quantity-value-modern">{quantity}</span>
                        
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(Math.min(10, quantity + 1))}
                          disabled={quantity >= 10 || quantity >= product.stock}
                          className="quantity-btn-modern"
                        >
                          <i className="bi bi-plus"></i>
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveFromCart()}
                        className="remove-btn-modern"
                      >
                        <i className="bi bi-trash me-1"></i>
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons-section">
                  <Button 
                    variant={inCart ? "success" : "primary"}
                    size="lg"
                    disabled={stockStatus.status === 'out' || isAddingToCart || inCart}
                    className="action-btn-primary"
                    onClick={handleAddToCart}
                    onMouseEnter={() => setHoveredElement('cart')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    {isAddingToCart ? (
                      <>
                        <i className="bi bi-check-circle-fill me-2 animate-spin"></i>
                        Added!
                      </>
                    ) : inCart ? (
                      <>
                        <i className="bi bi-cart-check me-2"></i>
                        Already Added to Cart
                      </>
                    ) : (
                      <>
                        <i className={`bi bi-cart-plus me-2 ${hoveredElement === 'cart' ? 'animate-bounce' : ''}`}></i>
                        {stockStatus.status === 'out' ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant={inWishlist ? "danger" : "outline-secondary"}
                    size="lg"
                    disabled={stockStatus.status === 'out' || isTogglingWishlist}
                    onClick={handleToggleWishlist}
                    className="action-btn-secondary"
                    onMouseEnter={() => setHoveredElement('wishlist')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    {isTogglingWishlist ? (
                      <>
                        <i className="bi bi-heart-fill me-2 animate-pulse"></i>
                        {inWishlist ? 'Removing...' : 'Adding...'}
                      </>
                    ) : inWishlist ? (
                      <>
                        <i className="bi bi-heart-fill me-2"></i>
                        Remove from Wishlist
                      </>
                    ) : (
                      <>
                        <i className={`bi bi-heart me-2 ${hoveredElement === 'wishlist' ? 'animate-pulse' : ''}`}></i>
                        {stockStatus.status === 'out' ? 'Notify When Available' : 'Add to Wishlist'}
                      </>
                    )}
                  </Button>
                </div>

                {/* Status Messages */}
                {inCart && (
                  <Alert variant="info" className="status-alert-modern">
                    <i className="bi bi-info-circle me-2"></i>
                    This item is in your cart. You can update the quantity above or view your cart.
                  </Alert>
                )}

                {inWishlist && (
                  <Alert variant="warning" className="status-alert-modern">
                    <i className="bi bi-heart-fill me-2"></i>
                    This item is in your wishlist. Click the button above to remove it.
                  </Alert>
                )}

                {stockStatus.status === 'low' && (
                  <Alert variant="warning" className="status-alert-modern">
                    <Alert.Heading>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Low Stock Alert!
                    </Alert.Heading>
                    <p>Only {product.stock} items left in stock. Order soon!</p>
                  </Alert>
                )}

                {/* Share Tooltip */}
                {showTooltip && (
                  <Alert variant="success" className="status-alert-modern">
                    <i className="bi bi-check-circle me-2"></i>
                    Link copied to clipboard!
                  </Alert>
                )}
              </div>
            </Col>
          </Row>
        </Container>

        {/* Reviews Section - Keep as is */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h3 className="reviews-title">Customer Reviews</h3>
            <Button 
              variant="success" 
              onClick={() => setShowReviewForm(true)}
              className="add-review-btn"
            >
              Write a Review
            </Button>
          </div>
          
          <ReviewList 
            reviews={reviews}
            averageRating={averageRating}
            totalReviews={reviews.length}
          />
        </div>
      </div>

      {/* Review Form Modal */}
      <ReviewForm
        show={showReviewForm}
        onHide={() => setShowReviewForm(false)}
        onSubmit={handleSubmitReview}
        productName={product.name}
      />
    </>
  );
};

export default ProductDetailsPage; 