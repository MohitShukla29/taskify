import { Request, Response, NextFunction } from 'express';
import { decrypt } from '../lib/auth';

// Extend Express Request to carry userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const payload = await decrypt(token);

    if (!payload || !payload.userId) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.userId = payload.userId as string;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
