import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import '../ProductCard.css'; // Custom CSS for styling

function ProductCards() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    axios.get('http://localhost:5001/api/products') // Backend API endpoint
      .then((response) => {
        setProducts(response.data); // Set products data in state
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="product-cards-container">
      {products.length > 0 ? (
        products.map((product) => (
          <Card key={product.id} className="product-card">
            <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>
                {product.description}
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>Price: $99.99</ListGroup.Item> {/* Example extra details */}
              <ListGroup.Item>In Stock</ListGroup.Item> {/* Placeholder */}
              <ListGroup.Item>Free Shipping</ListGroup.Item> {/* Placeholder */}
            </ListGroup>
            <Card.Body>
              <Card.Link href="#">View Details</Card.Link>
              <Card.Link href="#">Buy Now</Card.Link>
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
