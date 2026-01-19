# Ollama Setup для Local Agent

## ✅ Установка завершена

**Ollama версия**: 0.14.2  
**Путь**: `C:\Users\-\AppData\Local\Programs\Ollama`  
**Сервер**: http://localhost:11434

## 📦 Установленные модели

- **Gemma 3:4b** - 3.3 GB (уже установлена)
- **Qwen 2.5 Coder 1.5B** - загружается...

## 🚀 Быстрый старт

### 1. Добавить Ollama в PATH (текущая сессия)

```powershell
.\scripts\setup-ollama.ps1
```

### 2. Проверить установку

```powershell
ollama --version
ollama list
```

### 3. Загрузить модели Qwen

```powershell
# Легкая версия для разработки (1.5B, ~1GB)
ollama pull qwen2.5-coder:1.5b

# Рекомендуемая для продакшена (7B, ~4.7GB)
ollama pull qwen2.5-coder:7b

# Базовая Qwen (7B, ~4.7GB)
ollama pull qwen2:7b

# Совсем легкая (0.5B, ~397MB)
ollama pull qwen2:0.5b
```

### 4. Тестирование

```powershell
# Простой тест
ollama run qwen2.5-coder:1.5b "Write a hello world in Python"

# Интерактивный режим
ollama run qwen2.5-coder:1.5b
```

## 🔗 Интеграция с Local Agent

### Вариант 1: Использовать Ollama в существующем Local Agent

**В `C:\local-agent\`:**

Обновите `agent/llm.py` или создайте `agent/llm_ollama.py`:

```python
import httpx
import json

class OllamaLLM:
    def __init__(self, model="qwen2.5-coder:1.5b"):
        self.model = model
        self.base_url = "http://localhost:11434"
        self.client = httpx.AsyncClient(timeout=300.0)
    
    async def generate(self, prompt, **kwargs):
        response = await self.client.post(
            f"{self.base_url}/api/generate",
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )
        return response.json()["response"]
```

### Вариант 2: Новый Local Agent с Ollama

**В `C:\Users\-\Desktop\game-store\local-agent\`:**

```powershell
cd local-agent
pip install httpx
```

Создайте `agent/llm_ollama.py` (уже готов в проекте)

## 📊 Сравнение моделей Qwen

| Модель | Размер | VRAM | Скорость | Качество | Использование |
|--------|--------|------|----------|----------|---------------|
| **qwen2:0.5b** | 397MB | ~1GB | Очень быстро | Базовое | Тесты, прототипы |
| **qwen2.5-coder:1.5b** | ~1GB | ~2GB | Быстро | Хорошее | Разработка |
| **qwen2:7b** | 4.7GB | ~8GB | Средне | Отличное | Общие задачи |
| **qwen2.5-coder:7b** | 4.7GB | ~8GB | Средне | Отличное | Coding |
| **qwen2.5-coder:14b** | ~9GB | ~16GB | Медленно | Превосходное | Production |

## 🎯 Рекомендации

### Для разработки:
```powershell
ollama pull qwen2.5-coder:1.5b
```

### Для продакшена:
```powershell
ollama pull qwen2.5-coder:7b
```

### Для слабых систем:
```powershell
ollama pull qwen2:0.5b
```

## 🔧 Команды Ollama

### Управление моделями

```powershell
# Список моделей
ollama list

# Загрузить модель
ollama pull <model>

# Удалить модель
ollama rm <model>

# Информация о модели
ollama show <model>
```

### Запуск модели

```powershell
# Интерактивный режим
ollama run qwen2.5-coder:1.5b

# Одноразовый запрос
ollama run qwen2.5-coder:1.5b "Your prompt here"

# С параметрами
ollama run qwen2.5-coder:1.5b --temperature 0.7 "Your prompt"
```

### Управление сервером

```powershell
# Запустить сервер (обычно запускается автоматически)
ollama serve

# Остановить сервер
# Найти процесс: Get-Process ollama
# Остановить: Stop-Process -Name ollama
```

## 🌐 API

Ollama предоставляет REST API на `http://localhost:11434`

### Основные endpoints:

**POST /api/generate** - Генерация текста
```json
{
  "model": "qwen2.5-coder:1.5b",
  "prompt": "Write a function",
  "stream": false
}
```

**POST /api/chat** - Чат с историей
```json
{
  "model": "qwen2.5-coder:1.5b",
  "messages": [
    {"role": "user", "content": "Hello"}
  ]
}
```

**GET /api/tags** - Список моделей

**POST /api/pull** - Загрузить модель

## 🔗 Интеграция с проектами

### Node.js / TypeScript

```typescript
async function queryOllama(prompt: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: 'qwen2.5-coder:1.5b',
      prompt,
      stream: false
    })
  });
  
  const data = await response.json();
  return data.response;
}
```

### Python

```python
import httpx

async def query_ollama(prompt):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "qwen2.5-coder:1.5b",
                "prompt": prompt,
                "stream": False
            }
        )
        return response.json()["response"]
```

## 📝 Использование с Local Agent

### Запуск Local Agent с Ollama

```powershell
cd C:\local-agent

# Убедитесь, что Ollama запущен
ollama serve

# Запустите агента
python run.py --llm ollama --model qwen2.5-coder:1.5b
```

### Или через API сервер

```powershell
python server.py
```

Затем в другом терминале:
```powershell
curl -X POST http://localhost:8000/query `
  -H "Content-Type: application/json" `
  -d '{"query": "List Python files", "llm": "ollama"}'
```

## 🐛 Troubleshooting

### Ollama не запускается

```powershell
# Проверить процесс
Get-Process ollama

# Перезапустить
Stop-Process -Name ollama -Force
ollama serve
```

### Модель не найдена

```powershell
ollama list  # Проверить установленные модели
ollama pull qwen2.5-coder:1.5b  # Загрузить
```

### Медленная генерация

- Используйте меньшую модель (1.5B вместо 7B)
- Проверьте VRAM: `nvidia-smi` (если GPU)
- Уменьшите `max_tokens`

### Не может подключиться к серверу

```powershell
# Проверить, запущен ли сервер
Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing

# Если не запущен, запустить:
ollama serve
```

## 📚 Дополнительные ресурсы

- **Ollama**: https://ollama.com/
- **Qwen Models**: https://ollama.com/library/qwen2.5-coder
- **API Docs**: https://github.com/ollama/ollama/blob/main/docs/api.md
- **Model Library**: https://ollama.com/library

## ✨ Преимущества Ollama

- ✅ Проще установка (без CUDA Toolkit)
- ✅ Легче в использовании
- ✅ Автоматическое управление моделями
- ✅ REST API из коробки
- ✅ Меньше зависимостей
- ✅ Лучше работает на CPU
- ✅ Поддержка множества моделей

## 🔄 Ollama vs ExLlamaV2

| Критерий | Ollama | ExLlamaV2 |
|----------|--------|-----------|
| **Установка** | Простая | Сложная (CUDA) |
| **Использование** | Легкое (API) | Требует кода |
| **Скорость (GPU)** | Хорошая | Отличная |
| **Скорость (CPU)** | Отличная | Медленная |
| **Модели** | Готовые | Нужно качать |
| **Память** | Эффективная | Более требовательная |

**Рекомендация**: Используйте Ollama для разработки, ExLlamaV2 - для максимальной производительности на GPU.

---

**Ollama готов к работе! 🎉**

Для начала:
```powershell
ollama run qwen2.5-coder:1.5b "Write a hello world in Python"
```
