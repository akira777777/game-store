# Setup Python 3.11 and pip globally in System PATH
# Requires Administrator privileges

$python311Path = "C:\Users\-\AppData\Local\Programs\Python\Python311"
$python311ScriptsPath = "$python311Path\Scripts"

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "[WARNING] This script requires Administrator privileges" -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternatively, run: scripts\setup-python-311.ps1 (for current session only)" -ForegroundColor Cyan
    exit 1
}

Write-Host "Setting up Python 3.11 globally..." -ForegroundColor Cyan

# Get current system PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

# Check if already in PATH
if ($currentPath -notlike "*$python311Path*") {
    # Add Python 3.11 paths to system PATH
    $newPath = "$python311Path;$python311ScriptsPath;$currentPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")

    # Update current session PATH
    $env:PATH = "$python311Path;$python311ScriptsPath;$env:PATH"

    Write-Host "[OK] Python 3.11 added to System PATH" -ForegroundColor Green
}
else {
    Write-Host "[OK] Python 3.11 already in System PATH" -ForegroundColor Green
    $env:PATH = "$python311Path;$python311ScriptsPath;$env:PATH"
}

# Verify installation
Write-Host ""
Write-Host "Verifying Python 3.11 installation..." -ForegroundColor Cyan
python --version
python -m pip --version

Write-Host ""
Write-Host "[OK] Python 3.11 is now globally available as 'python' and 'pip'" -ForegroundColor Green
Write-Host "Note: You may need to restart Cursor/VS Code for changes to take effect." -ForegroundColor Yellow
