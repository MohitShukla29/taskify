import { NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const tokenCookie = cookieHeader.split('; ').find((c) => c.startsWith('token='))
    
    if (!tokenCookie) return null

    const token = tokenCookie.split('=')[1]
    const payload = await decrypt(token)
    
    if (!payload || !payload.userId) return null
    
    return payload.userId as string
  } catch (error) {
    return null
  }
}
