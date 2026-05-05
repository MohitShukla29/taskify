import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';

const router = Router({ mergeParams: true });

// POST /api/projects/:projectId/members
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId!;
  const projectId = req.params.projectId as string;

  try {
    const { email, role } = req.body;

    if (!email) {
      res.status(400).json({ error: 'User email is required' });
      return;
    }

    // Current user must be ADMIN
    const currentMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!currentMember || currentMember.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: Only admins can add members' });
      return;
    }

    // Find the user to add
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      res.status(404).json({ error: 'User with this email not found' });
      return;
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: userToAdd.id } },
    });

    if (existingMember) {
      res.status(400).json({ error: 'User is already a member' });
      return;
    }

    const newMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
        role: role || 'MEMBER',
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.status(201).json({ member: newMember });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: msg });
  }
});

export default router;
