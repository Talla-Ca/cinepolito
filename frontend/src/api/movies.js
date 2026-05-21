import api from './config';

export const getMovies = async () => {
  const response = await api.get('/movies/');
  return response.data;
};

export const getMovie = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const createMovie = async (movieData) => {
  const response = await api.post('/movies/', movieData);
  return response.data;
};
