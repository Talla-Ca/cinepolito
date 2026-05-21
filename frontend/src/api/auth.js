import api from './config';

export const getUsers = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};
