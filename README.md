# Minyan Tracker (React Native)

A React Native + TypeScript starter implementing the "Minyan Tracker" experience with photo-first logging, local persistence, streaks, and badge scaffolding. The app is structured for Expo and uses local storage so it can be wired to an API or Firebase later.

## Features
- Log Shacharit / Mincha / Maariv with shul selection, reflections, optional travel area, and proof-of-attendance photo capture.
- Photo album view that shows every photo-backed minyan entry with prayer, shul, and timestamp labels.
- Stats with streaks, prayer breakdown, levels (10 points per minyan), and starter badge logic.
- History list with notes and travel labels.
- Settings for profile basics, travel mode, proof-of-attendance toggle, default photo check-in, notifications lead time, location usage, and shul management (add/rename/delete).
- Data saved locally via `AsyncStorage`; preset shuls for Hendon and Golders Green.

## Project structure
- `App.tsx` – navigation shell with bottom tabs and provider wiring.
- `src/context/MinyanContext.tsx` – state, persistence, photo + location capture, logging, stats/level derivation.
- `src/screens/` – UI for Log, Album, Stats, History, Settings.
- `src/services/` – storage helpers and minyan/stat helpers.
- `src/data/shuls.ts` – seed shuls.
- `src/types/` – shared TypeScript models.

## Running
1. Install dependencies (requires Node and Expo tooling):
   ```
   npm install
   npm start
   ```
2. Open the Expo dev tools and launch on iOS/Android simulator or device.

## Notes
- Photo capture uses Expo Image Picker camera with **no blurring or filters** per requirement; proof-of-attendance mode enforces a photo.
- Location is requested when enabled; missing permission will simply skip attaching coordinates.
- Notification settings are stored but triggering local notifications is not wired yet; ready for future implementation.
