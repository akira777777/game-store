# Установка Local Agent с Python 3.11

## Быстрая установка

### Windows (PowerShell)

```powershell
# 1. Перейдите в папку local-agent
cd local-agent

# 2. Запустите скрипт установки
.\setup.ps1

# 3. Загрузите модель Qwen (выберите одну)
python download_model.py --model qwen-1.8b                 # Легкая версия
python download_model.py --model qwen2.5-coder-7b-awq      # Рекомендуемая
python download_model.py --model qwen2.5-coder-14b-awq     # Продвинутая

# 4. Запустите агента
python run.py
```

## Ручная установка

### 1. Установка Python 3.11

Если Python 3.11 не установлен:

1. Скачайте с [python.org](https://www.python.org/downloads/)
2. Установите с опцией "Add Python to PATH"
3. Проверьте: `py -3.11 --version`

### 2. Настройка Python 3.11 в проекте

Запустите скрипт из корня проекта:

```powershell
cd ..
.\scripts\setup-python-311.ps1
cd local-agent
```

### 3. Установка зависимостей Python

```powershell
# Обновить pip
python -m pip install --upgrade pip

# Установить зависимости
pip install -r requirements.txt
```

### 4. Установка PyTorch с CUDA (для GPU)

Если у вас NVIDIA GPU:

```powershell
# CUDA 12.1
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# CUDA 11.8
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

Для CPU (медленно):
```powershell
pip install torch torchvision torchaudio
```

### 5. Установка ExLlamaV2

```powershell
pip install exllamav2
```

Если возникают проблемы:
```powershell
pip install exllamav2 --no-build-isolation
```

### 6. Загрузка модели Qwen

#### Автоматическая загрузка:

```powershell
# Установить huggingface-hub
pip install huggingface-hub

# Список доступных моделей
python download_model.py --list

# Загрузить модель
python download_model.py --model qwen2.5-coder-7b-awq
```

#### Ручная загрузка:

1. Установите git-lfs: https://git-lfs.github.com/
2. Клонируйте репозиторий модели:

```powershell
cd models
git clone https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-AWQ qwen2.5-coder-7b-awq
cd ..
```

## Проверка установки

```powershell
# Проверить Python
python --version    # Должно быть 3.11.x

# Проверить установленные пакеты
pip list

# Проверить CUDA (если используется GPU)
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}')"

# Проверить модель
python -c "from pathlib import Path; print('Models:', list(Path('models').glob('*/config.json')))"
```

## Запуск

### Интерактивный режим:
```powershell
python run.py
```

### API сервер:
```powershell
python server.py
```

Откройте `http://localhost:8000/docs` для API документации.

## Решение проблем

### Python 3.11 не найден

```powershell
# Проверить установленные версии Python
py --list

# Если 3.11 не установлен, скачайте с python.org
```

### ExLlamaV2 не устанавливается

```powershell
# Проверить наличие CUDA Toolkit
nvcc --version

# Установить Visual Studio Build Tools (для Windows)
# https://visualstudio.microsoft.com/downloads/

# Попробовать установку без сборки
pip install exllamav2 --no-build-isolation
```

### Out of Memory при загрузке модели

Используйте меньшую модель или AWQ квантизацию:
- Qwen-1.8B: ~4GB VRAM
- Qwen2.5-Coder-7B-AWQ: ~8GB VRAM
- Qwen2.5-Coder-14B-AWQ: ~16GB VRAM

### Медленная генерация

1. Убедитесь, что используется GPU:
   ```powershell
   python -c "import torch; print(torch.cuda.is_available())"
   ```

2. Проверьте, что модель загружена в VRAM:
   ```powershell
   nvidia-smi
   ```

3. Используйте AWQ квантизованные модели

### ModuleNotFoundError

```powershell
# Переустановить зависимости
pip install -r requirements.txt --force-reinstall
```

## Системные требования

### Минимальные:
- OS: Windows 10/11, Linux, macOS
- CPU: 4 cores
- RAM: 8GB
- GPU: NVIDIA (опционально, но рекомендуется)
- Disk: 20GB свободного места

### Рекомендуемые:
- OS: Windows 11 / Linux
- CPU: 8+ cores
- RAM: 16GB+
- GPU: NVIDIA RTX 3060 или лучше (8GB+ VRAM)
- Disk: 50GB+ SSD

## Дополнительно

### Настройка окружения (.env)

Создайте файл `.env` в папке `local-agent/`:

```env
MODEL_PATH=models/qwen2.5-coder-7b-awq
API_HOST=0.0.0.0
API_PORT=8000
MAX_TOKENS=1000
TEMPERATURE=0.7
```

### Обновление зависимостей

```powershell
pip install -r requirements.txt --upgrade
```

### Очистка кэша

```powershell
# Удалить Python cache
Remove-Item -Recurse -Force agent\__pycache__

# Удалить память агента
Remove-Item memory.db
Remove-Item -Recurse -Force vector_store\
```
