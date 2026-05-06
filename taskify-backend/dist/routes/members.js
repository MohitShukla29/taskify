"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)({ mergeParams: true });
// POST /api/projects/:projectId/members
router.post('/', authenticate_1.authenticate, async (req, res) => {
    const userId = req.userId;
    const projectId = req.params.projectId;
    try {
        const { email, role } = req.body;
        if (!email) {
            res.status(400).json({ error: 'User email is required' });
            return;
        }
        // Current user must be ADMIN
        const currentMember = await prisma_1.default.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId } },
        });
        if (!currentMember || currentMember.role !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden: Only admins can add members' });
            return;
        }
        // Find the user to add
        const userToAdd = await prisma_1.default.user.findUnique({ where: { email } });
        if (!userToAdd) {
            res.status(404).json({ error: 'User with this email not found' });
            return;
        }
        // Check if already a member
        const existingMember = await prisma_1.default.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId: userToAdd.id } },
        });
        if (existingMember) {
            res.status(400).json({ error: 'User is already a member' });
            return;
        }
        const newMember = await prisma_1.default.projectMember.create({
            data: {
                projectId,
                userId: userToAdd.id,
                role: role || 'MEMBER',
            },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
        res.status(201).json({ member: newMember });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ error: msg });
    }
});
// DELETE /api/projects/:projectId/members/:userId
router.delete('/:userId', authenticate_1.authenticate, async (req, res) => {
    const currentUserId = req.userId;
    const projectId = req.params.projectId;
    const targetUserId = req.params.userId;
    try {
        // Current user must be ADMIN
        const currentMember = await prisma_1.default.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId: currentUserId } },
        });
        if (!currentMember || currentMember.role !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden: Only admins can remove members' });
            return;
        }
        // Check if target user is in project
        const targetMember = await prisma_1.default.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId: targetUserId } },
        });
        if (!targetMember) {
            res.status(404).json({ error: 'Member not found in project' });
            return;
        }
        // Cannot remove creator (we assume creator is the original ADMIN, but preventing self-removal is a good practice too if it's the last admin, for now just prevent if it's the project creator)
        const project = await prisma_1.default.project.findUnique({ where: { id: projectId } });
        if (project?.creatorId === targetUserId) {
            res.status(400).json({ error: 'Cannot remove the project creator' });
            return;
        }
        await prisma_1.default.projectMember.delete({
            where: { projectId_userId: { projectId, userId: targetUserId } },
        });
        res.status(200).json({ message: 'Member removed successfully' });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({ error: msg });
    }
});
exports.default = router;
//# sourceMappingURL=members.js.map