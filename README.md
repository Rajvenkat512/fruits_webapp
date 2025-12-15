# Fruits App - Mobile E-Commerce Application

A fully-featured React Native e-commerce application built with Expo, TypeScript, and integrated with a backend API. This app provides a seamless shopping experience for purchasing fresh fruits with categories, product details, shopping cart, and wishlist functionality.

## Features

✅ **Authentication**
- User login and registration
- JWT token-based authentication
- Persistent login state

✅ **Product Browsing**
- View all products
- Browse by categories
- Search and filter functionality
- Product details with descriptions

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- View cart summary
- Calculate totals

✅ **Wishlist**
- Save favorite items
- Quick access from any screen
- Remove items from wishlist

✅ **User Profile**
- View profile information
- Edit profile details
- Account statistics
- Logout functionality

✅ **UI/UX**
- Bottom tab navigation
- Responsive design
- Loading states
- Error handling
- RefreshControl on home screen

## Project Structure

```
app/
├── (splash)/
│   └── index.tsx                 ← Splash screen (auto 3 sec)
├── (auth)/
│   ├── login.tsx                 ← Login screen
│   └── register.tsx              ← Register screen
├── (tabs)/                       ← Main app tabs
│   ├── _layout.tsx               ← Bottom tabs layout
│   ├── index.tsx                 ← Home page
│   ├── cart.tsx                  ← Cart page
│   ├── watchlist.tsx             ← Watchlist page
│   └── profile.tsx               ← Profile page
├── categories/
│   └── [id].tsx                  ← Category detail page
├── products/
│   └── [id].tsx                  ← Product detail page
└── _layout.tsx                   ← Root layout

components/
├── ProductCard.tsx               ← Product display card
├── CategoryCard.tsx              ← Category card
├── Header.tsx                    ← Header component
└── Button.tsx                    ← Custom button

services/
├── api.ts                        ← Axios configuration
├── auth.service.ts               ← Authentication
├── category.service.ts           ← Categories API
├── product.service.ts            ← Products API
├── cart.service.ts               ← Shopping cart API
├── watchlist.service.ts          ← Wishlist API
└── user.service.ts               ← User profile API

store/
├── auth.store.ts                 ← Auth state (Zustand)
├── cart.store.ts                 ← Cart state (Zustand)
├── watchlist.store.ts            ← Wishlist state (Zustand)
└── user.store.ts                 ← User state (Zustand)

constants/
└── theme.ts                      ← Colors, spacing, fonts

assets/
└── images/                       ← App images
```

## Installation

1. **Clone and install dependencies**
   ```bash
   cd "d:\Fruits app"
   npm install
   ```

2. **Configure environment**
   - Edit `.env` file
   - Update `EXPO_PUBLIC_API_URL` to your backend URL (default: `http://localhost:3000`)

3. **Start the app**
   ```bash
   npm start
   ```

4. **Run on device/emulator**
   - **Android**: Press `a`
   - **iOS**: Press `i`
   - **Web**: Press `w`

## API Integration

All 20 API endpoints are fully integrated:

### Authentication (1 endpoint)
- POST `/api/auth/login` - User login

### Categories (5 endpoints)
- GET `/api/categories` - List all categories
- POST `/api/categories` - Create category
- GET `/api/categories/[id]` - Get single category
- PUT `/api/categories/[id]` - Update category
- DELETE `/api/categories/[id]` - Delete category

### Products (5 endpoints)
- GET `/api/products` - List products
- POST `/api/products` - Create product
- GET `/api/products/[id]` - Get product details
- PUT `/api/products/[id]` - Update product
- DELETE `/api/products/[id]` - Delete product

### Shopping Cart (4 endpoints)
- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add to cart
- PUT `/api/cart/[id]` - Update quantity
- DELETE `/api/cart/[id]` - Remove item

### Watchlist (3 endpoints)
- GET `/api/watchlist` - Get user's watchlist
- POST `/api/watchlist` - Add to watchlist
- DELETE `/api/watchlist/[id]` - Remove from watchlist

### User Profile (2 endpoints)
- GET `/api/profile` - Get profile
- PUT `/api/profile` - Update profile

## Demo Credentials

```
Email: user@example.com
Password: password123
```

## Required Headers

### For User-Specific Data
- `x-user-id` header is automatically added from AsyncStorage
- `Authorization: Bearer {token}` is automatically added for authenticated requests

### For Public Data
- No special headers needed

## State Management

Uses **Zustand** for state management with these stores:

- **authStore** - Authentication state, login, register, logout
- **cartStore** - Shopping cart items and operations
- **watchlistStore** - Wishlist items and operations
- **userStore** - User profile information

## Styling

- **NativeWind** for Tailwind CSS support
- **Custom theme** with predefined colors and spacing
- **Lucide React Native** for icons

## Color Scheme

- **Primary**: #FF6B6B (Red - Fruits theme)
- **Secondary**: #4ECDC4 (Teal)
- **Success**: #2ECC71 (Green)
- **Warning**: #F39C12 (Orange)
- **Danger**: #E74C3C (Red)
- **Dark**: #2C3E50
- **Light**: #ECF0F1

## Key Features

### Error Handling
- Try-catch blocks in all API calls
- Alert dialogs for user feedback
- Error state in stores

### Loading States
- ActivityIndicator during data fetching
- RefreshControl for pull-to-refresh
- Disabled buttons during loading

### Navigation
- Tab-based navigation for main app
- Stack navigation for details
- Proper handling of navigation state

### Data Persistence
- AsyncStorage for token and user ID
- Zustand stores for app state
- Auto-restore token on app launch

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Token expired, need to login again
   - Handled automatically with logout

2. **404 Not Found**
   - Verify API endpoint and ID
   - Check if resource exists

3. **Network Error**
   - Ensure backend is running
   - Check `EXPO_PUBLIC_API_URL` in `.env`

4. **Build Issues**
   - Delete `node_modules` and reinstall
   - Clear Expo cache: `expo start -c`

## Available Scripts

```bash
npm start        # Start Expo development server
npm run android  # Run on Android emulator
npm run ios      # Run on iOS simulator
npm run web      # Run in web browser
npm test         # Run tests (if configured)
```

## Dependencies

### Core
- `expo` - React Native framework
- `expo-router` - File-based routing
- `react-native` - Mobile framework
- `react` - UI library

### API & State
- `axios` - HTTP client
- `zustand` - State management
- `@react-native-async-storage/async-storage` - Local storage

### UI
- `nativewind` - Tailwind CSS for React Native
- `lucide-react-native` - Icon library
- `react-native-gesture-handler` - Gesture handling
- `react-native-screens` - Screen management

## License

MIT

## Support

For issues, questions, or suggestions, please reach out or create an issue in the repository.

---

**Built with ❤️ using Expo + React Native**
