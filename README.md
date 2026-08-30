# coffee cherry — backend

REST API для магазина specialty-кофе. Стек: Node.js, Express, TypeScript, MongoDB, Mongoose.

## Запуск (Docker)

```bash
docker compose up -d --build
docker compose exec backend npm run seed
```

Dev-режим с hot reload:

```bash
docker compose -f docker-compose.dev.yml up --build
```

API: http://localhost:3001  
Health: http://localhost:3001/api/health

## Локальный запуск без Docker

Нужен MongoDB и Node.js ≥ 20.

```bash
npm install
npm run seed:dev
npm run dev
```

## Переменные окружения

Файл `.env` в корне проекта.

| Переменная            | Описание                                                                     |
| --------------------- | ---------------------------------------------------------------------------- |
| `PORT`                | Порт HTTP-сервера API (по умолчанию `3001`)                                  |
| `MONGO_URI`           | Строка подключения к MongoDB                                                 |
| `NODE_ENV`            | Режим работы: `development` или `production`                                 |
| `CORS_ORIGIN`         | Разрешённые origins фронтенда, CRM и helpdesk (через запятую)                |
| `CORS_RELAXED_LOCAL`  | Разрешить локальные origins (`localhost`, `127.0.0.1`) при `true`            |
| `JWT_SECRET`          | Секрет для подписи JWT-токенов авторизации                                   |
| `SUPPORT_AGENT_TOKEN` | Токен для подключения операторов helpdesk к Socket.IO (пусто — без проверки) |
| `UPLOADS_DIR`         | Путь к каталогу загруженных изображений товаров                              |

## Endpoints

| Метод   | Путь                 | Описание               |
| ------- | -------------------- | ---------------------- |
| `GET`   | `/api/health`        | Healthcheck            |
| `GET`   | `/api/coffees`       | Список кофе            |
| `GET`   | `/api/coffees/:slug` | Карточка по slug       |
| `POST`  | `/api/orders`        | Создать заказ          |
| `GET`   | `/api/orders/:id`    | Получить заказ         |
| `PATCH` | `/api/orders/:id`    | Обновить статус заказа |

## Scripts

- `npm run dev` — разработка (`tsx watch`)
- `npm run build` / `npm start` — production
- `npm run seed` — seed после build
- `npm run seed:dev` — seed в dev
