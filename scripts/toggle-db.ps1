# Скрипт для переключения между SQLite (локально) и PostgreSQL (продакшен)
# Использование:
#   ./scripts/toggle-db.ps1 sqlite    - переключить на SQLite для локальной разработки
#   ./scripts/toggle-db.ps1 postgres  - переключить на PostgreSQL для продакшена

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("sqlite", "postgres")]
    [string]$provider
)

$schemaFile = "prisma/schema.prisma"
$envFile = ".env"

# Проверяем существование .env файла
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  Warning: .env file not found. DATABASE_URL won't be updated." -ForegroundColor Yellow
}

# Читаем schema.prisma
$content = Get-Content $schemaFile -Raw

if ($provider -eq "sqlite") {
    # Переключаем на SQLite
    $content = $content -replace 'provider = "postgresql"', 'provider = "sqlite"'
    Write-Host "✅ Switched to SQLite for local development" -ForegroundColor Green

    # Обновляем DATABASE_URL в .env если файл существует
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile -Raw
        $sqliteUrl = 'file:./prisma/dev.db'

        # Заменяем DATABASE_URL на SQLite URL
        if ($envContent -match 'DATABASE_URL\s*=\s*["'']?[^"'']+["'']?') {
            $envContent = $envContent -replace 'DATABASE_URL\s*=\s*["'']?[^"'']+["'']?', "DATABASE_URL=`"$sqliteUrl`""
            Set-Content -Path $envFile -Value $envContent -NoNewline
            Write-Host "[OK] Updated DATABASE_URL in .env to SQLite" -ForegroundColor Cyan
        } else {
            # Добавляем DATABASE_URL если его нет
            $envContent += "`nDATABASE_URL=`"$sqliteUrl`""
            Set-Content -Path $envFile -Value $envContent -NoNewline
            Write-Host "[OK] Added DATABASE_URL to .env" -ForegroundColor Cyan
        }
    }
} else {
    # Переключаем на PostgreSQL
    $content = $content -replace 'provider = "sqlite"', 'provider = "postgresql"'
    Write-Host "✅ Switched to PostgreSQL for production" -ForegroundColor Green

    # Предупреждаем о необходимости обновить DATABASE_URL вручную
    Write-Host "[!] Remember to update DATABASE_URL in .env file with your PostgreSQL connection string" -ForegroundColor Yellow
}

Set-Content -Path $schemaFile -Value $content -NoNewline
Write-Host "[OK] Updated $schemaFile" -ForegroundColor Cyan
Write-Host "[!] Run 'npm run db:generate' after switching" -ForegroundColor Yellow
