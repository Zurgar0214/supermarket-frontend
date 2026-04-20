import api from './api';

const ENDPOINT = '/sales';

export const saleService = {
  getAll: async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (saleData) => {
    const response = await api.post(ENDPOINT, saleData);
    return response.data;
  },

  update: async (id, saleData) => {
    const response = await api.put(`${ENDPOINT}/${id}`, saleData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  },
};