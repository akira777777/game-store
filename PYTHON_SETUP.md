# Python 3.11 Setup для Cursor

Этот проект настроен для использования Python 3.11 в Cursor IDE.

## Быстрый старт

### Для текущей сессии PowerShell

```powershell
.\scripts\setup-python-311.ps1
```

После выполнения скрипта Python 3.11 будет доступен как `python` и `pip` в текущей сессии терминала.

### Для глобальной настройки (требуются права администратора)

```powershell
.\scripts\setup-python-global.ps1
```

**Примечание:** После глобальной настройки может потребоваться перезапуск Cursor.

## Проверка установки

После запуска скрипта проверьте:

```powershell
python --version    # Должно показать Python 3.11.9
pip --version       # Должно показать pip для Python 3.11
```

## Конфигурация Cursor/VS Code

Файл `.vscode/settings.json` уже настроен для использования Python 3.11:

- Интерпретатор Python: `C:\Users\-\AppData\Local\Programs\Python\Python311\python.exe`
- Путь к pip: `C:\Users\-\AppData\Local\Programs\Python\Python311\Scripts\pip.exe`

Если ваш путь к Python отличается, обновите эти пути в `.vscode/settings.json`.

## Использование Python в проекте

После настройки вы можете использовать Python 3.11 напрямую:

```powershell
# Установка пакетов
pip install package-name

# Запуск Python скриптов
python script.py

# Использование Python модулей
python -m module_name
```

## Решение проблем

### Python 3.11 не найден после настройки

1. Убедитесь, что Python 3.11 установлен по пути: `C:\Users\-\AppData\Local\Programs\Python\Python311`
2. Проверьте, что скрипт выполнен успешно
3. Перезапустите терминал в Cursor

### Конфликт с другими версиями Python

Скрипт `setup-python-311.ps1` автоматически устанавливает Python 3.11 с наивысшим приоритетом в PATH, удаляя другие версии Python из текущей сессии.

### Cursor не видит Python 3.11

1. Проверьте `.vscode/settings.json` - путь должен быть правильным
2. Перезапустите Cursor
3. Используйте команду "Python: Select Interpreter" в Cursor и выберите Python 3.11

## Пути установки

- **Python 3.11:** `C:\Users\-\AppData\Local\Programs\Python\Python311`
- **Scripts:** `C:\Users\-\AppData\Local\Programs\Python\Python311\Scripts`
