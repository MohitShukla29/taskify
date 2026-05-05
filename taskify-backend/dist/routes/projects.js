"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// GET /api/projects — list projects where user is creator or member
router.get('/', authenticate_1.authenticate, async (req, res) => {
    const userId = req.userId;
    try {
        const projects = await prisma_1.default.project.findMany({
            where: {
                OR: [{ creatorId: userId }, { members: { some: { userId } } }],
            },
            include: {
                _count: { select: { tasks: true, members: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ projects });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ error: msg });
    }
});
// POST /api/projects — create a project (creator becomes ADMIN member)
router.post('/', authenticate_1.authenticate, async (req, res) => {
    const userId = req.userId;
    try {
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Project name is required' });
            return;
        }
        const project = await prisma_1.default.project.create({
            data: {
                name,
                description,
                creatorId: userId,
                members: {
                    create: { userId, role: 'ADMIN' },
                },
            },
        });
        res.status(201).json({ project });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ error: msg });
    }
});
// GET /api/projects/:projectId — get project detail with members + tasks
router.get('/:projectId', authenticate_1.authenticate, async (req, res) => {
    const userId = req.userId;
    const projectId = req.params.projectId;
    try {
        const project = await prisma_1.default.project.findUnique({
            where: { id: projectId },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                },
                tasks: {
                    include: { assignee: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        // Access check — user must be a member
        const isMember = project.members.some((m) => m.userId === userId);
        if (!isMember) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        res.status(200).json({ project });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ error: msg });
    }
});
exports.default = router;
//# sourceMappingURL=projects.js.map