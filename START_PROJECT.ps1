# VeriFin Quick Start Script
# Starts both backend and frontend servers

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    VeriFin - Quick Start               ║" -ForegroundColor Cyan
Write-Host "║    Financial Intelligence Platform      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot

Write-Host "📂 Project root: $projectRoot" -ForegroundColor Gray
Write-Host ""

# Check Python
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Python not found! Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Node.js not found! Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Ask user what to start
Write-Host "What would you like to start?" -ForegroundColor White
Write-Host ""
Write-Host "  1. Backend only (FastAPI)" -ForegroundColor Yellow
Write-Host "  2. Frontend only (Next.js)" -ForegroundColor Yellow
Write-Host "  3. Both (recommended for testing)" -ForegroundColor Yellow
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

Write-Host ""

switch ($choice) {
    "1" {
        Write-Host "Starting backend..." -ForegroundColor Cyan
        Set-Location "$projectRoot\backend_fastapi"
        .\start.ps1
    }
    "2" {
        Write-Host "Starting frontend..." -ForegroundColor Cyan
        Write-Host "⚠ Make sure backend is running!" -ForegroundColor Yellow
        Set-Location "$projectRoot\frontend_next"
        .\start.ps1
    }
    "3" {
        Write-Host "Starting both servers..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Opening two new PowerShell windows..." -ForegroundColor Yellow
        Write-Host ""
        
        # Start backend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\backend_fastapi'; .\start.ps1"
        
        Start-Sleep -Seconds 2
        
        # Start frontend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\frontend_next'; .\start.ps1"
        
        Write-Host "✓ Both servers starting in separate windows" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access your application at:" -ForegroundColor White
        Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Cyan
        Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Press any key to exit this window..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit 1
    }
}
