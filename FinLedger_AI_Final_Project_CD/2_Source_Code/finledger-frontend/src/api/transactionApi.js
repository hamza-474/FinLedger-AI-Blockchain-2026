import api from './axios';

export const getTransactions = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.category) params.append('category', filters.category);
  if (filters.month) params.append('month', filters.month);
  
  const { data } = await api.get(`/transactions?${params.toString()}`);
  return data;
};

export const createTransaction = async (transactionData) => {
  const { data } = await api.post('/transactions', transactionData);
  return data;
};

export const updateTransaction = async (id, transactionData) => {
  const { data } = await api.put(`/transactions/${id}`, transactionData);
  return data;
};

export const deleteTransaction = async (id) => {
  const { data } = await api.delete(`/transactions/${id}`);
  return data;
};

export const getSummary = async (month) => {
  const params = month ? `?month=${month}` : '';
  const { data } = await api.get(`/transactions/summary${params}`);
  return data;
};
