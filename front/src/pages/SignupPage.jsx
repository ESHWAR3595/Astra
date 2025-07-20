import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import '../styles/pages/Auth.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Watch for authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/hello');
    }
  }, [isAuthenticated, navigate]);

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [formData.password]);

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);
    
    if (result.success) {
      // The navigation will be handled by the useEffect above
      // when isAuthenticated becomes true
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'danger';
    if (passwordStrength <= 50) return 'warning';
    if (passwordStrength <= 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
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
                <h2 className="welcome-text">Join Our Community!</h2>
                <p className="welcome-subtitle">
                  Create your account and start exploring amazing products
                </p>
                <div className="feature-list">
                  <div className="feature-item">
                    <i className="bi bi-rocket"></i>
                    <span>Quick Setup</span>
                  </div>
                  <div className="feature-item">
                    <i className="bi bi-shield-check"></i>
                    <span>Secure Account</span>
                  </div>
                  <div className="feature-item">
                    <i className="bi bi-gift"></i>
                    <span>Exclusive Benefits</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={6} className="auth-form-col">
            <div className="auth-form-container">
              <div className="auth-form-card">
                <div className="form-header">
                  <h2 className="form-title">Create Account</h2>
                  <p className="form-subtitle">Fill in your details to get started</p>
                </div>
                
                {error && (
                  <Alert variant="danger" className="auth-alert" dismissible onClose={() => setError('')}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group-modern">
                    <div className={`input-container ${focusedField === 'name' || formData.name ? 'focused' : ''}`}>
                      <i className="bi bi-person input-icon"></i>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        required
                        className="modern-input"
                      />
                      <label className="floating-label">Full Name</label>
                    </div>
                  </div>

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
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="password-strength">
                        <div className="strength-header">
                          <span>Password Strength:</span>
                          <span className={`strength-text strength-${getPasswordStrengthColor()}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <ProgressBar 
                          now={passwordStrength} 
                          variant={getPasswordStrengthColor()}
                          className="strength-bar"
                        />
                        <div className="strength-requirements">
                          <div className={`requirement ${formData.password.length >= 6 ? 'met' : ''}`}>
                            <i className={`bi ${formData.password.length >= 6 ? 'bi-check-circle' : 'bi-circle'}`}></i>
                            At least 6 characters
                          </div>
                          <div className={`requirement ${formData.password.length >= 8 ? 'met' : ''}`}>
                            <i className={`bi ${formData.password.length >= 8 ? 'bi-check-circle' : 'bi-circle'}`}></i>
                            At least 8 characters
                          </div>
                          <div className={`requirement ${/[A-Z]/.test(formData.password) ? 'met' : ''}`}>
                            <i className={`bi ${/[A-Z]/.test(formData.password) ? 'bi-check-circle' : 'bi-circle'}`}></i>
                            One uppercase letter
                          </div>
                          <div className={`requirement ${/[0-9]/.test(formData.password) ? 'met' : ''}`}>
                            <i className={`bi ${/[0-9]/.test(formData.password) ? 'bi-check-circle' : 'bi-circle'}`}></i>
                            One number
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group-modern">
                    <div className={`input-container ${focusedField === 'confirmPassword' || formData.confirmPassword ? 'focused' : ''}`}>
                      <i className="bi bi-lock input-icon"></i>
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField('')}
                        required
                        className="modern-input"
                      />
                      <label className="floating-label">Confirm Password</label>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {formData.confirmPassword && (
                      <div className="password-match">
                        <i className={`bi ${formData.password === formData.confirmPassword ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'}`}></i>
                        <span className={formData.password === formData.confirmPassword ? 'text-success' : 'text-danger'}>
                          {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="form-options">
                    <div className="terms-agreement">
                      <Form.Check
                        type="checkbox"
                        id="agree-terms"
                        label={
                          <span>
                            I agree to the{' '}
                            <Link to="/terms" className="auth-link">Terms of Service</Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                          </span>
                        }
                        className="modern-checkbox"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="auth-submit-btn"
                  >
                    {loading ? (
                      <>
                        <i className="bi bi-arrow-clockwise animate-spin me-2"></i>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                </Form>

                <div className="divider">
                  <span>or sign up with</span>
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
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                      Sign in here
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

export default SignupPage; 