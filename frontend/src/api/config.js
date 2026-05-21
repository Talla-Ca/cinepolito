import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cinepolito.onrender.com', // Apuntando de nuevo a tu API en Render
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
