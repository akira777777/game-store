# 🐛 Debug Report - Game Store

**Дата:** 2026-01-19
**Координатор:** Claude
**Статус:** IN PROGRESS

---

## 📋 Найденные проблемы

### 1. ❌ CRITICAL: Missing Avatar Images (404)

**Симптом:**
```
GET /avatars/user1.jpg 404
GET /avatars/user2.jpg 404
... (повторяется 100+ раз)
```

**Причина:**
TestimonialsSection ссылается на несуществующие аватары

**Impact:** Low (UI работает, но браузер делает лишние запросы)

**Fix Plan:**
- Заменить на placeholder avatars
- Использовать public/avatars/ директорию
- Или использовать external CDN (unavatar.io, ui-avatars.com)

---

### 2. ⚠️ HIGH: JWT Auth Error

**Симптом:**
```
[auth][error] JWTSessionError: Read more at https://errors.authjs.dev#jwtsessionerror
[auth][cause]: Error: no matching decryption secret
```

**Причина:**
NextAuth `NEXTAUTH_SECRET` не установлен или изменился

**Impact:** Medium (auth может не работать корректно)

**Fix Plan:**
- Проверить `.env.local`
- Генерировать новый secret если нужно
- Документировать для deployment

---

### 3. ❌ CRITICAL: React Server/Client Component Error

**Симптом:**
```
⨯ Error: Event handlers cannot be passed to Client Component props.
<select className=... defaultValue="" onChange={function onChange} ...>
                                                ^^^^^^^^^^^^^^^^^^^
```

**Причина:**
Select component с onChange в Server Component

**Impact:** High (может ломать функциональность)

**Fix Plan:**
- Найти проблемный select
- Добавить "use client" directive
- Или переместить в Client Component

---

### 4. ⚠️ MEDIUM: Missing Pages (404)

**Симптомы:**
```
GET /ru/privacy 404
GET /ru/terms 404
GET /ru/partners 404
GET /ru/help 404
GET /ru/sitemap 404
GET /en/blog 404
GET /en/wishlist 404
```

**Причина:**
Footer/Navigation ссылаются на несуществующие страницы

**Impact:** Medium (плохой UX, broken links)

**Fix Plan:**
- Создать placeholder страницы
- Или временно disable links
- Или сделать redirect на главную

---

### 5. ⚠️ LOW: EventEmitter Memory Leak

**Симптом:**
```
MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 SIGINT listeners added to [process]. MaxListeners is 10.
```

**Причина:**
Множественные процессы или hot-reload

**Impact:** Low (только development warning)

**Fix Plan:**
- Ignore для dev (не влияет на production)
- Или добавить `setMaxListeners(15)` если нужно

---

### 6. ℹ️ INFO: Watchpack Errors (Windows)

**Симптом:**
```
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\pagefile.sys'
```

**Причина:**
Next.js пытается watch системные файлы Windows

**Impact:** None (можно игнорировать)

**Fix Plan:**
- Ignore (стандартное поведение на Windows)

---

## 🎯 Priority Fix Order

### Phase 1: CRITICAL (Делаю сейчас)
1. ✅ Fix Server/Client Component error (select issue)
2. ✅ Fix missing avatars (placeholder images)

### Phase 2: HIGH
3. ⏳ Fix JWT Auth error (.env setup)
4. ⏳ Create missing pages or disable links

### Phase 3: MEDIUM/LOW
5. ⏳ Document known issues for deployment
6. ⏳ Ignore EventEmitter warning (dev only)

---

## 🔍 Debugging Process

### Step 1: Locate Issues ✅
- Read terminal logs
- Identify error patterns
- Categorize by severity

### Step 2: Fix Critical ⏳
- Server/Client component
- Missing assets

### Step 3: Fix High Priority ⏳
- Auth configuration
- Missing pages

### Step 4: Optimize 📋
- Performance check
- Mobile responsive
- Final testing

---

## 📝 Fixes Applied

### Fix 1: Avatar Images (PENDING)
**Action:** Create placeholder avatars

### Fix 2: Select Component (PENDING)
**Action:** Find and convert to Client Component

### Fix 3: Auth Secret (PENDING)
**Action:** Document .env setup

---

**Coordinator:** Claude
**Execution:** Local Models (directed)
**Next:** Apply fixes sequentially
