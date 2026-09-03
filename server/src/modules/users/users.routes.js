const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const authenticate = require('../../middleware/auth');
const { authorizeRoles } = require('../../middleware/roleGuard');

// Users listing accessible by Director and Accounts
router.get('/', authenticate, authorizeRoles('DIRECTOR', 'ACCOUNTS'), usersController.getAll);
router.get('/:id', authenticate, usersController.getById);

module.exports = router;
