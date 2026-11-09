import api from './axios';

export const predictSpending = async () => {
  const { data } = await api.get('/ai/predict-spending');
  return data;
};

export const detectAnomalies = async () => {
  const { data } = await api.get('/ai/detect-anomalies');
  return data;
};

export const generateReport = async () => {
  const { data } = await api.get('/ai/generate-report');
  return data;
};

export const askQuestion = async (question) => {
  const { data } = await api.post('/ai/ask', { question });
  return data;
};
