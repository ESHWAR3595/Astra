import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Form } from 'react-bootstrap';
import '../DetailsPage.css'; // Custom styles

function DetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  const handleAddComment = (e) => {
    e.preventDefault();
    const comment = e.target.elements.comment.value.trim();
    if (comment) {
      setComments([...comments, comment]);
      e.target.reset();
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
        setError('Error loading product details. Please try again later.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!product) {
    return <Alert variant="warning">Product not found!</Alert>;
  }

  return (
    <Container className="details-page">
      <Row className="align-items-center">
        <Col md={6}>
          <Card className="shadow-lg product-card fade-in">
          <Card.Img
  variant="top"
  src={product.image_url}
  alt={product.name}
  className="product-image"
/>

          </Card>
        </Col>
        <Col md={6} className="fade-in">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <h3 className="product-price">${Number(product.price).toFixed(2)}</h3>
          <div className="product-meta">
            <Badge
              pill
              bg={product.inStock ? 'success' : 'danger'}
              className="status-badge"
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
            <Badge
              pill
              bg={product.freeShipping ? 'info' : 'secondary'}
              className="shipping-badge"
            >
              {product.freeShipping ? 'Free Shipping' : 'Shipping Charges Apply'}
            </Badge>
          </div>
          <div className="action-buttons mt-4">
            <Button variant="primary" className="buy-now-btn">
              Buy Now
            </Button>
            <Button variant="outline-danger" className="like-btn">
              ❤️ Like
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={12} className="fade-in">
          <h3>Comments</h3>
          <Form onSubmit={handleAddComment} className="comment-form">
            <Form.Group>
              <Form.Control
                as="textarea"
                name="comment"
                rows={3}
                placeholder="Write your comment here..."
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2">
              Add Comment
            </Button>
          </Form>
          <ul className="comment-list mt-4">
            {comments.map((comment, index) => (
              <li key={index} className="comment">
                {comment}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default DetailsPage;
