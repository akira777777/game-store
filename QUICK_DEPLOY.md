# Quick Deploy Guide

## Fastest Way: Vercel (2 minutes)

### Option 1: Simple Script (NO EMOJI - PowerShell Safe)

```powershell
cd "C:\Users\-\Desktop\game-store"
.\deploy-vercel-simple.ps1
```

### Option 2: Manual Commands (If script fails)

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy Preview
vercel

# OR Deploy Production
vercel --prod
```

---

## After First Deploy

### Add Environment Variables in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings -> Environment Variables
4. Add:

```bash
DATABASE_URL=postgresql://[YOUR_NEON_URL]
NEXTAUTH_SECRET=f8a7c3e9d2b1f4a6e8c7d9b3f2a5e1c4d6b8f7a9c3e5d2b4f6a8c1e3d5b7f9a2
NEXTAUTH_URL=https://your-app.vercel.app
```

5. Redeploy:

```powershell
vercel --prod
```

---

## Get Free Database (Neon)

1. Go to: https://neon.tech
2. Sign up (free)
3. Create new project
4. Copy DATABASE_URL (Pooled connection)
5. Add to Vercel environment variables

---

## Alternative: Railway (If Vercel doesn't work)

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login (opens browser)
railway login

# Create project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

Railway includes database automatically!

---

## Troubleshooting

### PowerShell Script Error

If script fails with encoding error, use manual commands:

```powershell
npm install -g vercel
vercel
```

### Build Error

Check that all dependencies are installed:

```powershell
npm install
npm run build
```

### Database Connection Error

Make sure:
1. DATABASE_URL is correct
2. Database is running (Neon auto-pause is normal)
3. Prisma is generated: `npx prisma generate`

---

## Success Checklist

- [ ] Site deployed (got URL)
- [ ] Environment variables added
- [ ] Redeployed after adding variables
- [ ] Site loads without errors
- [ ] Can register/login
- [ ] Images load
- [ ] Language switch works

---

**Need help? Check full guides:**
- `VERCEL_QUICK_DEPLOY.md` (detailed Vercel guide)
- `RAILWAY_DEPLOY_INSTRUCTIONS.md` (Railway guide)
