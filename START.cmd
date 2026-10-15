@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. You can open index.html directly.
  pause
  exit /b 1
)
echo Open http://127.0.0.1:4173 in your browser.
echo Press Ctrl+C to stop the server.
node server.cjs
pause
