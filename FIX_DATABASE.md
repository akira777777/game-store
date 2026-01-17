# Исправление ошибки подключения к базе данных

## Проблема

`DATABASE_URL` в Vercel содержит placeholder вместо реальной строки подключения к PostgreSQL.

## Решение

### Шаг 1: Получите правильный DATABASE_URL

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в ваш проект `game-store`
3. Откройте вкладку **Storage**
4. Найдите вашу Postgres базу данных
5. Откройте базу данных
6. Перейдите на вкладку **.env.local** или **Variables**
7. Найдите переменную `POSTGRES_PRISMA_URL` или `POSTGRES_URL_NON_POOLING`
8. **Скопируйте** это значение (без кавычек)

Пример реальной строки:

```
postgres://default:abc123xyz@ep-cool-name-123456.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true
```

### Шаг 2: Обновите DATABASE_URL в Vercel Environment Variables

1. В проекте Vercel перейдите: **Settings** → **Environment Variables**
2. Найдите переменную `DATABASE_URL`
3. Нажмите **Edit** (карандаш)
4. **Удалите** старое значение и **вставьте** реальную строку из шага 1
5. Убедитесь, что отмечены все окружения: **Production**, **Preview**, **Development**
6. Нажмите **Save**

### Шаг 3: Перезапустите деплой

1. Перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите **...** (три точки) → **Redeploy**
4. Дождитесь завершения деплоя

### Шаг 4: Примените миграции базы данных

После успешного деплоя с правильным `DATABASE_URL`:

**Вариант A: Через Vercel Postgres SQL Editor (проще)**

1. В Vercel Dashboard → **Storage** → ваша Postgres база
2. Откройте **SQL Editor**
3. Выполните SQL из миграций (если они есть)

**Вариант B: Через CLI (если миграции созданы)**

```bash
npx vercel env pull .env.production
npm run db:migrate:deploy
```

**Вариант C: Использовать `prisma db push` (быстро, без миграций)**

Если миграций нет, можно синхронизировать схему напрямую:

```bash
# Убедитесь, что DATABASE_URL в .env.production правильный
npx vercel env pull .env.production
npx prisma db push --accept-data-loss
```

⚠️ **Важно**: `db push` не создает историю миграций, но работает для быстрого деплоя.

## Проверка

После применения миграций/схемы:

- Откройте ваше приложение: `https://game-store-snowy-rho.vercel.app`
- Ошибка должна исчезнуть
- Страницы должны загружаться нормально
