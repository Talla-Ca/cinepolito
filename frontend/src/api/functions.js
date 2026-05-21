import api from './config';

export const getFunctionsByMovie = async (movieId) => {
  const response = await api.get(`/functions/?movie_id=${movieId}`);
  return response.data;
};

export const createFunction = async (functionData) => {
  const response = await api.post('/functions/', functionData);
  return response.data;
};

export const updateFunction = async (id, functionData) => {
  const response = await api.put(`/functions/${id}`, functionData);
  return response.data;
};

export const deleteFunction = async (id) => {
  const response = await api.delete(`/functions/${id}`);
  return response.data;
};
