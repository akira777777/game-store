# Game Store Marketplace

**Production-Ready Next.js 14 E-commerce Platform**

Modern, high-performance marketplace for buying games and gift cards. Built with Next.js, TypeScript, Prisma, and Stripe integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Setup database
$env:DATABASE_URL="file:./prisma/dev.db"
npx prisma db push

# Run development server
npm run dev
```

Open **http://localhost:3000** in your browser.

## 📊 Project Structure

```
game-store/
├── app/                 # Next.js App Router (routes & API)
├── components/          # React components (30+ components)
├── lib/                 # Utilities & configuration
├── prisma/             # Database schema & migrations
├── scripts/            # Helper scripts (seed, create-admin)
├── types/              # TypeScript type definitions
├── messages/           # i18n translations (EN, RU)
├── middleware.ts       # Next.js middleware (i18n, security)
├── package.json        # Dependencies
└── [config files]      # TypeScript, Tailwind, Next.js configs
```

## ✨ Key Features

- **E-commerce**: Game catalog, gift cards, shopping cart, checkout
- **Payments**: Stripe integration with webhook support
- **Authentication**: NextAuth v5 with JWT & password hashing
- **Localization**: Multi-language support (English, Russian)
- **Database**: Prisma ORM with PostgreSQL/SQLite support
- **Admin Panel**: Game and payment card management
- **Security**: SQL injection protection, CSRF defense, rate limiting
- **Performance**: Database query optimization, caching headers, image optimization

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript 5, TailwindCSS
- **Backend**: Next.js API Routes, Prisma 7 ORM
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: NextAuth v5, bcryptjs
- **Payments**: Stripe API
- **UI**: Radix UI components
- **Validation**: Zod

## 📋 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint

# Database
npx prisma db push      # Sync schema with database
npx prisma migrate dev  # Create migration
npx prisma studio      # Open Prisma Studio

# Utilities
npm run create-admin    # Create admin user
npm run db:seed        # Seed database with data
```

## 🔐 Security

✅ SQL Injection protection via input sanitization  
✅ XSS protection with Next.js built-in features  
✅ CSRF protection  
✅ Rate limiting (60 req/min API)  
✅ Password hashing with bcryptjs  
✅ JWT-based authentication  
✅ Security headers configured  

## 📦 Database Models

- **User** - User accounts and profiles
- **Game** - Game products  
- **PaymentCard** - Gift card products
- **CartItem** - Shopping cart items
- **Order** - User orders
- **OrderItem** - Items in orders
- **WishlistItem** - User favorites
- **PromoCode** - Discount codes

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Self-hosted
```bash
npm run build
npm start
```

### Cloudflare Pages
```bash
npm run build
wrangler pages deploy .next
```

## 🌍 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db"

# Authentication
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# Stripe
STRIPE_PUBLIC_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# i18n
NEXT_PUBLIC_DEFAULT_LOCALE="en"
```

## 📊 Project Status

✅ **Build**: Compiled successfully  
✅ **TypeScript**: No errors  
✅ **Security**: Enterprise-grade  
✅ **Performance**: Optimized  
✅ **Production Ready**: YES  

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

MIT

---

**Last Updated**: January 27, 2026  
**Version**: 1.0.0  
**Status**: 🟢 Production Ready
