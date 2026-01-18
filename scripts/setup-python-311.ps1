# Setup Python 3.11 and pip for current PowerShell session
# This script adds Python 3.11 to PATH for the current session (with priority)

$python311Path = "C:\Users\-\AppData\Local\Programs\Python\Python311"
$python311ScriptsPath = "$python311Path\Scripts"

# Remove all Python paths from current PATH
$pathArray = $env:PATH -split ';' | Where-Object { $_ -and $_ -notlike '*Python*' }

# Add Python 3.11 paths at the beginning (highest priority)
$env:PATH = "$python311Path;$python311ScriptsPath;" + ($pathArray -join ';')

Write-Host "[OK] Python 3.11 set as primary Python in PATH for current session" -ForegroundColor Green

# Verify installation
Write-Host ""
Write-Host "Verifying Python 3.11 installation..." -ForegroundColor Cyan
& "$python311Path\python.exe" --version
& "$python311Path\python.exe" -m pip --version

Write-Host ""
Write-Host "Python 3.11 is now available as 'python' and 'pip' in this session" -ForegroundColor Green
Write-Host "Note: This only affects the current PowerShell session." -ForegroundColor Yellow
Write-Host "To make it permanent, add to System Environment Variables:" -ForegroundColor Yellow
Write-Host "  $python311Path"
Write-Host "  $python311ScriptsPath"
