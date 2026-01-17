# Clear VS Code Cache to fix PowerShell Extension issues
# This script safely clears VS Code workspace cache

Write-Host "Clearing VS Code cache..." -ForegroundColor Cyan

$cachePath = "$env:APPDATA\Code\User\workspaceStorage"
$workspacePath = Get-Location

if (Test-Path $cachePath) {
    Write-Host "Cache directory found: $cachePath" -ForegroundColor Green
    
    $folders = Get-ChildItem -Path $cachePath -Directory -ErrorAction SilentlyContinue
    
    if ($folders) {
        Write-Host "Found $($folders.Count) workspace cache folders" -ForegroundColor Yellow
        
        $deleted = 0
        foreach ($folder in $folders) {
            try {
                Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction Stop
                $deleted++
                Write-Host "  Deleted: $($folder.Name)" -ForegroundColor Gray
            } catch {
                Write-Host "  Failed to delete: $($folder.Name) - $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        Write-Host "`nDeleted $deleted cache folders successfully!" -ForegroundColor Green
    } else {
        Write-Host "No cache folders found to clean." -ForegroundColor Yellow
    }
} else {
    Write-Host "Cache directory not found: $cachePath" -ForegroundColor Red
}

# Also clear PowerShell Extension specific cache
$psCachePath = "$env:APPDATA\Code\User\globalStorage\ms-vscode.powershell"
if (Test-Path $psCachePath) {
    Write-Host "`nClearing PowerShell Extension cache..." -ForegroundColor Cyan
    try {
        Remove-Item -Path "$psCachePath\*" -Recurse -Force -ErrorAction Stop -Exclude "sessions"
        Write-Host "PowerShell Extension cache cleared!" -ForegroundColor Green
    } catch {
        Write-Host "Could not clear PowerShell Extension cache: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`nCache clearing complete!" -ForegroundColor Green
Write-Host "Please restart VS Code for changes to take effect." -ForegroundColor Yellow