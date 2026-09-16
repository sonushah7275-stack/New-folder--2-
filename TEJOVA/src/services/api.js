import axios from 'axios';

// Axios instance configured for future backend API integration
const api = axios.create({
  baseURL: 'https://api.tejova.com/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
