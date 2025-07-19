// src/App.js
import React from 'react';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/utils/Global.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
