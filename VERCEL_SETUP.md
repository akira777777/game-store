# Настройка переменных окружения в Vercel

## Критически важно перед деплоем

### Шаг 1: Создайте PostgreSQL базу данных

1. Войдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в ваш проект `game-store`
3. Откройте вкладку **Storage**
4. Нажмите **Create Database** → выберите **Postgres**
5. После создания скопируйте строку подключения `DATABASE_URL`

### Шаг 2: Добавьте переменные окружения

1. В Vercel Dashboard проекта перейдите в **Settings** → **Environment Variables**
2. Добавьте следующие переменные (для всех окружений: Production, Preview, Development):

```
DATABASE_URL=postgresql://... (строка подключения от Vercel Postgres)
NEXTAUTH_SECRET=... (сгенерируйте: openssl rand -base64 32)
NEXTAUTH_URL=https://your-project.vercel.app (замените на ваш URL)
```

### Шаг 3: Примените миграции после деплоя

После успешного деплоя выполните:

```bash
npx vercel env pull .env.production
npm run db:migrate:deploy
```

Или через Vercel Postgres Dashboard используйте SQL Editor для создания таблиц вручную.

### Шаг 4: Перезапустите деплой

После добавления переменных окружения:

1. Перейдите в **Deployments**
2. Нажмите **Redeploy** на последнем деплое
3. Или сделайте новый коммит и push

## Формат DATABASE_URL

Должен начинаться с `postgresql://` или `postgres://`:

```
postgresql://user:password@host:port/database?schema=public
```

Пример от Vercel Postgres:

```
postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb
```
