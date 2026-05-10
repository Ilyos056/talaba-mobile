# 📚 Talaba Rejasi — Student Planner PWA

Talabalar uchun kun rejalashtiruvchi Progressive Web App.

## ✨ Xususiyatlar

- 📅 **Bugungi jadval** — darslar timeline + hozirgi vaqt ko'rsatkichi
- 📋 **Ertangi reja** — avtomatik vaqt taqsimoti
- 📆 **Haftalik ko'rinish** — 7 kunlik jadval
- 📚 **Fanlar boshqaruvi** — ranglar, emoji, progress
- ⏱️ **Pomodoro taymer** — 3 rejim + sessiya tarixi
- 📝 **Imtihon hisoblagichi** — checklist bilan
- 📊 **Statistika** — Chart.js grafiklar
- 🌙 **Dark mode** + 6 rang mavzusi
- 🔔 **Bildirishnomalar** — dars boshlanishidan 10 daq. oldin
- 🎊 **Konfetti** — barcha vazifalar tugaganda
- 📤 **Eksport/Import** — JSON
- 📱 **PWA** — offline ishlash, telefonga o'rnatish

## 🚀 Ishga tushirish

```bash
# Faqat brauzerda ochish:
# index.html ni ikki marta bosing

# Yoki HTTP server orqali:
python -m http.server 3030
# http://localhost:3030
```

## 📁 Tuzilma

```
student-planner/
├── index.html       # Asosiy sahifa
├── css/style.css    # Stillar (~960 qator)
├── js/app.js        # Logika (~1560 qator)
├── manifest.json    # PWA manifest
└── sw.js            # Service Worker (offline)
```

## 🛠️ Texnologiya

- Vanilla JavaScript (ES6+)
- CSS Variables + Flexbox/Grid
- Chart.js (CDN)
- LocalStorage
- Service Worker
- Web Notifications API

## 📱 Mobile App

Bu loyihaning Android versiyasi: [talaba-mobile](https://github.com/Ilyos056/talaba-mobile)

## 📝 Litsenziya

MIT

---

Ilyos056 tomonidan Claude Code yordamida yaratilgan
