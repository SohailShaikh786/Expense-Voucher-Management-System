const usersService = require('./users.service');

class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAllUsers();
      res.status(200).json({
        success: true,
        data: { users }
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await usersService.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();
