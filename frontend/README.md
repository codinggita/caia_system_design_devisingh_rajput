# CAIA Frontend

React + Vite client for the CAIA System Design learning platform.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

## Development

```bash
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

## Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api/v1` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
