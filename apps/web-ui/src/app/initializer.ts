import { apiClient } from './api-client';
import { refreshToken } from '../features/auth/auth.slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { REFRESH_TOKEN_KEY } from './config';

const REFRESH_TIMEOUT = 500

const applyAuth = (store, conf) => {
  const token = store.getState()?.auth?.token?.token;
  if (token) {
    conf.headers.Authorization = 'Bearer ' + token;
  }
  return conf
};

//Interceptor to auto-retry when receiving a 401 response.  Intialized from the redux store
export const interceptor = (store) => {
  apiClient().interceptors.request.use(
    (conf) => {
      const refreshActive = store.getState()?.auth?.refreshActive;
      //there's a token refresh in progress so just hold here
      if (refreshActive) {
        return new Promise((resolve) => setTimeout(() => resolve(applyAuth(store, conf)), REFRESH_TIMEOUT));
      }
      
      return applyAuth(store, conf);
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  apiClient().interceptors.response.use(
    (next) => {
      return Promise.resolve(next);
    },
    (error) => {
      return new Promise((resolve, reject) => {
        const originalReq = error.config;
        if (error.response.status === 401 && !originalReq._retry) {
          const user = store.getState()?.auth?.user;
          let refresh = store.getState()?.auth?.refreshToken?.token;

          if (!refresh) {
            refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
          }

          if (refresh) {
            originalReq._retry = true;
            const outcome = store
              .dispatch(refreshToken({ username: user.email, token: refresh }))
              .then(unwrapResult)
              .then((d) => apiClient().request(originalReq));
            resolve(outcome);
          }
        }
        reject(error);
      });
    }
  );
};
