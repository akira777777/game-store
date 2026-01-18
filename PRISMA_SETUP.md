# Настройка Prisma 7 и базы данных

## Проблема

В вашем `.env` файле указан SQLite URL (`file:./prisma/dev.db`), но схема Prisma настроена на PostgreSQL.

## Решение

### Вариант 1: Использовать PostgreSQL (рекомендуется для продакшена)

1. **Создайте PostgreSQL базу данных** на одном из сервисов:
   - [Neon](https://neon.tech/) (бесплатный tier)
   - [Supabase](https://supabase.com/) (бесплатный tier)
   - [Railway](https://railway.app/) (бесплатный tier)

2. **Обновите `.env` файл** с правильным PostgreSQL URL:

   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

   Пример для Neon:

   ```env
   DATABASE_URL="postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/gamestore?sslmode=require"
   ```

3. **Примените миграции**:

   ```bash
   npx prisma migrate deploy
   # или для разработки
   npx prisma db push
   ```

### Вариант 2: Использовать SQLite для локальной разработки

Если вы хотите использовать SQLite локально:

1. **Измените `prisma/schema.prisma`**:

   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Обновите `prisma.config.ts`** - уберите валидацию PostgreSQL

3. **Перегенерируйте клиент**:

   ```bash
   npx prisma generate
   ```

## Текущая конфигурация

- **Схема**: PostgreSQL (`prisma/schema.prisma`)
- **Конфигурация**: `prisma.config.ts` (Prisma 7)
- **Текущий DATABASE_URL**: SQLite (`file:./prisma/dev.db`)

## Следующие шаги

Выберите один из вариантов выше и обновите соответствующие файлы.
