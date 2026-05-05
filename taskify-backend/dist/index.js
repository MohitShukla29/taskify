"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const projects_1 = __importDefault(require("./routes/projects"));
const members_1 = __importDefault(require("./routes/members"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// ── CORS — allow the Next.js frontend with credentials ──────────────────────
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        // Add production frontend URL here when deploying
    ],
    credentials: true, // allow cookies to be sent cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// ── Core middleware ──────────────────────────────────────────────────────────
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', auth_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/projects/:projectId/members', members_1.default);
app.use('/api/tasks', tasks_1.default);
// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀  Taskify API running at http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health\n`);
});
exports.default = app;
//# sourceMappingURL=index.js.map