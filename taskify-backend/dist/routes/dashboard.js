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
        res.status(200).json({
            stats: {
                totalTasks,
                tasksByStatus,
                overdueTasks,
                userTasksCount,
                totalProjects: projectIds.length,
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