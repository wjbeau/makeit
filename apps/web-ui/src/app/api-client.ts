import axios from 'axios';
import { SERVER_URL } from './config';

const axiosInstance = axios.create({
  baseURL: SERVER_URL
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiClient = () => {
  return axiosInstance;
};