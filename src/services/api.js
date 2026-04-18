import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage = error.response?.data?.error || error.response?.data?.message;
    const fallbackMessage = 'No fue posible comunicarse con el servidor.';

    return Promise.reject({
      ...error,
      friendlyMessage: backendMessage || error.message || fallbackMessage,
    });
  }
);

export default api;
