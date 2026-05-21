import api from './config';

export const getFunctionsByMovie = async (movieId) => {
  const response = await api.get(`/functions/?movie_id=${movieId}`);
  return response.data;
};

export const createFunction = async (functionData) => {
  const response = await api.post('/functions/', functionData);
  return response.data;
};
