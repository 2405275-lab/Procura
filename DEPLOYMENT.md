# Procura Production Deployment Guide

Procura is designed to be easily deployed to Vercel (for frontend React) and Render or Supabase (for backend FastAPI and PostgreSQL).

## 1. Frontend Deployment (Vercel)
1. Set up a new project on Vercel importing this repository.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variables if needed.

## 2. Backend Deployment (Render / FastAPI)
1. Create a Web Service on Render linking this repository.
2. Build command: `pip install -r backend/requirements.txt`
3. Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `DATABASE_URL`: PostgreSQL connection string (e.g. from Supabase).
   - `JWT_SECRET_KEY`: Custom secure secret string.
