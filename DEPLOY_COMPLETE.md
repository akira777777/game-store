# Деплой завершен! ✅

## Ссылка на приложение

**<https://game-store-snowy-rho.vercel.app>**

## Следующие шаги

### 1. Добавьте переменные окружения в Vercel Dashboard

Откройте: **Settings** → **Environment Variables** в вашем проекте Vercel

Добавьте эти переменные (для всех окружений: Production, Preview, Development):

```
DATABASE_URL = <ваша строка подключения из Vercel Postgres>
NEXTAUTH_SECRET = xjHXwlsOOBf9hxBpiaZ3pPXsscP7U27ok0w+aGFIcL8=
NEXTAUTH_URL = https://game-store-snowy-rho.vercel.app
```

### 2. После добавления переменных - перезапустите деплой

В Vercel Dashboard:

- Перейдите в **Deployments**
- Найдите последний деплой
- Нажмите **...** (три точки) → **Redeploy**

### 3. Примените миграции базы данных

После успешного деплоя с правильными переменными окружения:

```bash
npx vercel env pull .env.production
npm run db:migrate:deploy
```

Или через Vercel CLI напрямую:

```bash
# Убедитесь, что в .env.production есть правильный DATABASE_URL
# Затем запустите:
npm run db:migrate:deploy
```

### 4. Проверьте приложение

Откройте: **<https://game-store-snowy-rho.vercel.app>**

## Примечания

- ⚠️ Если DATABASE_URL не настроен, приложение будет показывать ошибки подключения к БД
- ⚠️ После добавления переменных окружения обязательно перезапустите деплой (Redeploy)
- ✅ Все страницы настроены как динамические (`export const dynamic = 'force-dynamic'`)
- ✅ Prisma схема настроена на PostgreSQL для продакшена

## Структура миграций

После успешного применения миграций в базе данных будут созданы таблицы:

- `User` - пользователи
- `Game` - игры
- `CartItem` - корзина
- `Order` - заказы
- `OrderItem` - элементы заказов

## Создание первого администратора

После применения миграций вы можете создать администратора:

1. Зарегистрируйтесь через `/register`
2. Используйте Prisma Studio или SQL Editor в Vercel Postgres
3. Измените роль пользователя на `ADMIN` в таблице `User`
