/**
 * Internationalization (i18n) — Uzbek, English, Russian
 */
'use strict';

const I18N = {
  uz: {
    // App
    app_title: "Talaba Rejasi",

    // Greetings
    greet_morning: "Xayrli tong!",
    greet_day:     "Xayrli kun!",
    greet_evening: "Xayrli oqshom!",

    // Nav
    nav_today: "Bugun",
    nav_tomorrow: "Ertaga",
    nav_week: "Hafta",
    nav_month: "Oy",
    nav_subjects: "Fanlar",
    nav_pomodoro: "Pomodoro",
    nav_exams: "Imtihon",
    nav_grades: "Baholar",
    nav_goals: "Maqsadlar",
    nav_stats: "Statistika",

    // Common
    save: "Saqlash",
    cancel: "Bekor qilish",
    delete: "O'chirish",
    edit: "Tahrirlash",
    add: "Qo'shish",
    today: "Bugun",
    tomorrow: "Ertaga",
    yesterday: "Kecha",

    // Today page
    today_classes: "Bugungi jadval",
    today_tasks: "Bugungi vazifalar",
    free_time: "Bo'sh vaqtlar",
    no_classes_today: "Bugun dars yo'q",
    no_tasks_today: "Bugun vazifa yo'q",
    add_class: "Dars qo'shish",
    add_task: "Vazifa qo'shish",

    // Stats
    stat_classes: "Dars",
    stat_tasks: "Vazifa",
    stat_done: "Bajarildi",
    stat_pomodoros: "Pomodoro",

    // Tomorrow
    tomorrow_classes: "Ertangi darslar",
    tomorrow_tasks: "Ertanga vazifalar",
    auto_schedule: "Avtomatik taqsimot",
    auto_schedule_desc: "Darslar orasidagi bo'sh vaqtlarga tavsiyalar:",

    // Week
    this_week: "Bu hafta",
    weeks_ago: "hafta oldin",
    weeks_later: "hafta keyin",
    no_classes_day: "Bo'sh kun",

    // Subjects
    subjects: "Fanlar",
    add_subject: "Fan qo'shish",
    all_tasks: "Barcha vazifalar",
    filter_all: "Barchasi",
    filter_status: "Holat",
    filter_active: "Faol",
    filter_done: "Bajarilgan",
    search_tasks: "Vazifa qidirish...",

    // Pomodoro
    pomodoro_work: "Ishlash",
    pomodoro_break: "Dam olish",
    pomodoro_long: "Uzun tanaffus",
    pomodoro_start: "Boshlash",
    pomodoro_pause: "Pauza",
    pomodoro_resume: "Davom etish",
    select_subject: "Fan tanlang...",
    today_sessions: "Bugungi sessiyalar",
    no_sessions: "Bugun sessiya yo'q",
    work_time: "Ishlash vaqti (daqiqa)",
    break_time: "Dam olish vaqti",
    long_break: "Uzun tanaffus",
    weekly_goal: "Haftalik maqsad",

    // Exams
    exams: "Imtihonlar",
    add_exam: "Imtihon qo'shish",
    no_exams: "Imtihon qo'shilmagan",
    exam_passed: "O'tdi",
    exam_today: "BUGUN!",
    exam_soon: "Yaqin!",
    days_left: "kun",
    days_passed: "kun o'tdi",

    // Forms
    form_subject: "Fan",
    form_start: "Boshlanish",
    form_end: "Tugash",
    form_room: "Xona / Auditoriya",
    form_teacher: "O'qituvchi",
    form_days: "Kun(lar)",
    form_class_type: "Dars turi",
    form_lecture: "Ma'ruza",
    form_practice: "Amaliyot",
    form_lab: "Laboratoriya",
    form_seminar: "Seminar",
    form_title: "Vazifa nomi",
    form_due: "Muddat",
    form_priority: "Muhimlik",
    form_priority_high: "Muhim",
    form_priority_medium: "O'rtacha",
    form_priority_low: "Oddiy",
    form_description: "Izoh",
    form_recurring: "Takrorlanish",
    form_rec_none: "Bir martalik",
    form_rec_daily: "Har kuni",
    form_rec_weekly: "Har hafta",
    form_rec_monthly: "Har oy",
    form_rec_weekdays: "Har ish kuni",
    form_image: "Rasm biriktirish",
    form_image_pick: "Rasm tanlash yoki kameradan olish",

    // Settings
    settings: "Sozlamalar",
    appearance: "Ko'rinish",
    dark_mode: "Qorong'u rejim",
    dark_mode_desc: "Ko'z uchun qulay",
    theme_color: "Rang mavzusi",
    theme_color_desc: "Asosiy rang tanlash",
    notifications: "Bildirishnomalar",
    class_reminders: "Dars eslatmalari",
    class_reminders_desc: "10 daqiqa oldin va boshlanishida",
    task_reminders: "Vazifa eslatmasi",
    language: "Til",
    language_desc: "Ilova tilini tanlang",
    data: "Ma'lumotlar",
    export_import: "Eksport / Import",
    clear_completed: "Bajarilgan vazifalarni tozalash",
    reset_all: "Barcha ma'lumotlarni o'chirish",
    about: "Ilova haqida",

    // Toasts
    saved: "Saqlandi",
    added: "Qo'shildi",
    updated: "Yangilandi",
    deleted: "O'chirildi",
    enter_name: "Nomini kiriting",
    enter_required: "Barcha majburiy maydonlarni to'ldiring",

    // Goals
    goals_summary: "Maqsadlar qo'ying va kuzatib boring",
    active_goals: "Faol maqsadlar",
    completed_goals: "Bajarilgan maqsadlar",
    no_goals: "Maqsad qo'shilmagan",

    // Grades
    overall_gpa: "O'rtacha (GPA)",
    grades_total: "Baholar",
    grades_pct: "Foiz",
    grades_by_subject: "Fanlar bo'yicha",
    recent_grades: "Oxirgi baholar",
    no_grades: "Hali baholar yo'q",

    // Calendar
    back_to_today: "Bugunga qaytish",
    selected_day: "Tanlangan kun",
    nothing_today: "Bu kunda hech narsa yo'q",

    // Share
    share: "Ulashish",
    share_qr: "QR kod",
    share_link: "Havola",
    share_file: "Fayl",
    share_qr_desc: "Sinfdoshingiz QR kodni telefoni bilan o'qisin va jadvalingiz unga import bo'ladi.",
    share_link_desc: "Havolani nusxalab istalgan joyga yuboring.",
    share_file_desc: "Barcha ma'lumotlarni fayl ko'rinishida saqlang yoki yuklang.",
  },

  en: {
    app_title: "Student Planner",

    greet_morning: "Good morning!",
    greet_day:     "Good day!",
    greet_evening: "Good evening!",

    nav_today: "Today",
    nav_tomorrow: "Tomorrow",
    nav_week: "Week",
    nav_month: "Month",
    nav_subjects: "Subjects",
    nav_pomodoro: "Pomodoro",
    nav_exams: "Exams",
    nav_grades: "Grades",
    nav_goals: "Goals",
    nav_stats: "Stats",

    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",

    today_classes: "Today's Schedule",
    today_tasks: "Today's Tasks",
    free_time: "Free Time",
    no_classes_today: "No classes today",
    no_tasks_today: "No tasks today",
    add_class: "Add Class",
    add_task: "Add Task",

    stat_classes: "Classes",
    stat_tasks: "Tasks",
    stat_done: "Done",
    stat_pomodoros: "Pomodoros",

    tomorrow_classes: "Tomorrow's Classes",
    tomorrow_tasks: "Tomorrow's Tasks",
    auto_schedule: "Auto Schedule",
    auto_schedule_desc: "Suggestions for free time between classes:",

    this_week: "This week",
    weeks_ago: "weeks ago",
    weeks_later: "weeks later",
    no_classes_day: "Free day",

    subjects: "Subjects",
    add_subject: "Add Subject",
    all_tasks: "All Tasks",
    filter_all: "All",
    filter_status: "Status",
    filter_active: "Active",
    filter_done: "Done",
    search_tasks: "Search tasks...",

    pomodoro_work: "Work",
    pomodoro_break: "Break",
    pomodoro_long: "Long Break",
    pomodoro_start: "Start",
    pomodoro_pause: "Pause",
    pomodoro_resume: "Resume",
    select_subject: "Select subject...",
    today_sessions: "Today's Sessions",
    no_sessions: "No sessions today",
    work_time: "Work time (minutes)",
    break_time: "Break time",
    long_break: "Long break",
    weekly_goal: "Weekly goal",

    exams: "Exams",
    add_exam: "Add Exam",
    no_exams: "No exams added",
    exam_passed: "Passed",
    exam_today: "TODAY!",
    exam_soon: "Soon!",
    days_left: "days",
    days_passed: "days ago",

    form_subject: "Subject",
    form_start: "Start",
    form_end: "End",
    form_room: "Room",
    form_teacher: "Teacher",
    form_days: "Day(s)",
    form_class_type: "Class Type",
    form_lecture: "Lecture",
    form_practice: "Practice",
    form_lab: "Lab",
    form_seminar: "Seminar",
    form_title: "Task Title",
    form_due: "Due Date",
    form_priority: "Priority",
    form_priority_high: "High",
    form_priority_medium: "Medium",
    form_priority_low: "Low",
    form_description: "Description",
    form_recurring: "Recurring",
    form_rec_none: "One-time",
    form_rec_daily: "Daily",
    form_rec_weekly: "Weekly",
    form_rec_monthly: "Monthly",
    form_rec_weekdays: "Weekdays",
    form_image: "Attach image",
    form_image_pick: "Pick image or use camera",

    settings: "Settings",
    appearance: "Appearance",
    dark_mode: "Dark Mode",
    dark_mode_desc: "Easy on eyes",
    theme_color: "Theme Color",
    theme_color_desc: "Pick primary color",
    notifications: "Notifications",
    class_reminders: "Class Reminders",
    class_reminders_desc: "10 minutes before & at start",
    task_reminders: "Task Reminders",
    language: "Language",
    language_desc: "Choose app language",
    data: "Data",
    export_import: "Export / Import",
    clear_completed: "Clear Completed Tasks",
    reset_all: "Reset All Data",
    about: "About",

    saved: "Saved",
    added: "Added",
    updated: "Updated",
    deleted: "Deleted",
    enter_name: "Enter name",
    enter_required: "Fill in all required fields",

    goals_summary: "Set goals and track them",
    active_goals: "Active Goals",
    completed_goals: "Completed Goals",
    no_goals: "No goals added",

    overall_gpa: "Overall GPA",
    grades_total: "Grades",
    grades_pct: "Average",
    grades_by_subject: "By Subject",
    recent_grades: "Recent Grades",
    no_grades: "No grades yet",

    back_to_today: "Back to today",
    selected_day: "Selected day",
    nothing_today: "Nothing on this day",

    share: "Share",
    share_qr: "QR Code",
    share_link: "Link",
    share_file: "File",
    share_qr_desc: "Have your classmate scan the QR code with their phone — your schedule will be imported.",
    share_link_desc: "Copy the link and send it anywhere.",
    share_file_desc: "Save or load all data as a file.",
  },

  ru: {
    app_title: "Дневник Студента",

    greet_morning: "Доброе утро!",
    greet_day:     "Добрый день!",
    greet_evening: "Добрый вечер!",

    nav_today: "Сегодня",
    nav_tomorrow: "Завтра",
    nav_week: "Неделя",
    nav_month: "Месяц",
    nav_subjects: "Предметы",
    nav_pomodoro: "Помодоро",
    nav_exams: "Экзамен",
    nav_grades: "Оценки",
    nav_goals: "Цели",
    nav_stats: "Статистика",

    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Изменить",
    add: "Добавить",
    today: "Сегодня",
    tomorrow: "Завтра",
    yesterday: "Вчера",

    today_classes: "Расписание на сегодня",
    today_tasks: "Задачи на сегодня",
    free_time: "Свободное время",
    no_classes_today: "Сегодня нет занятий",
    no_tasks_today: "Сегодня нет задач",
    add_class: "Добавить занятие",
    add_task: "Добавить задачу",

    stat_classes: "Занятий",
    stat_tasks: "Задач",
    stat_done: "Сделано",
    stat_pomodoros: "Помодоро",

    tomorrow_classes: "Занятия на завтра",
    tomorrow_tasks: "Задачи на завтра",
    auto_schedule: "Автоматическое распределение",
    auto_schedule_desc: "Рекомендации для свободного времени:",

    this_week: "Эта неделя",
    weeks_ago: "недель назад",
    weeks_later: "недель вперёд",
    no_classes_day: "Свободный день",

    subjects: "Предметы",
    add_subject: "Добавить предмет",
    all_tasks: "Все задачи",
    filter_all: "Все",
    filter_status: "Статус",
    filter_active: "Активные",
    filter_done: "Сделанные",
    search_tasks: "Поиск задач...",

    pomodoro_work: "Работа",
    pomodoro_break: "Перерыв",
    pomodoro_long: "Длинный перерыв",
    pomodoro_start: "Начать",
    pomodoro_pause: "Пауза",
    pomodoro_resume: "Продолжить",
    select_subject: "Выберите предмет...",
    today_sessions: "Сегодняшние сессии",
    no_sessions: "Сегодня сессий нет",
    work_time: "Время работы (мин)",
    break_time: "Время перерыва",
    long_break: "Длинный перерыв",
    weekly_goal: "Цель на неделю",

    exams: "Экзамены",
    add_exam: "Добавить экзамен",
    no_exams: "Экзамены не добавлены",
    exam_passed: "Прошёл",
    exam_today: "СЕГОДНЯ!",
    exam_soon: "Скоро!",
    days_left: "дней",
    days_passed: "дней назад",

    form_subject: "Предмет",
    form_start: "Начало",
    form_end: "Конец",
    form_room: "Аудитория",
    form_teacher: "Преподаватель",
    form_days: "День(дни)",
    form_class_type: "Тип занятия",
    form_lecture: "Лекция",
    form_practice: "Практика",
    form_lab: "Лаборатория",
    form_seminar: "Семинар",
    form_title: "Название задачи",
    form_due: "Срок",
    form_priority: "Важность",
    form_priority_high: "Высокая",
    form_priority_medium: "Средняя",
    form_priority_low: "Низкая",
    form_description: "Описание",
    form_recurring: "Повторение",
    form_rec_none: "Однократно",
    form_rec_daily: "Ежедневно",
    form_rec_weekly: "Еженедельно",
    form_rec_monthly: "Ежемесячно",
    form_rec_weekdays: "Будни",
    form_image: "Прикрепить фото",
    form_image_pick: "Выбрать фото или с камеры",

    settings: "Настройки",
    appearance: "Внешний вид",
    dark_mode: "Тёмная тема",
    dark_mode_desc: "Удобно для глаз",
    theme_color: "Цвет темы",
    theme_color_desc: "Выберите основной цвет",
    notifications: "Уведомления",
    class_reminders: "Напоминания о занятиях",
    class_reminders_desc: "За 10 минут и в начале",
    task_reminders: "Напоминания о задачах",
    language: "Язык",
    language_desc: "Выберите язык приложения",
    data: "Данные",
    export_import: "Экспорт / Импорт",
    clear_completed: "Очистить выполненные задачи",
    reset_all: "Сбросить все данные",
    about: "О приложении",

    saved: "Сохранено",
    added: "Добавлено",
    updated: "Обновлено",
    deleted: "Удалено",
    enter_name: "Введите название",
    enter_required: "Заполните все обязательные поля",

    goals_summary: "Ставьте цели и отслеживайте их",
    active_goals: "Активные цели",
    completed_goals: "Достигнутые цели",
    no_goals: "Цели не добавлены",

    overall_gpa: "Средний балл",
    grades_total: "Оценки",
    grades_pct: "Процент",
    grades_by_subject: "По предметам",
    recent_grades: "Последние оценки",
    no_grades: "Оценок пока нет",

    back_to_today: "К сегодня",
    selected_day: "Выбранный день",
    nothing_today: "В этот день ничего нет",

    share: "Поделиться",
    share_qr: "QR код",
    share_link: "Ссылка",
    share_file: "Файл",
    share_qr_desc: "Дайте однокласснику отсканировать QR код — ваше расписание импортируется.",
    share_link_desc: "Скопируйте ссылку и отправьте куда угодно.",
    share_file_desc: "Сохраните или загрузите все данные как файл.",
  },
};

// Translation function
function t(key) {
  const lang = (window.App && window.App.data && window.App.data.settings && window.App.data.settings.language) || 'uz';
  return (I18N[lang] && I18N[lang][key]) || I18N.uz[key] || key;
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
}

window.t = t;
window.I18N = I18N;
window.applyTranslations = applyTranslations;
