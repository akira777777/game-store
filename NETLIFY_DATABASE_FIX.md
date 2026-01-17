# Исправление ошибок подключения к базе данных на Netlify

## Основная проблема

Анализ лог-файла показывает две критические ошибки:

1. **Ошибка Server Components render** - происходит при попытке рендеринга страниц на стороне сервера
2. **Ошибки подключения** - `Failed to load resource: net::ERR_CONNECTION_REFUSED` для `127.0.0.1:7243`

## Причина ошибок

Основная проблема в файле `.env.production`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gamestore?schema=public"
```

Этот URL пытается подключиться к базе данных на `localhost`, что **не работает на Netlify**, так как:

- Netlify - это облачный хостинг, у него нет доступа к вашему локальному компьютеру
- База данных должна быть доступна через интернет
- Нужно использовать внешний сервис баз данных (Neon, Supabase, Railway, etc.)

## Как исправить

### 1. Создайте базу данных PostgreSQL

Выберите один из бесплатных сервисов:

#### Option 1: Neon (рекомендуется)
1. Перейдите на [https://neon.tech/](https://neon.tech/)
2. Создайте аккаунт и новый проект
3. Создайте новую базу данных
4. Скопируйте URL подключения (он будет выглядеть так):
   ```
   postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/gamestore?sslmode=require
   ```

#### Option 2: Supabase
1. Перейдите на [https://supabase.com/](https://supabase.com/)
2. Создайте новый проект
3. Перейдите в Database → Connection settings
4. Скопируйте Connection string

#### Option 3: Railway
1. Перейдите на [https://railway.app/](https://railway.app/)
2. Создайте новый проект с PostgreSQL
3. Скопируйте connection URL

### 2. Обновите переменные окружения на Netlify

1. Перейдите в панель управления Netlify: [https://app.netlify.com/](https://app.netlify.com/)
2. Выберите ваш сайт `chic-cactus-2776a1`
3. Перейдите в **Site settings → Build & deploy → Environment → Environment variables**
4. Обновите переменные:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://user:password@your-db-host:port/gamestore?schema=public&sslmode=require` |
| `NEXTAUTH_URL` | `https://chic-cactus-2776a1.netlify.app` |
| `NEXTAUTH_SECRET` | `b5Jj2BL9yXoyPYA4MFegjOJkPVHyh8fEKBiaXhXzZMg=` |

**ВАЖНО:** Замените `user:password@your-db-host:port` на реальные данные из вашего PostgreSQL сервиса!

### 3. Настройте Stripe (если нужно)

Если вы используете Stripe для платежей, обновите переменные:

| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_...` (реальный ключ из Stripe) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (реальный ключ из Stripe) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (реальный секрет из Stripe) |

### 4. Перезапустите деплой

1. Перейдите в раздел **Deploys**
2. Нажмите **Trigger deploy**
3. Выберите **Clear cache and deploy site**
4. Дождитесь завершения сборки

## Дополнительные проверки

### Проверка подключения к базе данных

Убедитесь, что ваша база данных:
- Доступна из интернета (не только с localhost)
- Имеет правильные настройки безопасности (разрешены подключения с IP Netlify)
- Использует SSL (добавьте `?sslmode=require` в конец URL)

### Проверка логов

После деплоя проверьте логи на наличие ошибок:
1. Перейдите в **Deploys** → выберите последний деплой
2. Проверьте раздел **Deploy log**
3. Ищите ошибки, связанные с подключением к базе данных

## Пример правильного .env.production

```env
# Database - PostgreSQL from Neon
DATABASE_URL="postgresql://daniel:secret@ep-cool-name-123456.us-east-2.aws.neon.tech/gamestore?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="b5Jj2BL9yXoyPYA4MFegjOJkPVHyh8fEKBiaXhXzZMg="
NEXTAUTH_URL="https://chic-cactus-2776a1.netlify.app"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Netlify specific
NODE_VERSION=18
```

## Если проблема сохраняется

1. **Проверьте настройки безопасности базы данных** - убедитесь, что IP-адреса Netlify в белом списке
2. **Проверьте настройки CORS** - если используете API, убедитесь, что CORS правильно настроен
3. **Проверьте логи базы данных** - возможно, есть ошибки подключения или запросов
4. **Свяжитесь с поддержкой Netlify** - предоставьте им логи и описание проблемы

## Важно!

- **Никогда не используйте localhost в продакшен-окружении**
- **Всегда используйте SSL для подключения к базе данных**
- **Храните секретные ключи в переменных окружения, а не в коде**
- **Проверяйте логи после каждого деплоя**