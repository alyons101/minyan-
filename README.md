# Minyan Tracker

A full-stack Minyan Tracker application with a Mobile App (React Native), Web Frontend (React), and Backend API (Node.js/Express).

## Project Structure

- `mobile/`: Existing React Native / Expo application.
- `web/`: New React web frontend (Vite).
- `server/`: Backend API (Node.js, Express, Prisma, SQLite).

## Quick Start (Web + Backend)

To run the web application (which includes the backend):

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Initialize Database**
   ```bash
   npm run seed
   ```

4. **Start**
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your browser.

## Mobile App

To run the mobile app:

```bash
cd mobile
npm install
npm start
```

## Deployment

### Full Stack (Web + Backend)
Deploy the `server` directory. The build process copies the web frontend into `server/public`, so the server acts as both the API and the static file host.

- **Build Command**: `npm install && npm run build` (from root, or `cd server && npm install && npm run build` if deploying just server context with copied assets).
- **Start Command**: `npm start` (which runs `node dist/index.js` in server).
- **Environment Variables**: Ensure `DATABASE_URL` is set (e.g., `file:./prod.db` or a Postgres URL).

### Mobile
Deploy via Expo or build native binaries as usual.
