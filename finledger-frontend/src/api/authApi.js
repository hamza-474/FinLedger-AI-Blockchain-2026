import api from './axios';

export const loginApi = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const registerApi = async (name, email, password, organization) => {
  const { data } = await api.post('/auth/register', { name, email, password, organization });
  return data;
};

export const getMeApi = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const forgotPasswordApi = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPasswordApi = async (token, password) => {
  const { data } = await api.put(`/auth/reset-password/${token}`, { password });
  return data;
};
