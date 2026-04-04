# Google OAuth + Transactional Email Setup Guide

This guide walks you through setting up Google OAuth authentication and transactional emails for your Laravel + React e-commerce app.

## 📋 Prerequisites

1. **Laravel Sanctum** - Install if not already installed:
   ```bash
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   php artisan migrate
   ```

2. **Google OAuth Credentials** - Get from [Google Cloud Console](https://console.cloud.google.com/):
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:8000/auth/google/callback`

3. **Mailtrap Account** (for dev) - Sign up at [mailtrap.io](https://mailtrap.io)

## 🔧 Step 1: Environment Variables

Add these to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Mail Configuration (Mailtrap for dev)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@myshop.com
MAIL_FROM_NAME="${APP_NAME}"

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173

# Queue Configuration
QUEUE_CONNECTION=database
```

## 🗄️ Step 2: Run Migrations

```bash
# Add Google OAuth fields to users table
php artisan migrate

# Create jobs table for queue (if not exists)
# Note: This migration should already exist in Laravel 11
php artisan migrate
```

## 📧 Step 3: Queue Setup

The queue system is already configured to use the `database` driver. Make sure the `jobs` table exists:

```bash
php artisan migrate
```

## 🚀 Step 4: Start Queue Worker

In a separate terminal, start the queue worker to process emails:

```bash
php artisan queue:work
```

Or for development with auto-restart:

```bash
php artisan queue:listen
```

## ⚙️ Step 5: Update App Config

Add `frontend_url` to `config/app.php` (optional, uses env as fallback):

```php
'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),
```

## 🎨 Step 6: React Setup

### Install React Router (if not already installed):

```bash
npm install react-router-dom
```

### Wrap your app with AuthProvider:

In your main `App.tsx` or root component:

```tsx
import { AuthProvider } from "@/contexts/authContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Your routes */}
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* Other routes */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### Add Environment Variable for React:

Create or update `.env` in your React app root:

```env
VITE_API_URL=http://localhost:8000
```

## 🧪 Step 7: Test the Flow

1. **Start Laravel server:**
   ```bash
   php artisan serve
   ```

2. **Start Queue worker** (in separate terminal):
   ```bash
   php artisan queue:work
   ```

3. **Start React dev server:**
   ```bash
   npm run dev
   ```

4. **Test Google Login:**
   - Navigate to your login page
   - Click "Continue with Google"
   - Complete Google OAuth flow
   - Should redirect to `/auth/callback` with token
   - Should redirect to `/dashboard`
   - Check Mailtrap inbox for welcome email

## 📝 Step 8: Using the Components

### Add Google Login Button to Login Page:

```tsx
import GoogleLoginButton from "@/components/GoogleLoginButton";

function LoginPage() {
  return (
    <div>
      <GoogleLoginButton />
      {/* Other login options */}
    </div>
  );
}
```

### Use Auth Context in Components:

```tsx
import { useAuth } from "@/contexts/authContext";

function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Make Authenticated API Calls:

```tsx
import axios from "@/lib/axios";

async function fetchOrders() {
  const response = await axios.get("/api/orders");
  return response.data;
}
```

## 🔍 Troubleshooting

### CORS Issues:
- Make sure `config/cors.php` has `http://localhost:5173` in `allowed_origins`
- Check that API routes are properly configured in `bootstrap/app.php`

### Queue Not Processing:
- Make sure queue worker is running: `php artisan queue:work`
- Check `QUEUE_CONNECTION=database` in `.env`
- Verify `jobs` table exists: `php artisan migrate:status`

### Token Not Working:
- Check that Sanctum is installed and configured
- Verify token is being stored in localStorage
- Check browser console for CORS or auth errors

### Email Not Sending:
- Verify Mailtrap credentials in `.env`
- Check queue worker is running
- Check `failed_jobs` table for errors: `php artisan queue:failed`

## 📚 Next Steps

You can now easily add more transactional emails:

1. **OrderConfirmationEmail:**
   ```bash
   php artisan make:mail OrderConfirmationEmail
   ```

2. **ShippingUpdateEmail:**
   ```bash
   php artisan make:mail ShippingUpdateEmail
   ```

3. **InvoiceMail** (with PDF):
   ```bash
   php artisan make:mail InvoiceMail
   ```
   Then attach PDF in the `attachments()` method.

All emails will be queued automatically when using `Mail::queue()`.
