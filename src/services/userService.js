import api from './api';

const ENDPOINT = '/users';

export const userService = {
  getAll: async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post(ENDPOINT, userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`${ENDPOINT}/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  },
};
