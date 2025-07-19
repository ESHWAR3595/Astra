import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
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
  Alert 
} from 'react-bootstrap';
import { formatPrice, formatProductName, getStockStatus } from '../utils/formatters';
import '../styles/pages/ProductDetails.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { isValidImageUrl, handleImageError } = useImageLoader();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Load mock reviews for demonstration
        loadMockReviews();
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

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container mt-5 pt-5">
          <LoadingSpinner message="Loading product details..." />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navigation />
        <div className="container mt-5 pt-5">
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

  return (
    <>
      <Navigation />
      <div className="product-details-container">
        <Container>
          <Button 
            variant="outline-secondary" 
            onClick={handleGoBack}
            className="back-button"
          >
            ← Back to Products
          </Button>

          <Row>
            <Col lg={6} className="mb-4">
              <div className="product-image-container">
                <img
                  src={imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNmM3NTdkIj5QPC90ZXh0Pjwvc3ZnPg=='}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => handleImageError(e, product.name)}
                  loading="lazy"
                />
              </div>
            </Col>

            <Col lg={6}>
              <Card className="product-details-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h1 className="product-title">{formatProductName(product.name)}</h1>
                    <Badge bg={stockStatus.color} className="stock-badge">
                      {stockStatus.text}
                    </Badge>
                  </div>

                  <div className="price-rating">
                    <h2 className="product-price">{formatPrice(product.price)}</h2>
                    <div className="product-rating">
                      <StarRating 
                        rating={Math.round(averageRating)} 
                        readonly 
                        size="lg"
                        showValue
                      />
                      <span className="rating-text">
                        ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>

                  <div className="product-category">
                    <strong>Category:</strong> {product.category}
                  </div>

                  <div className="product-description">
                    <h5>Description</h5>
                    <p>{product.description}</p>
                  </div>

                  <div className="product-actions">
                    <Button 
                      variant="primary" 
                      size="lg"
                      disabled={stockStatus.status === 'out'}
                      className="me-3"
                    >
                      {stockStatus.status === 'out' ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    
                    <Button 
                      variant="outline-secondary" 
                      size="lg"
                      disabled={stockStatus.status === 'out'}
                    >
                      {stockStatus.status === 'out' ? 'Notify When Available' : 'Add to Wishlist'}
                    </Button>
                  </div>

                  {stockStatus.status === 'low' && (
                    <Alert variant="warning" className="mt-3">
                      <Alert.Heading>Low Stock Alert!</Alert.Heading>
                      <p>Only {product.stock} items left in stock. Order soon!</p>
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Reviews Section */}
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
        </Container>
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