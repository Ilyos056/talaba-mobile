# 📱 Talaba Rejasi — Android APK Qo'llanma

## Loyiha tuzilmasi
```
talaba-mobile/
├── android/          ← Android Studio loyihasi
├── www/              ← Web ilova fayllari
├── generate-icons.js ← Ikonka generatori
├── sync-web.js       ← Web → Android nusxalagich
└── capacitor.config.json
```

---

## 1️⃣ Android Studio o'rnatish (birinchi marta)

1. **Java JDK 17** yuklab oling:
   → https://adoptium.net/temurin/releases/?version=17
   - Windows x64 `.msi` faylini oching va o'rnating

2. **Android Studio** yuklab oling:
   → https://developer.android.com/studio
   - O'rnatish paytida "Android SDK" ni belgilang
   - Birinchi ochilishda SDK o'rnatish qadamlarini bajaring

3. **Environment variables** (o'rnatgandan keyin):
   - `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-17...`
   - `ANDROID_HOME` = `C:\Users\<siz>\AppData\Local\Android\Sdk`
   - PATH ga qo'shing: `%ANDROID_HOME%\platform-tools`

---

## 2️⃣ Loyihani Android Studio da ochish

```powershell
# Terminal da:
cd C:\Users\ilyos\talaba-mobile
npm run sync        # web fayllarni sinxronlashtirish
npm run open        # Android Studio da ochish
```

Yoki Android Studio > **Open** > `C:\Users\ilyos\talaba-mobile\android` papkasini tanlang.

---

## 3️⃣ Debug APK yaratish (test uchun)

Android Studio da:
1. `Build` menyu → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. Tayyor bo'lgach: `app/build/outputs/apk/debug/app-debug.apk`

Yoki terminal da (Android Studio o'rnatilgan bo'lsa):
```powershell
cd C:\Users\ilyos\talaba-mobile\android
.\gradlew.bat assembleDebug
```

---

## 4️⃣ Release APK (Play Store uchun)

### Keystore yaratish:
```powershell
keytool -genkey -v -keystore talaba-release.jks `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias talaba
```

### `android/app/build.gradle` ga qo'shing:
```groovy
android {
  signingConfigs {
    release {
      storeFile file('../../talaba-release.jks')
      storePassword 'SIZNING_PAROL'
      keyAlias 'talaba'
      keyPassword 'SIZNING_PAROL'
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
    }
  }
}
```

### Release APK build:
```powershell
cd C:\Users\ilyos\talaba-mobile\android
.\gradlew.bat assembleRelease
# Natija: app/build/outputs/apk/release/app-release.apk
```

---

## 5️⃣ Web ilovani yangilagandan keyin

```powershell
cd C:\Users\ilyos\talaba-mobile
node sync-web.js
# Keyin Android Studio da Run tugmasini bosing
```

---

## 6️⃣ Telefoningizda sinab ko'rish (USB)

1. Telefoningizda **Developer Options** yoqing:
   - Sozlamalar → Qurilma haqida → Build number → 7 marta bosing
2. **USB Debugging** ni yoqing
3. USB bilan ulang
4. Android Studio da **Run** ▶ tugmasini bosing

---

## 7️⃣ APK ni to'g'ridan telefonga o'rnatish

1. `app-debug.apk` faylini telefoningizga ko'chiring
2. Telefonda: Sozlamalar → Xavfsizlik → **Noma'lum manbalar** yoqing
3. APK faylni oching va o'rnating

---

## Muammolar

| Xato | Yechim |
|------|--------|
| `JAVA_HOME not set` | JDK o'rnating, JAVA_HOME belgilang |
| `SDK not found` | Android Studio → SDK Manager da API 34 o'rnating |
| `Gradle sync failed` | Android Studio → File → Sync Project with Gradle |
| `Build failed` | `android/gradlew.bat clean` keyin qayta build |

---

## APK hajmi taxminan: ~5-8 MB
## Minimum Android: 5.1+ (API 22)
## Maqsadli Android: 14 (API 34)
