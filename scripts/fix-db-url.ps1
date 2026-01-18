# Script to help fix DATABASE_URL format issues
# Usage: .\scripts\fix-db-url.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DATABASE_URL Format Fixer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    exit 1
}

$content = Get-Content $envFile -Raw -Encoding UTF8
$lines = Get-Content $envFile -Encoding UTF8

Write-Host "Checking DATABASE_URL format..." -ForegroundColor Yellow
Write-Host ""

# Find DATABASE_URL line
$dbUrlLineIndex = -1
$dbUrlLine = $null

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "^DATABASE_URL\s*=") {
        $dbUrlLineIndex = $i
        $dbUrlLine = $lines[$i]
        break
    }
}

if ($dbUrlLineIndex -eq -1) {
    Write-Host "ERROR: DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

Write-Host "Current DATABASE_URL line:" -ForegroundColor Yellow
Write-Host "  $dbUrlLine" -ForegroundColor Gray
Write-Host ""

# Extract URL value
$dbUrl = $dbUrlLine -replace "^DATABASE_URL\s*=\s*", "" -replace "['`"]", ""

Write-Host "Extracted URL: $dbUrl" -ForegroundColor Cyan
Write-Host ""

# Check for common issues
$issues = @()

if ($dbUrl -match "^file:") {
    $issues += "SQLite format detected (file:). Need PostgreSQL format."
}

if ($dbUrl -notmatch "^postgresql://|^postgres://") {
    $issues += "URL does not start with postgresql:// or postgres://"
}

# Check for port issues
if ($dbUrl -match "postgresql://|postgres://") {
    # Extract host:port part
    if ($dbUrl -match "@([^/]+)/") {
        $hostPort = $matches[1]
        Write-Host "Host:Port part: $hostPort" -ForegroundColor Cyan

        if ($hostPort -match ":") {
            $parts = $hostPort -split ":"
            $port = $parts[1]

            if ($port -match "[^0-9]") {
                $issues += "Port contains non-numeric characters: $port"
            } elseif ($port -eq "") {
                $issues += "Port is empty after colon"
            } elseif ([int]$port -lt 1 -or [int]$port -gt 65535) {
                $issues += "Port number out of range: $port"
            }
        }
    }

    # Check for special characters that need encoding
    if ($dbUrl -match "[@#\$%^&*()+=\[\]{}|\\:;'`"<>?,]") {
        $issues += "URL contains special characters that may need encoding"
    }
}

# Check for password encoding issues
if ($dbUrl -match "postgresql://|postgres://") {
    if ($dbUrl -match "://([^:]+):([^@]+)@") {
        $password = $matches[2]
        if ($password -match "[@#\$%^&*()+=\[\]{}|\\:;'`"<>?,]") {
            Write-Host "WARNING: Password contains special characters that may need URL encoding" -ForegroundColor Yellow
            Write-Host "  Special characters in passwords should be URL-encoded:" -ForegroundColor Yellow
            Write-Host "    @ -> %40" -ForegroundColor White
            Write-Host "    # -> %23" -ForegroundColor White
            Write-Host "    $ -> %24" -ForegroundColor White
            Write-Host "    % -> %25" -ForegroundColor White
            Write-Host "    & -> %26" -ForegroundColor White
            Write-Host "    + -> %2B" -ForegroundColor White
            Write-Host "    = -> %3D" -ForegroundColor White
            Write-Host "    : -> %3A" -ForegroundColor White
            Write-Host "    / -> %2F" -ForegroundColor White
            Write-Host "    ? -> %3F" -ForegroundColor White
            Write-Host ""
        }
    }
}

if ($issues.Count -eq 0) {
    Write-Host "OK: No obvious format issues detected" -ForegroundColor Green
    Write-Host ""
    Write-Host "If you're still getting errors, try:" -ForegroundColor Yellow
    Write-Host "  1. Ensure password is URL-encoded if it contains special characters" -ForegroundColor White
    Write-Host "  2. Check that port number is valid (1-65535)" -ForegroundColor White
    Write-Host "  3. Verify connection string from your database provider" -ForegroundColor White
} else {
    Write-Host "Issues found:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "  - $issue" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "  1. For Neon/Supabase: Copy Connection String directly from dashboard" -ForegroundColor White
    Write-Host "  2. Ensure format: postgresql://user:password@host:port/db?sslmode=require" -ForegroundColor White
    Write-Host "  3. URL-encode special characters in password" -ForegroundColor White
    Write-Host ""
    Write-Host "Example correct format:" -ForegroundColor Cyan
    Write-Host '  DATABASE_URL="postgresql://user:password123@ep-xxx-xxx.us-east-2.aws.neon.tech:5432/dbname?sslmode=require"' -ForegroundColor White
}

Write-Host ""
Write-Host "To manually edit .env file, run:" -ForegroundColor Yellow
Write-Host "  notepad .env" -ForegroundColor White
