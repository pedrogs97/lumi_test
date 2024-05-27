import axios from 'axios';
import { ENVIRONMENT } from '../constants/env'

const api = axios.create({
  baseURL: ENVIRONMENT.baseURL,
});

export const getDashboardData = async (numero_cliente: string) => {
  try {
    const response = await api.get('/dashboard/', {
      params: { numero_cliente },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    throw error;
  }
};

export default api;