import apiClient from './client';

export const dashboardApi = {
  getEmployeeDashboard: async () => {
    const response = await apiClient.get('/dashboard/employee');
    return response.data;
  },

  getDirectorDashboard: async () => {
    const response = await apiClient.get('/dashboard/director');
    return response.data;
  },

  getAccountsDashboard: async () => {
    const response = await apiClient.get('/dashboard/accounts');
    return response.data;
  }
};
