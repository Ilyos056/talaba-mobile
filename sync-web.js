/**
 * Web ilovadan o'zgarishlarni www/ ga nusxalaydi va Capacitor sync qiladi
 * Run: node sync-web.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, '..', 'student-planner');
const DEST = path.join(__dirname, 'www');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

console.log('📁 Web fayllarni nusxalash...');
try {
  copyDir(SRC, DEST);
  console.log(`✅ ${SRC} → ${DEST}`);
} catch (e) {
  console.error('❌ Nusxalash xatosi:', e.message);
  process.exit(1);
}

console.log('🔄 Capacitor sync...');
try {
  execSync('npx cap sync android', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Sync muvaffaqiyatli!');
} catch (e) {
  console.error('❌ Sync xatosi:', e.message);
}

console.log('\n✨ Hammasi tayyor! Android Studio da ishga tushiring.');
