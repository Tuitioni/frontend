import axios, { AxiosHeaders } from 'axios';

import { tokenService } from './auth/token';

const axiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authHeader = tokenService.getAuthHeader();
    if (authHeader.Authorization) {
      config.headers = new AxiosHeaders({
        ...config.headers,
        ...authHeader,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      tokenService.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
