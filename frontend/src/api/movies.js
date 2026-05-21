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

export const updateMovie = async (id, movieData) => {
  const response = await api.put(`/movies/${id}`, movieData);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(`/movies/${id}`);
  return response.data;
};

export const uploadMovieImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/movies/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
