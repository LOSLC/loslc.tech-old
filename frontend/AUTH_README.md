# Frontend Authentication System

This authentication system is built with:
- **ky** for HTTP requests
- **@tanstack/react-query** for state management
- **i18next** for internationalization (English and French)

## Features

### 🔐 Authentication Features
- User registration with email/username availability checking
- User login with email and password
- OTP verification (2FA)
- Password reset functionality
- Account email verification
- Form validation with real-time feedback
- Internationalization (English/French)

### 🏗️ Architecture
- **API Client**: `src/lib/api/client.ts` - ky-based HTTP client with error handling
- **Auth API**: `src/lib/api/auth.ts` - Authentication API functions
- **React Query Hooks**: `src/lib/hooks/auth.ts` - Custom hooks for auth operations
- **Validation**: `src/lib/hooks/validation.ts` - Form validation with i18n
- **Context**: `src/lib/contexts/auth-context.tsx` - Authentication context and state
- **Components**: `src/components/auth/` - Reusable auth UI components

### 📁 File Structure
```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts          # ky HTTP client
│   │   └── auth.ts            # Auth API functions
│   ├── hooks/
│   │   ├── auth.ts            # React Query auth hooks
│   │   ├── validation.ts      # Form validation hooks
│   │   └── toast.ts           # Toast notifications
│   ├── contexts/
│   │   └── auth-context.tsx   # Authentication context
│   ├── providers/
│   │   ├── index.tsx          # Combined providers
│   │   ├── react-query-provider.tsx
│   │   └── i18n-provider.tsx
│   └── i18n/
│       └── config.ts          # i18n configuration
├── components/
│   ├── auth/
│   │   ├── auth-container.tsx    # Main auth component
│   │   ├── login-form.tsx        # Login form
│   │   ├── register-form.tsx     # Registration form
│   │   ├── otp-form.tsx          # OTP verification
│   │   ├── password-reset-form.tsx
│   │   ├── protected-route.tsx   # Route protection
│   │   └── index.ts              # Exports
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── card.tsx
└── app/
    └── (main)/
        ├── auth/
        │   ├── login/page.tsx
        │   ├── register/page.tsx
        │   ├── forgot-password/page.tsx
        │   ├── reset-password/page.tsx
        │   └── verify-otp/page.tsx
        └── dashboard/page.tsx     # Protected demo page
```

### 🌐 API Endpoints (Backend)
The frontend expects these backend endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify-email` - Email verification
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/check-email/:email` - Check email availability
- `GET /api/auth/check-username/:username` - Check username availability

### 🎨 Components Usage

#### Basic Usage
```tsx
import { AuthContainer } from '@/components/auth';

// Login page
<AuthContainer initialMode="login" />

// Registration page
<AuthContainer initialMode="register" />
```

#### Protected Routes
```tsx
import { ProtectedRoute } from '@/components/auth';

<ProtectedRoute>
  <YourProtectedComponent />
</ProtectedRoute>
```

#### Using Auth Context
```tsx
import { useAuth } from '@/lib/contexts/auth-context';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.fullName}</div>;
}
```

### 🌍 Internationalization
Switch between English and French:
```tsx
import { useTranslation } from 'react-i18next';

function LanguageToggle() {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  return <button onClick={toggleLanguage}>Toggle Language</button>;
}
```

### 🔧 Configuration
The system uses these environment variables (configured in `next.config.ts`):
- `BACKEND_URL` - Backend API URL (defaults to https://api.loslc.tech)

### 📝 TODO
- [ ] Implement proper toast notifications (currently using console/alert)
- [ ] Add "Remember Me" functionality
- [ ] Add social authentication (Google, GitHub, etc.)
- [ ] Add user profile management
- [ ] Add user avatar upload
- [ ] Implement proper "me" endpoint integration
- [ ] Add loading states improvements
- [ ] Add more comprehensive error handling
- [ ] Add unit tests
- [ ] Add proper session management

### 🚀 Getting Started
1. The authentication system is already integrated into the layout
2. Visit `/auth/login` to see the login form
3. Visit `/auth/register` to see the registration form
4. Visit `/dashboard` to see a protected route example

The system is ready to use and will work with your NestJS backend once the backend is running.
