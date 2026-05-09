'use strict';

// =============================================
// DATA LAYER
// =============================================
const STORAGE_KEY = 'studentPlanner_v2';

const defaultData = {
  subjects: [
    { id: 's1', name: 'Matematika',  color: '#6C63FF', icon: '📐' },
    { id: 's2', name: 'Fizika',      color: '#F59E0B', icon: '⚡' },
    { id: 's3', name: 'Kimyo',       color: '#10B981', icon: '🧪' },
    { id: 's4', name: 'Biologiya',   color: '#EF4444', icon: '🌿' },
    { id: 's5', name: 'Tarix',       color: '#8B5CF6', icon: '📜' },
    { id: 's6', name: 'Ingliz tili', color: '#3B82F6', icon: '🌍' },
  ],
  schedule: [],
  tasks: [],
  exams: [],
  pomodoroSessions: [],
  settings: {
    darkMode: false,
    pomodoroWork: 25,
    pomodoroBreak: 5,
    longBreak: 15,
    notifications: false,
    weeklyGoal: 20,
  },
  _demo: false,
};

// Demo data seeded once on first launch
function buildDemoData(data) {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  // Use current weekday + neighbours for demo classes so they appear in "today/tomorrow"
  const days1 = [1,3,5]; // Mon,Wed,Fri
  const days2 = [2,4];   // Tue,Thu
  data.schedule = [
    { id: 'c1', subjectId:'s1', startTime:'08:00', endTime:'09:30', room:'301-xona', teacher:'Prof. Karimov', classType:'lecture',  days: days1 },
    { id: 'c2', subjectId:'s2', startTime:'10:00', endTime:'11:30', room:'Lab-2',    teacher:'Dots. Yusupov', classType:'lab',      days: days2 },
    { id: 'c3', subjectId:'s6', startTime:'12:00', endTime:'13:00', room:'205-xona', teacher:'O\'q. Saidova',  classType:'practice', days: [1,2,3,4,5] },
    { id: 'c4', subjectId:'s3', startTime:'14:00', endTime:'15:30', room:'Kimyo-1',  teacher:'Prof. Nazarov', classType:'lecture',  days: [2,4] },
    { id: 'c5', subjectId:'s5', startTime:'16:00', endTime:'17:00', room:'404-xona', teacher:'Dots. Rашidova', classType:'seminar', days: [3,5] },
  ];
  const fmt = (d) => d.toISOString().slice(0,10);
  const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate()+n); return fmt(d); };
  data.tasks = [
    { id:'t1', title:"Matematika – 5-topshiriq",   subjectId:'s1', dueDate: addDays(1),  priority:'high',   description:'Differensial tenglamalar bo\'limidan masalalar', completed:false, createdAt: Date.now() },
    { id:'t2', title:"Ingliz tili – So'zlar yodlash", subjectId:'s6', dueDate: addDays(0), priority:'medium', description:'', completed:false, createdAt: Date.now() },
    { id:'t3', title:"Fizika – Laboratoriya hisobot", subjectId:'s2', dueDate: addDays(3), priority:'high',   description:'Grafik va hisob-kitob', completed:false, createdAt: Date.now() },
    { id:'t4', title:"Tarix – Referat",              subjectId:'s5', dueDate: addDays(7), priority:'low',    description:'XX asr mavzusida', completed:false, createdAt: Date.now() },
    { id:'t5', title:"Kimyo – Test tayyorlash",      subjectId:'s3', dueDate: addDays(-1),priority:'medium', description:'', completed:true,  createdAt: Date.now() },
  ];
  data.exams = [
    { id:'e1', subjectId:'s1', date: addDays(14), examTime:'09:00', examType:'yozma',   room:'301-xona', notes:'Integral va differensial hisobdan' },
    { id:'e2', subjectId:'s2', date: addDays(21), examTime:'10:00', examType:'og\'zaki', room:'Lab-2',    notes:'Mexanika va optika bo\'limlari' },
    { id:'e3', subjectId:'s6', date: addDays(30), examTime:'08:00', examType:'test',     room:'205-xona', notes:'Grammar + Vocabulary' },
  ];
  data._demo = true;
}

// =============================================
// APP OBJECT
// =============================================
const App = {

  data: null,
  currentPage: 'today',
  weekOffset: 0,
  pomodoroInterval: null,
  pomodoroSeconds: 0,
  pomodoroMode: 'work',
  pomodoroRunning: false,
  pomodoroSession: 0,
  selectedEmoji: '📐',
  charts: {},
  editingTaskId: null,
  editingClassId: null,
  notifTimers: [],
  clockInterval: null,
  deferredInstallPrompt: null,
  confettiAnimId: null,

  // ------------------------------------------
  // INIT
  // ------------------------------------------
  init() {
    this.loadData();
    this.applyTheme();
    this.updateHeader();
    this.startClock();
    this.renderToday();
    this.renderTomorrow();
    this.populateSubjectSelects();
    this.loadPomodoroSettings();
    this.setupListeners();
    this.generatePWAIcon();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      document.getElementById('installBanner').style.display = 'flex';
    });
  },

  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.data = JSON.parse(raw);
      } else {
        this.data = JSON.parse(JSON.stringify(defaultData));
        buildDemoData(this.data);
      }
      // Merge missing keys
      if (!this.data.subjects) this.data.subjects = defaultData.subjects;
      if (!this.data.schedule) this.data.schedule = [];
      if (!this.data.tasks) this.data.tasks = [];
      if (!this.data.exams) this.data.exams = [];
      if (!this.data.pomodoroSessions) this.data.pomodoroSessions = [];
      if (!this.data.settings) this.data.settings = { ...defaultData.settings };
    } catch {
      this.data = JSON.parse(JSON.stringify(defaultData));
      buildDemoData(this.data);
    }
    this.save();
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  },

  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  // ------------------------------------------
  // CLOCK
  // ------------------------------------------
  startClock() {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2,'0');
      const m = String(now.getMinutes()).padStart(2,'0');
      const el = document.getElementById('liveClock');
      if (el) el.textContent = `${h}:${m}`;
    };
    tick();
    this.clockInterval = setInterval(tick, 10000);
  },

  // ------------------------------------------
  // THEME
  // ------------------------------------------
  applyTheme() {
    const dark = this.data.settings.darkMode;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.getElementById('themeBtn').textContent = dark ? '☀️' : '🌙';
    const cb = document.getElementById('settingDarkMode');
    if (cb) cb.checked = dark;
    // Apply custom primary color if set
    if (this.data.settings.themeColor) this.applyThemeColor(this.data.settings.themeColor);
  },

  applyThemeColor(color) {
    const root = document.documentElement;
    // Darken the color slightly for dark variant
    root.style.setProperty('--primary', color);
    root.style.setProperty('--primary-dark', this.darkenColor(color, 15));
    root.style.setProperty('--primary-light', color + '22');
    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
  },

  darkenColor(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const f = 1 - pct/100;
    const r = Math.max(0, Math.round(((n >> 16) & 0xff) * f));
    const g = Math.max(0, Math.round(((n >>  8) & 0xff) * f));
    const b = Math.max(0, Math.round(( n        & 0xff) * f));
    return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
  },

  setThemeColor(el) {
    document.querySelectorAll('.theme-color-opt').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    const color = el.dataset.color;
    this.data.settings.themeColor = color;
    this.save();
    this.applyThemeColor(color);
    this.toast('🎨 Rang o\'zgartirildi!');
  },

  toggleTheme() {
    this.data.settings.darkMode = !this.data.settings.darkMode;
    this.save();
    this.applyTheme();
    if (this.charts.weekly) this.refreshCharts();
  },

  // ------------------------------------------
  // SETTINGS MODAL
  // ------------------------------------------
  openSettings() {
    const s = this.data.settings;
    document.getElementById('settingDarkMode').checked = !!s.darkMode;
    document.getElementById('settingNotif').checked    = !!s.notifications;
    document.getElementById('settingTaskNotif').checked = !!s.taskNotif;
    document.getElementById('settingWork2').value  = s.pomodoroWork  || 25;
    document.getElementById('settingBreak2').value = s.pomodoroBreak || 5;
    document.getElementById('settingLong2').value  = s.longBreak     || 15;
    document.getElementById('settingGoal2').value  = s.weeklyGoal    || 20;
    // Highlight active theme color
    document.querySelectorAll('.theme-color-opt').forEach(el => {
      el.classList.toggle('active', el.dataset.color === (s.themeColor || '#6C63FF'));
    });
    document.getElementById('modal-settings').classList.add('open');
  },

  saveSettingsField(key, val) {
    this.data.settings[key] = val;
    this.save();
  },

  updatePomodoroSettings2() {
    this.data.settings.pomodoroWork  = parseInt(document.getElementById('settingWork2').value)  || 25;
    this.data.settings.pomodoroBreak = parseInt(document.getElementById('settingBreak2').value) || 5;
    this.data.settings.longBreak     = parseInt(document.getElementById('settingLong2').value)  || 15;
    this.data.settings.weeklyGoal    = parseInt(document.getElementById('settingGoal2').value)  || 20;
    this.save();
    // Sync pomodoro page inputs
    ['settingWork','settingBreak','settingLong','settingGoal'].forEach((id, i) => {
      const mirror = ['settingWork2','settingBreak2','settingLong2','settingGoal2'][i];
      const el = document.getElementById(id);
      if (el) el.value = document.getElementById(mirror).value;
    });
    if (!this.pomodoroRunning) this.resetPomodoro();
    this.toast('✅ Pomodoro sozlamalari saqlandi');
  },

  async toggleNotifications() {
    const cb = document.getElementById('settingNotif');
    if (cb.checked) {
      await this.requestNotifications();
      cb.checked = this.data.settings.notifications;
    } else {
      this.data.settings.notifications = false;
      this.save();
      this.notifTimers.forEach(t => clearTimeout(t));
      this.notifTimers = [];
      this.toast('🔕 Bildirishnomalar o\'chirildi');
    }
  },

  clearCompleted() {
    const before = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter(t => !t.completed);
    this.save();
    const removed = before - this.data.tasks.length;
    this.renderToday(); this.renderTomorrow();
    if (this.currentPage === 'subjects') this.renderSubjectsPage();
    this.toast(`🗑️ ${removed} ta bajarilgan vazifa o'chirildi`);
  },

  resetAllData() {
    if (!confirm('⚠️ BARCHA ma\'lumotlar o\'chib ketadi! Davom etasizmi?')) return;
    if (!confirm('Haqiqatan ham o\'chirmoqchimisiz? Bu amalni qaytarib bo\'lmaydi!')) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  },

  // ------------------------------------------
  // PWA INSTALL
  // ------------------------------------------
  async installPWA() {
    if (!this.deferredInstallPrompt) return;
    this.deferredInstallPrompt.prompt();
    const { outcome } = await this.deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      this.toast('📱 Ilova o\'rnatilmoqda...');
      document.getElementById('installBanner').style.display = 'none';
    }
    this.deferredInstallPrompt = null;
  },

  dismissInstall() {
    document.getElementById('installBanner').style.display = 'none';
    sessionStorage.setItem('installDismissed', '1');
  },

  // ------------------------------------------
  // PWA ICON GENERATOR
  // ------------------------------------------
  generatePWAIcon() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 192; canvas.height = 192;
      const ctx = canvas.getContext('2d');
      const color = this.data.settings.themeColor || '#6C63FF';
      // Background
      const grad = ctx.createLinearGradient(0,0,192,192);
      grad.addColorStop(0, color);
      grad.addColorStop(1, this.darkenColor(color, 20));
      ctx.fillStyle = grad;
      this.roundRect(ctx, 0, 0, 192, 192, 40);
      ctx.fill();
      // Book emoji
      ctx.font = '100px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📚', 96, 96);
      const dataUrl = canvas.toDataURL('image/png');
      // Set as apple-touch-icon
      let link = document.querySelector('link[rel="apple-touch-icon"]');
      if (!link) { link = document.createElement('link'); link.rel='apple-touch-icon'; document.head.appendChild(link); }
      link.href = dataUrl;
    } catch {}
  },

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y); ctx.arcTo(x+w, y, x+w, y+r, r);
    ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
    ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r);
    ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
    ctx.closePath();
  },

  // ------------------------------------------
  // CONFETTI
  // ------------------------------------------
  fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const pieces = Array.from({length: 80}, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 8 + 4,
      d: Math.random() * 2 + 1,
      color: ['#6C63FF','#10B981','#F59E0B','#EF4444','#3B82F6','#EC4899'][Math.floor(Math.random()*6)],
      tilt: Math.random() * 10 - 5,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      opacity: 1,
    }));
    let frame = 0;
    if (this.confettiAnimId) cancelAnimationFrame(this.confettiAnimId);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      let alive = false;
      pieces.forEach(p => {
        p.y += p.d * 3;
        p.tilt += p.tiltSpeed;
        if (frame > 80) p.opacity = Math.max(0, p.opacity - 0.015);
        if (p.y < canvas.height + 20) alive = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x + Math.sin(p.tilt)*10, p.y, p.r, p.r*0.5, p.tilt, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });
      if (alive) this.confettiAnimId = requestAnimationFrame(draw);
      else { canvas.style.display = 'none'; this.confettiAnimId = null; }
    };
    draw();
  },

  // ------------------------------------------
  // HEADER
  // ------------------------------------------
  updateHeader() {
    const now = new Date();
    const days = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'];
    const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
    document.getElementById('headerDate').textContent =
      `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
  },

  // ------------------------------------------
  // NAVIGATION
  // ------------------------------------------
  navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    this.currentPage = page;
    if (page === 'week') this.renderWeek();
    if (page === 'subjects') this.renderSubjectsPage();
    if (page === 'pomodoro') this.renderPomodoroPage();
    if (page === 'exams') this.renderExams();
    if (page === 'stats') this.renderStats();
    if (page === 'today') this.renderToday();
    if (page === 'tomorrow') this.renderTomorrow();
  },

  // ------------------------------------------
  // HELPERS
  // ------------------------------------------
  getSubject(id) {
    return this.data.subjects.find(s => s.id === id) || { name: id, color: '#999', icon: '📚' };
  },

  todayDow() { return new Date().getDay(); },

  dateStr(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  },

  formatDate(str) {
    if (!str) return '';
    const d = new Date(str + 'T00:00:00');
    const months = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  },

  daysUntil(str) {
    if (!str) return null;
    const now = new Date(); now.setHours(0,0,0,0);
    const d = new Date(str + 'T00:00:00');
    return Math.ceil((d - now) / 86400000);
  },

  classesForDay(dow) {
    return this.data.schedule
      .filter(c => c.days && c.days.includes(dow))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  tasksForDate(dateStr) {
    return this.data.tasks.filter(t => t.dueDate === dateStr);
  },

  isOngoing(startTime, endTime) {
    const now = new Date();
    const hhmm = n => { const [h,m] = n.split(':'); return h*60+m*1; };
    const cur = now.getHours()*60 + now.getMinutes();
    return cur >= hhmm(startTime) && cur <= hhmm(endTime);
  },

  timePassed(endTime) {
    const now = new Date();
    const [h,m] = endTime.split(':');
    const cur = now.getHours()*60 + now.getMinutes();
    return cur > h*60 + m*1;
  },

  minutesUntil(startTime) {
    const now = new Date();
    const [h,m] = startTime.split(':');
    const cur = now.getHours()*60 + now.getMinutes();
    const target = h*60 + m*1;
    return target - cur;
  },

  scheduleClassNotifications() {
    if (!this.data.settings.notifications || Notification.permission !== 'granted') return;
    this.notifTimers.forEach(t => clearTimeout(t));
    this.notifTimers = [];
    const dow = this.todayDow();
    const classes = this.classesForDay(dow);
    classes.forEach(c => {
      const minsLeft = this.minutesUntil(c.startTime);
      if (minsLeft > 0 && minsLeft <= 60) {
        const sub = this.getSubject(c.subjectId);
        const ms10 = (minsLeft - 10) * 60000;
        const ms0  = minsLeft * 60000;
        if (ms10 > 0) {
          this.notifTimers.push(setTimeout(() =>
            this.notify(`📚 10 daqiqadan keyin: ${sub.name}`, `${c.startTime} • ${c.room || ''}`)
          , ms10));
        }
        this.notifTimers.push(setTimeout(() =>
          this.notify(`🔔 Dars boshlandi: ${sub.name}`, `${c.startTime} – ${c.endTime} • ${c.room || ''}`)
        , ms0));
      }
    });
  },

  freeSlots(classes) {
    if (!classes.length) return [];
    const slots = [];
    const hhmm = n => { const [h,m] = n.split(':'); return h*60+m*1; };
    const fmt = mins => `${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`;
    // Before first class
    const firstStart = hhmm(classes[0].startTime);
    if (firstStart > 8*60) slots.push({ start: '08:00', end: classes[0].startTime, duration: firstStart - 8*60 });
    // Between classes
    for (let i=0; i<classes.length-1; i++) {
      const end = hhmm(classes[i].endTime);
      const next = hhmm(classes[i+1].startTime);
      if (next - end >= 30) slots.push({ start: classes[i].endTime, end: classes[i+1].startTime, duration: next-end });
    }
    // After last class
    const lastEnd = hhmm(classes[classes.length-1].endTime);
    if (lastEnd < 20*60) slots.push({ start: classes[classes.length-1].endTime, end: '20:00', duration: 20*60 - lastEnd });
    return slots;
  },

  priorityColor(p) {
    return { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }[p] || '#999';
  },

  typeLabel(t) {
    return { lecture:'Ma\'ruza', practice:'Amaliyot', lab:'Laboratoriya', seminar:'Seminar' }[t] || t;
  },

  // ------------------------------------------
  // TODAY PAGE
  // ------------------------------------------
  renderToday() {
    const dow = this.todayDow();
    const today = this.dateStr(0);
    const classes = this.classesForDay(dow);
    const tasks = this.tasksForDate(today);
    const now = new Date();
    const curMins = now.getHours()*60 + now.getMinutes();

    // Greeting
    const h = now.getHours();
    const greeting = h < 12 ? 'Xayrli tong!' : h < 17 ? 'Xayrli kun!' : 'Xayrli oqshom!';
    document.getElementById('todayGreeting').textContent = greeting;

    const doneTasks = tasks.filter(t => t.completed).length;
    document.getElementById('todaySubtitle').textContent =
      `${tasks.length} vazifa, ${classes.length} dars`;

    // Day progress (8:00 - 22:00 = 840 mins)
    const dayStart = 8*60, dayEnd = 22*60;
    const pct = Math.min(100, Math.max(0, Math.round((curMins - dayStart) / (dayEnd - dayStart) * 100)));
    document.getElementById('dayProgressPct').textContent = pct + '%';
    const circ = document.getElementById('circleProgress');
    circ.setAttribute('stroke-dasharray', `${pct} 100`);

    document.getElementById('statClasses').textContent = classes.length;
    document.getElementById('statTasks').textContent = tasks.length;
    document.getElementById('statDone').textContent = doneTasks;
    const todaySessions = this.data.pomodoroSessions.filter(s => s.date === today && s.completed).length;
    document.getElementById('statPomodoros').textContent = todaySessions;

    // Timeline with current-time indicator
    const tl = document.getElementById('todayTimeline');
    if (!classes.length) {
      tl.innerHTML = `<div class="empty-state"><span>📅</span><p>Bugun dars yo'q</p>
        <button class="btn btn-outline" onclick="App.openModal('class')">Dars qo'shish</button></div>`;
    } else {
      const nowStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      let html = '';
      let indicatorInserted = false;
      for (const c of classes) {
        if (!indicatorInserted && !this.timePassed(c.endTime) && !this.isOngoing(c.startTime, c.endTime)) {
          html += `<div class="time-indicator">
            <div class="time-indicator-dot"></div>
            <div class="time-indicator-label">${nowStr}</div>
            <div class="time-indicator-line"></div>
          </div>`;
          indicatorInserted = true;
        }
        html += this.renderClassItem(c);
      }
      tl.innerHTML = html;
    }

    // Tasks
    const tDiv = document.getElementById('todayTasks');
    if (!tasks.length) {
      tDiv.innerHTML = `<div class="empty-state"><span>✅</span><p>Bugun vazifa yo'q</p>
        <button class="btn btn-outline" onclick="App.openModal('task')">Vazifa qo'shish</button></div>`;
    } else {
      tDiv.innerHTML = tasks.map(t => this.renderTaskItem(t)).join('');
    }

    // Free slots
    const free = this.freeSlots(classes);
    const freeSection = document.getElementById('freeTimeSuggestions');
    const freeList = document.getElementById('freeTimeList');
    if (free.length) {
      freeSection.style.display = '';
      freeList.innerHTML = free.map(s => {
        const suggestions = s.duration >= 90 ? '📖 O\'qish + Pomodoro' : s.duration >= 60 ? '📚 O\'qish' : '☕ Dam olish';
        return `<div class="free-slot">
          <div>
            <div class="free-slot-time">${s.start} – ${s.end}</div>
            <div class="free-slot-text">${Math.floor(s.duration/60)}s ${s.duration%60}d • ${suggestions}</div>
          </div>
        </div>`;
      }).join('');
    } else {
      freeSection.style.display = 'none';
    }
  },

  renderClassItem(c) {
    const sub = this.getSubject(c.subjectId);
    const ongoing = this.isOngoing(c.startTime, c.endTime);
    const done = this.timePassed(c.endTime);
    const typeBg = { lecture:'#EEF0FF', practice:'#FFF0F0', lab:'#F0FFF8', seminar:'#FFFBF0' };
    const typeCol = { lecture:'#6C63FF', practice:'#EF4444', lab:'#10B981', seminar:'#F59E0B' };
    const minsLeft = this.minutesUntil(c.startTime);
    const soonBadge = (!ongoing && !done && minsLeft !== null && minsLeft > 0 && minsLeft <= 15)
      ? `<span style="font-size:10px;color:#F59E0B;font-weight:700">${minsLeft} daqiqadan keyin</span>` : '';
    return `<div class="timeline-item ${ongoing?'ongoing':''} ${done&&!ongoing?'done':''}">
      <div class="timeline-color" style="background:${sub.color}"></div>
      <div class="timeline-info">
        <div class="timeline-subject">${sub.icon} ${sub.name}</div>
        <div class="timeline-meta">
          ${c.room ? `🏫 ${c.room}` : ''}
          ${c.teacher ? `👤 ${c.teacher}` : ''}
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-top:4px;flex-wrap:wrap">
          <span class="type-badge" style="background:${typeBg[c.classType]||'#F5F5F5'};color:${typeCol[c.classType]||'#666'}">${this.typeLabel(c.classType)}</span>
          ${soonBadge}
        </div>
      </div>
      <div class="timeline-time">
        <div>${c.startTime}</div>
        <div style="font-size:11px;margin-top:2px">${c.endTime}</div>
        ${ongoing ? '<div class="ongoing-badge">HOZIR</div>' : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:4px">
        <button class="task-del" title="Tahrirlash" onclick="App.editClass('${c.id}')">✏️</button>
        <button class="task-del" title="O'chirish" onclick="App.deleteClass('${c.id}')">🗑️</button>
      </div>
    </div>`;
  },

  renderTaskItem(t) {
    const sub = this.getSubject(t.subjectId);
    const due = this.daysUntil(t.dueDate);
    let dueClass = '', dueText = '';
    if (t.dueDate) {
      if (due < 0) { dueClass='overdue'; dueText=`${Math.abs(due)} kun o'tdi ⚠️`; }
      else if (due === 0) { dueClass='today'; dueText='Bugun!'; }
      else if (due === 1) { dueClass='today'; dueText='Ertaga'; }
      else dueText = `${this.formatDate(t.dueDate)} (${due} kun)`;
    }
    return `<div class="task-item ${t.completed?'done':''}" id="task-${t.id}">
      <div class="priority-dot priority-${t.priority||'medium'}"></div>
      <div class="task-check ${t.completed?'checked':''}" onclick="App.toggleTask('${t.id}')">
        ${t.completed ? '✓' : ''}
      </div>
      <div class="task-info">
        <div class="task-title">${this.escHtml(t.title)}</div>
        <div class="task-meta">
          <span class="task-subject-tag" style="background:${sub.color}22;color:${sub.color}">${sub.icon} ${sub.name}</span>
          ${t.dueDate ? `<span class="task-due ${dueClass}">${dueText}</span>` : ''}
        </div>
        ${t.description ? `<div style="font-size:12px;color:var(--text-secondary);margin-top:4px">${this.escHtml(t.description)}</div>` : ''}
      </div>
      <div class="task-actions">
        <button class="task-del" title="Tahrirlash" onclick="App.editTask('${t.id}')">✏️</button>
        <button class="task-del" title="O'chirish" onclick="App.deleteTask('${t.id}')">🗑️</button>
      </div>
    </div>`;
  },

  // ------------------------------------------
  // TOMORROW PAGE
  // ------------------------------------------
  renderTomorrow() {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDow = tomorrow.getDay();
    const tomorrowStr = this.dateStr(1);
    const days = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'];
    const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];

    document.getElementById('tomorrowTitle').textContent = `${days[tomorrowDow]}gi reja`;
    document.getElementById('tomorrowDate').textContent =
      `${tomorrow.getDate()} ${months[tomorrow.getMonth()]} ${tomorrow.getFullYear()}`;

    const classes = this.classesForDay(tomorrowDow);
    const tasks = this.tasksForDate(tomorrowStr);

    const cDiv = document.getElementById('tomorrowClasses');
    cDiv.innerHTML = classes.length
      ? classes.map(c => this.renderClassItem(c)).join('')
      : `<div class="empty-state"><span>📅</span><p>Ertaga dars yo'q</p></div>`;

    const tDiv = document.getElementById('tomorrowTasks');
    tDiv.innerHTML = tasks.length
      ? tasks.map(t => this.renderTaskItem(t)).join('')
      : `<div class="empty-state"><span>📋</span><p>Ertaga uchun vazifa yo'q</p>
          <button class="btn btn-outline" onclick="App.openModal('task')">Vazifa qo'shish</button></div>`;

    // Auto schedule
    const free = this.freeSlots(classes);
    const autoSection = document.getElementById('autoScheduleSection');
    const autoList = document.getElementById('autoScheduleList');
    if (free.length && classes.length) {
      autoSection.style.display = '';
      autoList.innerHTML = free.map(s => {
        let suggestion = '';
        if (s.duration >= 90) suggestion = '📖 O\'qish + 🍅 Pomodoro sessiyasi';
        else if (s.duration >= 60) suggestion = '📚 Mavzu takrorlash';
        else if (s.duration >= 30) suggestion = '☕ Dam olish yoki qisqa takrorlash';
        else suggestion = '🚶 Piyoda yurish';
        return `<div class="auto-slot">
          <span class="auto-slot-time">${s.start}–${s.end}</span>
          <span>${Math.floor(s.duration/60)}s ${s.duration%60}d — ${suggestion}</span>
        </div>`;
      }).join('');
    } else {
      autoSection.style.display = 'none';
    }
  },

  // ------------------------------------------
  // WEEK PAGE
  // ------------------------------------------
  renderWeek() {
    const dayNames = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'];
    const now = new Date();
    const todayDow = now.getDay();
    const grid = document.getElementById('weekGrid');

    // Calculate week start (Monday)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7) + this.weekOffset * 7);

    const isCurrentWeek = this.weekOffset === 0;
    document.getElementById('weekTitle').textContent = isCurrentWeek ? 'Bu hafta' :
      this.weekOffset < 0 ? `${Math.abs(this.weekOffset)} hafta oldin` : `${this.weekOffset} hafta keyin`;

    // Mon-Sun
    const orderedDows = [1,2,3,4,5,6,0];
    grid.innerHTML = orderedDows.map(dow => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + ((dow + 6) % 7));
      const isToday = isCurrentWeek && dow === todayDow;
      const classes = this.classesForDay(dow);
      const months = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];

      return `<div class="week-day">
        <div class="week-day-header ${isToday?'today-header':''}" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'':'none'">
          <div>
            <div class="wdh-name">${dayNames[dow]}</div>
            <div class="wdh-date">${dayDate.getDate()} ${months[dayDate.getMonth()]}</div>
          </div>
          <span class="wdh-count">${classes.length} dars</span>
        </div>
        <div class="week-day-content">
          ${classes.length ? classes.map(c => {
            const sub = this.getSubject(c.subjectId);
            return `<div class="week-class-chip">
              <div class="week-class-chip-color" style="background:${sub.color}"></div>
              <div>
                <div style="font-weight:600">${sub.icon} ${sub.name}</div>
                <div style="font-size:11px;color:var(--text-secondary)">${c.startTime}–${c.endTime} ${c.room?'• '+c.room:''}</div>
              </div>
            </div>`;
          }).join('') : `<p style="font-size:13px;color:var(--text-secondary);text-align:center;padding:8px">Bo'sh kun</p>`}
        </div>
      </div>`;
    }).join('');
  },

  // ------------------------------------------
  // SUBJECTS PAGE
  // ------------------------------------------
  renderSubjectsPage() {
    const grid = document.getElementById('subjectsList');
    grid.innerHTML = this.data.subjects.map(s => {
      const taskCount = this.data.tasks.filter(t => t.subjectId === s.id).length;
      const doneCount = this.data.tasks.filter(t => t.subjectId === s.id && t.completed).length;
      const classCount = this.data.schedule.filter(c => c.subjectId === s.id).length;
      return `<div class="subject-card" style="--subject-color:${s.color}">
        <div class="subject-icon">${s.icon}</div>
        <div class="subject-name">${this.escHtml(s.name)}</div>
        <div class="subject-stats">${taskCount} vazifa • ${classCount} dars</div>
        ${taskCount > 0 ? `<div style="height:4px;background:var(--border);border-radius:2px;margin-top:6px;overflow:hidden">
          <div style="height:100%;width:${taskCount?Math.round(doneCount/taskCount*100):0}%;background:${s.color};border-radius:2px"></div>
        </div>` : ''}
        <button class="subject-del" onclick="event.stopPropagation();App.deleteSubject('${s.id}')">✕</button>
      </div>`;
    }).join('') + `<div class="subject-card" style="border:2px dashed var(--border);box-shadow:none;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;min-height:120px" onclick="App.openModal('subject')">
      <div style="font-size:28px">➕</div>
      <div style="font-size:12px;color:var(--text-secondary);margin-top:6px">Fan qo'shish</div>
    </div>`;

    // Update filter selects
    const filterSel = document.getElementById('taskFilterSubject');
    const curr = filterSel.value;
    filterSel.innerHTML = '<option value="">Barchasi</option>' +
      this.data.subjects.map(s => `<option value="${s.id}" ${curr===s.id?'selected':''}>${s.icon} ${s.name}</option>`).join('');

    // Render tasks
    let tasks = [...this.data.tasks];
    const subFilter = document.getElementById('taskFilterSubject').value;
    const statusFilter = document.getElementById('taskFilterStatus').value;
    const searchQ = (document.getElementById('taskSearch')?.value || '').toLowerCase().trim();
    if (subFilter) tasks = tasks.filter(t => t.subjectId === subFilter);
    if (statusFilter === 'active') tasks = tasks.filter(t => !t.completed);
    if (statusFilter === 'done') tasks = tasks.filter(t => t.completed);
    if (searchQ) tasks = tasks.filter(t => t.title.toLowerCase().includes(searchQ) || (t.description||'').toLowerCase().includes(searchQ));
    tasks.sort((a,b) => (a.dueDate||'').localeCompare(b.dueDate||''));

    const tList = document.getElementById('allTasksList');
    tList.innerHTML = tasks.length
      ? tasks.map(t => this.renderTaskItem(t)).join('')
      : `<div class="empty-state"><span>📋</span><p>Vazifalar yo'q</p></div>`;
  },

  // ------------------------------------------
  // POMODORO PAGE
  // ------------------------------------------
  renderPomodoroPage() {
    this.loadPomodoroSettings();
    this.renderPomodoroSubjectSelect();
    this.renderPomodoroHistory();
    this.renderSessionDots();
  },

  renderPomodoroSubjectSelect() {
    const sel = document.getElementById('pomodoroSubject');
    sel.innerHTML = '<option value="">Fan tanlang...</option>' +
      this.data.subjects.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('');
  },

  renderPomodoroHistory() {
    const today = this.dateStr(0);
    const sessions = this.data.pomodoroSessions.filter(s => s.date === today && s.completed);
    const div = document.getElementById('pomodoroHistory');
    if (!sessions.length) {
      div.innerHTML = `<div class="empty-state"><span>⏱️</span><p>Bugun sessiya yo'q</p></div>`;
      return;
    }
    div.innerHTML = sessions.slice(-10).reverse().map(s => {
      const sub = s.subjectId ? this.getSubject(s.subjectId) : null;
      return `<div class="pomodoro-history-item">
        <span>${sub ? sub.icon + ' ' + sub.name : '🍅 Umumiy'} — ${s.duration} daqiqa</span>
        <span class="ph-time">${s.time || ''}</span>
      </div>`;
    }).join('');
  },

  renderSessionDots() {
    const dotsDiv = document.getElementById('sessionDots');
    const count = document.getElementById('sessionCount');
    const filled = this.pomodoroSession % 4;
    const total = 4;
    dotsDiv.innerHTML = Array.from({length: total}, (_, i) =>
      `<div class="session-dot ${i < filled ? 'filled' : ''}"></div>`
    ).join('');
    count.textContent = `${filled} / 4 sessiya • Jami: ${this.pomodoroSession}`;
  },

  loadPomodoroSettings() {
    document.getElementById('settingWork').value = this.data.settings.pomodoroWork;
    document.getElementById('settingBreak').value = this.data.settings.pomodoroBreak;
    document.getElementById('settingLong').value = this.data.settings.longBreak;
    document.getElementById('settingGoal').value = this.data.settings.weeklyGoal;
  },

  updatePomodoroSettings() {
    this.data.settings.pomodoroWork = parseInt(document.getElementById('settingWork').value) || 25;
    this.data.settings.pomodoroBreak = parseInt(document.getElementById('settingBreak').value) || 5;
    this.data.settings.longBreak = parseInt(document.getElementById('settingLong').value) || 15;
    this.data.settings.weeklyGoal = parseInt(document.getElementById('settingGoal').value) || 20;
    this.save();
    if (!this.pomodoroRunning) {
      this.resetPomodoro();
    }
    this.toast('Sozlamalar saqlandi ✓');
  },

  setPomodoroMode(mode) {
    this.pomodoroMode = mode;
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    this.stopPomodoro();
    this.resetPomodoro();
    const labels = { work:'Ishlash vaqti', break:'Dam olish', long:'Uzun tanaffus' };
    document.getElementById('timerLabel').textContent = labels[mode];
    const ring = document.getElementById('timerRing');
    const colors = { work:'#6C63FF', break:'#10B981', long:'#3B82F6' };
    ring.style.stroke = colors[mode];
  },

  getDurationSeconds() {
    const s = this.data.settings;
    const mins = { work: s.pomodoroWork, break: s.pomodoroBreak, long: s.longBreak }[this.pomodoroMode];
    return mins * 60;
  },

  togglePomodoro() {
    if (this.pomodoroRunning) this.stopPomodoro();
    else this.startPomodoro();
  },

  startPomodoro() {
    if (this.pomodoroSeconds === 0) this.pomodoroSeconds = this.getDurationSeconds();
    this.pomodoroRunning = true;
    document.getElementById('pomodoroStartBtn').textContent = '⏸ Pauza';
    this.pomodoroInterval = setInterval(() => {
      this.pomodoroSeconds--;
      this.updateTimerDisplay();
      if (this.pomodoroSeconds <= 0) {
        this.pomodoroComplete();
      }
    }, 1000);
  },

  stopPomodoro() {
    this.pomodoroRunning = false;
    clearInterval(this.pomodoroInterval);
    document.getElementById('pomodoroStartBtn').textContent = '▶ Davom etish';
  },

  resetPomodoro() {
    this.stopPomodoro();
    this.pomodoroSeconds = this.getDurationSeconds();
    document.getElementById('pomodoroStartBtn').textContent = '▶ Boshlash';
    this.updateTimerDisplay();
  },

  skipPomodoro() {
    this.pomodoroComplete();
  },

  pomodoroComplete() {
    clearInterval(this.pomodoroInterval);
    this.pomodoroRunning = false;

    if (this.pomodoroMode === 'work') {
      this.pomodoroSession++;
      // Save session
      const now = new Date();
      this.data.pomodoroSessions.push({
        id: this.uid(),
        date: this.dateStr(0),
        time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
        duration: this.data.settings.pomodoroWork,
        subjectId: document.getElementById('pomodoroSubject').value || null,
        completed: true,
      });
      this.save();
      this.renderPomodoroHistory();

      if (this.data.settings.notifications) {
        this.notify('Pomodoro tugadi! 🍅', 'Dam olish vaqti keldi.');
      }
      this.toast('🍅 Pomodoro tugadi! Ajoyib!');

      // Auto switch to break
      if (this.pomodoroSession % 4 === 0) this.setPomodoroMode('long');
      else this.setPomodoroMode('break');
    } else {
      if (this.data.settings.notifications) {
        this.notify('Dam olish tugadi!', 'Yana ishlashga tayyor?');
      }
      this.toast('💪 Dam olish tugadi! Ishlashni davom ettiramiz.');
      this.setPomodoroMode('work');
    }

    this.renderSessionDots();
    if (this.currentPage === 'today') this.renderToday();
  },

  updateTimerDisplay() {
    const total = this.getDurationSeconds();
    const mins = Math.floor(this.pomodoroSeconds / 60);
    const secs = this.pomodoroSeconds % 60;
    document.getElementById('timerDisplay').textContent =
      `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

    // Update ring
    const circumference = 2 * Math.PI * 90; // r=90
    const progress = this.pomodoroSeconds / total;
    const offset = circumference * (1 - progress);
    document.getElementById('timerRing').style.strokeDashoffset = offset;
  },

  // ------------------------------------------
  // EXAMS PAGE
  // ------------------------------------------
  renderExams() {
    const list = document.getElementById('examsList');
    const exams = [...this.data.exams].sort((a,b) => a.date.localeCompare(b.date));
    if (!exams.length) {
      list.innerHTML = `<div class="empty-state"><span>📝</span><p>Imtihon qo'shilmagan</p>
        <button class="btn btn-outline" onclick="App.openModal('exam')">Imtihon qo'shish</button></div>`;
      return;
    }
    list.innerHTML = exams.map(e => {
      const sub = this.getSubject(e.subjectId);
      const days = this.daysUntil(e.date);
      let bg, status;
      if (days < 0) { bg='#6B7280'; status='O\'tdi'; }
      else if (days === 0) { bg='#EF4444'; status='BUGUN!'; }
      else if (days <= 3) { bg='#F59E0B'; status='Yaqin!'; }
      else if (days <= 7) { bg='#3B82F6'; status=`${days} kun`; }
      else { bg='#10B981'; status=`${days} kun`; }
      return `<div class="exam-card">
        <div class="exam-countdown" style="background:${bg}22">
          <div class="days" style="color:${bg}">${days < 0 ? '—' : days === 0 ? '0' : days}</div>
          <div class="days-label" style="color:${bg}">${days < 0 ? 'o\'tdi' : 'kun'}</div>
        </div>
        <div class="exam-info">
          <div class="exam-subject">${sub.icon} ${sub.name}</div>
          <div class="exam-meta">
            <span>📅 ${this.formatDate(e.date)} ${e.examTime || ''}</span>
            <span>📋 ${e.examType || 'Imtihon'}</span>
            ${e.room ? `<span>🏫 ${e.room}</span>` : ''}
          </div>
          <span class="exam-status" style="background:${bg}22;color:${bg}">${status}</span>
          ${e.notes ? `<div style="margin-top:8px">${e.notes.split('\n').filter(Boolean).map((line,i) =>
            `<div style="display:flex;align-items:center;gap:6px;font-size:12px;padding:2px 0;cursor:pointer" onclick="App.toggleExamTopic('${e.id}',${i})">
              <span style="font-size:14px">${(e.checkedTopics||[]).includes(i) ? '✅' : '⬜'}</span>
              <span style="${(e.checkedTopics||[]).includes(i) ? 'text-decoration:line-through;color:var(--text-secondary)' : ''}">${this.escHtml(line)}</span>
            </div>`).join('')}</div>` : ''}
        </div>
        <button class="exam-del" onclick="App.deleteExam('${e.id}')">🗑️</button>
      </div>`;
    }).join('');
  },

  // ------------------------------------------
  // STATISTICS PAGE
  // ------------------------------------------
  renderStats() {
    const tasks = this.data.tasks;
    const sessions = this.data.pomodoroSessions.filter(s => s.completed);
    const totalMins = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    document.getElementById('statTotalTasks').textContent = tasks.length;
    document.getElementById('statCompletedTasks').textContent = tasks.filter(t => t.completed).length;
    document.getElementById('statTotalPomodoros').textContent = sessions.length;
    document.getElementById('statStudyHours').textContent = (totalMins / 60).toFixed(1);

    // Weekly goal
    const weekStart = this.dateStr(-6);
    const weekSessions = sessions.filter(s => s.date >= weekStart).length;
    const goal = this.data.settings.weeklyGoal;
    const pct = Math.min(100, Math.round(weekSessions / goal * 100));
    document.getElementById('goalPct').textContent = pct + '%';
    document.getElementById('goalFill').style.width = pct + '%';
    document.getElementById('goalSubtitle').textContent = `${weekSessions} / ${goal} pomodoro (bu hafta)`;

    this.renderCharts();
  },

  renderCharts() {
    const isDark = this.data.settings.darkMode;
    const textColor = isDark ? '#9CA3AF' : '#6B7280';
    const gridColor = isDark ? '#2A2A4A' : '#E5E7EB';

    Chart.defaults.color = textColor;

    // Weekly pomodoro chart
    const last7 = Array.from({length:7}, (_, i) => this.dateStr(i-6));
    const weeklyData = last7.map(d => this.data.pomodoroSessions.filter(s => s.date === d && s.completed).length);
    const dayLabels = last7.map(d => {
      const dt = new Date(d + 'T00:00:00');
      return ['Ya','Du','Se','Ch','Pa','Ju','Sh'][dt.getDay()];
    });

    if (this.charts.weekly) this.charts.weekly.destroy();
    const wCtx = document.getElementById('weeklyChart').getContext('2d');
    this.charts.weekly = new Chart(wCtx, {
      type: 'bar',
      data: {
        labels: dayLabels,
        datasets: [{
          label: 'Pomodoro',
          data: weeklyData,
          backgroundColor: '#6C63FF99',
          borderColor: '#6C63FF',
          borderWidth: 2,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor } },
          y: { grid: { color: gridColor }, ticks: { stepSize: 1 } }
        }
      }
    });

    // Subject distribution
    const subjectData = this.data.subjects.map(s => ({
      name: s.icon + ' ' + s.name,
      color: s.color,
      count: this.data.pomodoroSessions.filter(p => p.subjectId === s.id && p.completed).length
    })).filter(s => s.count > 0);

    if (this.charts.subject) this.charts.subject.destroy();
    const sCtx = document.getElementById('subjectChart').getContext('2d');
    if (subjectData.length) {
      this.charts.subject = new Chart(sCtx, {
        type: 'doughnut',
        data: {
          labels: subjectData.map(s => s.name),
          datasets: [{ data: subjectData.map(s => s.count), backgroundColor: subjectData.map(s => s.color + 'CC'), borderColor: subjectData.map(s => s.color), borderWidth: 2 }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '60%' }
      });
    } else {
      sCtx.canvas.parentNode.innerHTML = '<h3>Fanlar bo\'yicha o\'qish</h3><div class="empty-state" style="border:none"><span>📊</span><p>Hali ma\'lumot yo\'q</p></div>';
    }

    // Task completion chart
    const taskData = last7.map(d => {
      const dayTasks = this.data.tasks.filter(t => t.dueDate === d);
      return { total: dayTasks.length, done: dayTasks.filter(t => t.completed).length };
    });

    if (this.charts.tasks) this.charts.tasks.destroy();
    const tCtx = document.getElementById('taskChart').getContext('2d');
    this.charts.tasks = new Chart(tCtx, {
      type: 'line',
      data: {
        labels: dayLabels,
        datasets: [
          { label: 'Jami', data: taskData.map(d => d.total), borderColor: '#6B7280', backgroundColor: '#6B728020', fill: true, tension: 0.4, borderWidth: 2 },
          { label: 'Bajarildi', data: taskData.map(d => d.done), borderColor: '#10B981', backgroundColor: '#10B98120', fill: true, tension: 0.4, borderWidth: 2 },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          x: { grid: { color: gridColor } },
          y: { grid: { color: gridColor }, ticks: { stepSize: 1 }, beginAtZero: true }
        }
      }
    });
  },

  refreshCharts() {
    if (this.currentPage === 'stats') this.renderStats();
  },

  // ------------------------------------------
  // MODALS
  // ------------------------------------------
  openModal(type) {
    if (type === 'settings') { this.openSettings(); return; }
    const tomorrow = this.dateStr(1);
    if (type === 'task') {
      this.editingTaskId = null;
      document.getElementById('taskDue').value = tomorrow;
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDesc').value = '';
      document.getElementById('taskPriority').value = 'medium';
      this.populateSelect('taskSubject');
      document.querySelector('#modal-task .modal-header h3').textContent = 'Vazifa qo\'shish';
    }
    if (type === 'class') {
      this.editingClassId = null;
      this.populateSelect('classSubject');
      document.querySelectorAll('#dayCheckboxes input').forEach(i => i.checked = false);
      document.querySelector('#modal-class .modal-header h3').textContent = 'Dars qo\'shish';
    }
    if (type === 'exam') {
      this.populateSelect('examSubject');
      document.getElementById('examDate').value = tomorrow;
      document.getElementById('examNotes').value = '';
      document.getElementById('examRoom').value = '';
    }
    document.getElementById('modal-' + type).classList.add('open');
  },

  editTask(id) {
    const t = this.data.tasks.find(x => x.id === id);
    if (!t) return;
    this.editingTaskId = id;
    this.populateSelect('taskSubject');
    document.getElementById('taskTitle').value = t.title;
    document.getElementById('taskSubject').value = t.subjectId;
    document.getElementById('taskDue').value = t.dueDate || '';
    document.getElementById('taskPriority').value = t.priority || 'medium';
    document.getElementById('taskDesc').value = t.description || '';
    document.querySelector('#modal-task .modal-header h3').textContent = 'Vazifani tahrirlash';
    document.getElementById('modal-task').classList.add('open');
  },

  editClass(id) {
    const c = this.data.schedule.find(x => x.id === id);
    if (!c) return;
    this.editingClassId = id;
    this.populateSelect('classSubject');
    document.getElementById('classSubject').value = c.subjectId;
    document.getElementById('classStart').value = c.startTime;
    document.getElementById('classEnd').value = c.endTime;
    document.getElementById('classRoom').value = c.room || '';
    document.getElementById('classTeacher').value = c.teacher || '';
    document.getElementById('classType').value = c.classType || 'lecture';
    document.querySelectorAll('#dayCheckboxes input').forEach(i => {
      i.checked = c.days && c.days.includes(parseInt(i.value));
    });
    document.querySelector('#modal-class .modal-header h3').textContent = 'Darsni tahrirlash';
    document.getElementById('modal-class').classList.add('open');
  },

  closeModal(type) {
    document.getElementById('modal-' + type).classList.remove('open');
  },

  populateSelect(id) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = this.data.subjects.map(s =>
      `<option value="${s.id}">${s.icon} ${s.name}</option>`
    ).join('');
  },

  populateSubjectSelects() {
    ['classSubject','taskSubject','examSubject','pomodoroSubject'].forEach(id => {
      this.populateSelect(id);
    });
  },

  // ------------------------------------------
  // SAVE OPERATIONS
  // ------------------------------------------
  saveClass() {
    const subjectId = document.getElementById('classSubject').value;
    const startTime = document.getElementById('classStart').value;
    const endTime = document.getElementById('classEnd').value;
    const room = document.getElementById('classRoom').value.trim();
    const teacher = document.getElementById('classTeacher').value.trim();
    const classType = document.getElementById('classType').value;
    const days = [...document.querySelectorAll('#dayCheckboxes input:checked')].map(i => parseInt(i.value));

    if (!subjectId || !startTime || !endTime) { this.toast('⚠️ Barcha majburiy maydonlarni to\'ldiring'); return; }
    if (!days.length) { this.toast('⚠️ Kamida bir kun tanlang'); return; }
    if (startTime >= endTime) { this.toast('⚠️ Boshlanish vaqti tugash vaqtidan kichik bo\'lishi kerak'); return; }

    if (this.editingClassId) {
      const idx = this.data.schedule.findIndex(c => c.id === this.editingClassId);
      if (idx !== -1) this.data.schedule[idx] = { ...this.data.schedule[idx], subjectId, startTime, endTime, room, teacher, classType, days };
      this.toast('✅ Dars yangilandi!');
    } else {
      this.data.schedule.push({ id: this.uid(), subjectId, startTime, endTime, room, teacher, classType, days });
      this.toast('✅ Dars qo\'shildi!');
    }
    this.editingClassId = null;
    this.save();
    this.closeModal('class');
    this.renderToday();
    this.renderTomorrow();
    this.scheduleClassNotifications();
  },

  saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const subjectId = document.getElementById('taskSubject').value;
    const dueDate = document.getElementById('taskDue').value;
    const priority = document.getElementById('taskPriority').value;
    const description = document.getElementById('taskDesc').value.trim();

    if (!title) { this.toast('⚠️ Vazifa nomini kiriting'); return; }
    if (!dueDate) { this.toast('⚠️ Muddatni kiriting'); return; }

    if (this.editingTaskId) {
      const t = this.data.tasks.find(x => x.id === this.editingTaskId);
      if (t) Object.assign(t, { title, subjectId, dueDate, priority, description });
      this.toast('✅ Vazifa yangilandi!');
    } else {
      this.data.tasks.push({ id: this.uid(), title, subjectId, dueDate, priority, description, completed: false, createdAt: Date.now() });
      this.toast('✅ Vazifa qo\'shildi!');
    }
    this.editingTaskId = null;
    this.save();
    this.closeModal('task');
    this.renderToday();
    this.renderTomorrow();
    if (this.currentPage === 'subjects') this.renderSubjectsPage();
  },

  saveExam() {
    const subjectId = document.getElementById('examSubject').value;
    const date = document.getElementById('examDate').value;
    const examTime = document.getElementById('examTime').value;
    const examType = document.getElementById('examType').value;
    const room = document.getElementById('examRoom').value.trim();
    const notes = document.getElementById('examNotes').value.trim();

    if (!subjectId || !date) { this.toast('⚠️ Fan va sanani kiriting'); return; }

    this.data.exams.push({ id: this.uid(), subjectId, date, examTime, examType, room, notes });
    this.save();
    this.closeModal('exam');
    this.toast('✅ Imtihon qo\'shildi!');
    this.renderExams();
  },

  saveSubject() {
    const name = document.getElementById('subjectName').value.trim();
    const color = document.querySelector('input[name="subColor"]:checked')?.value || '#6C63FF';
    const icon = this.selectedEmoji || '📚';

    if (!name) { this.toast('⚠️ Fan nomini kiriting'); return; }

    this.data.subjects.push({ id: this.uid(), name, color, icon });
    this.save();
    this.closeModal('subject');
    this.populateSubjectSelects();
    this.renderSubjectsPage();
    this.toast('✅ Fan qo\'shildi!');
    document.getElementById('subjectName').value = '';
  },

  selectEmoji(el) {
    document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    this.selectedEmoji = el.textContent;
  },

  // ------------------------------------------
  // DELETE OPERATIONS
  // ------------------------------------------
  deleteClass(id) {
    if (!confirm('Bu darsni o\'chirmoqchimisiz?')) return;
    this.data.schedule = this.data.schedule.filter(c => c.id !== id);
    this.save();
    this.renderToday();
    this.renderTomorrow();
    if (this.currentPage === 'week') this.renderWeek();
    this.toast('🗑️ Dars o\'chirildi');
  },

  deleteTask(id) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    this.save();
    this.renderToday();
    this.renderTomorrow();
    if (this.currentPage === 'subjects') this.renderSubjectsPage();
    this.toast('🗑️ Vazifa o\'chirildi');
  },

  toggleExamTopic(examId, topicIdx) {
    const exam = this.data.exams.find(e => e.id === examId);
    if (!exam) return;
    if (!exam.checkedTopics) exam.checkedTopics = [];
    const pos = exam.checkedTopics.indexOf(topicIdx);
    if (pos === -1) exam.checkedTopics.push(topicIdx);
    else exam.checkedTopics.splice(pos, 1);
    this.save();
    this.renderExams();
  },

  deleteExam(id) {
    if (!confirm('Bu imtihonni o\'chirmoqchimisiz?')) return;
    this.data.exams = this.data.exams.filter(e => e.id !== id);
    this.save();
    this.renderExams();
    this.toast('🗑️ Imtihon o\'chirildi');
  },

  deleteSubject(id) {
    if (!confirm('Bu fanni o\'chirmoqchimisiz? Barcha bog\'liq dars va vazifalar qoladi.')) return;
    this.data.subjects = this.data.subjects.filter(s => s.id !== id);
    this.save();
    this.populateSubjectSelects();
    this.renderSubjectsPage();
    this.toast('🗑️ Fan o\'chirildi');
  },

  toggleTask(id) {
    const task = this.data.tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    this.save();
    this.renderToday();
    this.renderTomorrow();
    if (this.currentPage === 'subjects') this.renderSubjectsPage();
    if (task.completed) {
      this.toast('✅ Vazifa bajarildi!');
      // Confetti if all today's tasks are done
      const todayTasks = this.data.tasks.filter(t => t.dueDate === this.dateStr(0));
      const allDone = todayTasks.length > 0 && todayTasks.every(t => t.completed);
      if (allDone) {
        setTimeout(() => this.fireConfetti(), 300);
        setTimeout(() => this.toast('🎉 Bugungi barcha vazifalar bajarildi!'), 500);
      }
    }
  },

  // ------------------------------------------
  // SHARE / EXPORT / IMPORT
  // ------------------------------------------
  exportData() {
    const json = JSON.stringify(this.data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talaba-rejasi-${this.dateStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('📤 Fayl yuklab olindi!');
  },

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported.subjects || !imported.schedule) throw new Error('Invalid format');
        if (confirm('Mavjud ma\'lumotlar o\'rniga import qilinsinmi?')) {
          this.data = imported;
          this.save();
          this.populateSubjectSelects();
          this.renderToday();
          this.closeModal('share');
          this.toast('✅ Ma\'lumotlar import qilindi!');
        }
      } catch {
        this.toast('❌ Fayl noto\'g\'ri format');
      }
    };
    reader.readAsText(file);
  },

  copySchedule() {
    const days = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'];
    let text = '📚 DARSLAR JADVALI\n\n';
    [1,2,3,4,5,6,0].forEach(dow => {
      const cls = this.classesForDay(dow);
      if (cls.length) {
        text += `${days[dow]}:\n`;
        cls.forEach(c => {
          const sub = this.getSubject(c.subjectId);
          text += `  ${c.startTime}-${c.endTime} ${sub.icon} ${sub.name}${c.room ? ' ('+c.room+')' : ''}\n`;
        });
        text += '\n';
      }
    });
    navigator.clipboard.writeText(text).then(() => {
      this.toast('📋 Jadval nusxalandi!');
    }).catch(() => {
      this.toast('❌ Nusxalashda xato');
    });
  },

  // ------------------------------------------
  // NOTIFICATIONS
  // ------------------------------------------
  async requestNotifications() {
    if (!('Notification' in window)) { this.toast('Brauzer bildirishnomalarni qo\'llab-quvvatlamaydi'); return; }
    const perm = await Notification.requestPermission();
    this.data.settings.notifications = perm === 'granted';
    this.save();
    if (perm === 'granted') {
      this.toast('🔔 Bildirishnomalar yoqildi!');
      this.scheduleClassNotifications();
    } else {
      this.toast('🔕 Bildirishnomalar rad etildi');
    }
    document.getElementById('notifBtn').textContent = perm === 'granted' ? '🔔' : '🔕';
  },

  notify(title, body) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: 'icons/icon-192.png' });
    }
  },

  // ------------------------------------------
  // TOAST
  // ------------------------------------------
  toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  },

  // ------------------------------------------
  // SECURITY
  // ------------------------------------------
  escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  },

  // ------------------------------------------
  // EVENT LISTENERS
  // ------------------------------------------
  updateNavBadges() {
    const today = this.dateStr(0);
    const pending = this.data.tasks.filter(t => !t.completed && t.dueDate <= today).length;
    const examsNear = this.data.exams.filter(e => { const d = this.daysUntil(e.date); return d !== null && d >= 0 && d <= 7; }).length;
    // Task badge on subjects nav
    const subNav = document.querySelector('[data-page="subjects"] .nav-icon');
    if (subNav) subNav.textContent = pending > 0 ? `📚${pending}` : '📚';
    // Exam badge
    const examNav = document.querySelector('[data-page="exams"] .nav-icon');
    if (examNav) examNav.textContent = examsNear > 0 ? `📝${examsNear}` : '📝';
  },

  fabAction() {
    const pageToModal = {
      today: 'task', tomorrow: 'task', subjects: 'task',
      week: 'class', exams: 'exam', pomodoro: null, stats: null,
    };
    const type = pageToModal[this.currentPage];
    if (type) this.openModal(type);
    else this.toast('Qo\'shish uchun boshqa bo\'limga o\'ting');
  },

  setupListeners() {
    document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());
    document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          const id = overlay.id.replace('modal-','');
          this.closeModal(id);
        }
      });
    });

    // Keyboard: Escape closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
          m.classList.remove('open');
        });
      }
    });

    // Update today every minute + refresh nav badges
    setInterval(() => {
      if (this.currentPage === 'today') this.renderToday();
      this.updateNavBadges();
    }, 60000);
    this.updateNavBadges();

    // Schedule notifications for today's classes on load
    setTimeout(() => this.scheduleClassNotifications(), 1000);

    // ---- Capacitor native integrations ----
    this.initCapacitor();
  },

  // ------------------------------------------
  // CAPACITOR NATIVE BRIDGE
  // ------------------------------------------
  initCapacitor() {
    if (!window.Capacitor) return;

    // Android orqa tugmasi
    document.addEventListener('ionBackButton', (ev) => {
      ev.detail.register(10, () => {
        const openModal = document.querySelector('.modal-overlay.open');
        if (openModal) {
          const id = openModal.id.replace('modal-', '');
          this.closeModal(id);
          return;
        }
        if (this.currentPage !== 'today') {
          this.navigate('today');
          return;
        }
        // Ikki marta bosilsa chiqish so'raladi
        if (this._backPressedOnce) {
          if (window.Capacitor.Plugins?.App) {
            window.Capacitor.Plugins.App.exitApp();
          }
        } else {
          this._backPressedOnce = true;
          this.toast('Chiqish uchun yana bir marta bosing');
          setTimeout(() => { this._backPressedOnce = false; }, 2000);
        }
      });
    });

    // Status bar rangini o'rnatish
    if (window.Capacitor.Plugins?.StatusBar) {
      const { StatusBar } = window.Capacitor.Plugins;
      StatusBar.setStyle({ style: 'LIGHT' });
      StatusBar.setBackgroundColor({ color: '#6C63FF' });
    }

    // Splash screeni yashirish
    if (window.Capacitor.Plugins?.SplashScreen) {
      window.Capacitor.Plugins.SplashScreen.hide({ fadeOutDuration: 500 });
    }

    // Keyboard pushup
    if (window.Capacitor.Plugins?.Keyboard) {
      const { Keyboard } = window.Capacitor.Plugins;
      Keyboard.addListener('keyboardWillShow', (info) => {
        document.body.style.paddingBottom = info.keyboardHeight + 'px';
      });
      Keyboard.addListener('keyboardWillHide', () => {
        document.body.style.paddingBottom = '';
      });
    }

    // App foreground/background
    if (window.Capacitor.Plugins?.App) {
      window.Capacitor.Plugins.App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          this.updateHeader();
          this.startClock();
          if (this.currentPage === 'today') this.renderToday();
        } else {
          clearInterval(this.clockInterval);
        }
      });
    }

    console.log('✅ Capacitor native bridge initialized');
  },
};

// =============================================
// BOOT
// =============================================
document.addEventListener('DOMContentLoaded', () => App.init());
