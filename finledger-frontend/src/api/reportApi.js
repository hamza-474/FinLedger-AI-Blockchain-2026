import api from './axios';

export const getDashboardData = async () => {
  const { data } = await api.get('/reports/dashboard');
  return data;
};

export const getMonthlyReport = async (month) => {
  const { data } = await api.get(`/reports/monthly?month=${month}`);
  return data;
};

export const getYearlyReport = async (year) => {
  const { data } = await api.get(`/reports/yearly?year=${year}`);
  return data;
};

export const exportTransactions = async (filters = {}) => {
  let query = '';
  if (filters.month) query += `month=${filters.month}&`;
  if (filters.type) query += `type=${filters.type}`;
  const { data } = await api.get(`/reports/export?${query}`);
  return data;
};
