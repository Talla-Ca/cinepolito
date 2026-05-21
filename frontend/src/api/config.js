import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cinepolito.onrender.com', // Apuntando a tu API en Render
  // baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
