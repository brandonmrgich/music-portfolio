# Music Portfolio Website

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3.
4. [Future Enhancements](#future-enhancements)

## Project Overview

This project is a music portfolio website designed to showcase a musician's work, offer services, and provide a means of contact. The site features an about page, a work-in-progress section, and a services page with audio comparisons and a contact form.

## Technology Stack

-   **React**: A JavaScript library for building user interfaces
-   **React Router**: For handling routing within the application
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development
-   **lucide-react**: For including icons in the UI
-   **HTML5 Audio API**: For handling audio playback
-   **localStorage**: For managing user interactions like track likes

## Backend

### Heirarchy

.
├── config
│   └── config.js
├── controllers
│   ├── audioController.js
│   ├── authController.js
│   ├── profileController.js
│   └── servicesController.js
├── helpers
│   └── fileHelpers.js
├── middleware
│   └── auth.js
├── package-lock.json
├── package.json
├── routes
│   ├── audioRoutes.js
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   └── servicesRoutes.js
└── server.js

### Folders and Responsibilities

#### config/

-   **config.js**: Manages and exports environment variables and other configurations.

#### controllers/

-   **authController.js**: Handles authentication-related logic, such as login.
-   **audioController.js**: Manages audio file uploads and deletions.
-   **profileController.js**: Handles profile updates, including uploading profile pictures.
-   **servicesController.js**: Manages updates to the services page.

#### helpers/

-   **fileHelpers.js**: Provides functions to ensure folders exist and manage audio lists persitatncy.

#### middlewares/

-   **authMiddleware.js**: Verifies JWT tokens for protected routes.

#### routes/

-   **authRoutes.js**: Defines routes related to authentication.
-   **audioRoutes.js**: Defines routes for uploading and deleting audio files.
-   **profileRoutes.js**: Defines routes for updating profiles.
-   **servicesRoutes.js**: Defines routes for updating the services page.

### Management

1.  Environment

    -   Create `.env.development.local` and `.env.production.local` files with the necessary environment variables:
        ```
        ADMIN_PASSWORD_HASH=your_hashed_password
        JWT_SECRET=your_jwt_secret
        BASE_PATH=your_base_path
        PORT=your_port
        ```

2.  **Running the Server**:

    -   Use `npm run start` to run the server in production mode.
    -   Use `npm run start:dev` to run the server in development mode.

3.  **Adding New Routes**:

    -   Create a new controller in the `controllers/` folder.
    -   Create a new route in the `routes/` folder and connect it to the controller.
    -   Import and use the new route in `server.js`.

4.  **Updating Configurations**:

    -   Modify the `config.js` file in the `config/` folder to update or add new environment variables and configurations.

5.  **Authentication Middleware**:

    -   Update the `authMiddleware.js` file in the `middlewares/` folder if there are changes to how authentication should be handled.

6.  **Helper Functions**:
    -   Add or modify helper functions in the `fileHelpers.js` file in the `helpers/` folder as needed.

### Example Usage

**Login Route**:

```http
POST /login
Content-Type: application/json
{
  "username": "admin",
  "password": "your_password"
}

POST /upload-audio
Authorization: Bearer <token>
Content-Type: multipart/form-data
{
  "audio": <file>,
  "title": "Song Title",
  "artist": "Artist Name",
  "type": "services"
}

PUT /update-profile
Authorization: Bearer <token>
Content-Type: multipart/form-data
{
  "profilePicture": <file>,
  "bio": "Your bio here"
}

PUT /update-services
Authorization: Bearer <token>
Content-Type: application/json
{
  "servicesText": "Services description here"
}

```

## Future Enhancements

1. Extend backend API for handling form submissions.
2. Add animations and transitions for a more engaging user experience.
3. Implement progressive loading for audio files to improve performance.
4. Add unit and integration tests to ensure code quality and prevent regressions.

---

```

```
