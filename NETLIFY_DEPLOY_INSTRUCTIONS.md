# Инструкции по развертыванию на Netlify

## Подготовка проекта

✅ Проект подготовлен к деплою на Netlify:

1. **Создан файл `netlify.toml`** с настройками редиректов и заголовков безопасности
2. **Создан `.env.production`** с шаблоном переменных окружения для продакшена
3. **Успешно создан продакшен-билд** командой `npm run build`

## Шаги для развертывания на Netlify

### 1. Загрузите проект в репозиторий Git

Если проект еще не в репозитории:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/game-store.git
git push -u origin main
```

### 2. Создайте новый сайт на Netlify

1. Перейдите на [Netlify](https://app.netlify.com/)
2. Нажмите "Add new site" → "Import an existing project"
3. Выберите ваш Git провайдер и репозиторий

### 3. Настройте переменные окружения

Перейдите в **Site settings → Build & deploy → Environment → Environment variables** и добавьте следующие переменные:

**Обязательные переменные:**
- `NEXTAUTH_SECRET` - Используйте сгенерированный секрет: `b5Jj2BL9yXoyPYA4MFegjOJkPVHyh8fEKBiaXhXzZMg=`
- `DATABASE_URL` - URL базы данных PostgreSQL (рекомендуется для продакшена)
- `NEXTAUTH_URL` - URL вашего сайта (например, `https://your-site.netlify.app`)

**Для Stripe (если нужно):**
- `STRIPE_SECRET_KEY` - Секретный ключ Stripe
- `STRIPE_PUBLISHABLE_KEY` - Публичный ключ Stripe
- `STRIPE_WEBHOOK_SECRET` - Секрет для вебхуков Stripe

### 4. Настройте базу данных PostgreSQL

**Рекомендуемые сервисы:**
- [Neon](https://neon.tech/) (бесплатный tier)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)

Пример DATABASE_URL:
```
postgresql://user:password@host:port/database?schema=public
```

### 5. Настройте параметры сборки

В настройках Netlify:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 18 или выше

### 6. Разверните сайт

После настройки всех параметров, Netlify автоматически запустит процесс деплоя. Вы можете следить за процессом в разделе "Deploys".

## Важные замечания

1. **Для продакшена используйте PostgreSQL** вместо SQLite
2. **Настройте Stripe вебхуки** для обработки платежей
3. **Создайте первого администратора** через Prisma Studio после деплоя
4. **Настройте домен** и SSL в настройках Netlify

## Решение известных проблем

**Проблема:** Ошибка сборки из-за отсутствия NEXTAUTH_SECRET
**Решение:** Убедитесь, что переменная `NEXTAUTH_SECRET` добавлена в настройки Netlify

**Проблема:** Ошибка Prisma с SQLite URL
**Решение:** Используйте PostgreSQL для продакшена

**Проблема:** Несовместимость bcryptjs с Edge Runtime
**Решение:** Код уже оптимизирован для динамического импорта bcryptjs

## После деплоя

1. Настройте Stripe вебхуки с URL: `https://your-site.netlify.app/api/webhooks/stripe`
2. Создайте первого администратора через Prisma Studio
3. Протестируйте все функции: регистрацию, авторизацию, корзину, оформление заказа