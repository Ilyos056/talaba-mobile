# Talaba Rejasi - APK Update Script (PowerShell)
# Usage: .\update-apk.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   📱 Talaba Rejasi — APK Yangilagich     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# === 1. Web sync ===
Write-Host "[1/3] 🔄 Web fayllarni sinxronlash..." -ForegroundColor Yellow
try {
  node sync-web.js
  if ($LASTEXITCODE -ne 0) { throw "Sync failed" }
} catch {
  Write-Host "❌ Sync xato: $_" -ForegroundColor Red
  Read-Host "Davom etish uchun Enter"
  exit 1
}

# === 2. JAVA_HOME ===
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
if (-not (Test-Path "$env:JAVA_HOME\bin\java.exe")) {
  Write-Host "❌ Android Studio JBR topilmadi: $env:JAVA_HOME" -ForegroundColor Red
  Write-Host "   Iltimos Android Studio o'rnatilganini tekshiring." -ForegroundColor Red
  Read-Host "Davom etish uchun Enter"
  exit 1
}
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# === 3. Build APK ===
Write-Host ""
Write-Host "[2/3] 🔨 APK build qilinmoqda... (~30 soniya)" -ForegroundColor Yellow
Push-Location android
try {
  & .\gradlew.bat assembleDebug
  if ($LASTEXITCODE -ne 0) { throw "Build failed" }
} catch {
  Write-Host ""
  Write-Host "❌ Build xato: $_" -ForegroundColor Red
  Pop-Location
  Read-Host "Davom etish uchun Enter"
  exit 1
} finally {
  Pop-Location
}

# === 4. Result ===
$apkPath = Join-Path $PSScriptRoot "android\app\build\outputs\apk\debug\app-debug.apk"
$apkDir  = Split-Path $apkPath
$apkSize = if (Test-Path $apkPath) {
  [math]::Round((Get-Item $apkPath).Length / 1MB, 2)
} else { "?" }

Write-Host ""
Write-Host "[3/3] ✅ Tayyor!" -ForegroundColor Green
Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         🎉 APK muvaffaqiyatli!           ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📦 APK fayl ($apkSize MB):" -ForegroundColor White
Write-Host "   $apkPath" -ForegroundColor Gray
Write-Host ""
Write-Host "📲 Telefoningizga yuborish:" -ForegroundColor White
Write-Host "   1) Yuqoridagi faylni Telegram Saved Messages ga yuboring" -ForegroundColor Gray
Write-Host "   2) Telefonda yuklab oling va o'rnating" -ForegroundColor Gray
Write-Host "   3) 'Update qilasizmi?' — HA ni bosing" -ForegroundColor Gray
Write-Host ""

$open = Read-Host "Fayl papkasini ochaymi? (y/n)"
if ($open -eq 'y' -or $open -eq 'Y') {
  Start-Process explorer.exe -ArgumentList $apkDir
}

Write-Host ""
