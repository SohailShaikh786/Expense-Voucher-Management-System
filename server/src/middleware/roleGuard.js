const prisma = require('../config/prisma');

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 * @param  {...string} roles - e.g. 'EMPLOYEE', 'DIRECTOR', 'ACCOUNTS'
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User is not authenticated.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${roles.join(', ')}]. Your role is ${req.user.role}.`
      });
    }

    next();
  };
}

module.exports = {
  authorizeRoles
};
