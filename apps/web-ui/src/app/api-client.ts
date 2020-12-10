import axios from 'axios';
import { SERVER_URL, ACTIVE_TOKEN_KEY } from './config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiClient = (options: any = {}) => {
  const jwt = localStorage.getItem(ACTIVE_TOKEN_KEY);
  const headers = options.headers ? options.headers : {}
  headers.Authorization = jwt ? `Bearer ${jwt}` : null;
  const instance = axios.create({
    baseURL: SERVER_URL,
    headers: headers,
  });
  return instance;
};
