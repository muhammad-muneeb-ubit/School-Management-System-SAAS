import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api', // Your backend URL
  withCredentials: true, // CRITICAL: This tells the browser to send the HttpOnly cookie
});

export default api;