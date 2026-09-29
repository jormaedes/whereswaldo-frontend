# Where's Waldo? (Frontend)

A browser-based hidden-object game inspired by [Where's Waldo?](https://www.theodinproject.com/lessons/node-path-javascript-where-s-waldo-a-photo-tagging-app), built as a project for [The Odin Project](https://www.theodinproject.com/).

Choose a scene, find every listed character, and submit your completion time to the leaderboard.

## Live Demo

Play the deployed application: [whereswaldo-frontend.vercel.app](https://whereswaldo-frontend.vercel.app/)

## Related Repository

The backend API and its database implementation are maintained separately: [jormaedes/whereswaldo-backend](https://github.com/jormaedes/whereswaldo-backend).

## Features

- Multiple hidden-object scenes, each with its own target characters.
- Coordinate-based guesses checked by the backend.
- A timer that starts with the game and stops when all characters are found.
- Winner registration using the player's name, scene, and completion time.
- A per-scene leaderboard showing player names, completion dates, and times.
- Responsive layout for desktop and mobile screens.

## Tech Stack

- [Next.js](https://nextjs.org/) App Router
- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) and project-specific CSS
- A separately deployed backend API

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- A running or deployed instance of the [backend API](https://github.com/jormaedes/whereswaldo-backend)

### Installation

From the project root, install its dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and set the base URL of the backend API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Replace the example URL with the address where your backend is running. The frontend expects this value to be the API base URL, without a trailing slash. Since this variable is prefixed with `NEXT_PUBLIC_`, it is exposed to the browser; do not put secrets in it.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play locally.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build locally. Run `npm run build` first. |

## Gameplay and Data Flow

1. Select a scene from the home page.
2. Review the characters to find and start the timer.
3. Click a location in the scene and select a character to submit a guess.
4. The frontend sends the selected character and normalized image coordinates to the backend for validation.
5. When every character has been found, enter a name and submit the result.
6. The frontend sends the name, scene ID, and elapsed time in milliseconds to the backend. After a successful registration, it returns to that scene's introduction and displays the refreshed leaderboard.

Scene IDs are zero-based in the frontend: the first scene is sent as `0`, the second as `1`, and so on.

## Backend API

The frontend uses the following endpoints, with `NEXT_PUBLIC_API_URL` as the base URL:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/guess` | Validate a character guess. The request includes `levelId`, character `name`, and normalized `x` and `y` coordinates. |
| `POST` | `/winner` | Register a completed game with `name`, `scene`, and `timeMs`. |
| `GET` | `/levels/{scene}/winners` | Retrieve the leaderboard entries for a scene. |

See the [backend repository](https://github.com/jormaedes/whereswaldo-backend) for backend setup, persistence, and API details.

## Project Structure

```text
src/
  api/           Backend API requests and response types
  app/           Next.js routes and global styles
  components/    Reusable scene components
  utils/         Scene and target-character definitions
public/
  assets/        Scene and character images
```

Scene images, target characters, and their image paths are configured in `src/utils/levelsGame.ts`.

## Deployment

The frontend is deployed on [Vercel](https://vercel.com/). When deploying another instance, configure `NEXT_PUBLIC_API_URL` in the project's environment variables for each environment, then deploy the application. The configured backend must allow browser requests from the frontend origin.

For more information, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
