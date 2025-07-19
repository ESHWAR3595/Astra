import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles/pages/Auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Watch for authentication state changes
  useEffect(() => {
    console.log('LoginPage: isAuthenticated changed to:', isAuthenticated);
    if (isAuthenticated) {
      console.log('LoginPage: Navigating to /hello');
      navigate('/hello');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('LoginPage: Starting login submission');
    const result = await login(formData);
    console.log('LoginPage: Login result:', result);
    
    if (result.success) {
      console.log('LoginPage: Login successful, waiting for state update');
      // The navigation will be handled by the useEffect above
      // when isAuthenticated becomes true
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <Container fluid className="auth-content">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={6} className="auth-illustration-col">
            <div className="auth-illustration">
              <div className="illustration-content">
                <div className="brand-logo">
                  <i className="bi bi-stars"></i>
                  <h1>ASTRA</h1>
                </div>
                <h2 className="welcome-text">Welcome Back!</h2>
                <p className="welcome-subtitle">
                  Sign in to your account and continue your journey with us
                </p>
                <div className="feature-list">
                  <div className="feature-item">
                    <i className="bi bi-shield-check"></i>
                    <span>Secure & Private</span>
                  </div>
                  <div className="feature-item">
                    <i className="bi bi-lightning"></i>
                    <span>Lightning Fast</span>
                  </div>
                  <div className="feature-item">
                    <i className="bi bi-heart"></i>
                    <span>User Friendly</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={6} className="auth-form-col">
            <div className="auth-form-container">
              <div className="auth-form-card">
                <div className="form-header">
                  <h2 className="form-title">Sign In</h2>
                  <p className="form-subtitle">Enter your credentials to access your account</p>
                </div>
                
                {error && (
                  <Alert variant="danger" className="auth-alert" dismissible onClose={() => setError('')}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group-modern">
                    <div className={`input-container ${focusedField === 'email' || formData.email ? 'focused' : ''}`}>
                      <i className="bi bi-envelope input-icon"></i>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        required
                        className="modern-input"
                      />
                      <label className="floating-label">Email Address</label>
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <div className={`input-container ${focusedField === 'password' || formData.password ? 'focused' : ''}`}>
                      <i className="bi bi-lock input-icon"></i>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        required
                        className="modern-input"
                      />
                      <label className="floating-label">Password</label>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="form-options">
                    <div className="remember-me">
                      <Form.Check
                        type="checkbox"
                        id="remember-me"
                        label="Remember me"
                        className="modern-checkbox"
                      />
                    </div>
                    <Link to="/forgot-password" className="forgot-password">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="auth-submit-btn"
                  >
                    {loading ? (
                      <>
                        <i className="bi bi-arrow-clockwise animate-spin me-2"></i>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                <div className="divider">
                  <span>or continue with</span>
                </div>

                <div className="social-login">
                  <Button variant="outline-secondary" className="social-btn">
                    <i className="bi bi-google me-2"></i>
                    Google
                  </Button>
                  <Button variant="outline-secondary" className="social-btn">
                    <i className="bi bi-facebook me-2"></i>
                    Facebook
                  </Button>
                </div>

                <div className="auth-footer">
                  <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage; 