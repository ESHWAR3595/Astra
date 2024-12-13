// src/components/NavScrollExample.js
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Carousel from './Carouse';
import Card from './Card';

function NavScrollExample({ onLogout }) {
  // Handle Logout
  const handleLogout = () => {
    onLogout(); // Call the onLogout function passed from parent component
  };

  return (
    <>
      <Container fluid className="bg-primary">
        <Navbar bg="primary" variant="dark" fixed="top" sticky="top">
          <Navbar.Brand href="#">ASTRA</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link href="#action1">Home</Nav.Link>
              <Nav.Link href="#action2">Link</Nav.Link>
              <NavDropdown title="Link" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              {/* Always render the Logout button */}
              <Button variant="outline-light" onClick={handleLogout}>
                LogOut
              </Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </Container>

      {/* Main content */}
      <div>
        <Carousel className="carousel" />
        <Card />
      </div>
    </>
  );
}

export default NavScrollExample;
