# Setup script for Local Agent with Python 3.11
# This script installs all dependencies and prepares the environment

Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Local AI Agent Setup (Python 3.11)" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Python 3.11
Write-Host "[1/5] Checking Python 3.11..." -ForegroundColor Yellow
$pythonVersion = & py -3.11 --version 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Python 3.11 not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.11 from https://python.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] $pythonVersion" -ForegroundColor Green
Write-Host ""

# Step 2: Setup Python 3.11 in PATH
Write-Host "[2/5] Setting up Python 3.11 in PATH..." -ForegroundColor Yellow
$python311Path = py -3.11 -c "import sys; print(sys.executable)"
$python311Dir = Split-Path -Parent $python311Path
$python311ScriptsDir = Join-Path $python311Dir "Scripts"

$env:PATH = "$python311Dir;$python311ScriptsDir;$env:PATH"
Write-Host "[OK] Python 3.11 set as default for this session" -ForegroundColor Green
Write-Host ""

# Step 3: Upgrade pip
Write-Host "[3/5] Upgrading pip..." -ForegroundColor Yellow
& python -m pip install --upgrade pip --quiet
Write-Host "[OK] pip upgraded" -ForegroundColor Green
Write-Host ""

# Step 4: Install dependencies
Write-Host "[4/5] Installing Python dependencies..." -ForegroundColor Yellow
Write-Host "This may take several minutes..." -ForegroundColor Gray
Write-Host ""

$requirementsFile = "requirements.txt"
if (Test-Path $requirementsFile) {
    Write-Host "Installing from $requirementsFile..." -ForegroundColor Gray
    & python -m pip install -r $requirementsFile

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies!" -ForegroundColor Red
        Write-Host "Try installing manually: python -m pip install -r requirements.txt" -ForegroundColor Yellow
        exit 1
    }

    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] requirements.txt not found!" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Check model directory
Write-Host "[5/5] Checking model directory..." -ForegroundColor Yellow
$modelsDir = "models"

if (-not (Test-Path $modelsDir)) {
    New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null
    Write-Host "[OK] Created models directory" -ForegroundColor Green
}
else {
    Write-Host "[OK] Models directory exists" -ForegroundColor Green
}

# Check if any models are downloaded
$modelFiles = Get-ChildItem -Path $modelsDir -Recurse -Filter "config.json" -ErrorAction SilentlyContinue
if ($modelFiles.Count -eq 0) {
    Write-Host ""
    Write-Host "[WARNING] No models found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To download a model, run:" -ForegroundColor Cyan
    Write-Host "  python download_model.py --model qwen2.5-coder-7b-awq" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Available models:" -ForegroundColor Cyan
    Write-Host "  - qwen-1.8b               (Light, ~4GB VRAM)" -ForegroundColor Gray
    Write-Host "  - qwen2.5-coder-7b-awq    (Recommended, ~8GB VRAM)" -ForegroundColor Gray
    Write-Host "  - qwen2.5-coder-14b-awq   (Advanced, ~16GB VRAM)" -ForegroundColor Gray
    Write-Host ""
}
else {
    Write-Host "[OK] Found model(s) in models directory" -ForegroundColor Green
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "[SUCCESS] Setup complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Download a model (if not done yet):" -ForegroundColor Gray
Write-Host "     python download_model.py --model qwen2.5-coder-7b-awq" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Run the agent:" -ForegroundColor Gray
Write-Host "     python run.py           (Interactive mode)" -ForegroundColor Gray
Write-Host "     python server.py        (API server mode)" -ForegroundColor Gray
Write-Host ""
Write-Host "For more information, see README.md" -ForegroundColor Gray
Write-Host ""
