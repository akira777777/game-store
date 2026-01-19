# Интеграция Local Agent с Game Store

## Обзор

Local Agent интегрирован в проект Game Store для автоматизации задач разработки, тестирования и развертывания.

## Структура

```
game-store/
├── local-agent/           # AI Agent компонент
│   ├── agent/            # Модули агента
│   ├── models/           # Qwen модели
│   ├── run.py           # CLI интерфейс
│   └── server.py        # API сервер
│
├── scripts/              # Утилиты
│   ├── setup-python-311.ps1
│   └── ...
│
├── app/                  # Next.js приложение
├── components/           # React компоненты
└── ...
```

## Использование в разработке

### 1. Автоматизация задач

```powershell
# Запустить agent в отдельном терминале
cd local-agent
python server.py
```

```typescript
// В вашем коде (TypeScript/Node.js)
import { AgentClient } from './lib/agent-client';

const agent = new AgentClient('http://localhost:8000');

// Запустить тесты
await agent.query('Run all unit tests for the game store');

// Проверить code style
await agent.query('Run eslint and fix issues');

// Генерация компонентов
await agent.query('Create a new React component for user reviews');
```

### 2. CI/CD интеграция

```yaml
# .github/workflows/agent-tasks.yml
name: Agent Tasks
on: [push]

jobs:
  agent:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python 3.11
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Start Agent
        run: |
          cd local-agent
          pip install -r requirements.txt
          python server.py &
          sleep 10

      - name: Run agent tasks
        run: |
          curl -X POST http://localhost:8000/query \
            -H "Content-Type: application/json" \
            -d '{"query": "Run tests and generate report"}'
```

### 3. Скрипты для разработки

```powershell
# scripts/agent-dev.ps1
Write-Host "Starting Local Agent..."
cd local-agent
python server.py
```

Добавьте в `package.json`:

```json
{
  "scripts": {
    "agent:start": "powershell -File scripts/agent-dev.ps1",
    "agent:query": "node scripts/agent-query.js"
  }
}
```

## Создание Agent Client для проекта

```typescript
// lib/agent-client.ts
export class AgentClient {
  constructor(private baseUrl: string = 'http://localhost:8000') {}

  async query(query: string, workingDir?: string): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, working_dir: workingDir }),
    });

    return response.json();
  }

  async getState(): Promise<AgentState> {
    const response = await fetch(`${this.baseUrl}/state`);
    return response.json();
  }

  async health(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

// Использование
const agent = new AgentClient();

// Автоматическое тестирование
await agent.query('Run npm test');

// Проверка базы данных
await agent.query('Check Prisma schema and suggest optimizations');

// Git операции
await agent.query('Create a new branch feature/new-feature');
```

## Примеры задач для Game Store

### 1. Работа с базой данных

```typescript
// Генерация миграций
await agent.query('Create Prisma migration for new payment cards table');

// Seeding
await agent.query('Run database seed script with test data');

// Проверка консистентности
await agent.query('Analyze database schema and check for missing indexes');
```

### 2. Тестирование

```typescript
// Unit тесты
await agent.query('Run all Jest tests and generate coverage report');

// E2E тесты
await agent.query('Run Playwright tests for checkout flow');

// Performance тесты
await agent.query('Run lighthouse audit on main pages');
```

### 3. Code Review

```typescript
// Анализ кода
await agent.query('Review recent changes in components/ directory');

// Поиск проблем
await agent.query('Find all TODO comments and create GitHub issues');

// Refactoring suggestions
await agent.query('Suggest improvements for game-queries.ts');
```

### 4. Документация

```typescript
// Генерация документации
await agent.query('Generate API documentation from route handlers');

// README обновление
await agent.query('Update README with latest features');

// Комментарии к коду
await agent.query('Add JSDoc comments to all exported functions in lib/');
```

## Интеграция с Prisma

```typescript
// scripts/agent-db.ts
import { AgentClient } from '../lib/agent-client';

const agent = new AgentClient();

async function manageDatabaseWithAgent() {
  // Генерация модели
  await agent.query(`
    Create a new Prisma model for Reviews with fields:
    - id (String, cuid)
    - userId (String, relation to User)
    - gameId (String, relation to Game)
    - rating (Int, 1-5)
    - comment (String)
    - createdAt (DateTime)
  `);

  // Применение изменений
  await agent.query('Run prisma migrate dev');

  // Генерация клиента
  await agent.query('Run prisma generate');
}
```

## Интеграция с Next.js

```typescript
// app/api/agent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AgentClient } from '@/lib/agent-client';

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  const agent = new AgentClient();
  const response = await agent.query(query);

  return NextResponse.json(response);
}
```

```typescript
// Использование в компоненте
'use client';

import { useState } from 'react';

export function AgentInterface() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/agent', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResponse(data.result);
  };

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSubmit}>Ask Agent</button>
      <pre>{response}</pre>
    </div>
  );
}
```

## Полезные команды для Game Store

### Development

```
- "Start development server with hot reload"
- "Install all npm dependencies"
- "Check TypeScript types"
- "Run ESLint and fix all issues"
```

### Database

```
- "Reset database and apply all migrations"
- "Seed database with sample games"
- "Generate Prisma client"
- "Open Prisma Studio"
```

### Testing

```
- "Run all tests with coverage"
- "Test payment checkout flow"
- "Test user authentication"
- "Check for security vulnerabilities"
```

### Deployment

```
- "Build production bundle"
- "Deploy to Netlify"
- "Deploy to Cloudflare Pages"
- "Run pre-deployment checks"
```

### Git

```
- "Show git status and suggest next actions"
- "Create commit with descriptive message"
- "Create new feature branch"
- "Merge develop into current branch"
```

## Best Practices

### 1. Специфичные запросы

❌ Плохо: "Do something with the database"
✅ Хорошо: "Run Prisma migration dev and generate client for the new schema"

### 2. Контекст

```typescript
await agent.query(`
  In the game-store project:
  1. Add a new field 'featured' to Game model
  2. Update the games API route to filter featured games
  3. Run migrations
`, './');
```

### 3. Проверка результатов

```typescript
const result = await agent.query('Run npm test');

if (!result.success) {
  console.error('Tests failed:', result.error);
  // Handle error
}
```

### 4. Цепочка задач

```typescript
// Вместо одного большого запроса
await agent.query('Add field to schema');
await agent.query('Generate Prisma client');
await agent.query('Update API routes');
await agent.query('Run tests');
```

## Безопасность

⚠️ **Важно**: Agent имеет доступ к файловой системе и может выполнять команды.

**Рекомендации**:

- Не запускайте agent с правами администратора
- Используйте в изолированной среде разработки
- Проверяйте результаты перед применением к production
- Не передавайте секреты через запросы

## Мониторинг

```typescript
// Проверка состояния агента
const state = await agent.getState();
console.log('Agent state:', state);

// Health check
const health = await agent.health();
console.log('Agent health:', health);
```

## Troubleshooting

### Agent не отвечает

```powershell
# Проверить, запущен ли сервер
curl http://localhost:8000/health

# Перезапустить
cd local-agent
python server.py
```

### Ошибки выполнения команд

Проверьте рабочую директорию:

```typescript
await agent.query('List files', './game-store');
```

### Медленная генерация

Используйте меньшую модель или увеличьте таймауты:

```env
MAX_TOKENS=500
TEMPERATURE=0.5
```

## Дальнейшее развитие

Планируемые улучшения:

- [ ] Интеграция с Cursor через MCP
- [ ] Webhook для автоматических задач
- [ ] Dashboard для мониторинга
- [ ] Кэширование частых запросов
- [ ] Fine-tuning модели на кодовой базе

---

**См. также**:

- [Local Agent README](local-agent/README.md)
- [Quick Start](local-agent/QUICKSTART.md)
- [Installation Guide](local-agent/INSTALL.md)
