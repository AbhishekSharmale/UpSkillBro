@echo off
echo ========================================
echo   UpskillBro Authentication Setup
echo ========================================
echo.

echo Installing dependencies...
call npm install

echo.
echo Setup complete! 
echo.
echo To start the server:
echo   npm start
echo.
echo To start in development mode:
echo   npm run dev
echo.
echo Don't forget to:
echo 1. Update MongoDB connection string in .env file
echo 2. Change JWT_SECRET in .env file
echo 3. Configure email settings for verification (optional)
echo.
echo Server will run on: http://localhost:3000
echo.
pause