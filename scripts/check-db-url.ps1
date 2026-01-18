# Script to check and validate DATABASE_URL format
# Usage: .\scripts\check-db-url.ps1

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Checking DATABASE_URL..." -ForegroundColor Yellow

$content = Get-Content $envFile -Encoding UTF8
$dbUrlLine = $content | Where-Object { $_ -match "^DATABASE_URL=" }

if (-not $dbUrlLine) {
    Write-Host "ERROR: DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

$dbUrl = $dbUrlLine -replace "^DATABASE_URL=", "" -replace "['`"]", ""

Write-Host "Current DATABASE_URL: $dbUrl" -ForegroundColor Cyan

if ($dbUrl -match "^postgresql://|^postgres://") {
    Write-Host "OK: DATABASE_URL format is correct" -ForegroundColor Green

    # Check for sslmode parameter for Neon
    if ($dbUrl -notmatch "sslmode=") {
        Write-Host "WARNING: Missing sslmode=require parameter (recommended for Neon)" -ForegroundColor Yellow
    }
} else {
    Write-Host "ERROR: Invalid DATABASE_URL format!" -ForegroundColor Red
    Write-Host ""
    Write-Host "DATABASE_URL must start with:" -ForegroundColor Yellow
    Write-Host "  - postgresql://" -ForegroundColor White
    Write-Host "  - postgres://" -ForegroundColor White
    Write-Host ""
    Write-Host "Example format:" -ForegroundColor Yellow
    Write-Host "  postgresql://user:password@host:port/database?sslmode=require" -ForegroundColor White
    Write-Host ""
    Write-Host "For Neon PostgreSQL, use Connection String from Neon dashboard." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "OK: Validation completed successfully" -ForegroundColor Green
