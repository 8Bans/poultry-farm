Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Poultry Farm Management System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Activating Node.js 20.19.6..." -ForegroundColor Yellow
nvm use 20.19.6
Write-Host ""

Write-Host "Checking Node.js version..." -ForegroundColor Yellow
node -v
Write-Host ""

Write-Host "Checking npm version..." -ForegroundColor Yellow
npm -v
Write-Host ""

Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Open http://localhost:3000 in your browser" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
