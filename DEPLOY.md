# 🚀 Game Store - Production Deployment Guide

**Version:** 1.0
**Date:** 2026-01-19
**Status:** ✅ Ready for Production

---

## 📋 Pre-Deployment Checklist

### ✅ Code Quality

- [x] `npm run build` passes ✅
- [x] No TypeScript errors
- [x] No console errors
- [x] `.gitignore` updated
- [x] Removed dev files (LLM models, local-agent)

### ✅ Environment Setup

- [x] `.env.example` exists and is documented
- [ ] All production env vars prepared

### ✅ Database

- [x] Prisma schema is valid
- [x] Migrations created
- [ ] Production database URL ready

### ✅ Security

- [x] No hardcoded secrets
- [x] `.env` in .gitignore
- [ ] NEXTAUTH_SECRET generated
- [ ] Stripe keys obtained

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Best for:** Full-featured production deployment

#### Steps

1. **Push to GitHub:**

```bash
git add .
git commit -m "chore: clean up project for production deployment"
git push origin main
```

1. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables:**

In Vercel dashboard → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://user:password@host:port/db?sslmode=require
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.vercel.app
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

1. **Deploy:**
   - Click "Deploy"
   - Wait ~2-3 minutes
   - Done! ✅

2. **Configure Stripe Webhook:**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy webhook secret → Update `STRIPE_WEBHOOK_SECRET` in Vercel

#### Database Recommendations for Vercel

- **Neon** (Serverless PostgreSQL): <https://neon.tech> ✅ FREE tier
- **Supabase**: <https://supabase.com> ✅ FREE tier
- **PlanetScale**: <https://planetscale.com>

---

### Option 2: Netlify

**Best for:** Simpler deployments

#### Steps

1. **Install Netlify CLI:**

```bash
npm install -g netlify-cli
```

1. **Build:**

```bash
npm run build
```

1. **Deploy:**

```bash
netlify deploy --prod
```

1. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables in Netlify UI

**Note:** Netlify requires additional configuration for Next.js API routes. Vercel recommended for easier setup.

---

### Option 3: Cloudflare Pages

**Best for:** Edge deployment

#### Steps

1. **Install Wrangler:**

```bash
npm install -g wrangler
```

1. **Login:**

```bash
wrangler login
```

1. **Deploy:**

```bash
npm run build
wrangler pages deploy .next
```

**Note:** See `wrangler.toml` for configuration.

---

## 🔐 Environment Variables Setup

### 1. Generate NEXTAUTH_SECRET

```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or use script:
node scripts/generate-secret.js
```

### 2. Get Stripe Keys

1. Go to <https://stripe.com/dashboard>
2. **For Testing:** Switch to "Test mode"
   - Copy "Publishable key" (pk_test_...)
   - Copy "Secret key" (sk_test_...)
3. **For Production:** Switch to "Live mode"
   - Copy "Publishable key" (pk_live_...)
   - Copy "Secret key" (sk_live_...)

### 3. Setup Database

#### Option A: Neon (Recommended)

1. Go to <https://neon.tech>
2. Create new project
3. Copy connection string:

   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

4. Add to `DATABASE_URL`

#### Option B: Supabase

1. Go to <https://supabase.com>
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (Transaction mode)
5. Replace `[YOUR-PASSWORD]` with your password
6. Add to `DATABASE_URL`

### 4. Configure Stripe Webhook

**Production webhook URL format:**

```
https://your-domain.com/api/webhooks/stripe
```

**Events to select:**

- `checkout.session.completed`

After creating webhook, copy the `Signing secret` (whsec_...) to `STRIPE_WEBHOOK_SECRET`.

---

## 🗄️ Database Migration

### First Deployment

```bash
# 1. Set DATABASE_URL in .env
echo "DATABASE_URL=postgresql://..." > .env

# 2. Run migrations
npm run db:migrate:deploy

# 3. (Optional) Seed data
npm run db:seed
```

### Subsequent Deployments

Migrations run automatically during build (`npm run build`).

---

## ✅ Post-Deployment Verification

### 1. Basic Functionality

- [ ] Homepage loads
- [ ] Games catalog displays
- [ ] Game details page works
- [ ] Search/filter works
- [ ] Internationalization (EN/RU) works

### 2. Authentication

- [ ] Register new user
- [ ] Login works
- [ ] Logout works
- [ ] Session persists

### 3. Shopping Flow

- [ ] Add game to cart
- [ ] Cart displays correctly
- [ ] Checkout page loads
- [ ] Payment form appears

### 4. Admin Panel

- [ ] Login as admin
- [ ] Admin dashboard accessible
- [ ] Can create/edit games
- [ ] Can view orders

### 5. Stripe Integration

- [ ] Test payment succeeds
- [ ] Webhook received
- [ ] Order created in database

**Test Card:** `4242 4242 4242 4242` (any future date, any CVC)

---

## 🔍 Monitoring

### Vercel

- **Analytics:** Vercel Dashboard → Analytics
- **Logs:** Vercel Dashboard → Deployments → View Function Logs
- **Errors:** Automatic error tracking

### Custom Monitoring

Consider adding:

- **Sentry** (error tracking)
- **LogRocket** (session replay)
- **Google Analytics** (user analytics)

---

## 🚨 Troubleshooting

### Build Fails

**Error:** `Cannot find module 'prisma'`

```bash
npm install
npm run db:generate
npm run build
```

**Error:** `NEXTAUTH_SECRET is not defined`

- Add `NEXTAUTH_SECRET` to environment variables
- Redeploy

### Database Connection Issues

**Error:** `Can't reach database server`

- Verify `DATABASE_URL` is correct
- Check database is running
- For Neon/Supabase: verify SSL mode (`?sslmode=require`)

### Stripe Webhook Not Working

1. Verify webhook URL is correct: `https://your-domain.com/api/webhooks/stripe`
2. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Check Stripe Dashboard → Webhooks → Recent deliveries for errors

### 404 on Dynamic Pages

- Ensure database is populated with games
- Check Prisma client is generated
- Verify API routes are working

---

## 📊 Performance Tips

### 1. Enable Caching

In `next.config.mjs`:

```javascript
images: {
  minimumCacheTTL: 60,
},
```

### 2. Optimize Images

All images should be:

- WebP format
- Optimized size
- Lazy loaded (Next.js does this automatically)

### 3. Database Query Optimization

- Use indexes on frequently queried fields
- Implement pagination for large lists
- Use `select` to limit returned fields

### 4. Prisma Connection Pooling

For serverless (Vercel), use:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // For migrations
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📝 Deployment Logs

### Track Your Deployments

| Date | Version | Platform | URL | Status |
|------|---------|----------|-----|--------|
| 2026-01-19 | 1.0 | Vercel | https://... | ✅ |
|  |  |  |  |  |

---

## 🎯 Next Steps After Deployment

1. **Monitor for 24h** - Check logs and errors
2. **Setup Analytics** - Add tracking code
3. **Configure Domain** - Add custom domain
4. **Setup Email** - Configure transactional emails
5. **Backup Database** - Setup automatic backups
6. **SSL Certificate** - Verify HTTPS works
7. **SEO** - Submit sitemap to search engines

---

## 📞 Support

### Documentation

- `README.md` - Project overview
- `ENV_SETUP.md` - Environment setup
- `TROUBLESHOOTING.md` - Common issues

### External Resources

- **Next.js Docs:** <https://nextjs.org/docs>
- **Prisma Docs:** <https://www.prisma.io/docs>
- **Stripe Docs:** <https://stripe.com/docs>
- **Vercel Docs:** <https://vercel.com/docs>

---

**🎉 Your Game Store is ready for production!**

**Quick Deploy to Vercel:**

```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
# Then import in Vercel dashboard
```

Good luck! 🚀
