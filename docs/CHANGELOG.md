# Ітерація 1 — 2026-06-28

## Зроблено

- Ініціалізовано Next.js 15 + TypeScript + Tailwind CSS.
- Додано адаптивний темний roadmap dashboard зі статистикою, пошуком і фільтрами.
- Додано 102 стартові пункти з `ROADMAP_DATA.md`.
- Реалізовано редагування статусу, URL і нотаток з автозбереженням у `localStorage`.
- Налаштовано static export та GitHub Actions deploy на GitHub Pages.

## Перевірка

- `npm run build`

## Назва коміту

`Build initial My Transfer roadmap dashboard`

# Ітерація 2 — 2026-06-28

## Зроблено

- Додано кнопку відкриття URL розміщення у новій вкладці.
- Кнопка відображається лише коли поле URL заповнене.
- Для адрес без протоколу автоматично використовується `https://`.

## Перевірка

- `npx tsc --noEmit`
- Production build відкладено: запущений dev-сервер утримує `.next/trace`.

## Назва коміту

`Add placement URL quick-open button`

# Ітерація 3 — 2026-06-28

## Зроблено

- Підключено Supabase JavaScript SDK.
- Додано спільний browser client у `src/lib/supabase.ts`.
- Локальні змінні перейменовано з `VITE_` на потрібний Next.js-префікс `NEXT_PUBLIC_`.
- GitHub Actions передає Supabase URL і publishable key із Repository Secrets під час build.
- Додано безпечний шаблон `.env.example` без реальних ключів.

## Перевірка

- `npx tsc --noEmit`
- `.env.local` підтверджено виключений із Git.
- Production build відкладено: активний dev-сервер утримує `.next`.

## Назва коміту

`Configure Supabase client and GitHub Actions secrets`

# Ітерація 4 — 2026-06-28

## Зроблено

- Замість аватара `MT` додано компактний індикатор стану Supabase.
- Індикатор перевіряє реальне REST-з’єднання: зелений при успіху, червоний при помилці, жовтий під час перевірки.
- На hover або click відкривається попап із доменом проєкту, затримкою, HTTP-статусом і часом перевірки.
- Додано ручну повторну перевірку з’єднання.

## Перевірка

- `npx tsc --noEmit`
- `npm run lint`

## Назва коміту

`Add Supabase connection status beacon`

# Ітерація 5 — 2026-06-28

## Зроблено

- Створено окрему папку `docs/` для проєктної документації.
- Перенесено специфікацію, roadmap-дані, інформацію про компанію та changelog.

## Перевірка

- Перевірено структуру файлів і посилання на документацію.

## Назва коміту

`Organize project documentation`

# Ітерація 6 — 2026-06-28

## Зроблено

- GitHub Actions переведено з `secrets.*` на `vars.*` для публічних Supabase-змінних.
- Health-check переведено на безпечний PostgREST probe лише з `apikey`, оскільки `sb_publishable_` не є JWT для Bearer-заголовка.
- Очікуваний `404` неіснуючої probe-таблиці правильно трактується як успішне з’єднання з PostgREST.
- Для HTTP 401 індикатор тепер показує точне повідомлення про неприйнятий publishable key.

## Перевірка

- Локальний PostgREST probe: ключ прийнято, gateway повернув очікуваний `404`.
- `npx tsc --noEmit`

## Назва коміту

`Fix Supabase variables in GitHub Pages build`

# Ітерація 7 — 2026-06-28

## Зроблено

- Проведено повний аудит env-назв, Supabase client, beacon, GitHub Actions і опублікованого JS bundle.
- У workflow додано fail-fast перевірку наявності URL та publishable key перед `next build`.
- У GitHub Actions log виводяться безпечні діагностичні дані: URL, наявність ключа, довжина та перші 15 символів.
- У beacon-попап додано env URL, наявність і довжину ключа, префікс, endpoint, HTTP-статус і build timestamp.
- Додано тимчасовий console debug із тими самими публічними діагностичними даними.
- Підтверджено, що продакшн bundle містить актуальний URL, 46-символьний publishable key і probe endpoint.
- Виявлено GitHub Pages HTML cache `max-age=600`; content-hashed JS bundle оновлюється після нового build.

## Перевірка

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Перевірка опублікованого GitHub Pages HTML і JS bundle.
- Перевірка останнього успішного GitHub Actions run та commit SHA.

## Назва коміту

`Add Supabase deployment diagnostics`

# Ітерація 8 — 2026-06-28

## Зроблено

- Fingerprint-аудит довів, що локальний і production publishable keys різні.
- Локальний ключ проходить PostgREST probe з HTTP 404, production key отримує HTTP 401.
- У GitHub Actions додано реальний REST probe: deploy з неправильним ключем тепер зупиняється до build.
- Build timestamp формується один раз у workflow та передається через `GITHUB_ENV`.
- Прибрано нестабільний `new Date()` з `next.config.ts`, який генерував різні timestamp під час одного build.
- Timestamp відображається у стабільному ISO-форматі, що усуває React hydration error #418.

## Потрібна зовнішня дія

- Замінити значення Repository Variable `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` на актуальне значення з локального `.env.local`.

## Перевірка

- Локальний key fingerprint: `682899879f346ac7`, probe HTTP 404.
- Production key fingerprint: `d5dbdf8eaecafda5`, probe HTTP 401.
- `npx tsc --noEmit`
- `npm run lint`

## Назва коміту

`Validate Supabase key before deployment`

# Ітерація 9 — 2026-06-28

## Зроблено

- Повністю видалено читання й запис у `localStorage`.
- Додано таблицю Supabase `roadmap_items` для статусів, URL, нотаток і часу оновлення.
- Додано SQL migration із RLS-політиками, trigger `updated_at` та Realtime publication.
- Зміни картки зберігаються після debounce 3 секунди.
- На картці додано лаконічні стани: очікує, зберігається, збережено, помилка.
- При помилці виконуються три автоматичні спроби; після них доступна ручна кнопка retry.
- Підключено Supabase Realtime для синхронізації змін між браузерами.
- Додано захист незбереженої локальної правки від перезапису Realtime-подією.
- Health-check та CI probe переведено на реальну таблицю `roadmap_items`.
- Додано інструкцію `docs/SUPABASE_SETUP.md`.

## Перевірка

- `npx tsc --noEmit`
- `npm run lint`

## Назва коміту

`Move roadmap persistence to Supabase`

# Ітерація 10 — 2026-06-28

## Зроблено

- Додано документ `docs/SUPABASE_DATA_FLOW.md`.
- Описано принцип роботи Next.js, PostgREST, PostgreSQL, RLS і Realtime.
- Додано простий CRUD-приклад.
- Додано розширений приклад autosave із debounce, retry та live-синхронізацією.
- Задокументовано захист незбережених змін і поточну модель безпеки.

## Назва коміту

`Document Supabase persistence and realtime flow`

# Ітерація 11 — 2026-06-28

## Зроблено

- Клік по компактній картці відкриває окремий focus modal.
- На desktop modal має квадратний розмір приблизно `80vh × 80vh`.
- На mobile modal займає всю доступну ширину та близько `82vh` висоти.
- Додано велику адаптивну область нотаток.
- Поля modal використовують той самий debounce, Supabase save status і retry.
- Закриття працює через хрестик, Escape або клік по розмитій підкладці.
- Інтерактивні поля компактної картки не відкривають modal випадково.

## Перевірка

- `npx tsc --noEmit`
- `npm run lint`

## Назва коміту

`Add focused roadmap card modal`

# Ітерація 12 — 2026-06-28

## Зроблено

- Додано окремі стримані кольорові стани для карток і focus modal.
- `planned` — синьо-сірий, `in_progress` — фіолетовий, `done` — зелено-бірюзовий.
- `skipped` — приглушений сірий, `problem` — м’який червоний.
- Відтінки застосовано до фону, рамки та легкого внутрішнього підсвічування без кислотної насиченості.

## Назва коміту

`Add subtle status colors to roadmap cards`

# Ітерація 13 — 2026-06-28

## Зроблено

- Біля назви кожної картки додано напівпрозору кнопку переходу до сервісу.
- Використано ту саму іконку `ExternalLink`, що й у полі URL розміщення.
- Для відомих платформ додано прямі офіційні адреси.
- Для узагальнених roadmap-пунктів додано релевантний пошуковий перехід.
- Посилання відкриваються в новій вкладці та не запускають focus modal.

## Назва коміту

`Add service links to roadmap cards`

# Ітерація 14 — 2026-06-28

## Зроблено

- Додано сторінку `/company` з бібліотекою інформації про My Transfer.
- У top navigation додано переходи `Roadmap` і `Company Info`.
- Дані з `docs/COMPANY_INFO.md` структуровано під типові поля форм і контентні задачі.
- Додано блоки назв, описів різної довжини, маршрутів, аудиторій, переваг, автопарку, послуг, географії та SEO-ключів.
- Кожен блок має окрему кнопку копіювання з підтвердженням.
- Сторінка адаптована для desktop, tablet і mobile.

## Перевірка

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Назва коміту

`Add structured company info library`

# Ітерація 15 — 2026-06-28

## Зроблено

- Company Info переведено з row-based grid на компактний masonry-потік без великих порожніх зон.
- Зменшено висоту hero, зовнішні відступи та padding карток.
- Заголовки звичайних блоків виділено cyan, великих текстових блоків — м’яким violet.
- Прибрано дубль `Roadmap` біля логотипа.
- Збережено адаптивні 3/2/1 колонки для desktop, tablet і mobile.

## Назва коміту

`Compact company info card layout`
