# 🔧 Vercel Build Error Fix

**Error:** `Command "npm run build" exited with 1`

---

## ✅ Что было исправлено

### 1. Добавлен `.node-version`

Указывает Vercel использовать Node.js 20:

```
20
```

### 2. Обновлен `package.json`

Добавлен `engines` для указания минимальной версии Node:

```json
"engines": {
  "node": ">=18.0.0"
}
```

---

## 🚀 Как исправить build error на Vercel

### Вариант 1: Redeploy после push (рекомендуется)

```bash
# 1. Push изменения
git push origin 2026-01-18-nf91

# 2. Vercel автоматически пересоберет с правильной версией Node
```

### Вариант 2: Добавить Environment Variables

Если ошибка из-за отсутствующих переменных:

1. Открыть Vercel Dashboard
2. Project Settings → Environment Variables
3. Добавить **обязательные** переменные:

```env
NEXTAUTH_SECRET=<сгенерировать: openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.vercel.app
```

**Генерация NEXTAUTH_SECRET:**

```powershell
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

1. Нажать **Redeploy** в Vercel

### Вариант 3: Очистить Build Cache

Если проблема в кеше:

1. Vercel Dashboard → Deployments
2. Найти последний deployment
3. ... → Clear Build Cache
4. Redeploy

---

## 📊 Проверка после исправления

После успешного деплоя проверить:

```bash
# 1. Build logs должны показать:
✓ Compiled successfully
✓ Generating static pages
✓ Finalizing page optimization

# 2. Deployment status:
✅ Ready

# 3. URL работает:
https://your-app.vercel.app
```

---

## 🔍 Типичные причины ошибки build на Vercel

| Причина | Решение |
|---------|---------|
| **Missing NEXTAUTH_SECRET** | Добавить в Environment Variables |
| **Node.js version mismatch** | Добавить `.node-version` (✅ сделано) |
| **TypeScript errors** | Исправить локально: `npm run build` |
| **Out of memory** | Upgrade Vercel plan или оптимизировать код |
| **Prisma не генерируется** | Убедиться `postinstall` в `package.json` |

---

## 💡 Если ошибка остается

### 1. Проверить полные логи

1. Vercel Dashboard → Deployments
2. Кликнуть на Failed deployment
3. Открыть **Build Logs**
4. Найти точную ошибку (обычно в красном цвете)

### 2. Типичные ошибки в логах

**Ошибка:** `Error: [@next/auth]: NEXTAUTH_SECRET must be provided`

**Решение:** Добавить `NEXTAUTH_SECRET` в Environment Variables

---

**Ошибка:** `Error: Can't resolve 'fs'`

**Решение:** Проблема с server/client components. Убедиться что:

- Server components помечены `async`
- Client components помечены `"use client"`

---

**Ошибка:** `Module not found: Can't resolve '...'`

**Решение:**

```bash
npm install <missing-package>
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push
```

---

## ✅ ИТОГ

**Исправлено:**

- ✅ Добавлен `.node-version` = 20
- ✅ Добавлен `engines` в `package.json`
- ✅ Build локально работает

**Следующие шаги:**

```bash
git push origin 2026-01-18-nf91
```

Vercel автоматически пересоберет с правильными настройками.

---

**Если проблема остается:**

1. Проверить Environment Variables
2. Посмотреть полные Build Logs
3. Очистить Build Cache
4. Сделать Redeploy

---

*Created: 2026-01-19*
*Status: Ready to push ✅*
