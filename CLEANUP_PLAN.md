# 🧹 Game Store - План очистки и подготовки к деплою

**Дата:** 2026-01-19  
**Цель:** Подготовить проект к production деплою

---

## ❌ Проблемы

### 1. Огромные файлы в репозитории
- `Qwen2.5-Coder-7B-Instruct/` - LLM модель ~4GB ❌ НЕ ДОЛЖНА БЫТЬ ЗДЕСЬ!
- `local-agent/` - AI агент папка ❌ НЕ ДОЛЖНА БЫТЬ ЗДЕСЬ!

### 2. Лишние документы
Множество .md файлов разработки, которые не нужны для деплоя:
- `CLAUDE_COORDINATION_PLAN.md`
- `LOCAL_AGENT_INTEGRATION.md`
- `LOCAL_AGENT_SUMMARY.md`
- `OLLAMA_SETUP.md`
- `PYTHON_SETUP.md`
- И другие...

### 3. Лишние файлы
- `Untitled` - непонятный файл
- `game-store.code-workspace` - workspace файл

---

## ✅ План очистки

### Шаг 1: Обновить .gitignore ✅

Добавить:
```gitignore
# AI Models and agents (НЕ ДОЛЖНЫ БЫТЬ В ПРОЕКТЕ!)
Qwen2.5-Coder-7B-Instruct/
local-agent/

# Development documentation (не нужны для деплоя)
CLAUDE_COORDINATION_PLAN.md
LOCAL_AGENT_*.md
OLLAMA_SETUP.md
PYTHON_SETUP.md
DRV_*/

# Workspace files
*.code-workspace

# Temp files
Untitled
```

### Шаг 2: Удалить из git tracking

```bash
git rm -r --cached Qwen2.5-Coder-7B-Instruct/
git rm -r --cached local-agent/
git rm --cached CLAUDE_COORDINATION_PLAN.md
git rm --cached LOCAL_AGENT_*.md
git rm --cached OLLAMA_SETUP.md
git rm --cached PYTHON_SETUP.md
git rm --cached game-store.code-workspace
git rm --cached Untitled
```

### Шаг 3: Оставить только нужные документы

**Оставить:**
- `README.md` ✅ (главный файл проекта)
- `ENV_SETUP.md` ✅ (инструкции по настройке env)
- `DEPLOYMENT_CHECKLIST.md` ✅ (чеклист деплоя)
- `READY_FOR_DEPLOYMENT.md` ✅ (готовность к деплою)
- `TESTING_GUIDE.md` ✅ (гайд по тестированию)

**Удалить/переименовать:**
- Все `*_FIX.md` → объединить в `TROUBLESHOOTING.md`
- Все `*_SETUP.md` (кроме ENV_SETUP) → удалить
- Все `*_SUMMARY.md` → удалить

### Шаг 4: Проверка структуры проекта

**Production-ready структура:**
```
game-store/
├── app/                    ✅ Next.js App Router
├── components/             ✅ React components
├── lib/                    ✅ Utilities
├── prisma/                 ✅ Database schema
├── public/                 ✅ Static assets
├── scripts/                ✅ Utility scripts
├── types/                  ✅ TypeScript types
├── messages/               ✅ i18n
├── .env.example            ✅ Template
├── .gitignore              ✅ Updated
├── package.json            ✅
├── README.md               ✅
├── ENV_SETUP.md            ✅
└── DEPLOYMENT_CHECKLIST.md ✅
```

### Шаг 5: Проверка готовности к деплою

#### Environment Variables
- [ ] `.env.example` существует и актуален
- [ ] Все секреты из примера
- [ ] Инструкции по получению ключей

#### Database
- [ ] Migrations в порядке
- [ ] Prisma schema валидна
- [ ] Seed данные готовы

#### Build
- [ ] `npm run build` проходит без ошибок
- [ ] `npm run lint` проходит
- [ ] TypeScript без ошибок

#### Security
- [ ] Нет хардкоженных секретов
- [ ] `.env` в .gitignore
- [ ] NEXTAUTH_SECRET настроен

---

## 🚀 После очистки

### Финальные шаги:

1. **Commit очистки:**
```bash
git add .
git commit -m "Clean up project: remove LLM models, local-agent, and dev docs"
```

2. **Проверка размера:**
```bash
git count-objects -vH
```

3. **Push:**
```bash
git push origin main
```

4. **Deploy:**
- Vercel: автоматически
- Netlify: через UI или CLI
- Cloudflare Pages: `npm run deploy`

---

## 📋 Deployment Checklist

### Pre-Deploy:
- [ ] Все env vars настроены в платформе
- [ ] Database URL корректен
- [ ] NEXTAUTH_SECRET сгенерирован
- [ ] Stripe ключи добавлены
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`

### Post-Deploy:
- [ ] Проверить homepage загружается
- [ ] Проверить логин работает
- [ ] Проверить каталог игр
- [ ] Проверить checkout flow
- [ ] Проверить admin panel

---

**Готов начать очистку!**
