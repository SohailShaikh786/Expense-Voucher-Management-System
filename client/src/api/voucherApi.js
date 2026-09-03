import apiClient from './client';

export const voucherApi = {
  list: async (params = {}) => {
    const response = await apiClient.get('/vouchers', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/vouchers/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/vouchers', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/vouchers/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/vouchers/${id}`);
    return response.data;
  },

  submit: async (id) => {
    const response = await apiClient.post(`/vouchers/${id}/submit`);
    return response.data;
  },

  uploadSignature: async (id, file) => {
    const formData = new FormData();
    formData.append('signature', file);
    const response = await apiClient.post(`/vouchers/${id}/signature`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  approve: async (id, data, file = null) => {
    if (file) {
      const formData = new FormData();
      formData.append('signature', file);
      if (data?.signatureBase64) formData.append('signatureBase64', data.signatureBase64);
      if (data?.directorSignatureUrl) formData.append('directorSignatureUrl', data.directorSignatureUrl);
      const response = await apiClient.post(`/vouchers/${id}/approve`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }

    const response = await apiClient.post(`/vouchers/${id}/approve`, data);
    return response.data;
  },

  reject: async (id, rejectionReason) => {
    const response = await apiClient.post(`/vouchers/${id}/reject`, { rejectionReason });
    return response.data;
  }
};
