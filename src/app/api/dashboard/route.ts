import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/api-auth'

export async function GET(request: Request) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Get all projects where user is member
    const projects = await prisma.project.findMany({
      where: { members: { some: { userId } } },
      select: { id: true }
    })
    const projectIds = projects.map(p => p.id)

    // Aggregate stats for tasks across these projects
    const totalTasks = await prisma.task.count({ where: { projectId: { in: projectIds } } })
    
    const tasksByStatusResult = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId: { in: projectIds } },
      _count: true
    })
    
    // Transform to friendly format
    const tasksByStatus = { 'To Do': 0, 'In Progress': 0, 'Done': 0 }
    tasksByStatusResult.forEach(item => {
      // @ts-ignore
      tasksByStatus[item.status] = item._count
    })

    const overdueTasks = await prisma.task.count({
      where: {
        projectId: { in: projectIds },
        status: { not: 'Done' },
        dueDate: { lt: new Date() }
      }
    })

    const userTasksCount = await prisma.task.count({
      where: { assigneeId: userId, status: { not: 'Done' } }
    })

    return NextResponse.json({
      stats: {
        totalTasks,
        tasksByStatus,
        overdueTasks,
        userTasksCount,
        totalProjects: projectIds.length
      }
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
