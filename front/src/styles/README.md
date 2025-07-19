# CSS Structure Documentation

## 📁 Folder Structure

```
src/styles/
├── components/          # Component-specific styles
│   ├── ProductCard.css
│   ├── ReviewForm.css
│   └── StarRating.css
├── pages/              # Page-specific styles
│   ├── ProductDetails.css
│   ├── SearchResults.css
│   └── HomePage.css
├── layouts/            # Layout component styles
│   ├── Navigation.css
│   └── Footer.css
├── utils/              # Global utilities and common styles
│   ├── Global.css
│   └── Variables.css
└── README.md           # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: `#667eea` to `#764ba2` (Gradient)
- **Secondary**: `#f093fb` to `#f5576c` (Gradient)
- **Success**: `#28a745`
- **Warning**: `#ffc107`
- **Danger**: `#dc3545`
- **Info**: `#17a2b8`

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Base Font Size**: 16px
- **Line Height**: 1.6

### Spacing
- **Base Unit**: 0.25rem (4px)
- **Common Spacings**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem

### Border Radius
- **Small**: 4px
- **Medium**: 8px
- **Large**: 12px
- **Extra Large**: 16px

## 🚀 Features

### 1. Component-Specific CSS
Each component has its own CSS file for better organization and maintainability.

### 2. Responsive Design
All components are mobile-first and include responsive breakpoints.

### 3. Modern Animations
- Hover effects with smooth transitions
- Loading animations
- Fade-in and slide-in effects

### 4. Utility Classes
Global utility classes for common styling needs:
- `.text-gradient` - Gradient text
- `.shadow-custom` - Custom shadow
- `.btn-custom` - Custom button styling
- `.card-custom` - Custom card styling

### 5. Enhanced Components

#### ProductCard
- Hover animations
- Image scaling effects
- Stock status badges
- Responsive grid layout

#### ProductDetails
- Gradient background
- Enhanced image display
- Review system integration
- Modern card design

#### Navigation
- Gradient background
- Sticky positioning
- Enhanced search bar
- Smooth animations

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (max-width: 768px) { /* Mobile */ }
@media (min-width: 769px) and (max-width: 1024px) { /* Tablet */ }
@media (min-width: 1025px) { /* Desktop */ }
```

## 🎯 Best Practices

1. **Mobile First**: Design for mobile first, then enhance for larger screens
2. **Component Isolation**: Each component has its own CSS file
3. **Consistent Naming**: Use BEM methodology for class naming
4. **Performance**: Minimize CSS bundle size with proper organization
5. **Accessibility**: Ensure proper contrast ratios and focus states

## 🔧 Usage Examples

### Adding a new component style:
1. Create CSS file in appropriate folder
2. Import in component file
3. Use consistent naming conventions
4. Include responsive design
5. Add hover states and animations

### Using utility classes:
```jsx
<div className="card-custom shadow-hover">
  <h2 className="text-gradient">Title</h2>
  <button className="btn-custom btn-gradient">Action</button>
</div>
```

## 🚀 Future Enhancements

- [ ] CSS Variables for theming
- [ ] Dark mode support
- [ ] CSS-in-JS integration
- [ ] Animation library integration
- [ ] Performance optimization 