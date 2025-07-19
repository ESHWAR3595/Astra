import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">No products found</h4>
        <p className="text-muted">Check back later for new products!</p>
      </div>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} xl={4} className="g-4">
      {products.map((product) => (
        <Col key={product.id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid; 