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
