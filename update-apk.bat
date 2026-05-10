@echo off
chcp 65001 >nul
setlocal

echo.
echo ╔══════════════════════════════════════════╗
echo ║   📱 Talaba Rejasi — APK Yangilagich     ║
echo ╚══════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM === 1. Web fayllarni sync qilish ===
echo [1/3] 🔄 Web fayllarni sinxronlash...
node sync-web.js
if errorlevel 1 (
  echo ❌ Sync xato!
  pause
  exit /b 1
)

REM === 2. JAVA_HOME ni Android Studio JBR ga sozlash ===
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
if not exist "%JAVA_HOME%\bin\java.exe" (
  echo ❌ Android Studio JBR topilmadi: %JAVA_HOME%
  echo    Iltimos Android Studio o'rnatilganini tekshiring.
  pause
  exit /b 1
)
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM === 3. APK build ===
echo.
echo [2/3] 🔨 APK build qilinmoqda... (~30 soniya)
cd android
call gradlew.bat assembleDebug
set BUILD_RESULT=%errorlevel%
cd ..

if %BUILD_RESULT% neq 0 (
  echo.
  echo ❌ Build xato!
  pause
  exit /b 1
)

REM === 4. Yakun ===
echo.
echo [3/3] ✅ Tayyor!
echo.
echo ╔══════════════════════════════════════════╗
echo ║         🎉 APK muvaffaqiyatli!           ║
echo ╚══════════════════════════════════════════╝
echo.
echo 📦 APK fayl:
echo    %~dp0android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 📲 Telefoningizga yuborish:
echo    1) Yuqoridagi faylni Telegram Saved Messages ga yuboring
echo    2) Telefonda yuklab oling va o'rnating
echo    3) "Update qilasizmi?" — HA ni bosing
echo.

REM Faylni ochib ko'rsatish (papkani Explorer'da ochish)
set APK_DIR=%~dp0android\app\build\outputs\apk\debug
set /p OPEN="Fayl papkasini ochaymi? (y/n): "
if /i "%OPEN%"=="y" explorer "%APK_DIR%"

echo.
pause
