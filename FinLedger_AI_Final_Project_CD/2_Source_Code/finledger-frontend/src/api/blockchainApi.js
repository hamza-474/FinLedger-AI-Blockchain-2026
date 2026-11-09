import api from './axios';

export const getChain = async () => {
  const { data } = await api.get('/blockchain/chain');
  return data;
};

export const verifyChain = async () => {
  const { data } = await api.get('/blockchain/verify');
  return data;
};

export const tamperChain = async () => {
  const { data } = await api.post('/blockchain/tamper');
  return data;
};
