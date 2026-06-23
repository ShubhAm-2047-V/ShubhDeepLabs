@echo off
title ShubDeepLabs Portfolio - Dev Server

echo.
echo =============================================
echo  ShubDeepLabs Portfolio - Starting Dev Server
echo =============================================
echo.

:: Check if node_modules exists, install if not
if not exist "node_modules\" (
    echo [*] node_modules not found. Installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed. Make sure Node.js is installed.
        pause
        exit /b 1
    )
    echo.
    echo [+] Dependencies installed successfully!
    echo.
)

echo [*] Starting Vite dev server...
echo.
call npm run dev -- --open

pause
