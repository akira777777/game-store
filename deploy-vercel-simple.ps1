# Vercel Deployment Script
# Quick deploy for Game Store

Write-Host "Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check Vercel CLI
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI not found! Installing..." -ForegroundColor Red
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Vercel CLI ready" -ForegroundColor Green
Write-Host ""

# Check Git status
Write-Host "Checking Git status..." -ForegroundColor Yellow
$uncommitted = git status --short
if ($uncommitted) {
    Write-Host "You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $uncommitted
    Write-Host ""
    $commit = Read-Host "Commit changes before deployment? (Y/n)"
    if ($commit -ne "n") {
        $message = Read-Host "Commit message (default: Pre-deployment updates)"
        if (-not $message) {
            $message = "Pre-deployment updates"
        }
        git add .
        git commit -m "$message"
    }
}
Write-Host ""

# Deployment type
Write-Host "Deployment type:" -ForegroundColor Yellow
Write-Host "  1. Preview (testing URL)" -ForegroundColor White
Write-Host "  2. Production (main site)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Choose (1/2, default: 1)"

if ($choice -eq "2") {
    Write-Host ""
    Write-Host "Deploying to PRODUCTION..." -ForegroundColor Green
    Write-Host ""
    vercel --prod
}
else {
    Write-Host ""
    Write-Host "Deploying PREVIEW..." -ForegroundColor Cyan
    Write-Host ""
    vercel
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Configure environment variables" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Settings -> Environment Variables" -ForegroundColor White
Write-Host "4. Add these variables:" -ForegroundColor White
Write-Host ""
Write-Host "DATABASE_URL=postgresql://..." -ForegroundColor Gray
Write-Host "NEXTAUTH_SECRET=f8a7c3e9d2b1f4a6e8c7d9b3f2a5e1c4d6b8f7a9c3e5d2b4f6a8c1e3d5b7f9a2" -ForegroundColor Gray
Write-Host "NEXTAUTH_URL=https://your-app.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Redeploy after adding variables:" -ForegroundColor White
Write-Host "   vercel --prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "For database, use Neon (free): https://neon.tech" -ForegroundColor Yellow
Write-Host ""
