import api from './api';

const ENDPOINT = '/products'; // Make sure this matches your backend controller route

export const productService = {
  /**
   * Obtiene todos los productos del backend
   * @returns {Promise<Array>} Lista de productos
   */
  getAll: async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
  },

  /**
   * Obtiene un producto específico por ID
   * @param {number} id
   * @returns {Promise<Object>} Datos del producto
   */
  getById: async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo producto
   * @param {Object} productData - { name, description, price, stock, providerId }
   * @returns {Promise<Object>} El producto creado
   */
  create: async (productData) => {
    const response = await api.post(ENDPOINT, productData);
    return response.data;
  },

  /**
   * Actualiza un producto existente
   * @param {number} id 
   * @param {Object} productData 
   * @returns {Promise<Object>} El producto actualizado
   */
  update: async (id, productData) => {
    const response = await api.put(`${ENDPOINT}/${id}`, productData);
    return response.data;
  },

  /**
   * Elimina un producto por ID
   * @param {number} id 
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  }
};
