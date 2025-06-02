# Music Portfolio

A modern, full-stack music portfolio web application for showcasing tracks, audio comparisons, and more. Built with React, Node.js, and AWS S3.

## Tech Stack
- **Frontend:** React (with Context API, React Router, TailwindCSS)
- **Backend:** Node.js, Express, AWS S3 (for audio storage)
- **Deployment:** GitHub Pages (frontend), custom backend (Node/Express)

## Key Features
- **Audio Player Cards:** Play, pause, seek, and volume controls for each track.
- **A/B Comparison:** Toggle between "before" and "after" versions of tracks.
- **Global Audio Bar:** Persistent bottom bar for controlling the currently playing track, always in sync with player cards.
- **Track Management:** Tracks are fetched and managed globally in React context for seamless navigation and playback.
- **Contact Form:** Managed via context, with open/close state and email sending via SendGrid.
- **Dark/Light Theme:** User preference is persisted and managed globally.

## Deployment
- **Frontend:** Automatically deployed to GitHub Pages on push to `main` via GitHub Actions (`.github/workflows/main.yml`).
  - Custom domain: [brandonmrgich.com](https://brandonmrgich.com)
- **Backend:** Node.js/Express server (see `/backend` for details)

## Notable Complex Sections
- **Audio Context:** All audio state (playback, seek, volume, current track) is managed globally in `AudioContext` for perfect sync between UI and global bar.
- **Global Audio Bar:** Always visible, controls the current track, and stays in sync with player cards even when navigating between pages.
- **Backend API:** Handles track uploads, S3 storage, and manifest management for robust audio delivery.

## Local Development
```bash
npm install
npm start
```

## Deployment (Manual)
```bash
npm run deploy
```

---
For more details, see code comments and JSDoc in the source files.
