<p align="center">
  <img src="public/primelogo.png" alt="Prime SH Logo" width="180"/>
</p>

<h1 align="center">Prime SH — Full-Stack E-Commerce Platform</h1>

<p align="center">
  A modern, production-ready e-commerce web application built with Laravel, React, and Inertia.js — featuring multi-gateway payments, real-time search, automated email notifications, and a full admin dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Inertia.js-1-9553E9?style=for-the-badge&logo=inertia&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</p>

---

## 📸 Screenshots

> Add your screenshots here by replacing the placeholders below.

| Home Page | Product Detail | Checkout |
|-----------|---------------|----------|
| ![Home](screenshots/home.png) | ![Product](screenshots/product.png) | ![Checkout](screenshots/checkout.png) |

| Admin Dashboard | Orders | Search |
|----------------|--------|--------|
| ![Admin](screenshots/admin.png) | ![Orders](screenshots/orders.png) | ![Search](screenshots/search.png) |

---

## 🚀 Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Laravel 11** | Core PHP framework — routing, ORM, queues, mail |
| **Laravel Sanctum** | API token authentication |
| **Laravel Socialite** | Google OAuth 2.0 login |
| **Laravel Queues** | Asynchronous email processing |
| **MySQL** | Primary relational database |
| **DomPDF** | PDF invoice generation |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | Component-based UI |
| **TypeScript** | Type-safe frontend code |
| **Inertia.js** | SPA experience without a separate API |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible UI component library |
| **Framer Motion** | Smooth page & element animations |

### Payments
| Gateway | Region | Method |
|---------|--------|--------|
| **Stripe** | International | Credit / Debit Card |
| **PayPal** | International | PayPal Account |
| **Chargily Pay** | Algeria 🇩🇿 | CIB · Edahabia |
| **Cash on Delivery** | All | Pay on arrival |

### DevOps & Tooling
- **Mailtrap** — Email sandbox for development
- **Laravel Queue Worker** — Background job processing
- **Vite** — Frontend build tool
- **Git + GitHub** — Version control

---

## ✨ Key Features

### 🛍️ Shopping Experience
- Product catalog with category filtering, sorting, and price range slider
- Real-time **search autocomplete** — finds products and categories as you type, case-insensitive, debounced for performance
- Full search results page with combined product + category results
- Product detail pages with stock awareness
- **Smart shopping cart** — persists per logged-in user, clears automatically on logout, guests get session-only cart
- Add to cart toast notification with live item count
- Wishlist system saved to database

### 🔐 Authentication
- **Email & password** registration and login
- **Google OAuth** one-click sign-in via Laravel Socialite
- Sanctum token-based auth for API protection
- Role-based access control — `admin` vs `client`

### 💳 Checkout & Payments
- 3-step checkout flow: Contact & Delivery → Payment → Review
- Client-side **form validation** with inline error messages before submission
- Multi-gateway payment support: Stripe, PayPal, Chargily Pay, Cash on Delivery
- Webhook handlers for Stripe and Chargily to confirm payments server-side
- Automatic **order number generation**
- Stock decrement wrapped in DB transactions to prevent overselling

### 📧 Email System
- **Welcome email** sent on new user registration
- **Order confirmation email** with a professionally generated **PDF invoice** attached
- All emails processed through Laravel's queue system — non-blocking and reliable
- Configurable mail driver (Mailtrap for dev → any SMTP for production)

### 📦 Order Management
- Full order lifecycle: `pending → processing → shipped → delivered`
- Client order history with status badges and filtering
- Admin order management dashboard

### 🛠️ Admin Dashboard
- Product management: create, edit, delete with image uploads
- Category management
- Order management and status updates
- Stock tracking with low-stock warnings

---

## ⚙️ Installation & Setup

### Requirements
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8+

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/prime-sh.git
cd prime-sh
```

### 2. Install dependencies
```bash
composer install
npm install
```

### 3. Environment setup
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configure your `.env`
```env
# Database
DB_DATABASE=prime_sh
DB_USERNAME=root
DB_PASSWORD=

# Mail (Mailtrap for dev)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_user
MAIL_PASSWORD=your_mailtrap_pass

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Stripe
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_SANDBOX_CLIENT_ID=your_client_id
PAYPAL_SANDBOX_CLIENT_SECRET=your_secret
PAYPAL_MODE=sandbox

# Chargily Pay
CHARGILY_API_KEY=your_api_key
CHARGILY_MODE=test
CHARGILY_WEBHOOK_SECRET=your_webhook_secret
```

### 5. Database setup
```bash
php artisan migrate
php artisan db:seed   # optional: seed sample data
php artisan storage:link
```

### 6. Run the application
```bash
# Terminal 1 — Laravel server
php artisan serve

# Terminal 2 — Queue worker (for emails)
php artisan queue:work

# Terminal 3 — Vite dev server
npm run dev
```

Visit `http://localhost:8000`

---

## 🗂️ Project Structure

```
prime-sh/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/           # Google OAuth
│   │   ├── Shop/           # Home, Categories, Search, Checkout
│   │   └── User/           # Product & Order management
│   ├── Mail/               # WelcomeEmail, OrderConfirmationMail
│   └── Models/             # User, Product, Order, OrderItem, Category
├── resources/
│   ├── js/
│   │   ├── components/     # AddToCartButton, ShoppingCart, FavoriteButton...
│   │   ├── contexts/       # cartContext, wishlistContext, authContext
│   │   ├── layouts/        # ShopFrontLayout
│   │   └── pages/          # Home, CategoryDetail, Checkout, Orders, Search...
│   └── views/
│       ├── emails/         # order-confirmation.blade.php
│       └── pdfs/           # invoice.blade.php
└── routes/
    ├── web.php
    └── api.php
```

---

## 🔮 Future Work

| Feature | Description |
|---------|-------------|
| 🐳 **Docker** | Containerize with Docker Compose for one-command deployment |
| 🚀 **CI/CD Pipeline** | GitHub Actions for automated testing and deployment |
| ⭐ **Product Reviews** | Let customers rate and review products they've purchased |
| 🔔 **Push Notifications** | Real-time order status updates via WebSockets (Laravel Echo + Pusher) |
| 🎟️ **Discount Coupons** | Promo code system with percentage and fixed-amount discounts |
| 📊 **Analytics Dashboard** | Sales charts, revenue tracking, top products by period |
| 📱 **Mobile App** | React Native app sharing the same Laravel API backend |
| 🌍 **Multi-language** | Arabic / French / English support with i18n |
| 🔁 **Order Returns** | Return request flow with admin approval and refund tracking |
| 📦 **Inventory Alerts** | Email admin when a product reaches low stock threshold |
| 🤖 **AI Recommendations** | "Customers also bought" based on order history |
| 💬 **Live Chat Support** | Customer support chat integrated into the storefront |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by <strong>Ahmed Amokrane</strong></p>
