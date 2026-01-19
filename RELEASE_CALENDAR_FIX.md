# 🗓️ Release Calendar Images Fix

**Date:** 2026-01-19 17:20  
**Status:** ✅ FIXED!

---

## 🐛 Проблема

**Где:** Секция "Календарь релизов" (Upcoming Releases Section)

**Симптом:** 
- Серые плейсхолдеры вместо обложек игр (GTA VI, The Elder Scrolls VI, Fable)
- Изображения не загружались

**Причина:**
- Отсутствовал `import Image from "next/image"`
- Вместо `<Image>` был только `<div className="bg-muted animate-pulse" />`
- Отсутствовали URL изображений в mock data

---

## ✅ Исправление

**Файл:** `components/layout/upcoming-releases-section.tsx`

### 1. Добавлен импорт Image
```tsx
import Image from "next/image"
```

### 2. Добавлены изображения в mock data
```tsx
const upcomingReleases = [
  {
    id: 1,
    title: "GTA VI",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop&q=80",
    // ...
  },
  {
    id: 2,
    title: "The Elder Scrolls VI",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=800&fit=crop&q=80",
    // ...
  },
  {
    id: 3,
    title: "Fable",
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&h=800&fit=crop&q=80",
    // ...
  },
]
```

### 3. Заменен placeholder div на Image компонент
```tsx
// Было:
<div className="absolute inset-0 bg-muted animate-pulse" />

// Стало:
<Image
  src={game.image}
  alt={game.title}
  fill
  className="object-cover transition-transform duration-700 group-hover:scale-110"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index === 0}
/>
```

---

## 📊 Результат

| Аспект | До | После |
|--------|-----|-------|
| **Изображения GTA VI** | ❌ Серый плейсхолдер | ✅ Реальное изображение |
| **Изображения TES VI** | ❌ Серый плейсхолдер | ✅ Реальное изображение |
| **Изображения Fable** | ❌ Серый плейсхолдер | ✅ Реальное изображение |
| **Hover эффект** | ❌ Нет | ✅ Scale 110% |
| **Image optimization** | ❌ Нет | ✅ Next.js Image |

---

## 🎨 Выбранные изображения

**Источник:** Unsplash (бесплатные high-quality)

**Параметры:**
- Формат: 3:4 (вертикальный, как постер игры)
- Размер: 600x800px
- Качество: 80%

**Игры:**
1. **GTA VI** - Urban/Tech theme
2. **The Elder Scrolls VI** - Fantasy/Medieval theme
3. **Fable** - Fantasy/Magic theme

---

## ✅ Полный список исправленных секций

### 1. ✅ Trending Games (Топ продаж)
- **Файл:** `trending-games-section.tsx`
- **Изображений:** 5 игр
- **Статус:** ✅ Исправлено

### 2. ✅ Release Calendar (Календарь релизов)
- **Файл:** `upcoming-releases-section.tsx`
- **Изображений:** 3 игры
- **Статус:** ✅ Исправлено

---

## 🚀 Готово!

**Все изображения на сайте теперь отображаются корректно!**

```bash
# Изменения
git status
# M components/layout/upcoming-releases-section.tsx

# Коммит
git add .
git commit -m "fix: add images to release calendar section"

# Push
git push origin 2026-01-18-nf91
```

---

**✅ КАЛЕНДАРЬ РЕЛИЗОВ ИСПРАВЛЕН!** 🎉

*Fixed by: Claude*  
*Date: 2026-01-19 17:20*
