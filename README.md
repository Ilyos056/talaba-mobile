# 📱 Talaba Rejasi — Android App

[Student Planner PWA](https://github.com/Ilyos056/student-planner) ning native Android versiyasi (Capacitor orqali).

## 🚀 Build qilish

### Talablar
- Node.js 18+
- Android Studio (JDK 21 ichida keladi)

### ⚡ Eng oson yo'l — bitta komanda

**Windows (cmd.exe):**
```
update-apk.bat
```

**Windows (PowerShell):**
```powershell
.\update-apk.ps1
```

Skript avtomatik:
1. Web fayllarni sync qiladi
2. APK build qiladi
3. Fayl manzilini ko'rsatadi va papkani ochadi

### Qo'lda build qilish

```bash
# 1. Dependencies o'rnatish
npm install

# 2. Ikonkalar va splash screen yaratish
npm run icons

# 3. Web fayllarni Android ga sync qilish
npm run sync

# 4. Android Studio da ochish
npm run open
```

Android Studio da: **Build → Build APK(s)**

Yoki terminal orqali:
```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
cd android
.\gradlew.bat assembleDebug
```

APK joyi: `android/app/build/outputs/apk/debug/app-debug.apk`

## 📁 Tuzilma

```
talaba-mobile/
├── android/              # Capacitor Android loyihasi
├── www/                  # Web ilova fayllari
├── generate-icons.js     # Ikonka generatori
├── sync-web.js           # student-planner → www sync
├── capacitor.config.json # Capacitor sozlamalari
└── QULLANMA.md           # To'liq qo'llanma
```

## 🛠️ Texnologiya

- [Capacitor](https://capacitorjs.com) 8.x
- Android SDK
- Gradle
- node-canvas (ikonka generatsiya uchun)

## 📦 APK haqida

- **Hajmi:** ~4.6 MB
- **Min Android:** 5.1+ (API 22)
- **Target:** Android 14 (API 34)
- **Package:** `uz.talaba.rejasi`

## 🌐 Web versiya

[student-planner](https://github.com/Ilyos056/student-planner) — PWA versiyasi.

---

Ilyos056 tomonidan Claude Code yordamida yaratilgan
