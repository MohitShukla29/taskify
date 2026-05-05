import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';

const router = Router({ mergeParams: true });

// GET /api/projects/:projectId/tasks
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId!;
  const projectId = req.params.projectId as string;

  try {
    // Membership check
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: { assignee: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ tasks });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: msg });
  }
});

// POST /api/projects/:projectId/tasks
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId!;
  const projectId = req.params.projectId as string;

  try {
    const { title, description, dueDate, priority, assigneeId } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Task title is required' });
      return;
    }

    // Only ADMIN can create tasks
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member || member.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: Only admins can create tasks' });
      return;
    }

    // Validate assignee is a project member
    if (assigneeId) {
      const assigneeMember = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: assigneeId } },
      });
      if (!assigneeMember) {
        res.status(400).json({ error: 'Assignee is not a member of this project' });
        return;
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'Medium',
        projectId,
        assigneeId: assigneeId || null,
      },
      include: { assignee: { select: { id: true, name: true } } },
    });

    res.status(201).json({ task });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: msg });
  }
});

// PUT /api/tasks/:taskId
router.put('/:taskId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId!;
  const taskId = req.params.taskId as string;

  try {
    const data = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { members: true } } },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const member = task.project.members.find((m) => m.userId === userId);
    if (!member) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    // Members can only update their own assigned tasks' status
    if (member.role === 'MEMBER') {
      if (task.assigneeId !== userId) {
        res.status(403).json({ error: 'Forbidden: You can only update tasks assigned to you' });
        return;
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status: data.status || task.status },
        include: { assignee: { select: { id: true, name: true } } },
      });

      res.status(200).json({ task: updatedTask });
      return;
    }

    // Admins can update everything
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title:       data.title       !== undefined ? data.title       : task.title,
        description: data.description !== undefined ? data.description : task.description,
        dueDate:     data.dueDate     !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : task.dueDate,
        priority:    data.priority    !== undefined ? data.priority    : task.priority,
        status:      data.status      !== undefined ? data.status      : task.status,
        assigneeId:  data.assigneeId  !== undefined ? data.assigneeId  : task.assigneeId,
      },
      include: { assignee: { select: { id: true, name: true } } },
    });

    res.status(200).json({ task: updatedTask });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/tasks/:taskId
router.delete('/:taskId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId!;
  const taskId = req.params.taskId as string;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { members: true } } },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const member = task.project.members.find((m) => m.userId === userId);
    if (!member || member.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: Only admins can delete tasks' });
      return;
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: msg });
  }
});

export default router;
