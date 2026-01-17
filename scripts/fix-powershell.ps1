# Fix PowerShell Extension Issues
# This script checks and fixes common PowerShell Extension problems

Write-Host "Checking PowerShell Execution Policy..." -ForegroundColor Cyan

$currentPolicy = Get-ExecutionPolicy -Scope CurrentUser
Write-Host "Current Execution Policy: $currentPolicy" -ForegroundColor Yellow

if ($currentPolicy -eq "Restricted") {
    Write-Host "Execution Policy is Restricted. Setting to RemoteSigned..." -ForegroundColor Yellow
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "Execution Policy updated successfully!" -ForegroundColor Green
} else {
    Write-Host "Execution Policy is acceptable: $currentPolicy" -ForegroundColor Green
}

Write-Host "`nChecking PowerShell version..." -ForegroundColor Cyan
$psVersion = $PSVersionTable.PSVersion
Write-Host "PowerShell Version: $psVersion" -ForegroundColor Green

Write-Host "`nChecking available PowerShell installations..." -ForegroundColor Cyan
$psInstalls = Get-Command powershell -ErrorAction SilentlyContinue
if ($psInstalls) {
    Write-Host "PowerShell found at: $($psInstalls.Source)" -ForegroundColor Green
} else {
    Write-Host "PowerShell not found in PATH!" -ForegroundColor Red
}

Write-Host "`nPowerShell Extension Diagnostics Complete!" -ForegroundColor Green
Write-Host "If issues persist, try:" -ForegroundColor Yellow
Write-Host "  1. Restart VS Code" -ForegroundColor White
Write-Host "  2. Clear VS Code cache: Remove-Item -Path `"`$env:APPDATA\Code\User\workspaceStorage\*`" -Recurse -Force" -ForegroundColor White
Write-Host "  3. Reinstall PowerShell Extension" -ForegroundColor White
