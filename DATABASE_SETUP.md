# Настройка DATABASE_URL

## Проблема

В файле `.env` указаны плейсхолдеры вместо реального connection string:

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

Это нужно заменить на реальный connection string из вашей базы данных.

## Решение

### Вариант 1: Neon PostgreSQL

1. Откройте [Neon Console](https://console.neon.tech/)
2. Войдите в свой аккаунт
3. Выберите проект
4. Перейдите в раздел **Connection Details**
5. Скопируйте **Connection string** (он будет выглядеть примерно так):

   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

6. Откройте файл `.env` в редакторе
7. Замените строку `DATABASE_URL` на скопированный connection string:

   ```env
   DATABASE_URL="postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### Вариант 2: Supabase PostgreSQL

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите проект
3. Перейдите в **Settings** → **Database**
4. Найдите раздел **Connection string**
5. Выберите **URI** формат
6. Скопируйте connection string
7. Вставьте его в `.env` файл

### Вариант 3: Другая PostgreSQL база данных

Формат connection string:

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

Где:

- `USERNAME` - имя пользователя базы данных
- `PASSWORD` - пароль (если содержит специальные символы, их нужно URL-кодировать)
- `HOST` - хост базы данных (например, `localhost` или `db.example.com`)
- `PORT` - порт (обычно `5432` для PostgreSQL)
- `DATABASE` - имя базы данных

## Важные замечания

### URL-кодирование паролей

Если пароль содержит специальные символы, их нужно закодировать:

| Символ | Код |
|--------|-----|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |

**Пример:**
Если пароль `p@ss#word`, то в URL должно быть `p%40ss%23word`

### Проверка формата

После обновления `.env` файла, проверьте формат:

```powershell
.\scripts\check-db-url.ps1
```

Или используйте расширенную проверку:

```powershell
.\scripts\fix-db-url.ps1
```

### Применение миграций

После правильной настройки DATABASE_URL выполните миграции:

```powershell
npx prisma migrate dev --name add_performance_indexes
```

Или для продакшена:

```powershell
npx prisma migrate deploy
```

## Быстрая проверка

1. Откройте `.env` файл
2. Убедитесь, что `DATABASE_URL` начинается с `postgresql://` или `postgres://`
3. Убедитесь, что нет плейсхолдеров типа `USERNAME`, `PASSWORD`, `HOST`, `PORT`, `DATABASE`
4. Убедитесь, что порт указан числом (например, `5432`)
5. Убедитесь, что есть параметр `?sslmode=require` (для Neon обязательно)

## Примеры правильных форматов

### Neon

```
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Supabase

```
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require"
```

### Локальный PostgreSQL

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/gamestore?sslmode=prefer"
```
