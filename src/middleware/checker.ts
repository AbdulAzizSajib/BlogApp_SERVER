import { NextFunction, Request, Response } from 'express';
import { auth } from '../lib/auth';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string | null;
        email: string | null;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const checker = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //ger use session
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.json({
        success: false,
        message: 'You are not authorized!',
      });
    }

    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email verification required. Please verfiy your email!',
      });
    }

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden! You don't have permission to access this resources!",
      });
    }

    next();
  };
};

export default checker;
