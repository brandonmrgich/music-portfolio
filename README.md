# Music Portfolio Website

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Routing](#routing)
7. [Styling](#styling)
8. [Audio Playback](#audio-playback)
9. [Form Handling](#form-handling)
10. [Deployment](#deployment)
11. [Future Enhancements](#future-enhancements)

## Project Overview

This project is a music portfolio website designed to showcase a musician's work, offer services, and provide a means of contact. The site features an about page, a work-in-progress section, and a services page with audio comparisons and a contact form.

## Technology Stack

- **React**: A JavaScript library for building user interfaces
- **React Router**: For handling routing within the application
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **lucide-react**: For including icons in the UI
- **HTML5 Audio API**: For handling audio playback
- **localStorage**: For managing user interactions like track likes

## Project Structure

```
music-portfolio/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── About.js
│   │   ├── InWork.js
│   │   ├── Services.js
│   │   ├── AudioPlayer.js
│   │   └── ContactForm.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Component Architecture

The application is built using a component-based architecture:

1. **App.js**: The main component that sets up routing and the overall structure of the application.
2. **About.js**: Displays information about the musician, including a bio and skills.
3. **InWork.js**: Shows work-in-progress tracks with play and like functionality.
4. **Services.js**: Offers mixing and mastering services with before/after audio comparisons and includes the contact form.
5. **AudioPlayer.js**: A reusable component for playing audio tracks.
6. **ContactForm.js**: Handles the contact form submission.

## State Management

The application primarily uses React's built-in state management (useState and useEffect hooks) for handling component-level state. In the future, Redux or MobX.

## Routing

React Router is used for handling navigation within the application. The main routes are:

- `/`: About page
- `/in-work`: Work in Progress page
- `/services`: Services page

## Styling

Tailwind CSS is used for styling the application via `tailwind.config.js` file.

## Audio Playback

Audio playback is handled using the HTML5 Audio API. The AudioPlayer component encapsulates this functionality, providing play/pause controls and the ability to switch between "before" and "after" versions of a track.

## Form Handling

The contact form in the Services component uses React's controlled components pattern for form handling. Form submission is currently logged to the console, but will be extended to send data to a backend API.

## Deployment

The project is set up for deployment on GitHub Pages. The deployment process is automated using the `gh-pages` package and npm scripts.

To deploy:

1. Ensure all changes are committed and pushed to the main branch.
2. Run `npm run deploy`.

## Future Enhancements

1. Implement a backend API for handling form submissions and managing audio files.
2. Add user authentication for additional features like saving liked tracks.
3. Implement a content management system for easy updates to the portfolio.
4. Add animations and transitions for a more engaging user experience.
5. Implement progressive loading for audio files to improve performance.
6. Add unit and integration tests to ensure code quality and prevent regressions.

---

