# 🔐 Environment Setup - Game Store

**ВАЖНО:** Для работы auth и других фич нужны environment variables

---

## 📋 Required Variables

### 1. NEXTAUTH_SECRET ⚠️ CRITICAL

**Что:** Secret key для JWT токенов

**Как генерировать:**

```bash
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Mac/Linux
openssl rand -base64 32
```

**Пример:**
```env
NEXTAUTH_SECRET="A3m8kL9pQ2rX5vY8nB1cD4fG7hJ0kL"
```

---

### 2. NEXTAUTH_URL

**Что:** URL вашего приложения

**Development:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**Production:**
```env
NEXTAUTH_URL="https://yourdomain.com"
```

---

### 3. DATABASE_URL

**Development (SQLite):**
```env
DATABASE_URL="file:./dev.db"
```

**Production (PostgreSQL example):**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

---

## 📝 Создание .env.local

### Шаг 1: Создать файл

```powershell
# В корне проекта
cd C:\Users\-\Desktop\game-store
New-Item -Path ".env.local" -ItemType File
```

### Шаг 2: Добавить variables

Откройте `.env.local` и добавьте:

```env
# Обязательно
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="YOUR-GENERATED-SECRET-HERE"
NEXTAUTH_URL="http://localhost:3000"

# Опционально - Analytics
# NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
# NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Опционально - Payment
# STRIPE_SECRET_KEY="sk_test_..."
# STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Опционально - Email
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASSWORD="your-app-password"
```

### Шаг 3: Проверить

```powershell
# Файл должен быть в .gitignore
cat .gitignore | Select-String ".env"
```

---

## 🚨 Исправление JWT Error

Если видите ошибку:
```
[auth][error] JWTSessionError: no matching decryption secret
```

**Fix:**

1. Остановить сервер (Ctrl+C)
2. Генерировать новый secret (см. выше)
3. Обновить `.env.local`
4. Удалить cookies в браузере (F12 → Application → Clear cookies)
5. Перезапустить: `npm run dev`

---

## 🔒 Security Checklist

- [ ] `.env.local` создан
- [ ] `NEXTAUTH_SECRET` сгенерирован (не копировать из примера!)
- [ ] `.env.local` в `.gitignore`
- [ ] Никогда не коммитить secrets в git
- [ ] Production secrets отличаются от dev

---

## 📦 Deployment

### Vercel

1. Settings → Environment Variables
2. Добавить все переменные
3. Разные values для Production/Preview/Development

### Netlify

1. Site settings → Environment variables
2. Add variable for each

### VPS/Docker

1. Создать `.env` на сервере
2. Использовать docker-compose env_file
3. Или export в bash profile

---

## ✅ Проверка

```powershell
# Start server
npm run dev

# Должно работать без JWT errors
# Open http://localhost:3000
# Check browser console (F12)
# No auth errors = success!
```

---

**ГОТОВО! Environment variables настроены! ✅**
