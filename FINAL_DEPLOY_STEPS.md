# Финальные шаги деплоя ✅

## ✅ Что уже сделано

1. ✅ Схема базы данных применена (`prisma db push`)
2. ✅ Все таблицы созданы в PostgreSQL
3. ✅ Деплой запущен

## ⚠️ Что нужно сделать вручную (2 минуты)

### Обновить DATABASE_URL в Vercel Dashboard

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Проект `game-store` → **Settings** → **Environment Variables**
3. Найдите `DATABASE_URL`
4. Нажмите **Edit** (карандаш)
5. Удалите старое значение: `postgresql://user:password@localhost:5432/gamestore?schema=public`
6. Найдите в том же списке переменную `POSTGRES_PRISMA_URL_DATABASE_URL`
7. Скопируйте её значение
8. Вставьте скопированное значение в `DATABASE_URL`
9. Сохраните для всех окружений: Production, Preview, Development
10. Нажмите **Save**

### Перезапустите деплой

1. **Deployments** → последний деплой
2. **...** (три точки) → **Redeploy**

## После этого

Приложение должно заработать на: `https://game-store-snowy-rho.vercel.app`

---

## Альтернатива: Обновить через CLI (если поддерживается)

```powershell
$realDbUrl = "значение_из_POSTGRES_PRISMA_URL_DATABASE_URL"
echo $realDbUrl | npx vercel env add DATABASE_URL production
echo $realDbUrl | npx vercel env add DATABASE_URL preview
echo $realDbUrl | npx vercel env add DATABASE_URL development
```

Но проще через Dashboard - копируете значение одной переменной и вставляете в другую.
