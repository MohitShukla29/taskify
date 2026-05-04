import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/api-auth'

export async function PUT(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { members: true } } }
    })

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    const member = task.project.members.find(m => m.userId === userId)
    if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // If Member, they can only update status if they are assigned to it
    if (member.role === 'MEMBER') {
      if (task.assigneeId !== userId) {
        return NextResponse.json({ error: 'Forbidden: You can only update tasks assigned to you' }, { status: 403 })
      }
      
      // Members can ONLY update status
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status: data.status || task.status },
        include: { assignee: { select: { id: true, name: true } } }
      })
      return NextResponse.json({ task: updatedTask }, { status: 200 })
    }

    // Admin can update anything
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title !== undefined ? data.title : task.title,
        description: data.description !== undefined ? data.description : task.description,
        dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : task.dueDate,
        priority: data.priority !== undefined ? data.priority : task.priority,
        status: data.status !== undefined ? data.status : task.status,
        assigneeId: data.assigneeId !== undefined ? data.assigneeId : task.assigneeId,
      },
      include: { assignee: { select: { id: true, name: true } } }
    })

    return NextResponse.json({ task: updatedTask }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { members: true } } }
    })

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    const member = task.project.members.find(m => m.userId === userId)
    if (!member || member.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can delete tasks' }, { status: 403 })
    }

    await prisma.task.delete({ where: { id: taskId } })

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
