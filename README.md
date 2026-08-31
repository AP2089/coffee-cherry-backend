# coffee cherry — backend

REST API для магазина specialty-кофе. Стек: Node.js, Express, TypeScript, MongoDB, Mongoose.

## Запуск (Docker)

```bash
docker compose up -d --build
docker compose exec backend npm run seed
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
| `PORT`                | Порт HTTP-сервера API                                                        |
| `MONGO_URI`           | MongoDB для локального запуска без Docker                                    |
| `DOCKER_MONGO_URI`    | MongoDB внутри Docker Compose                                                |
| `NODE_ENV`            | Режим работы: `development` или `production`                                 |
| `CORS_ORIGIN`         | Разрешённые origins frontend, CRM и helpdesk через запятую                   |
| `CORS_RELAXED_LOCAL`  | Разрешить локальные origins при `true`; на production должно быть `false`    |
| `JWT_SECRET`          | Секрет подписи JWT; на production обязательно заменить                       |
| `SUPPORT_AGENT_TOKEN` | Дополнительный токен оператора Socket.IO; пустое значение отключает проверку |
| `UPLOADS_DIR`         | Каталог изображений при локальном запуске                                    |

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
- `npm run migrate:images` — перенос изображений
- `npm test` — тесты
- `npm run lint` — ESLint
