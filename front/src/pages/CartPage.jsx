import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import { formatPrice } from '../utils/formatters';
import '../styles/pages/CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity));
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // TODO: Navigate to checkout page
    alert('Checkout functionality coming soon!');
  };

  const handleContinueShopping = () => {
    navigate('/hello');
  };

  if (cartItems.length === 0) {
    return (
      <Container className="cart-page">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="empty-cart-card">
              <Card.Body className="text-center">
                <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
                <h3>Your cart is empty</h3>
                <p className="text-muted">Add some products to get started!</p>
                <Button 
                  variant="primary" 
                  onClick={handleContinueShopping}
                  className="mt-3"
                >
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="cart-page">
      <Row>
        <Col lg={8}>
          <h2 className="cart-title mb-4">
            <i className="bi bi-cart3 me-2"></i>
            Shopping Cart ({cartItems.length} items)
          </h2>
          
          {cartItems.map((item) => (
            <Card key={item.id} className="cart-item-card mb-3">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={2}>
                    <img 
                      src={item.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZjNzU3ZCI+UDwvdGV4dD48L3N2Zz4='}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </Col>
                  <Col md={4}>
                    <h6 className="cart-item-title">{item.name}</h6>
                    <p className="cart-item-description text-muted">
                      {item.description?.substring(0, 100)}...
                    </p>
                  </Col>
                  <Col md={2}>
                    <span className="cart-item-price">{formatPrice(item.price)}</span>
                  </Col>
                  <Col md={2}>
                    <select
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="form-select quantity-select"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </Col>
                  <Col md={1}>
                    <span className="cart-item-total">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </Col>
                  <Col md={1}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove item"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
          
          <div className="cart-actions mt-3">
            <Button 
              variant="outline-secondary" 
              onClick={handleContinueShopping}
              className="me-2"
            >
              <i className="bi bi-arrow-left me-1"></i>
              Continue Shopping
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={clearCart}
            >
              <i className="bi bi-trash me-1"></i>
              Clear Cart
            </Button>
          </div>
        </Col>
        
        <Col lg={4}>
          <Card className="cart-summary-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Order Summary
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="summary-item">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="summary-item">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="summary-total">
                <span>Total:</span>
                <span className="total-amount">{formatPrice(getCartTotal())}</span>
              </div>
              
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 mt-3"
                onClick={handleCheckout}
              >
                <i className="bi bi-credit-card me-2"></i>
                Proceed to Checkout
              </Button>
              
              {!isAuthenticated && (
                <Alert variant="warning" className="mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Please <strong>login</strong> to complete your purchase.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage; 