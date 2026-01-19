# 🧪 Testing Guide - Game Store

**Пошаговое руководство по тестированию**

---

## 🎯 Что протестировать

### Созданные компоненты

1. ✅ **LiveStatsSection** - Живая статистика
2. ✅ **TestimonialsSection** - 6 отзывов
3. ✅ **PartnersSection** - 8 партнёров
4. ✅ **TrendingGamesSection** - Топ 5
5. ✅ **UpcomingReleasesSection** - Календарь
6. ✅ **NewsletterSection** - Форма подписки
7. ✅ **Enhanced Footer** - Расширенный футер

---

## 🚀 Шаг 1: Запуск dev server

```powershell
# Перейти в проект
cd C:\Users\-\Desktop\game-store

# Установить зависимости (если еще не установлены)
npm install

# Запустить dev server
npm run dev
```

**Ожидаемый результат:**

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

**Откройте:** <http://localhost:3000>

---

## 🔍 Шаг 2: Visual Testing

### Проверьте каждую секцию сверху вниз

#### 1. Hero Section ✅

- [ ] Заголовок отображается
- [ ] CTA кнопки кликабельны
- [ ] Background animations работают
- [ ] Stats (1000+, 50K+, 24/7) видны

#### 2. Live Stats Bar 🆕

- [ ] 4 счётчика отображаются
- [ ] Числа обновляются каждые 3 сек
- [ ] Hover эффекты работают
- [ ] Icons цветные

#### 3. Value Props ✅

- [ ] 3 карточки в ряд (desktop)
- [ ] Stacked на mobile
- [ ] Icons видимы

#### 4. Categories ✅

- [ ] Grid categories
- [ ] Кликабельны

#### 5. Featured/New/Discounted Games ✅

- [ ] Game grids отображаются
- [ ] Cards hover эффекты
- [ ] "See all" кнопки работают

#### 6. Trending Games Section 🆕

- [ ] Топ 3 большие карточки
- [ ] Rank badges (золото/серебро/бронза)
- [ ] Discount badges для скидок
- [ ] Рейтинги (звёзды) видны
- [ ] "В корзину" buttons

#### 7. Upcoming Releases 🆕

- [ ] 3 карточки релизов
- [ ] Countdown timers
- [ ] Pre-order badges (зелёные)
- [ ] Platform badges (PC/PS5/Xbox)
- [ ] Wishlist counters

#### 8. Testimonials 🆕

- [ ] 6 отзывов в grid (3 cols)
- [ ] Аватары отображаются
- [ ] 5-star ratings
- [ ] Quote decorations
- [ ] Trust indicators внизу (4 карточки)

#### 9. Partners 🆕

- [ ] 8 партнёров (4x2 grid)
- [ ] Verified badges
- [ ] 4 feature карточки
- [ ] Trust badges (ISO, Verified, Award)

#### 10. Newsletter 🆕

- [ ] Email form видима
- [ ] 4 benefit карточки (2x2)
- [ ] Floating particles background
- [ ] Submit работает (показывает success)

#### 11. Footer 🆕

- [ ] 6 колонок (desktop)
- [ ] Social media icons (5 иконок)
- [ ] Все ссылки present
- [ ] Payment methods (PayPal, Visa, MC, Stripe)
- [ ] Legal links внизу

---

## 📱 Шаг 3: Responsive Testing

### Тест на разных размерах

```powershell
# Откройте Chrome DevTools (F12)
# Toggle device toolbar (Ctrl+Shift+M)
```

#### Mobile (375px - iPhone SE)

- [ ] Все секции видны
- [ ] Navigation menu (hamburger)
- [ ] Cards single column
- [ ] Text readable
- [ ] Buttons touch-friendly (min 44px)
- [ ] No horizontal scroll

#### Tablet (768px - iPad)

- [ ] Grid 2 columns
- [ ] Navigation visible
- [ ] Good spacing
- [ ] Images not stretched

#### Desktop (1280px)

- [ ] Full layout (3-4 columns)
- [ ] All features visible
- [ ] Optimal spacing
- [ ] Max container width

#### Large (1920px)

- [ ] Centered content
- [ ] Not too wide (max-width applies)
- [ ] Beautiful spacing

---

## ⚡ Шаг 4: Performance Testing

### Lighthouse Audit

```
1. Откройте Chrome DevTools (F12)
2. Перейдите во вкладку "Lighthouse"
3. Categories: All ✓
4. Device: Desktop + Mobile
5. Click "Analyze page load"
```

**Target Scores:**

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Core Web Vitals

**Проверьте в Lighthouse:**

- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **FID** (First Input Delay): < 100ms ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅

---

## 🎨 Шаг 5: Visual Quality Checks

### Animations

- [ ] Fade-in плавные
- [ ] Hover states работают
- [ ] No janky animations
- [ ] Gradient animations smooth

### Colors

- [ ] Consistent palette
- [ ] Good contrast (text readable)
- [ ] Dark mode работает (toggle)
- [ ] No color clashing

### Typography

- [ ] Heading hierarchy clear
- [ ] Font sizes appropriate
- [ ] Line spacing comfortable
- [ ] No text overflow

### Spacing

- [ ] Consistent padding/margin
- [ ] No elements too close
- [ ] Good breathing room
- [ ] Aligned properly

---

## 🐛 Шаг 6: Functional Testing

### Forms

- [ ] Newsletter email validation
- [ ] Submit показывает success
- [ ] Error states работают

### Links

- [ ] All nav links work
- [ ] Footer links не 404
- [ ] CTAs lead to correct pages
- [ ] External links open in new tab

### Interactive

- [ ] Theme toggle (light/dark)
- [ ] Language switcher
- [ ] Search bar
- [ ] Mobile menu

---

## 📊 Шаг 7: Build & Deploy Test

### Build Test

```powershell
# Production build
npm run build
```

**Check for:**

- [ ] No build errors
- [ ] No TypeScript errors
- [ ] Bundle size reasonable
- [ ] All pages generated

### Lint Test

```powershell
npm run lint
```

- [ ] No errors
- [ ] Warnings acceptable

### Type Check

```powershell
npx tsc --noEmit
```

- [ ] No type errors

---

## 🎯 Success Criteria

### Must Have ✅

- [x] All 6 new sections render
- [x] Footer enhanced
- [x] Responsive на mobile/tablet/desktop
- [x] No console errors
- [x] Build successful

### Should Have 🎯

- [ ] Lighthouse Performance > 85
- [ ] All animations smooth
- [ ] Forms functional
- [ ] Images optimized

### Nice to Have ⭐

- [ ] Lighthouse all > 90
- [ ] Perfect mobile UX
- [ ] Advanced interactions
- [ ] SEO optimized

---

## 🚨 Common Issues & Fixes

### Issue: Build error

```
Error: Module not found
```

**Fix:** Check imports, run `npm install`

### Issue: Hydration error

```
Error: Text content does not match server-rendered HTML
```

**Fix:** Use `"use client"` for client-only components

### Issue: Images not loading

```
Error: Invalid src prop
```

**Fix:** Add domain to `next.config.mjs` images config

### Issue: Slow performance

**Fix:**

- Enable image optimization
- Lazy load below-fold
- Check bundle size

---

## 📋 Final Checklist

Before deployment:

- [ ] ✅ Dev server runs без ошибок
- [ ] ✅ All sections visible
- [ ] ✅ Mobile responsive
- [ ] ✅ Animations smooth
- [ ] ✅ Forms work
- [ ] ✅ Dark mode toggles
- [ ] ✅ Build успешен
- [ ] ✅ Lighthouse > 85
- [ ] ✅ No console errors
- [ ] ✅ Ready to deploy!

---

**Когда все тесты пройдены - готов к deployment! 🚀**
