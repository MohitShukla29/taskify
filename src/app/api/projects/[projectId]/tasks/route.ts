import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/api-auth'

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Check if user is a member
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: params.projectId, userId } }
    })
    if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const tasks = await prisma.task.findMany({
      where: { projectId: params.projectId },
      include: { assignee: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ tasks }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, description, dueDate, priority, assigneeId } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 })
    }

    // Verify current user is ADMIN of the project
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: params.projectId, userId } }
    })

    if (!member || member.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can create tasks' }, { status: 403 })
    }

    // Assignee validation: if assigneeId is provided, they must be a project member
    if (assigneeId) {
      const assigneeMember = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: params.projectId, userId: assigneeId } }
      })
      if (!assigneeMember) {
        return NextResponse.json({ error: 'Assignee is not a member of this project' }, { status: 400 })
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'Medium',
        projectId: params.projectId,
        assigneeId: assigneeId || null
      },
      include: { assignee: { select: { id: true, name: true } } }
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
