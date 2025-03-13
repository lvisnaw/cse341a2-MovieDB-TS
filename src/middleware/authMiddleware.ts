import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined.');
}

// ✅ Extend Express's `Request` to include a properly typed `user`
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      accountType: 'read' | 'read-write' | 'admin';
    };
  }
}

// ✅ Ensure proper type safety for the middleware function
export const authenticateJWT: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  console.log('🔹 authenticateJWT middleware was called');

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('🔴 No valid Authorization header found');
    res.status(401).json({ message: 'Unauthorized: No user logged in' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      userId: string;
      accountType: 'read' | 'read-write' | 'admin';
    };

    req.user = {
      userId: decodedToken.userId,
      accountType: decodedToken.accountType
    };

    console.log('✅ JWT Verified Successfully:', req.user);
    next();
  } catch (err) {
    console.log('🔴 JWT Verification Error:', (err as Error).message);
    res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};
