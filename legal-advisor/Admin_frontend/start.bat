@echo off
echo ========================================
echo Legal Assistant Admin Panel - Startup
echo ========================================
echo.

echo Step 1: Starting Backend...
echo.
cd ..\backend
start cmd /k "python main.py"
timeout /t 3

echo.
echo Step 2: Starting Admin Frontend...
echo.
cd ..\Admin_frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo Both services starting...
echo.
echo Backend: http://localhost:8000
echo Admin Panel: http://localhost:5174
echo.
echo Login credentials:
echo Username: Shrishti
echo Password: 34567890@#
echo ========================================
pause
