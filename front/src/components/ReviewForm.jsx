import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import StarRating from './StarRating';

const ReviewForm = ({ show, onHide, onSubmit, productName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reviewData = {
        rating,
        comment: comment.trim(),
        reviewerName: name.trim(),
        date: new Date().toISOString(),
      };

      await onSubmit(reviewData);
      
      // Reset form
      setRating(0);
      setComment('');
      setName('');
      onHide();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setComment('');
      setName('');
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton={!isSubmitting}>
        <Modal.Title>Write a Review</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-4">
            <h6 className="text-muted mb-2">Product</h6>
            <p className="mb-0 fw-bold">{productName}</p>
          </div>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Your Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rating *</Form.Label>
                <div className="d-flex align-items-center">
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    disabled={isSubmitting}
                    size="lg"
                  />
                  <span className="ms-2 text-muted">
                    {rating > 0 && `${rating} out of 5`}
                  </span>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Your Review *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              required
              disabled={isSubmitting}
            />
            <Form.Text className="text-muted">
              Minimum 10 characters required
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim() || !name.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReviewForm; 