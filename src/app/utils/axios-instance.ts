import axios from 'axios';
import { AuthService } from '../auth/auth.service';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

const authService = new AuthService();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      authService.logout(); // Remove token and redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
