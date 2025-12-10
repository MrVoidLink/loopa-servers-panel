# Loopa Servers Panel

Frontend: React + Vite + TS. Backend: Express + TS (in `backend/`).

## One-line install (clone + install + build)
```bash
git clone https://github.com/MrVoidLink/loopa-servers-panel.git && cd loopa-servers-panel && bash scripts/install.sh
```

## Backend
- Env file: `backend/.env` (sample in `.env.example`)
- Start: `cd backend && npm start` (default port 4000)
- Health: `GET /health`

## Frontend
- Dev: `npm run dev` (default 5173)
- Build: `npm run build` → `dist/` (serve statically; proxy `/api` to backend)
