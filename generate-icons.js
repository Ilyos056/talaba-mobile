/**
 * Generates app icons and splash screens for Android using Canvas API
 * Run: node generate-icons.js
 */
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Icon sizes for Android mipmap folders
const ICONS = [
  { folder: 'mipmap-mdpi',    size: 48  },
  { folder: 'mipmap-hdpi',    size: 72  },
  { folder: 'mipmap-xhdpi',   size: 96  },
  { folder: 'mipmap-xxhdpi',  size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

// Splash screen sizes
const SPLASHES = [
  { folder: 'drawable-port-mdpi',    w: 320,  h: 480  },
  { folder: 'drawable-port-hdpi',    w: 480,  h: 800  },
  { folder: 'drawable-port-xhdpi',   w: 720,  h: 1280 },
  { folder: 'drawable-port-xxhdpi',  w: 960,  h: 1600 },
  { folder: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
  { folder: 'drawable-land-mdpi',    w: 480,  h: 320  },
  { folder: 'drawable-land-hdpi',    w: 800,  h: 480  },
  { folder: 'drawable-land-xhdpi',   w: 1280, h: 720  },
  { folder: 'drawable-land-xxhdpi',  w: 1600, h: 960  },
  { folder: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
];

const RES_DIR = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
const PRIMARY = '#6C63FF';
const PRIMARY_DARK = '#5A52D5';

function drawIcon(ctx, size) {
  const r = size * 0.22; // corner radius

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, PRIMARY);
  grad.addColorStop(1, PRIMARY_DARK);
  ctx.fillStyle = grad;

  // Rounded rect
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0); ctx.arcTo(size, 0, size, r, r);
  ctx.lineTo(size, size - r); ctx.arcTo(size, size, size - r, size, r);
  ctx.lineTo(r, size); ctx.arcTo(0, size, 0, size - r, r);
  ctx.lineTo(0, r); ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();
  ctx.fill();

  // Book emoji / icon
  ctx.font = `${size * 0.52}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📚', size / 2, size / 2);
}

function drawSplash(ctx, w, h) {
  // Background
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, PRIMARY);
  grad.addColorStop(1, PRIMARY_DARK);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Center icon
  const iconSize = Math.min(w, h) * 0.28;
  const cx = w / 2;
  const cy = h / 2 - iconSize * 0.15;

  // Icon background circle
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.arc(cx, cy, iconSize * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Emoji
  ctx.font = `${iconSize}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📚', cx, cy);

  // App name
  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.min(w, h) * 0.055}px sans-serif`;
  ctx.fillText('Talaba Rejasi', cx, cy + iconSize * 0.85);

  // Tagline
  ctx.font = `${Math.min(w, h) * 0.032}px sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText('Kunni rejalashtirib, muvaffaqiyatga eris!', cx, cy + iconSize * 1.18);
}

async function run() {
  let canvasLib;
  try {
    canvasLib = require('canvas');
    console.log('✅ canvas library found, generating PNG icons...');
  } catch {
    console.log('⚠️  canvas library not found. Run: npm install canvas');
    console.log('📌 Alternatively, use Android Studio to set icons manually.');
    generateSVGFallback();
    return;
  }

  const { createCanvas: cc } = canvasLib;

  // Generate icons
  for (const { folder, size } of ICONS) {
    const canvas = cc(size, size);
    const ctx = canvas.getContext('2d');
    drawIcon(ctx, size);
    const outDir = path.join(RES_DIR, folder);
    fs.mkdirSync(outDir, { recursive: true });
    ['ic_launcher', 'ic_launcher_round', 'ic_launcher_foreground'].forEach(name => {
      fs.writeFileSync(path.join(outDir, `${name}.png`), canvas.toBuffer('image/png'));
    });
    console.log(`✅ Icon: ${folder} (${size}x${size})`);
  }

  // Generate splashes
  for (const { folder, w, h } of SPLASHES) {
    const canvas = cc(w, h);
    const ctx = canvas.getContext('2d');
    drawSplash(ctx, w, h);
    const outDir = path.join(RES_DIR, folder);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'splash.png'), canvas.toBuffer('image/png'));
    console.log(`✅ Splash: ${folder} (${w}x${h})`);
  }

  // Also generate drawable (default)
  const defaultCanvas = cc(1080, 1920);
  drawSplash(defaultCanvas.getContext('2d'), 1080, 1920);
  fs.writeFileSync(path.join(RES_DIR, 'drawable', 'splash.png'), defaultCanvas.toBuffer('image/png'));
  console.log('✅ Default splash generated');

  console.log('\n🎉 Barcha ikonkalar va splash screenlar tayyor!');
  console.log('📱 Endi Android Studio da loyihani oching va APK build qiling.');
}

function generateSVGFallback() {
  // Generate a simple SVG icon as fallback
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6C63FF"/>
      <stop offset="1" stop-color="#5A52D5"/>
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="42" fill="url(#g)"/>
  <text x="96" y="115" font-size="90" text-anchor="middle" font-family="serif">📚</text>
</svg>`;
  fs.writeFileSync(path.join(__dirname, 'icon.svg'), svg);
  console.log('✅ icon.svg yaratildi (Android Studio da ishlatish uchun)');
}

run().catch(console.error);
