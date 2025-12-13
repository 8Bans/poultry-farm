@echo off
echo ========================================
echo Poultry Farm Management System
echo ========================================
echo.

echo Activating Node.js 20.19.6...
call nvm use 20.19.6
echo.

echo Checking Node.js version...
node -v
echo.

echo Checking npm version...
npm -v
echo.

echo Starting development server...
echo Open http://localhost:3000 in your browser
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
