# Local AI Agent

Локальный AI агент на основе Qwen с использованием ExLlamaV2 для выполнения задач разработки.

## Возможности

- 🤖 **LLM**: Работа с моделями Qwen через ExLlamaV2 (с квантизацией AWQ)
- 🛠️ **Tools**: Выполнение shell, git, и Python команд
- 🧠 **Memory**: Кратковременная и долговременная память (SQLite + Vector Store)
- 🌐 **API**: FastAPI сервер для интеграции
- 💬 **Interactive**: Интерактивный режим в терминале

## Требования

- Python 3.11+
- CUDA-совместимая GPU (рекомендуется для AWQ моделей)
- ~8GB VRAM для модели 7B с AWQ квантизацией
- ~16GB RAM системной памяти

## Установка

### 1. Настройка Python 3.11

Запустите скрипт настройки Python 3.11:

```powershell
cd ..
.\scripts\setup-python-311.ps1
```

### 2. Установка зависимостей

```powershell
cd local-agent
pip install -r requirements.txt
```

### 3. Загрузка модели Qwen

Доступные варианты:

#### Qwen 2.5 Coder 7B AWQ (рекомендуется)
```powershell
python download_model.py --model qwen2.5-coder-7b-awq
```

#### Qwen 1.8B (легкая версия, для слабых GPU)
```powershell
python download_model.py --model qwen-1.8b
```

#### Qwen 2.5 Coder 14B AWQ (требуется ~16GB VRAM)
```powershell
python download_model.py --model qwen2.5-coder-14b-awq
```

Или загрузите вручную с Hugging Face:
- [Qwen2.5-Coder-7B-Instruct-AWQ](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-AWQ)
- [Qwen-1.8B-Chat](https://huggingface.co/Qwen/Qwen-1_8B-Chat)

Поместите модель в папку: `local-agent/models/<model-name>/`

## Использование

### Интерактивный режим

```powershell
python run.py
```

Пример сессии:
```
You: List files in the current directory
Agent: [выполняет команду и показывает результат]

You: Create a new Python script hello.py
Agent: [создает файл]

You: What did we discuss earlier?
Agent: [использует память для ответа]
```

### API Сервер

Запуск сервера:
```powershell
python server.py
```

Сервер запустится на `http://localhost:8000`

#### API Endpoints:

**POST /query** - Отправить запрос агенту
```json
{
  "query": "List all Python files in this directory"
}
```

**GET /state** - Получить состояние агента
```json
{
  "state": "idle",
  "working_dir": "C:\\Users\\-\\Desktop\\game-store",
  "model_path": "models/qwen2.5-coder-7b-awq"
}
```

**POST /clear_memory** - Очистить старую память
```json
{
  "days": 30
}
```

**GET /health** - Health check
```json
{
  "status": "healthy",
  "agent_initialized": true
}
```

### Документация API

Откройте `http://localhost:8000/docs` для Swagger UI

## Конфигурация

Создайте `.env` файл в папке `local-agent/`:

```env
# Model Configuration
MODEL_PATH=models/qwen2.5-coder-7b-awq
MODEL_CONFIG_PATH=

# Server Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Memory Configuration
MEMORY_DB_PATH=memory.db
VECTOR_STORE_PATH=vector_store

# LLM Generation Parameters
MAX_TOKENS=1000
TEMPERATURE=0.7
TOP_P=0.9
```

## Архитектура

```
local-agent/
├── agent/
│   ├── controller.py    # Главный контроллер агента
│   ├── llm.py          # ExLlamaV2 wrapper
│   ├── memory.py       # Memory manager (SQLite + Vector Store)
│   └── tools.py        # Tool executor (shell, git, python)
├── models/             # Папка с моделями Qwen
├── run.py             # Интерактивный запуск
├── server.py          # FastAPI сервер
└── requirements.txt   # Python зависимости
```

## Инструменты (Tools)

Агент может выполнять:

1. **Shell команды**: `ls`, `mkdir`, `npm install`, и т.д.
2. **Git команды**: `git status`, `git commit`, `git push`
3. **Python код**: Выполнение Python скриптов и кода

Пример использования:
```
You: Run npm install in the frontend directory
Agent: [выполняет shell команду]

You: Commit changes with message "Update dependencies"
Agent: [выполняет git команду]

You: Run the test script
Agent: [выполняет Python скрипт]
```

## Память (Memory)

Агент использует:
- **SQLite** для хранения истории
- **Vector Store** (ChromaDB) для семантического поиска
- **Conversation History** для контекста диалога

Память автоматически:
- Сохраняет все взаимодействия
- Находит релевантный контекст для запросов
- Очищает старые записи (по умолчанию >30 дней)

## Troubleshooting

### Модель не загружается
- Проверьте путь к модели в `run.py` или `.env`
- Убедитесь, что модель полностью загружена
- Проверьте наличие файлов модели (config.json, safetensors, etc.)

### Out of Memory (OOM)
- Используйте меньшую модель (Qwen 1.8B вместо 7B)
- Уменьшите `max_tokens` в конфигурации
- Закройте другие приложения, использующие VRAM

### ExLlamaV2 не устанавливается
- Убедитесь, что установлен CUDA Toolkit
- Попробуйте установить PyTorch с CUDA поддержкой:
  ```powershell
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
  ```

### Медленная генерация
- Убедитесь, что используется GPU (не CPU)
- Используйте AWQ квантизованные модели
- Уменьшите `max_tokens`

## Интеграция с Cursor

Агент может быть интегрирован с Cursor IDE для:
- Автоматического выполнения задач
- Анализа кодовой базы
- Генерации кода по описанию
- Рефакторинга и оптимизации

Для интеграции см. документацию Cursor по MCP (Model Context Protocol).

## Лицензия

MIT
