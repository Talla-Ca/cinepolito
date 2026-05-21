import api from './config';

export const getUsers = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/auth/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id, isAdmin) => {
  const response = await api.put(`/auth/users/${id}/role?is_admin=${isAdmin}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/auth/users/${id}`, userData);
  return response.data;
};
