# 🚂 Railway Deployment Script
# Автоматический деплой Game Store на Railway

Write-Host "🚂 Railway Deployment Script" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Проверка Railway CLI
Write-Host "📦 Checking Railway CLI..." -ForegroundColor Yellow
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Railway CLI not found!" -ForegroundColor Red
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Railway CLI" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Railway CLI ready" -ForegroundColor Green
Write-Host ""

# Проверка авторизации
Write-Host "🔐 Checking Railway authentication..." -ForegroundColor Yellow
$loginCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Railway" -ForegroundColor Red
    Write-Host "🔓 Opening browser for login..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please complete login in your browser, then return here." -ForegroundColor Cyan
    Write-Host ""

    railway login

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Authenticated" -ForegroundColor Green
Write-Host ""

# Проверка Git статуса
Write-Host "📋 Checking Git status..." -ForegroundColor Yellow
git status --short
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git error" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Спросить о коммите
$uncommitted = git status --short
if ($uncommitted) {
    Write-Host "⚠️  You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $uncommitted
    Write-Host ""
    $commit = Read-Host "Commit changes before deployment? (Y/n)"
    if ($commit -ne "n") {
        $message = Read-Host "Commit message (default: 'Pre-deployment updates')"
        if (-not $message) {
            $message = "Pre-deployment updates"
        }
        git add .
        git commit -m "$message"
    }
}
Write-Host ""

# Проверка проекта Railway
Write-Host "🔍 Checking Railway project..." -ForegroundColor Yellow
$projectCheck = railway status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  No Railway project linked" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Creating new Railway project..." -ForegroundColor Cyan
    Write-Host ""

    railway init

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create project" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "✅ Project created!" -ForegroundColor Green
    Write-Host ""

    # Добавить PostgreSQL
    Write-Host "🗄️  Adding PostgreSQL database..." -ForegroundColor Yellow
    railway add

    Write-Host ""
    Write-Host "✅ Database added!" -ForegroundColor Green
    Write-Host ""

    # Настроить environment variables
    Write-Host "⚙️  Setting up environment variables..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "IMPORTANT: Add these environment variables in Railway dashboard:" -ForegroundColor Red
    Write-Host ""
    Write-Host "NEXTAUTH_SECRET=f8a7c3e9d2b1f4a6e8c7d9b3f2a5e1c4d6b8f7a9c3e5d2b4f6a8c1e3d5b7f9a2" -ForegroundColor Cyan
    Write-Host 'NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opening Railway dashboard..." -ForegroundColor Yellow
    railway open
    Write-Host ""
    $ready = Read-Host "Press ENTER when you've added the variables"
}
Write-Host ""

# Деплой
Write-Host "🚀 Starting deployment..." -ForegroundColor Yellow
Write-Host ""
Write-Host "This will:" -ForegroundColor Cyan
Write-Host "  1. Upload your code to Railway" -ForegroundColor White
Write-Host "  2. Install dependencies (npm install)" -ForegroundColor White
Write-Host "  3. Generate Prisma client" -ForegroundColor White
Write-Host "  4. Build Next.js app (npm run build)" -ForegroundColor White
Write-Host "  5. Start the application" -ForegroundColor White
Write-Host ""
$deploy = Read-Host "Continue with deployment? (Y/n)"
if ($deploy -eq "n") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚂 Deploying to Railway..." -ForegroundColor Green
railway up

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check logs:" -ForegroundColor Yellow
    Write-Host "  railway logs" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""

# Миграции базы данных
Write-Host "🗄️  Running database migrations..." -ForegroundColor Yellow
railway run npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  Migration failed (you can run it later)" -ForegroundColor Yellow
}
Write-Host ""

# Получить URL
Write-Host "🌐 Getting deployment URL..." -ForegroundColor Yellow
railway domain

Write-Host ""
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update NEXTAUTH_URL in Railway dashboard with your actual domain" -ForegroundColor White
Write-Host "  2. Test your site" -ForegroundColor White
Write-Host "  3. Add to portfolio!" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  railway logs         - View deployment logs" -ForegroundColor White
Write-Host "  railway open         - Open Railway dashboard" -ForegroundColor White
Write-Host "  railway status       - Check deployment status" -ForegroundColor White
Write-Host ""
Write-Host "📊 View logs now? (Y/n)" -ForegroundColor Cyan
$logs = Read-Host
if ($logs -ne "n") {
    railway logs --follow
}
