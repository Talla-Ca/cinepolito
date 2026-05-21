import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cinepolito.onrender.com', // Apuntando de nuevo a tu API en Render
  //baseURL: 'https://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
