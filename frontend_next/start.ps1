# Test Frontend Development Server
# Run this from frontend_next directory

Write-Host "🚀 Starting VeriFin Frontend..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "⚠ Dependencies not installed" -ForegroundColor Yellow
    Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "✓ Dependencies found" -ForegroundColor Green
}

# Check if .env.local exists
if (-Not (Test-Path ".env.local")) {
    Write-Host ""
    Write-Host "⚠ No .env.local file found" -ForegroundColor Yellow
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item .env.local.example .env.local
    Write-Host "✓ Created .env.local file" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠ Make sure backend is running at http://localhost:8000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Frontend Server Starting..." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Frontend URL: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend URL:  http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the development server
npm run dev
