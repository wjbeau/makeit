import axios from 'axios';
import { SERVER_URL, ACTIVE_TOKEN_KEY } from './config';

export const apiClient = () => {
  const jwt = localStorage.getItem(ACTIVE_TOKEN_KEY);
  const instance = axios.create({
    baseURL: SERVER_URL,
    headers: { Authorization: jwt ? `Bearer ${jwt}` : null },
  });
  return instance;
};
