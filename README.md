# Game Store - Интернет-магазин видеоигр

Современный полнофункциональный интернет-магазин видеоигр, построенный на Next.js 14+, TypeScript, Prisma и Stripe.

## Технологический стек

- **Frontend/Backend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Стилизация**: Tailwind CSS, shadcn/ui
- **База данных**: SQLite (через Prisma ORM, можно переключить на PostgreSQL)
- **Аутентификация**: NextAuth.js v5
- **Платежи**: Stripe
- **Управление состоянием**: Zustand (для клиентского состояния)
- **Валидация**: React Hook Form + Zod

## Функциональность

- ✅ Каталог игр с фильтрацией и поиском
- ✅ Детальные страницы игр
- ✅ Система корзины покупок
- ✅ Оформление заказа через Stripe
- ✅ Регистрация и авторизация пользователей
- ✅ Админ-панель для управления играми
- ✅ Управление заказами
- ✅ Адаптивный дизайн

## Быстрый старт

### Предварительные требования

- Node.js 18+ и npm/yarn
- Аккаунт Stripe (для обработки платежей)

### Установка

1. Клонируйте репозиторий или перейдите в папку проекта:
```bash
cd game-store
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Заполните переменные окружения в `.env`:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Примечание**: По умолчанию используется SQLite. Для продакшена рекомендуется PostgreSQL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/gamestore?schema=public"
```

Для генерации `NEXTAUTH_SECRET` выполните:
```bash
openssl rand -base64 32
```

5. Создайте и примените миграции базы данных:
```bash
npm run db:migrate
```

6. Сгенерируйте Prisma клиент:
```bash
npm run db:generate
```

7. Запустите сервер разработки:
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Настройка Stripe

1. Зарегистрируйтесь на [Stripe](https://stripe.com)
2. Получите тестовые ключи API из панели управления Stripe
3. Добавьте ключи в файл `.env`
4. Настройте webhook для обработки событий оплаты:
   - URL: `http://localhost:3000/api/webhooks/stripe`
   - События: `checkout.session.completed`
   - Скопируйте секрет webhook в `STRIPE_WEBHOOK_SECRET`

## Создание первого администратора

Для создания администратора выполните скрипт или используйте Prisma Studio:

```bash
npm run db:studio
```

В Prisma Studio найдите таблицу `User` и измените роль пользователя на `ADMIN`.

## Структура проекта

```
game-store/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Маршруты авторизации
│   ├── (store)/           # Основной магазин
│   ├── (admin)/           # Админ-панель
│   └── api/               # API маршруты
├── components/            # React компоненты
│   ├── ui/                # shadcn/ui компоненты
│   ├── game/              # Компоненты игр
│   ├── cart/              # Компоненты корзины
│   └── layout/            # Layout компоненты
├── lib/                   # Утилиты и конфигурация
├── prisma/                # Prisma схемы
└── types/                 # TypeScript типы
```

## Доступные команды

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка для продакшена
- `npm run start` - Запуск продакшен сервера
- `npm run lint` - Проверка кода линтером
- `npm run db:generate` - Генерация Prisma клиента
- `npm run db:push` - Применение изменений схемы к БД
- `npm run db:migrate` - Создание и применение миграций
- `npm run db:studio` - Запуск Prisma Studio

## Лицензия

MIT
