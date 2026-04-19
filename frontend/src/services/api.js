import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const sendQuestion = async (question) => {
  const response = await axios.post(`${API_URL}/api/chat`, { question });
  return response.data;
};
