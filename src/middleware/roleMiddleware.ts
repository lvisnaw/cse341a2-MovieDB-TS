import { Request, Response, NextFunction, RequestHandler } from 'express';

// ✅ Ensure proper typing using Express’s extended Request (from `authMiddleware.ts`)
const authorizeRoles =
  (...allowedRoles: ('read' | 'read-write' | 'admin')[]): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: No user logged in' });
      return;
    }

    if (!allowedRoles.includes(req.user.accountType)) {
      res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
      return;
    }

    next(); // ✅ User has permission, proceed to route
  };

export default authorizeRoles;
