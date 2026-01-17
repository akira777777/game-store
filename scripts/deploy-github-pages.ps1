# GitHub Pages Deployment Helper Script
# This script helps prepare and deploy the birthday card to GitHub Pages

Write-Host "🚀 GitHub Pages Deployment Helper" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if git repository exists
if (!(Test-Path ".git")) {
    Write-Host "❌ Error: Not a git repository. Please initialize git first." -ForegroundColor Red
    exit 1
}

# Check git status
Write-Host "📋 Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $gitStatus
    Write-Host ""
    $commit = Read-Host "Do you want to commit these changes? (y/n)"
    if ($commit -eq "y" -or $commit -eq "Y") {
        $commitMessage = Read-Host "Enter commit message"
        git add .
        git commit -m "$commitMessage"
        Write-Host "✅ Changes committed" -ForegroundColor Green
    }
}
else {
    Write-Host "✅ Working directory is clean" -ForegroundColor Green
}

# Check if remote exists
$remote = git remote -v
if (!$remote) {
    Write-Host "❌ Error: No git remote configured" -ForegroundColor Red
    Write-Host "Please add a GitHub remote:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Cyan
    exit 1
}

Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your GitHub repository" -ForegroundColor White
    Write-Host "2. Click Settings → Pages" -ForegroundColor White
    Write-Host "3. Set Source to 'GitHub Actions'" -ForegroundColor White
    Write-Host "4. The deployment will start automatically" -ForegroundColor White
    Write-Host ""
}
else {
    else {
        Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
        exit 1
    }
