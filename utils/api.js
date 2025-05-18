import axios from 'axios';

const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://localhost:8000/api
  withCredentials: true, // optional, if you're using cookies
  headers: token ? { Authorization: token } : {}
});

export default api;