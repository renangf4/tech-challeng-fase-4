import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/v1/auth/login', { email, password });
  return response.data;
};

