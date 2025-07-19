// src/components/Carousel.js
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../styles/components/Carousel.css'; // Updated import path

function DarkVariantExample() {
  return (
    <Carousel data-bs-theme="dark" className="custom-carousel">
      <Carousel.Item>
        <img
          className="d-block w-100 custom-carousel-image"
          src="https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg"
          alt="First slide"
          srcSet="
            https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg 1200w,
            https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg 800w,
            https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg 600w"
          sizes="(max-width: 768px) 600px, 1200px"
        />
        <Carousel.Caption>
          <h5>First slide label</h5>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 custom-carousel-image"
          src="https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg"
          alt="Second slide"
          srcSet="
            https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg 1200w,
            https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg 800w,
            https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg 600w"
          sizes="(max-width: 768px) 600px, 1200px"
        />
        <Carousel.Caption>
          <h5>Second slide label</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 custom-carousel-image"
          src="https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg"
          alt="Third slide"
          srcSet="
            https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg 1200w,
            https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg 800w,
            https://www.shutterstock.com/image-vector/merry-christmas-sale-promotion-poster-260nw-2063944733.jpg 600w"
          sizes="(max-width: 768px) 600px, 1200px"
        />
        <Carousel.Caption>
          <h5>Third slide label</h5>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default DarkVariantExample;
