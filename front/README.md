# ASTRA Frontend

A modern, responsive e-commerce frontend built with React, featuring a clean architecture and best practices.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, hooks, and context API
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **State Management**: Centralized state with React Context
- **Image Handling**: Robust image loading with fallbacks
- **Search Functionality**: Real-time product search with Elasticsearch
- **Authentication**: Secure user authentication with session management
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Smooth loading experiences throughout the app

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorMessage.jsx
│   └── Carouse.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   └── ProductContext.jsx
├── hooks/              # Custom React hooks
│   └── useImageLoader.js
├── layouts/            # Layout components
│   └── Navigation.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── SearchResultsPage.jsx
│   └── ProductDetailsPage.jsx
├── routes/             # Routing configuration
│   └── AppRoutes.jsx
├── utils/              # Utility functions
│   └── formatters.js
├── constants/          # Application constants
│   └── index.js
├── config/             # Configuration files
│   └── api.js
└── styles/             # CSS files
    ├── App.css
    ├── ProductCard.css
    ├── SearchResults.css
    └── DetailsPage.css
```

## 🏗️ Architecture Overview

### Context Providers

#### AuthContext
- Manages user authentication state
- Handles login, signup, and logout operations
- Provides session checking functionality
- Automatic navigation on auth state changes

#### ProductContext
- Manages product data and search functionality
- Handles API calls for products and search
- Provides data transformation and sanitization
- Centralized error handling for product operations

### Custom Hooks

#### useImageLoader
- Handles image loading with fallback functionality
- Validates image URLs
- Prevents infinite loading loops
- Generates SVG placeholders for failed images

### Utility Functions

#### formatters.js
- Price formatting with currency support
- Text truncation and formatting
- Product name formatting
- Stock status calculation
- Rating formatting

### Components

#### Reusable Components
- **ProductCard**: Displays individual product information
- **ProductGrid**: Responsive grid layout for products
- **LoadingSpinner**: Consistent loading indicators
- **ErrorMessage**: Error display with retry functionality

#### Layout Components
- **Navigation**: Main navigation with search and logout

#### Page Components
- **HomePage**: Main dashboard with carousel and product grid
- **LoginPage**: User authentication
- **SignupPage**: User registration
- **SearchResultsPage**: Search results display
- **ProductDetailsPage**: Detailed product view

## 🔧 Key Features

### Image Handling
- Automatic fallback to SVG placeholders
- URL validation before loading
- Error handling with user-friendly messages
- Lazy loading for performance

### Search Functionality
- Real-time search with debouncing
- Elasticsearch integration
- Search result highlighting
- Empty state handling

### Authentication
- Session-based authentication
- Protected routes
- Automatic redirects
- Form validation

### Responsive Design
- Mobile-first approach
- Bootstrap 5 grid system
- Responsive images and layouts
- Touch-friendly interactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

## 📱 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🎨 Styling

The application uses:
- **Bootstrap 5** for responsive grid and components
- **Custom CSS** for specific styling needs
- **CSS Modules** for component-specific styles
- **Responsive design** principles

## 🔒 Security Features

- Session-based authentication
- Protected routes
- Input validation
- XSS prevention
- CSRF protection (via session cookies)

## 📊 Performance Optimizations

- Lazy loading for images
- Code splitting with React Router
- Memoized components where appropriate
- Optimized bundle size
- Efficient re-renders with proper dependency arrays

## 🐛 Error Handling

- Comprehensive error boundaries
- User-friendly error messages
- Retry mechanisms
- Fallback UI components
- Network error handling

## 🔄 State Management

- React Context for global state
- Local state for component-specific data
- Optimized re-renders
- Proper state updates

## 📈 Future Enhancements

- [ ] Shopping cart functionality
- [ ] Wishlist feature
- [ ] User profile management
- [ ] Product reviews and ratings
- [ ] Advanced filtering and sorting
- [ ] PWA capabilities
- [ ] Offline support
- [ ] Performance monitoring
- [ ] Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
