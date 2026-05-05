import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter      from './routes/auth';
import dashboardRouter from './routes/dashboard';
import projectsRouter  from './routes/projects';
import membersRouter   from './routes/members';
import tasksRouter     from './routes/tasks';

const app  = express();
const PORT = process.env.PORT || 4000;

// ── CORS — allow the Next.js frontend with credentials ──────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      // Add production frontend URL here when deploying
    ],
    credentials: true,         // allow cookies to be sent cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',                        authRouter);
app.use('/api/dashboard',                   dashboardRouter);
app.use('/api/projects',                    projectsRouter);
app.use('/api/projects/:projectId/members', membersRouter);
app.use('/api/projects/:projectId/tasks',   tasksRouter);
app.use('/api/tasks',                       tasksRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Taskify API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

export default app;
