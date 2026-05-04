import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/api-auth'

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { email, role } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 })
    }

    // Verify current user is ADMIN of the project
    const currentMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: params.projectId, userId } }
    })

    if (!currentMember || currentMember.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can add members' }, { status: 403 })
    }

    // Find the user to add
    const userToAdd = await prisma.user.findUnique({ where: { email } })
    if (!userToAdd) {
      return NextResponse.json({ error: 'User with this email not found' }, { status: 404 })
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: params.projectId, userId: userToAdd.id } }
    })
    
    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 400 })
    }

    const newMember = await prisma.projectMember.create({
      data: {
        projectId: params.projectId,
        userId: userToAdd.id,
        role: role || 'MEMBER'
      },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    return NextResponse.json({ member: newMember }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
