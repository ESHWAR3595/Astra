import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import '../ProductCard.css'; // Custom CSS for styling

function ProductCards() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/products')
      .then((response) => {
        const sanitizedProducts = response.data.map((product) => ({
          ...product,
          image_url: (product.image_url || '').trim(), // Trim the image_url
        }));
        setProducts(sanitizedProducts);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="product-cards-container">
      {products.length > 0 ? (
        products.map((product) => (
          <Card key={product.id} className="product-card shadow">
            <Card.Img
              variant="top"
              src={product.image_url || '/fallback-image.png'}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.src = '/fallback-image.png';
                e.target.alt = 'Image not available';
              }}
            />
            <Card.Body>
              <Card.Title className="product-title">{product.name}</Card.Title>
              <Card.Text className="product-description">
                {product.description.length > 100
                  ? `${product.description.substring(0, 100)}...`
                  : product.description}
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                <strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Status:</strong> {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Shipping:</strong>{' '}
                {product.free_shipping ? 'Free Shipping' : 'Shipping Charges Apply'}
              </ListGroup.Item>
            </ListGroup>
            <Card.Body className="d-flex justify-content-center">
              <Link to={`/details/${product.id}`} className="btn btn-primary product-view-button">
                View Details
              </Link>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}

export default ProductCards;
