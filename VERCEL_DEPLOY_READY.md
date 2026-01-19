# 🚀 Готов к деплою на Vercel

**Date:** 2026-01-19
**Status:** ✅ PRODUCTION READY

---

## ✅ Все исправления завершены

**Что исправлено сегодня:**

1. ✅ Language switching - плавное переключение RU/EN
2. ✅ Game images - 8 изображений (Trending + Release Calendar)
3. ✅ Countdown timer - динамический расчет дней
4. ✅ Prisma 7 schema - исправлена ошибка P1012
5. ✅ Payment methods - удалена блеклая секция
6. ✅ npm install - работает без ошибок

---

## 🚀 Инструкция по деплою на Vercel

### Шаг 1: Push to GitHub

```bash
cd "C:\Users\-\Desktop\game-store"
git push origin 2026-01-18-nf91
```

### Шаг 2: Открыть Vercel

Перейти на: **<https://vercel.com/new>**

### Шаг 3: Import Repository

1. Нажать **"Import Git Repository"**
2. Выбрать `game-store` из списка
3. Нажать **"Import"**

### Шаг 4: Configure Project

Vercel автоматически определит:

- ✅ Framework: **Next.js**
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`

**Ничего менять не нужно!** Нажать **"Deploy"**

### Шаг 5: Add Environment Variables

В процессе деплоя или после, добавить переменные окружения:

```env
# Database (рекомендую Neon.tech - бесплатный tier)
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# NextAuth (сгенерировать новый секрет!)
NEXTAUTH_SECRET=<your-secret-here>
NEXTAUTH_URL=https://your-app.vercel.app

# Stripe (взять из stripe.com/dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🔑 Как получить переменные окружения

### 1. Database (Neon.tech) - 2 минуты

1. Открыть: <https://neon.tech>
2. Sign Up (бесплатно)
3. Create New Project
4. Copy **Connection String**
5. Добавить `?sslmode=require` в конец
6. Вставить в `DATABASE_URL`

**Пример:**

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 2. NEXTAUTH_SECRET - 10 секунд

**Windows PowerShell:**

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Копировать результат и вставить в `NEXTAUTH_SECRET`**

### 3. NEXTAUTH_URL

После деплоя Vercel покажет URL вашего приложения:

```
https://game-store-xxx.vercel.app
```

Вставить этот URL в `NEXTAUTH_URL`

### 4. Stripe Keys - 3 минуты

1. Открыть: <https://stripe.com/dashboard>
2. Developers → API Keys
3. Copy:
   - **Publishable key** → `STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

4. Webhooks → Add endpoint:
   - URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Event: `checkout.session.completed`
   - Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 📋 Checklist перед деплоем

- [x] ✅ Все изменения закоммичены
- [x] ✅ npm install работает
- [x] ✅ TypeScript без ошибок
- [x] ✅ Language switching работает
- [x] ✅ Изображения загружаются
- [x] ✅ Countdown timer динамический
- [ ] ⏳ Push to GitHub
- [ ] ⏳ Import на Vercel
- [ ] ⏳ Добавить env variables
- [ ] ⏳ Deploy!

---

## 🎯 Что произойдет после деплоя

1. **Vercel начнет сборку** (2-3 минуты)
2. **Создаст production build**
3. **Задеплоит на CDN**
4. **Покажет URL:** `https://game-store-xxx.vercel.app`

### Автоматически настроятся

- ✅ SSL сертификат (HTTPS)
- ✅ CDN для статики
- ✅ Image optimization
- ✅ Edge Functions
- ✅ Automatic rebuilds при push

---

## 🧪 Что проверить после деплоя

### 1. Homepage (2 минуты)

- [ ] Открыть <https://your-app.vercel.app>
- [ ] Проверить Hero section загружается
- [ ] Проверить Trending Games - 5 изображений
- [ ] Проверить Release Calendar - 3 изображения
- [ ] Проверить Countdown timer показывает дни

### 2. Language Switching (1 минута)

- [ ] Кликнуть на иконку языка (🌐)
- [ ] Выбрать English
- [ ] Проверить URL: `/en`
- [ ] Проверить контент на английском
- [ ] Переключить обратно на Русский
- [ ] Проверить URL: `/ru`

### 3. Games Catalog (1 минута)

- [ ] Открыть `/games`
- [ ] Проверить список игр
- [ ] Проверить фильтры работают

### 4. Test Payment (опционально)

- [ ] Выбрать игру
- [ ] Добавить в корзину
- [ ] Перейти к оплате
- [ ] Использовать тестовую карту: `4242 4242 4242 4242`
- [ ] Проверить редирект после оплаты

---

## ⚠️ Важные моменты

### 1. Database

**ВАЖНО:** Не забыть создать Neon database и добавить `DATABASE_URL`!

Без database сайт будет работать, но:

- ❌ Нельзя создать/редактировать игры в admin
- ❌ Нельзя регистрировать пользователей
- ✅ Статические страницы будут работать

### 2. Stripe

**Для тестирования:** Можно использовать test keys (`sk_test_...`)

**Для production:** Обязательно заменить на live keys (`sk_live_...`)

### 3. Admin Panel

URL: `https://your-app.vercel.app/admin`

Нужно будет создать первого admin пользователя через database.

---

## 🔧 Troubleshooting

### Build fails на Vercel

**Возможные причины:**

1. `NEXTAUTH_SECRET` не добавлен → Добавить в Vercel env vars
2. TypeScript ошибки → Проверить локально `npm run build`
3. Missing dependencies → Проверить `package.json`

**Решение:**

- Открыть Vercel Dashboard → Deployment → View Logs
- Найти ошибку
- Исправить и сделать новый commit
- Vercel автоматически пересоберет

### Database connection error

**Ошибка:** `P1001: Can't reach database server`

**Решение:**

1. Проверить `DATABASE_URL` в Vercel env vars
2. Убедиться, что `?sslmode=require` есть в конце URL
3. Проверить, что Neon database активна (не в idle)

### Images не загружаются

**Ошибка:** 403 или 404 на изображения

**Решение:**

1. Проверить `next.config.mjs` - remotePatterns настроены
2. Проверить URL изображений в components
3. Проверить Network tab в DevTools

---

## 📊 Ожидаемые метрики после деплоя

| Метрика | Значение |
|---------|----------|
| **Build time** | 2-3 минуты |
| **Deploy time** | 30-60 секунд |
| **Cold start** | < 1 секунда |
| **Page load** | < 2 секунды |
| **Lighthouse Score** | > 90 |

---

## 🎉 После успешного деплоя

### 1. Поделиться ссылкой

```
https://your-app.vercel.app
```

### 2. Настроить custom domain (опционально)

- Vercel Dashboard → Settings → Domains
- Add domain
- Configure DNS

### 3. Включить Analytics (опционально)

- Vercel Dashboard → Analytics
- Enable Web Analytics
- Enable Speed Insights

### 4. Мониторинг

- Vercel Dashboard → Monitoring
- Проверять errors
- Проверять performance

---

## 📞 Полезные ссылки

- **Vercel Dashboard:** <https://vercel.com/dashboard>
- **Vercel Docs:** <https://vercel.com/docs>
- **Neon Console:** <https://console.neon.tech>
- **Stripe Dashboard:** <https://stripe.com/dashboard>
- **Next.js Docs:** <https://nextjs.org/docs>

---

## 🚀 ГОТОВ К ДЕПЛОЮ

**Команда:**

```bash
git push origin 2026-01-18-nf91
```

**Затем:** <https://vercel.com/new>

**Время до production:** ~5 минут

**Удачи!** 🎉

---

*Created by: Claude*
*Date: 2026-01-19*
*Ready for: Vercel Deployment ✅*
