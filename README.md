# Coffee Cherry Backend

Storefront API (каталог, заказы, контакты).

## Демо

- URL: https://coffee-cherry.proskurin.site/
- Логин: `guest`
- Пароль: `guest`

## Переменные окружения

- `PORT` — порт API, по умолчанию `3001`.
- `MONGO_URI` — строка подключения к MongoDB.
- `NODE_ENV` — режим запуска.
- `CORS_ORIGIN` — разрешённые origins через запятую.
- `CORS_RELAXED_LOCAL` — разрешить локальные origins.
- `UPLOADS_DIR` — каталог статических изображений (read).

## Scripts

- `npm run dev` — dev-сервер.
- `npm run build` — сборка TypeScript.
- `npm start` — запуск production-сборки.
- `npm run seed` — заполнение БД после сборки.
- `npm run seed:dev` — заполнение БД в dev-режиме.
- `npm run migrate:images` — миграция изображений.
- `npm run lint` / `npm run lint:fix` — ESLint.
- `npm run format` / `npm run format:check` — Prettier.
- `npm test` / `npm run test:watch` — тесты.
