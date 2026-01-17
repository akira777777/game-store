# Инструкция по развертыванию на Vercel

Это руководство поможет вам развернуть проект Game Store на Vercel и получить публичную ссылку для демонстрации.

## Шаг 1: Подготовка проекта

Убедитесь, что проект готов к развертыванию:
- ✅ Все зависимости установлены (`npm install`)
- ✅ Проект собирается без ошибок (`npm run build`)
- ✅ Все изменения закоммичены в Git

## Шаг 2: Регистрация на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Зарегистрируйтесь через GitHub, GitLab или email
3. Войдите в аккаунт

## Шаг 3: Создание базы данных PostgreSQL

**Важно:** В текущей конфигурации используется SQLite, который не подходит для продакшена. Нужно переключиться на PostgreSQL.

### Вариант A: Vercel Postgres (Рекомендуется - бесплатно)

1. В панели Vercel перейдите в **Storage**
2. Создайте новую базу данных **Postgres**
3. После создания скопируйте строку подключения (`DATABASE_URL`)

### Вариант B: Другие сервисы БД

- **Neon** (бесплатно): [neon.tech](https://neon.tech)
- **Supabase** (бесплатно): [supabase.com](https://supabase.com)
- **Railway** (бесплатно): [railway.app](https://railway.app)

## Шаг 4: Обновление схемы Prisma для PostgreSQL

Если сейчас используется SQLite, нужно обновить схему:

1. Откройте `prisma/schema.prisma`
2. Измените провайдер базы данных:

```prisma
datasource db {
  provider = "postgresql"  // Было: "sqlite"
  url      = env("DATABASE_URL")
}
```

3. Создайте и примените миграцию:
```bash
npm run db:migrate
```

## Шаг 5: Развертывание на Vercel

### Способ 1: Через веб-интерфейс (Рекомендуется для первого раза)

1. На странице Vercel нажмите **Add New...** → **Project**
2. Подключите ваш Git репозиторий (GitHub/GitLab/Bitbucket)
3. Выберите репозиторий с проектом `game-store`
4. Vercel автоматически определит Next.js проект
5. Нажмите **Deploy**

### Способ 2: Через CLI (Для опытных пользователей)

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Войдите в аккаунт:
```bash
vercel login
```

3. Разверните проект:
```bash
cd game-store
vercel
```

Следуйте инструкциям в терминале.

## Шаг 6: Настройка переменных окружения

После развертывания нужно настроить переменные окружения:

1. В панели Vercel перейдите в ваш проект
2. Откройте **Settings** → **Environment Variables**
3. Добавьте следующие переменные:

```
DATABASE_URL="postgresql://..." (из шага 3)
NEXTAUTH_SECRET="your-secret-here" (сгенерируйте: openssl rand -base64 32)
NEXTAUTH_URL="https://your-project.vercel.app" (ваш URL после деплоя)
STRIPE_SECRET_KEY="sk_test_..." (если используете Stripe)
STRIPE_PUBLISHABLE_KEY="pk_test_..." (если используете Stripe)
STRIPE_WEBHOOK_SECRET="whsec_..." (если используете Stripe)
```

4. После добавления переменных перейдите в **Deployments** и нажмите **Redeploy** на последнем деплое

## Шаг 7: Применение миграций базы данных

После развертывания нужно применить миграции к продакшен базе данных:

### Вариант 1: Через Vercel CLI

```bash
vercel env pull .env.production
npx prisma migrate deploy
```

### Вариант 2: Через Prisma Studio (локально)

Установите DATABASE_URL в `.env` и запустите:
```bash
npx prisma migrate deploy
```

### Вариант 3: Через Vercel Postgres Dashboard

В Vercel Postgres есть SQL Editor для выполнения миграций вручную.

## Шаг 8: Заполнение базы данных (опционально)

Если у вас есть скрипт для заполнения данными:

```bash
npm run db:seed
```

Убедитесь, что `DATABASE_URL` указывает на продакшен базу данных.

## Шаг 9: Проверка работы

1. Откройте ваш сайт по адресу: `https://your-project.vercel.app`
2. Проверьте основные функции:
   - Главная страница загружается
   - Можно зарегистрироваться/войти
   - Каталог игр отображается
   - Корзина работает

## Шаг 10: Настройка кастомного домена (опционально)

1. В настройках проекта перейдите в **Domains**
2. Добавьте свой домен или используйте домен Vercel (например: `your-project.vercel.app`)

## Получение публичной ссылки

После успешного развертывания ваша публичная ссылка будет:
```
https://your-project.vercel.app
```

Или если вы настроили кастомный домен:
```
https://your-custom-domain.com
```

## Обновление проекта

После каждого push в Git репозиторий Vercel автоматически развернет новую версию.

Или вручную через CLI:
```bash
vercel --prod
```

## Решение проблем

### Ошибка при сборке

Проверьте логи в Vercel Dashboard → Deployments → выберите деплой → View Function Logs

### База данных не подключается

- Убедитесь, что `DATABASE_URL` правильный
- Проверьте, что миграции применены
- Убедитесь, что БД доступна из интернета (для Vercel Postgres это настроено автоматически)

### Ошибка аутентификации

- Проверьте `NEXTAUTH_SECRET` - он должен быть одинаковым во всех окружениях
- Убедитесь, что `NEXTAUTH_URL` правильный (https://your-project.vercel.app)

### Ошибка с Stripe

- Проверьте, что все Stripe ключи правильные
- Настройте webhook в Stripe Dashboard с URL: `https://your-project.vercel.app/api/webhooks/stripe`

## Дополнительные ресурсы

- [Документация Vercel](https://vercel.com/docs)
- [Документация Next.js](https://nextjs.org/docs)
- [Документация Prisma](https://www.prisma.io/docs)
- [Документация Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

## Быстрый старт (TL;DR)

```bash
# 1. Подготовка
cd game-store
npm install
npm run build  # Проверка сборки

# 2. Обновите prisma/schema.prisma на postgresql

# 3. Развертывание
vercel login
vercel

# 4. Настройте переменные окружения в Vercel Dashboard

# 5. Примените миграции
vercel env pull .env.production
npx prisma migrate deploy

# Готово! Ваша ссылка: https://your-project.vercel.app
```
