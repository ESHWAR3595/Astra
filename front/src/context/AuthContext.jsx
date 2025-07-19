import React, { createContext, useContext, useState, useEffect } from 'react';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check session on mount and set up periodic checks
  useEffect(() => {
    checkSession();
    
    // Set up periodic session checks every 5 minutes
    const sessionCheckInterval = setInterval(() => {
      if (isAuthenticated) {
        console.log('AuthContext: Periodic session check...');
        checkSession();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, [isAuthenticated]);

  const checkSession = async () => {
    try {
      console.log('AuthContext: Checking session...');
      const response = await fetch(buildApiUrl(API_ENDPOINTS.CHECK_SESSION), {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('AuthContext: Session check response:', data);
      
      if (data.isAuthenticated && data.user) {
        console.log('AuthContext: User is authenticated:', data.user);
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        console.log('AuthContext: User is not authenticated');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('AuthContext: Error checking session:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Starting login process');
      const response = await fetch(buildApiUrl(API_ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('AuthContext: Login response:', data);

      if (data.success) {
        // Update state immediately
        console.log('AuthContext: Login successful, setting isAuthenticated to true');
        setIsAuthenticated(true);
        setUser(data.user || null);
        
        // Force a small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('AuthContext: Login delay completed');
        
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.SIGNUP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // Update state immediately
        setIsAuthenticated(true);
        setUser(data.user || null);
        
        // Force a small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.LOGOUT), {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        return { success: true };
      } else {
        return { success: false, message: 'Logout failed' };
      }
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    signup,
    logout,
    checkSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 