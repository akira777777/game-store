# DEPLOY NOW - Railway (No Limits!)

## Problem: Vercel Free Tier Limits

Vercel has strict limits:

- Max 5000 files per upload
- Rate limiting on free tier

## Solution: Railway

Railway has NO such limits and includes PostgreSQL!

---

## Quick Railway Deploy (3 commands)

```powershell
# Already installed: Railway CLI v4.26.0

# 1. Login (opens browser)
railway login

# 2. Create project + add PostgreSQL
railway init

# 3. Deploy!
railway up
```

---

## Step by Step

### 1. Login

```powershell
railway login
```

- Browser will open
- Login with GitHub or Google
- Return to terminal

### 2. Initialize Project

```powershell
railway init
```

**Answer:**

- Create new project? **Yes**
- Project name: **game-store**
- Starting template: **Empty Project**

### 3. Add PostgreSQL

```powershell
railway add
```

**Select:** PostgreSQL

Railway automatically:

- Creates database
- Sets DATABASE_URL environment variable
- Configures everything!

### 4. Add Environment Variables

```powershell
railway open
```

In dashboard:

1. Go to your service (not PostgreSQL)
2. Variables tab
3. Add:

```
NEXTAUTH_SECRET=f8a7c3e9d2b1f4a6e8c7d9b3f2a5e1c4d6b8f7a9c3e5d2b4f6a8c1e3d5b7f9a2
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

### 5. Deploy

```powershell
railway up
```

Wait 2-3 minutes...

### 6. Run Migrations

```powershell
railway run npx prisma db push
```

### 7. Get URL

```powershell
railway domain
```

---

## Why Railway > Vercel for this project

| Feature | Railway | Vercel |
|---------|---------|--------|
| **File limit** | No limit | 5000 files |
| **Database** | Included | Separate (Neon) |
| **Setup** | Easier | More steps |
| **Free tier** | $5/month | Free but limited |
| **Cold starts** | No | Yes |

---

## Ready to Deploy?

Copy these 3 commands:

```powershell
railway login
railway init
railway up
```

That's it! 🚀
