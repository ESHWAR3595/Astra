import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import '../styles/layouts/Navigation.css';

const Navigation = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getCartItemCount } = useCart();
  const { getWishlistCount } = useWishlist();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    } else {
      console.error('Logout failed:', result.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    navigate('/cart');
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    // TODO: Navigate to wishlist page when created
    alert('Wishlist page coming soon!');
  };

  return (
    <Navbar 
      expand="lg" 
      className="navbar-custom"
      variant="dark"
    >
      <Container>
        <Navbar.Brand 
          href="#" 
          className="navbar-brand"
          onClick={(e) => handleNavClick(e, '/hello')}
        >
          ASTRA
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link 
              href="#" 
              onClick={(e) => handleNavClick(e, '/hello')}
              className="nav-link"
            >
              Home
            </Nav.Link>
            <Nav.Link 
              href="#" 
              onClick={(e) => handleNavClick(e, '/hello')}
              className="nav-link"
            >
              Products
            </Nav.Link>
            <NavDropdown title="Categories" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#electronics">Electronics</NavDropdown.Item>
              <NavDropdown.Item href="#clothing">Clothing</NavDropdown.Item>
              <NavDropdown.Item href="#books">Books</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#all">All Categories</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="search-container">
            <Form onSubmit={handleSearch} className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search products..."
                className="search-input"
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Form>
            
            {/* Wishlist Icon */}
            <Button
              variant="outline-light"
              className="wishlist-icon-btn me-2"
              onClick={handleWishlistClick}
              title="View Wishlist"
            >
              <i className="bi bi-heart"></i>
              {getWishlistCount() > 0 && (
                <Badge 
                  bg="warning" 
                  className="wishlist-badge"
                >
                  {getWishlistCount()}
                </Badge>
              )}
            </Button>
            
            {/* Cart Icon */}
            <Button
              variant="outline-light"
              className="cart-icon-btn me-2"
              onClick={handleCartClick}
              title="View Cart"
            >
              <i className="bi bi-cart3"></i>
              {getCartItemCount() > 0 && (
                <Badge 
                  bg="danger" 
                  className="cart-badge"
                >
                  {getCartItemCount()}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="danger" 
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 