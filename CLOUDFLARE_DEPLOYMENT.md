# Game Store - Cloudflare Deployment Guide

This guide will help you deploy the Game Store application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. Node.js 18 or later installed
3. Wrangler CLI installed (`npm install -D wrangler`)

## Environment Variables

Before deploying, you need to set up the following environment variables in your Cloudflare Pages project:

### Required Environment Variables

1. **Database Configuration:**
   - `DATABASE_URL`: Your database connection string (for production, consider using a hosted database like PlanetScale, Neon, or Supabase)

2. **NextAuth Configuration:**
   - `NEXTAUTH_SECRET`: A random string for JWT encryption (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your production domain (e.g., `https://your-project.pages.dev`)

3. **Site Configuration:**
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (same as NEXTAUTH_URL)

4. **Stripe Configuration (for payments):**
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

### Setting Environment Variables in Cloudflare

1. Go to your Cloudflare Dashboard
2. Navigate to Pages
3. Select your project (or create a new one)
4. Go to Settings → Environment variables
5. Add each variable with its value

## Deployment Steps

### Option 1: Using Wrangler CLI (Recommended)

1. **Login to Cloudflare:**
   ```bash
   npx wrangler auth login
   ```

2. **Deploy to Cloudflare Pages:**
   ```bash
   npm run deploy
   ```

### Option 2: Using Cloudflare Dashboard

1. **Connect your repository:**
   - Go to Cloudflare Pages dashboard
   - Click "Create a project"
   - Connect your GitHub/GitLab repository

2. **Configure build settings:**
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/` (leave empty)

3. **Set environment variables** (see section above)

4. **Deploy:**
   - Cloudflare will automatically deploy when you push to your main branch

## Database Setup for Production

Since SQLite doesn't work well with serverless environments like Cloudflare Pages, you'll need a hosted database:

### Recommended Options:

1. **PlanetScale** (MySQL-compatible)
2. **Neon** (PostgreSQL)
3. **Supabase** (PostgreSQL)
4. **Railway** (PostgreSQL/MySQL)

### Migration Steps:

1. Update your `DATABASE_URL` in environment variables
2. Update `schema.prisma` provider to match your database (e.g., `postgresql` for PostgreSQL)
3. Run migrations: `npx prisma db push`
4. Seed the database if needed: `npx prisma db seed`

## Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Ensure `DATABASE_URL` is correctly set in Cloudflare environment variables
   - Verify database credentials and network access

2. **Build Failures:**
   - Check that all environment variables are set
   - Ensure Node.js version is 18 or higher
   - Verify that `npm install` completes successfully

3. **Authentication Issues:**
   - Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set correctly
   - Check that the domain matches your Cloudflare Pages domain

### Debug Commands:

```bash
# Test build locally
npm run build

# Preview deployment locally
npm run preview

# Check wrangler configuration
npx wrangler pages deployment list
```

## Performance Optimization

The application includes several performance optimizations:

- Static generation for pages where possible
- Image optimization with Next.js
- API response caching
- Code splitting and lazy loading

## Security Considerations

- All sensitive data (API keys, secrets) are stored as environment variables
- Database queries use parameterized statements to prevent SQL injection
- Authentication is handled securely with NextAuth.js
- HTTPS is enforced by Cloudflare

## Monitoring

After deployment, you can monitor your application through:

- Cloudflare Analytics dashboard
- Application logs in Cloudflare Pages
- Database monitoring (if using a hosted database)

## Support

If you encounter issues during deployment:

1. Check the Cloudflare Pages build logs
2. Verify all environment variables are set correctly
3. Ensure your database is accessible from Cloudflare's network
4. Check that all dependencies are compatible with the deployment environment