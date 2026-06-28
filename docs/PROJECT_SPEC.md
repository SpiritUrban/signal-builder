# Технічне завдання: Roadmap Manager для просування My Transfer

## Мета

Створити компактний сайт-інструмент для менеджменту SEO-розміщень My Transfer.

Сайт має допомагати:

* рухатись по roadmap розміщення компанії;
* бачити всі майданчики та етапи;
* чекати виконані пункти;
* додавати нотатки до кожного пункту;
* швидко копіювати готові тексти для розміщення;
* експортувати поточний стан у файл;
* імпортувати стартовий стан із файлу;
* зберігати локальний прогрес у браузері.

---

# Стек

Бажано:

* Next.js / React
* TypeScript
* Tailwind CSS
* LocalStorage
* Без backend на першій версії

Проєкт має працювати як статичний сайт.

---

# Дизайн

Темна тема.

Стиль:

* сучасний;
* соковитий;
* компактний;
* roadmap / dashboard vibe;
* акценти: cyan, violet, lime, orange;
* багато інформації, але без візуального хаосу.

Інтерфейс має бути зручний для щоденної роботи.

---

# Основні сторінки

## 1. Dashboard / Roadmap

Головна сторінка з усіма етапами.

Потрібно показувати:

* загальний прогрес;
* кількість виконаних пунктів;
* кількість пунктів у роботі;
* кількість запланованих пунктів;
* roadmap по рівнях;
* швидкий пошук;
* фільтри.

Фільтри:

* всі;
* виконано;
* в роботі;
* заплановано;
* без нотаток;
* з нотатками;
* за рівнем;
* за типом майданчика.

---

# Структура одного пункту roadmap

Кожен пункт має мати:

* id
* title
* category
* level
* priority
* status
* url
* targetUrl
* login
* contact
* price
* seoValue
* clientValue
* difficulty
* description
* recommendedText
* notes
* createdAt
* updatedAt

---

# Status

Можливі статуси:

* planned
* in_progress
* done
* skipped
* problem

---

# Картка пункту

У кожній картці має бути:

* назва майданчика;
* тип: каталог / соцмережа / ЗМІ / оголошення / група / відео / стаття;
* рівень пріоритету;
* SEO-цінність;
* складність;
* кнопка “Виконано”;
* select статусу;
* поле URL сторінки після розміщення;
* поле нотаток;
* кнопка “Скопіювати текст”;
* кнопка “Скопіювати дані компанії”;
* дата останнього оновлення.

Нотатки мають бути біля кожного пункту, не в окремому модальному вікні.

---

# База даних компанії

Окремий блок “Company Info”.

Там мають бути готові тексти:

* короткий опис;
* середній опис;
* повний опис;
* список ключових слів;
* список основних маршрутів;
* список переваг;
* автопарк;
* контактні дані;
* сайт;
* Google Maps link.

Біля кожного поля:

* кнопка copy;
* textarea для власної нотатки;
* можливість редагувати текст локально.

---

# Експорт звіту

Має бути кнопка:

“Скачати звіт”

Формат:

* .txt або .md
* бажано JSON + Markdown в одному файлі або окремі кнопки:

  * Export JSON
  * Export Markdown Report

У звіті має бути:

* дата експорту;
* загальна статистика;
* виконані етапи;
* етапи в роботі;
* заплановані етапи;
* проблемні етапи;
* нотатки до кожного пункту;
* URL розміщення, якщо є;
* поточний стан company info.

---

# Імпорт стану

Має бути кнопка:

“Імпортувати стан”

Логіка:

1. Проєкт має мати базовий initialData файл.
2. При запуску сайт бере стартовий стан з initialData.
3. Потім накладає зміни з localStorage.
4. Користувач може імпортувати JSON-файл.
5. Імпортований файл оновлює стан.
6. Після імпорту дані також зберігаються в localStorage.

---

# LocalStorage

Зберігати:

* статуси пунктів;
* нотатки;
* URL розміщень;
* редаговані тексти company info;
* дату останньої зміни.

Ключ localStorage:

my-transfer-roadmap-state

---

# Reset

Має бути кнопка:

“Скинути локальне сховище”

Обов’язково:

* confirmation dialog;
* попередження, що локальні зміни буде видалено;
* бажано ввести слово RESET для підтвердження.

Після reset:

* очистити localStorage;
* перезавантажити стан з initialData.

---

# Дані roadmap

Початкові категорії:

1. Карти
2. Соцмережі
3. Каталоги
4. Оголошення
5. Facebook групи
6. Telegram канали
7. Регіональні ЗМІ
8. Великі ЗМІ
9. Міжнародні платформи
10. Власний контент
11. Відгуки

---

# Початкові пункти roadmap

Додати стартовий список:

* Google Business Profile
* Bing Places
* Apple Business Connect
* HERE Maps
* TomTom Places
* OpenStreetMap
* Waze
* Facebook Page
* Instagram
* TikTok
* YouTube
* LinkedIn Company Page
* Hotfrog
* Brownbook
* Cylex
* MisterWhat
* Tupalo
* Fyple
* Yellow.Place
* Callupcontact
* ShowMeLocal
* Yalwa
* OLX
* Flagma
* Obyava.ua
* Ukrboard
* Bizator
* RIA
* Besplatka
* Prom.ua
* Visit Ukraine
* Facebook групи українців у Польщі
* Telegram канали українців у Польщі
* 0382.ua
* 20minut.ua
* 0432.ua
* 0352.ua
* 032.ua
* 057.ua
* 056.ua
* 048.ua
* Telegraf
* OBOZ
* УНІАН
* РБК Україна
* Фокус
* ЛІГА
* NV
* Reddit
* Quora
* Medium
* LinkedIn Articles
* Blogger
* Substack
* Google Reviews
* Facebook Reviews
* Trustpilot

---

# UX вимоги

Інтерфейс має бути швидкий.

Без зайвих сторінок.

Бажано зробити:

* sticky top bar;
* progress bar;
* search;
* compact cards;
* collapsible groups;
* кнопки copy;
* autosave;
* toast повідомлення “збережено”, “скопійовано”, “експортовано”.

---

# Структура файлів

Бажана структура:

src/
app/
page.tsx
components/
RoadmapDashboard.tsx
RoadmapCard.tsx
CompanyInfoPanel.tsx
ProgressStats.tsx
ImportExportPanel.tsx
FiltersBar.tsx
data/
initialRoadmap.ts
companyInfo.ts
lib/
storage.ts
export.ts
import.ts
types.ts

---

# Типи TypeScript

Створити типи:

RoadmapItem

CompanyInfo

RoadmapStatus

RoadmapCategory

ExportState

---

# Головний сценарій користувача

1. Користувач відкриває сайт.
2. Бачить roadmap.
3. Відкриває перший пункт.
4. Копіює опис компанії.
5. Розміщує інформацію на майданчику.
6. Вставляє URL розміщення.
7. Додає нотатку.
8. Ставить статус done.
9. Прогрес автоматично оновлюється.
10. В кінці роботи експортує звіт.
11. Файл звіту може бути доданий у проєкт як новий initial state.

---

# Важлива логіка

Дані з initialData не мають перезаписувати localStorage автоматично.

Правильний порядок:

1. Завантажити initialData.
2. Завантажити localStorage.
3. Змерджити.
4. Показати користувачу merged state.

LocalStorage має пріоритет над initialData.

---

# Результат

Потрібно отримати готовий робочий сайт-дашборд, через який можна менеджерити процес SEO-розміщення My Transfer і не втрачати прогрес між сесіями.
