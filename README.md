# Niyukti Frontend

Frontend application for Niyukti - AI-Assisted Hiring Platform for Educators.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
Create `.env` file:
```
VITE_API_BASE_URL=https://api.niyukti.jeetofy.com
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment

This project is configured for Vercel deployment.

### Environment Variables (Set in Vercel Dashboard):
- `VITE_API_BASE_URL`: Backend API URL (default: https://api.niyukti.jeetofy.com)

### Vercel Setup:
1. Connect this repository to Vercel
2. Vercel will auto-detect settings from `vercel.json`
3. Set `VITE_API_BASE_URL` environment variable in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://api.niyukti.jeetofy.com`
4. Deploy!

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts

