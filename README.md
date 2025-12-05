# Minyan Tracker

A full-stack Minyan Tracker application with a Mobile App (React Native), Web Frontend (React), and Backend API (Node.js/Express).

## Project Structure

- `mobile/`: Existing React Native / Expo application.
- `web/`: New React web frontend (Vite).
- `server/`: Backend API (Node.js, Express, Prisma, SQLite).

## Quick Start

### 1. Backend (`/server`)

The backend manages data persistence and business logic.

```bash
cd server
npm install
# Initialize database
npx prisma migrate dev --name init
# Seed initial data (Shuls)
npm run seed
# Start development server
npm run dev
```

The server runs on `http://localhost:3000`.

### 2. Web Frontend (`/web`)

The web frontend allows tracking minyanim from a browser.

```bash
cd web
npm install
npm run dev
```

The web app runs on `http://localhost:5173` (by default) and proxies API requests to `http://localhost:3000`.

### 3. Mobile App (`/mobile`)

The original mobile app.

```bash
cd mobile
npm install
npm start
```

## Deployment

### Backend
Deploy the `server` directory to any Node.js hosting provider (Render, Railway, Heroku).
- Ensure `DATABASE_URL` is set in the environment variables.
- Run `npx prisma migrate deploy` during the build/deploy process.

### Web Frontend
Build the `web` directory:
```bash
cd web
npm run build
```
This produces a `dist` folder. You can:
1.  Serve these static files via the Backend (configure Express to serve `../web/dist`).
2.  Deploy separately to Vercel/Netlify. If doing this, ensure the API URL is configured correctly (e.g., via `.env` pointing to your deployed backend).

## Environment Variables

Check `.env` in `server/` for database configuration.
