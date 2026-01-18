# Script to test database connection
# Usage: .\scripts\test-db-connection.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Connection Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    exit 1
}

$content = Get-Content $envFile -Encoding UTF8
$dbUrlLine = $content | Where-Object { $_ -match "^DATABASE_URL\s*=" } | Select-Object -First 1

if (-not $dbUrlLine) {
    Write-Host "ERROR: DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

$dbUrl = $dbUrlLine -replace "^DATABASE_URL\s*=\s*", "" -replace "['`"]", ""

Write-Host "Testing connection to database..." -ForegroundColor Yellow
Write-Host ""

# Extract connection details (without password)
if ($dbUrl -match "postgresql://([^:]+):([^@]+)@([^/]+)/([^?]+)") {
    $username = $matches[1]
    $password = $matches[2]
    $hostPort = $matches[3]
    $database = $matches[4]

    Write-Host "Connection details:" -ForegroundColor Cyan
    Write-Host "  Username: $username" -ForegroundColor White
    Write-Host "  Password: " -NoNewline -ForegroundColor White
    if ($password.Length -gt 0) {
        Write-Host ("*" * [Math]::Min($password.Length, 20)) -ForegroundColor Gray
    } else {
        Write-Host "(empty)" -ForegroundColor Red
    }
    Write-Host "  Host:Port: $hostPort" -ForegroundColor White
    Write-Host "  Database: $database" -ForegroundColor White
    Write-Host ""

    # Check if password is empty
    if ($password -eq "" -or $password -eq "PASSWORD") {
        Write-Host "WARNING: Password appears to be empty or placeholder!" -ForegroundColor Red
        Write-Host "  Make sure you've replaced PASSWORD with actual password" -ForegroundColor Yellow
        Write-Host ""
    }

    # Check if username is placeholder
    if ($username -eq "USERNAME" -or $username -eq "") {
        Write-Host "WARNING: Username appears to be placeholder!" -ForegroundColor Red
        Write-Host "  Make sure you've replaced USERNAME with actual username" -ForegroundColor Yellow
        Write-Host ""
    }

    # Check if host is placeholder
    if ($hostPort -match "HOST|PORT") {
        Write-Host "WARNING: Host/Port appears to contain placeholders!" -ForegroundColor Red
        Write-Host "  Make sure you've replaced HOST and PORT with actual values" -ForegroundColor Yellow
        Write-Host ""
    }
}

Write-Host "Common authentication issues:" -ForegroundColor Yellow
Write-Host "  1. Wrong username or password" -ForegroundColor White
Write-Host "  2. Password contains special characters that need URL encoding" -ForegroundColor White
Write-Host "  3. Database user doesn't have access to the database" -ForegroundColor White
Write-Host "  4. Database server is not accessible from your network" -ForegroundColor White
Write-Host "  5. SSL/TLS connection issues" -ForegroundColor White
Write-Host ""

Write-Host "Solutions:" -ForegroundColor Green
Write-Host "  1. Verify credentials in your database provider dashboard:" -ForegroundColor White
Write-Host "     - Neon: https://console.neon.tech/" -ForegroundColor Cyan
Write-Host "     - Supabase: https://supabase.com/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Try resetting the database password:" -ForegroundColor White
Write-Host "     - Generate a new password in your provider dashboard" -ForegroundColor White
Write-Host "     - Update DATABASE_URL in .env file" -ForegroundColor White
Write-Host ""
Write-Host "  3. Check if password needs URL encoding:" -ForegroundColor White
Write-Host "     - Special characters (@, #, $, %, &, etc.) must be URL-encoded" -ForegroundColor White
Write-Host "     - Use .\scripts\fix-db-url.ps1 to check" -ForegroundColor Yellow
Write-Host ""
Write-Host "  4. Verify database is accessible:" -ForegroundColor White
Write-Host "     - Check if database is running" -ForegroundColor White
Write-Host "     - Check firewall/network settings" -ForegroundColor White
Write-Host "     - For Neon: Ensure connection pooling is configured correctly" -ForegroundColor White
Write-Host ""

Write-Host "To test with Prisma:" -ForegroundColor Yellow
Write-Host "  npx prisma db pull" -ForegroundColor White
Write-Host "  (This will test the connection)" -ForegroundColor Gray
