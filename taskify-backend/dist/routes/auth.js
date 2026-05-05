"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../lib/auth");
const router = (0, express_1.Router)();
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required' });
            return;
        }
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: { name, email, password: hashedPassword },
        });
        const token = await (0, auth_1.encrypt)({ userId: user.id, email: user.email });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 1000, // 1 day in ms
            path: '/',
        });
        res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, name: user.name, email: user.email },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ error: msg });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = await (0, auth_1.encrypt)({ userId: user.id, email: user.email });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 1000,
            path: '/',
        });
        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ error: msg });
    }
});
// POST /api/auth/logout
router.post('/logout', (_req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});
// GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const payload = await (0, auth_1.decrypt)(token);
        if (!payload || !payload.userId) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    }
    catch {
        res.status(401).json({ error: 'Not authenticated' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map