# Backend Setup Script for Windows PowerShell
# This script helps set up the Python backend

Write-Host "=== CareerOS Backend Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking for Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Python from:" -ForegroundColor Yellow
    Write-Host "  https://www.python.org/downloads/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANT: Check 'Add Python to PATH' during installation!" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Check if pip is available
Write-Host "Checking for pip..." -ForegroundColor Yellow
try {
    $pipVersion = pip --version 2>&1
    Write-Host "✓ Found: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ pip not found, trying python -m pip..." -ForegroundColor Yellow
    try {
        $pipVersion = python -m pip --version 2>&1
        Write-Host "✓ Found pip via python -m pip" -ForegroundColor Green
        $usePythonMPip = $true
    } catch {
        Write-Host "✗ pip is not available" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Installing dependencies from requirements.txt..." -ForegroundColor Yellow

# Install dependencies
if ($usePythonMPip) {
    python -m pip install -r requirements.txt
} else {
    pip install -r requirements.txt
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the server, run:" -ForegroundColor Cyan
    Write-Host "  python server.py" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Installation failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}
