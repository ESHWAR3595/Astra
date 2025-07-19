import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ 
  rating, 
  onRatingChange, 
  disabled = false, 
  size = 'md',
  showValue = false,
  readonly = false 
}) => {
  const stars = [1, 2, 3, 4, 5];
  
  const getStarSize = () => {
    switch (size) {
      case 'sm': return '1rem';
      case 'lg': return '1.5rem';
      case 'xl': return '2rem';
      default: return '1.25rem';
    }
  };

  const handleStarClick = (starValue) => {
    if (!disabled && !readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!disabled && !readonly) {
      // Add hover effect if needed
    }
  };

  return (
    <div className="star-rating">
      <div className="stars-container">
        {stars.map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            style={{
              fontSize: getStarSize(),
              cursor: disabled || readonly ? 'default' : 'pointer',
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
      
      {showValue && rating > 0 && (
        <span className="rating-value ms-2">
          {rating.toFixed(1)}
        </span>
      )}
      
      <style jsx>{`
        .star-rating {
          display: flex;
          align-items: center;
        }
        
        .stars-container {
          display: flex;
          gap: 2px;
        }
        
        .star {
          transition: all 0.2s ease;
          user-select: none;
        }
        
        .star.filled {
          color: #ffc107;
        }
        
        .star.empty {
          color: #e9ecef;
        }
        
        .star:hover:not(.disabled) {
          transform: scale(1.1);
        }
        
        .rating-value {
          font-weight: 600;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  showValue: PropTypes.bool,
  readonly: PropTypes.bool,
};

export default StarRating; 