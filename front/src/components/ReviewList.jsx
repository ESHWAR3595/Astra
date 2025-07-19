import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import StarRating from './StarRating';

const ReviewList = ({ reviews = [], averageRating = 0, totalReviews = 0 }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-muted mb-3">
          <i className="fas fa-comments" style={{ fontSize: '3rem' }}></i>
        </div>
        <h5 className="text-muted">No reviews yet</h5>
        <p className="text-muted">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      {/* Reviews Summary */}
      <div className="reviews-summary mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="average-rating me-3">
              <span className="rating-number">{averageRating.toFixed(1)}</span>
              <StarRating 
                rating={Math.round(averageRating)} 
                readonly 
                size="lg"
              />
            </div>
            <div>
              <h6 className="mb-1">Average Rating</h6>
              <p className="text-muted mb-0">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <Badge bg={getRatingColor(averageRating)} className="rating-badge">
            {averageRating >= 4 ? 'Excellent' : 
             averageRating >= 3 ? 'Good' : 'Fair'}
          </Badge>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <Card key={index} className="review-card mb-3">
            <Card.Body>
              <div className="review-header">
                <div className="reviewer-info">
                  <h6 className="reviewer-name mb-1">
                    {review.reviewerName}
                  </h6>
                  <div className="review-meta">
                    <StarRating 
                      rating={review.rating} 
                      readonly 
                      size="sm"
                      showValue
                    />
                    <span className="review-date ms-2">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
                
                <Badge bg={getRatingColor(review.rating)}>
                  {review.rating >= 4 ? 'Excellent' : 
                   review.rating >= 3 ? 'Good' : 'Fair'}
                </Badge>
              </div>
              
              <div className="review-content mt-3">
                <p className="review-text mb-0">
                  {review.comment}
                </p>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <style jsx>{`
        .reviews-container {
          margin-top: 2rem;
        }
        
        .reviews-summary {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }
        
        .average-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .rating-number {
          font-size: 2rem;
          font-weight: 700;
          color: #007bff;
        }
        
        .rating-badge {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
        }
        
        .review-card {
          border: 1px solid #e9ecef;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .review-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .reviewer-name {
          color: #2c3e50;
          font-weight: 600;
        }
        
        .review-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .review-date {
          color: #6c757d;
          font-size: 0.85rem;
        }
        
        .review-content {
          border-top: 1px solid #e9ecef;
          padding-top: 1rem;
        }
        
        .review-text {
          color: #495057;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        
        @media (max-width: 768px) {
          .review-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .average-rating {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewList; 