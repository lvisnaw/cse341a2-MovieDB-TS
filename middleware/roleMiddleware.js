module.exports = function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user logged in' });
      }
  
      if (!allowedRoles.includes(req.user.accountType)) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
      }
  
      next(); // User has permission, proceed to route
    };
  };
  