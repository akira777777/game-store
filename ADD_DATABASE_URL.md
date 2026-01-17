# Добавление DATABASE_URL в Vercel

## Проблема
`DATABASE_URL` отсутствует в Environment Variables, но нужен для работы приложения.

## Решение через Dashboard (1 минута):

### Вариант 1: Скопировать из POSTGRES_PRISMA_URL_DATABASE_URL

1. В Vercel Dashboard → **Settings** → **Environment Variables**
2. Найдите переменную **`POSTGRES_PRISMA_URL_DATABASE_URL`**
3. Нажмите на неё, чтобы увидеть значение (или нажмите "Show")
4. Скопируйте значение
5. Нажмите **"Add New"** (или "Add")
6. Введите:
   - **Name**: `DATABASE_URL`
   - **Value**: вставьте скопированное значение
   - **Environments**: отметьте все три (Production, Preview, Development)
7. Нажмите **Save**

### Вариант 2: Взять из Storage → Postgres

1. Vercel Dashboard → **Storage** → ваша Postgres база
2. Вкладка **.env.local** или **Variables**
3. Найдите `POSTGRES_PRISMA_URL` или `POSTGRES_URL_NON_POOLING`
4. Скопируйте значение
5. Settings → Environment Variables → Add New
6. Добавьте как `DATABASE_URL`

## После добавления:

1. **Deployments** → последний деплой → **Redeploy**
2. Подождите завершения деплоя
3. Проверьте приложение: `https://game-store-snowy-rho.vercel.app`

---

## Через CLI (если нужно):

Значение для DATABASE_URL (найдено в проекте):
```
postgres://cc1877edde5df4a41d40648da3a325534533d73f539081e69aeac4d79cb0a27a:sk_mNxGLlo7QhjOuktEjD6pL@db.prisma.io:5432/postgres?sslmode=require
```

Скопируйте эту строку и добавьте через Dashboard (быстрее и надежнее).
