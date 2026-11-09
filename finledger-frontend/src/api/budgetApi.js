import api from './axios';

export const getBudgets = async (month) => {
  const params = month ? `?month=${month}` : '';
  const { data } = await api.get(`/budgets${params}`);
  return data;
};

export const getBudgetStatus = async (month) => {
  const params = month ? `?month=${month}` : '';
  const { data } = await api.get(`/budgets/status${params}`);
  return data;
};

export const createBudget = async (budgetData) => {
  const { data } = await api.post('/budgets', budgetData);
  return data;
};

export const updateBudget = async (id, budgetData) => {
  const { data } = await api.put(`/budgets/${id}`, budgetData);
  return data;
};

export const deleteBudget = async (id) => {
  const { data } = await api.delete(`/budgets/${id}`);
  return data;
};
