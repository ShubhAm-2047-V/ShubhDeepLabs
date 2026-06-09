@echo off
title ProjectHub Solutions - Dev Server Launcher
echo ==========================================================
echo   ProjectHub Solutions Dev Server Launcher
echo ==========================================================
echo.

:: Detect if Bun is installed and working
where bun >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Clearing Next.js cache to load new backend updates...
    if exist .next rmdir /s /q .next
    echo [INFO] Bun detected. Launching server using Bun...
    echo [INFO] Automatically opening http://localhost:3000 in your browser...
    timeout /t 2 /nobreak >nul
    start http://localhost:3000
    bun run dev
) else (
    echo [WARNING] Bun not detected. Checking for npm...
    where npm >nul 2>nul
    if %errorlevel% equ 0 (
        echo [INFO] Clearing Next.js cache to load new backend updates...
        if exist .next rmdir /s /q .next
        echo [INFO] npm detected. Launching server using npm...
        echo [INFO] Automatically opening http://localhost:3000 in your browser...
        timeout /t 2 /nobreak >nul
        start http://localhost:3000
        npm run dev
    ) else (
        echo [ERROR] Neither Bun nor npm/Node.js was detected in your PATH.
        echo.
        echo Please ensure you have Node.js or Bun installed and added to your 
        echo System Environment variables.
        echo.
        pause
    )
)
