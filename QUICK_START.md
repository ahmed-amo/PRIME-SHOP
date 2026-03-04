# Quick Start: Google OAuth Setup

## ⚡ Quick Setup Steps

### 1. Install Laravel Sanctum (if not installed)
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 2. Add to `.env`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM_ADDRESS=noreply@myshop.com
MAIL_FROM_NAME="My Shop"

FRONTEND_URL=http://localhost:5173
QUEUE_CONNECTION=database
```

### 3. Run Migrations:
```bash
php artisan migrate
```

### 4. Start Queue Worker (in separate terminal):
```bash
php artisan queue:work
```

### 5. Install React Router (if using React Router):
```bash
npm install react-router-dom
```

### 6. Add to React `.env`:
```env
VITE_API_URL=http://localhost:8000
```

## 📁 Files Created

### Backend:
- ✅ `database/migrations/2026_02_19_100000_add_google_oauth_fields_to_users_table.php`
- ✅ `app/Http/Controllers/Auth/GoogleController.php`
- ✅ `app/Mail/WelcomeEmail.php`
- ✅ `resources/views/emails/welcome.blade.php`
- ✅ `routes/api.php`
- ✅ `config/cors.php`

### Frontend:
- ✅ `resources/js/components/GoogleLoginButton.tsx`
- ✅ `resources/js/pages/AuthCallback.tsx`
- ✅ `resources/js/contexts/authContext.tsx`
- ✅ `resources/js/lib/axios.ts`

## 🎯 Usage

### In Login Component:
```tsx
import GoogleLoginButton from "@/components/GoogleLoginButton";

<GoogleLoginButton />
```

### In Protected Routes:
```tsx
import { useAuth } from "@/contexts/authContext";

const { user, logout, isAuthenticated } = useAuth();
```

### Make API Calls:
```tsx
import axios from "@/lib/axios";

const response = await axios.get("/api/user");
```

## 🔗 Routes

- `GET /api/auth/google` - Redirects to Google OAuth
- `GET /api/auth/google/callback` - Handles OAuth callback
- `GET /api/user` - Get authenticated user (requires token)
- `DELETE /api/logout` - Revoke token (requires token)

See `GOOGLE_OAUTH_SETUP.md` for detailed documentation.
