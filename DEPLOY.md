# Deploy: Railway + Vercel

Ниже инструкция для деплоя backend (Railway + Postgres) и frontend (Vercel).

## 1) Railway: Backend + Postgres

### Создать сервис
1. Railway → New Project → Deploy from GitHub.
2. Выбери репозиторий `portalsMR`.
3. Создай новый сервис для backend:
   - Root Directory: `backend`
   - Start Command:
     ```
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - Config-as-code: укажи файл `/backend/railway.json` (Settings → Config-as-code).

### Добавить Postgres
1. Railway → Add → Database → PostgreSQL.
2. Скопируй `DATABASE_URL` из Postgres service.
3. В backend service → Variables добавь:
   - `DATABASE_URL`
   - `JWT_SECRET_KEY`
   - `ACCESS_TOKEN_EXPIRE_MINUTES` (например `60`)
   - `S3_ENDPOINT_URL`
   - `S3_ACCESS_KEY`
   - `S3_SECRET_KEY`
   - `S3_BUCKET_NAME`
   - `S3_REGION`
   - `AI_PROVIDER`

### Проверка
Открой `https://<railway-service-url>/health` — должно вернуть `{"status": "ok"}`.

## 2) Vercel: Frontend

### Создать проект
1. Vercel → New Project → Import Git Repository.
2. Root Directory: `frontend`.
3. Build Command: `npm run build` (по умолчанию).
4. Output: `.next` (по умолчанию).
5. В корне репозитория есть `vercel.json` для монорепозитория.

### Переменные окружения (Vercel → Settings → Environment Variables)
Добавь:
- `NEXT_PUBLIC_API_BASE_URL` = `https://<railway-backend-url>`
- `NEXT_PUBLIC_WATERMARK_ENABLED` = `true`

### Проверка
Открой `https://<vercel-app-url>/login` и проверь вход.

## 3) Демо-доступ (локально/для проверки)
По умолчанию в seed:
- email: `demo@portal.local`
- пароль: `demo1234`

