# Script to help setup DATABASE_URL for PostgreSQL
# Usage: .\scripts\setup-db-url.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DATABASE_URL Setup Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    New-Item -Path $envFile -ItemType File | Out-Null
}

Write-Host "Current DATABASE_URL:" -ForegroundColor Yellow
$content = Get-Content $envFile -ErrorAction SilentlyContinue
$currentDbUrl = $content | Where-Object { $_ -match "^DATABASE_URL=" } | ForEach-Object { $_ -replace "^DATABASE_URL=", "" -replace "['`"]", "" }

if ($currentDbUrl) {
    Write-Host "  $currentDbUrl" -ForegroundColor Gray
} else {
    Write-Host "  (not set)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "You need to update DATABASE_URL to a PostgreSQL connection string." -ForegroundColor Yellow
Write-Host ""
Write-Host "Format:" -ForegroundColor Cyan
Write-Host "  postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?sslmode=require" -ForegroundColor White
Write-Host ""
Write-Host "Example for Neon:" -ForegroundColor Cyan
Write-Host "  postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require" -ForegroundColor White
Write-Host ""
Write-Host "To update:" -ForegroundColor Yellow
Write-Host "  1. Get your PostgreSQL connection string from:" -ForegroundColor White
Write-Host "     - Neon: https://console.neon.tech/" -ForegroundColor White
Write-Host "     - Supabase: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "     - Other PostgreSQL provider" -ForegroundColor White
Write-Host ""
Write-Host "  2. Edit .env file and replace DATABASE_URL with your connection string" -ForegroundColor White
Write-Host ""
Write-Host "  3. Run: .\scripts\check-db-url.ps1 to verify" -ForegroundColor White
Write-Host ""

$response = Read-Host "Do you want to manually edit .env file now? (y/n)"

if ($response -eq "y" -or $response -eq "Y") {
    notepad $envFile
    Write-Host ""
    Write-Host "After saving, run: .\scripts\check-db-url.ps1" -ForegroundColor Green
}
