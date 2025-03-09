import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined.');
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  console.log('🔹 authenticateJWT middleware was called');

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('🔴 No valid Authorization header found');
    return res.status(401).json({ message: 'Unauthorized: No user logged in' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decodedToken || typeof decodedToken !== 'object') {
      throw new Error('Invalid token structure');
    }

    req.user = decodedToken;
    console.log('✅ JWT Verified Successfully:', decodedToken);
    next();
  } catch (err) {
    console.log('🔴 JWT Verification Error:', (err as Error).message);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
}
