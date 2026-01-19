# Setup Ollama for current PowerShell session and Local Agent integration

Write-Host "Setting up Ollama..." -ForegroundColor Cyan
Write-Host ""

# Ollama path
$ollamaPath = "C:\Users\-\AppData\Local\Programs\Ollama"

# Check if Ollama exists
if (Test-Path $ollamaPath) {
    Write-Host "[OK] Ollama found at: $ollamaPath" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Ollama not found!" -ForegroundColor Red
    Write-Host "Please install Ollama from: https://ollama.com/download" -ForegroundColor Yellow
    exit 1
}

# Add to PATH for current session
$env:PATH = "$ollamaPath;$env:PATH"
Write-Host "[OK] Ollama added to PATH for current session" -ForegroundColor Green

# Check version
Write-Host ""
Write-Host "Checking Ollama version..." -ForegroundColor Cyan
& ollama --version

# Check if Ollama service is running
Write-Host ""
Write-Host "Checking Ollama service..." -ForegroundColor Cyan

$ollamaRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
    $ollamaRunning = $true
    Write-Host "[OK] Ollama service is running" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Ollama service is not running" -ForegroundColor Yellow
    Write-Host "Starting Ollama service..." -ForegroundColor Gray
    
    # Start Ollama in background
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
        Write-Host "[OK] Ollama service started successfully" -ForegroundColor Green
        $ollamaRunning = $true
    } catch {
        Write-Host "[ERROR] Failed to start Ollama service" -ForegroundColor Red
        Write-Host "Try manually: ollama serve" -ForegroundColor Yellow
    }
}

# List available models
if ($ollamaRunning) {
    Write-Host ""
    Write-Host "Available Ollama models:" -ForegroundColor Cyan
    & ollama list
    
    Write-Host ""
    Write-Host "Recommended models for coding:" -ForegroundColor Cyan
    Write-Host "  - qwen2.5-coder:7b    (Best for coding, 7B params)" -ForegroundColor Gray
    Write-Host "  - qwen2:7b            (General purpose, 7B params)" -ForegroundColor Gray
    Write-Host "  - qwen:1.8b           (Lightweight, 1.8B params)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To download a model:" -ForegroundColor Yellow
    Write-Host "  ollama pull qwen2.5-coder:7b" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Green
Write-Host "[SUCCESS] Ollama setup complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green
