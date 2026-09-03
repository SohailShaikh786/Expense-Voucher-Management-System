const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const authenticate = require('../../middleware/auth');
const { authorizeRoles } = require('../../middleware/roleGuard');

router.use(authenticate);

router.get('/employee', authorizeRoles('EMPLOYEE'), dashboardController.getEmployeeDashboard);
router.get('/director', authorizeRoles('DIRECTOR'), dashboardController.getDirectorDashboard);
router.get('/accounts', authorizeRoles('ACCOUNTS'), dashboardController.getAccountsDashboard);

module.exports = router;
