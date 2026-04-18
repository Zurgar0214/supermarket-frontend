import api from './api';

const ENDPOINT = '/providers';

export const providerService = {
  getAll: async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (providerData) => {
    const response = await api.post(ENDPOINT, providerData);
    return response.data;
  },

  update: async (id, providerData) => {
    const response = await api.put(`${ENDPOINT}/${id}`, providerData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  },
};
