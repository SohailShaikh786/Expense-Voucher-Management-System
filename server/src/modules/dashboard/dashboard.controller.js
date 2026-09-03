const dashboardService = require('./dashboard.service');

class DashboardController {
  async getEmployeeDashboard(req, res, next) {
    try {
      const data = await dashboardService.getEmployeeDashboard(req.user.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async getDirectorDashboard(req, res, next) {
    try {
      const data = await dashboardService.getDirectorDashboard();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async getAccountsDashboard(req, res, next) {
    try {
      const data = await dashboardService.getAccountsDashboard();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
