import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// GET /api/dashboard
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId!;

  try {
    // Get all projects where user is member
    const projects = await prisma.project.findMany({
      where: { members: { some: { userId } } },
      select: { id: true },
    });
    const projectIds = projects.map((p) => p.id);

    // Total tasks in those projects
    const totalTasks = await prisma.task.count({
      where: { projectId: { in: projectIds } },
    });

    // Tasks grouped by status
    const tasksByStatusResult = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId: { in: projectIds } },
      _count: true,
    });

    const tasksByStatus: Record<string, number> = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
    tasksByStatusResult.forEach((item) => {
      tasksByStatus[item.status] = item._count;
    });

    // Overdue tasks (not Done and past due date)
    const overdueTasks = await prisma.task.count({
      where: {
        projectId: { in: projectIds },
        status: { not: 'Done' },
        dueDate: { lt: new Date() },
      },
    });

    // Active tasks assigned to the current user
    const userTasksCount = await prisma.task.count({
      where: { assigneeId: userId, status: { not: 'Done' } },
    });

    // Tasks per user
    const tasksPerUserResult = await prisma.task.groupBy({
      by: ['assigneeId'],
      where: { projectId: { in: projectIds }, assigneeId: { not: null } },
      _count: true,
    });

    const assigneeIds = tasksPerUserResult.map((t) => t.assigneeId as string);
    const users = await prisma.user.findMany({
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: msg });
  }
});

export default router;
