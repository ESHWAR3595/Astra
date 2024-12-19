import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Carouse from './Carouse';  // Assuming your Carousel component is in the same directory
import Card from './Card';  // Assuming your Card component is in the same directory

function NavScrollExample({ onLogout }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    onLogout(); // Call the onLogout function passed from the parent component
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    if (query) {
      // Navigate to the search results page with query as a parameter
      navigate(`/search-results?query=${query}`);
    }
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

            <Form className="d-flex" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)} // Update query state on input change
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
        {/* Carousel Component */}
        <Carouse className="carousel" />

        {/* Card Component */}
        <Card />
      </div>
    </>
  );
}

export default NavScrollExample;
