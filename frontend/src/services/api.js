import axios from 'axios';

const API_URL = (() => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '');

  if (configuredUrl) {
    return configuredUrl;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }

  throw new Error('VITE_API_URL is not set for production. Configure the deployed backend URL in Vercel.');
})();

export const sendQuestion = async (question) => {
  const response = await axios.post(`${API_URL}/api/chat`, { question });
  return response.data;
};
