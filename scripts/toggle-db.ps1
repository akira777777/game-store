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
$content = Get-Content $schemaFile -Raw

if ($provider -eq "sqlite") {
    $content = $content -replace 'provider = "postgresql"', 'provider = "sqlite"'
    Write-Host "✅ Switched to SQLite for local development" -ForegroundColor Green
} else {
    $content = $content -replace 'provider = "sqlite"', 'provider = "postgresql"'
    Write-Host "✅ Switched to PostgreSQL for production" -ForegroundColor Green
}

Set-Content -Path $schemaFile -Value $content -NoNewline
Write-Host "[OK] Updated $schemaFile" -ForegroundColor Cyan
Write-Host "[!] Run 'npm run db:generate' after switching" -ForegroundColor Yellow
