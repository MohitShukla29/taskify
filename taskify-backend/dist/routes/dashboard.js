"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// GET /api/dashboard
router.get('/', authenticate_1.authenticate, async (req, res) => {
    const userId = req.userId;
    try {
        // Get all projects where user is member
        const projects = await prisma_1.default.project.findMany({
            where: { members: { some: { userId } } },
            select: { id: true },
        });
        const projectIds = projects.map((p) => p.id);
        // Total tasks in those projects
        const totalTasks = await prisma_1.default.task.count({
            where: { projectId: { in: projectIds } },
        });
        // Tasks grouped by status
        const tasksByStatusResult = await prisma_1.default.task.groupBy({
            by: ['status'],
            where: { projectId: { in: projectIds } },
            _count: true,
        });
        const tasksByStatus = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
        tasksByStatusResult.forEach((item) => {
            tasksByStatus[item.status] = item._count;
        });
        // Overdue tasks (not Done and past due date)
        const overdueTasks = await prisma_1.default.task.count({
            where: {
                projectId: { in: projectIds },
                status: { not: 'Done' },
                dueDate: { lt: new Date() },
            },
        });
        // Active tasks assigned to the current user
        const userTasksCount = await prisma_1.default.task.count({
            where: { assigneeId: userId, status: { not: 'Done' } },
        });
        // Tasks per user
        const tasksPerUserResult = await prisma_1.default.task.groupBy({
            by: ['assigneeId'],
            where: { projectId: { in: projectIds }, assigneeId: { not: null } },
            _count: true,
        });
        const assigneeIds = tasksPerUserResult.map((t) => t.assigneeId);
        const users = await prisma_1.default.user.findMany({
            where: { id: { in: assigneeIds } },
            select: { id: true, name: true }
        });
        const tasksPerUser = tasksPerUserResult.map((item) => {
            const user = users.find((u) => u.id === item.assigneeId);
            return {
                name: user ? user.name : 'Unknown',
                count: item._count,
            };
        }).sort((a, b) => b.count - a.count);
        res.status(200).json({
            stats: {
                totalTasks,
                tasksByStatus,
                overdueTasks,
                userTasksCount,
                totalProjects: projectIds.length,
                tasksPerUser,
            },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ error: msg });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map