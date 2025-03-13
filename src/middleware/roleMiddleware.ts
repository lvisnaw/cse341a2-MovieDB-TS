import { Request, Response, NextFunction } from 'express';

// ✅ Define a proper AuthenticatedRequest type
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string; // ✅ Add `userId`
    accountType: 'read' | 'read-write' | 'admin';
  };
}

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user logged in' });
    }

    if (!allowedRoles.includes(req.user.accountType)) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }

    next(); // ✅ User has permission, proceed to route
  };
};

export default authorizeRoles;


// import { Request, Response, NextFunction } from 'express';

// // Define a type for the user object in the request
// interface AuthenticatedRequest extends Request {
//   user?: {
//     accountType: 'read' | 'read-write' | 'admin';
//   };
// }

// const authorizeRoles = (...allowedRoles: string[]) => {
//   return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized: No user logged in' });
//     }

//     if (!allowedRoles.includes(req.user.accountType)) {
//       return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
//     }

//     next(); // ✅ User has permission, proceed to route
//   };
// };

// export default authorizeRoles;
