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
