import axios from 'axios';
import { SERVER_URL, REFRESH_TOKEN_KEY } from './config';
import { unwrapResult } from '@reduxjs/toolkit';

const REFRESH_TIMEOUT = 500;

let _client:APIClientManager = undefined;

export const apiClient = (options?) => {
  return _client.apiClient(options);
}

export const initApiClient = (store, refreshToken) => {
  _client = new APIClientManager(store, refreshToken);
}

class APIClientManager {
  constructor(private store, private refreshToken) {}

  public apiClient(options?) {
    const headers = options?.headers ? options?.headers : {}
    const result = axios.create({
      baseURL: SERVER_URL,
      headers: headers,
    });
    this.attachInterceptors(result);
    return result;
  }

  public attachInterceptors(client) {
    client.interceptors.request.use(
      (conf) => {
        const refreshActive = this.store.getState()?.auth?.refreshActive;
        //there's a token refresh in progress so just hold here
        if (refreshActive) {
          return new Promise((resolve) =>
            setTimeout(() => resolve(this.applyAuth(conf)), REFRESH_TIMEOUT)
          );
        }

        return this.applyAuth(conf);
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    client.interceptors.response.use(
      (next) => {
        return Promise.resolve(next);
      },
      (error) => {
        return new Promise((resolve, reject) => {
          const originalReq = error.config;
          if (error?.response?.status === 401 && !originalReq._retry) {
            const user = this.store.getState()?.auth?.user;
            let refresh = this.store.getState()?.auth?.refreshToken?.token;

            if (!refresh) {
              refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
            }

            if (refresh) {
              originalReq._retry = true;
              const outcome = this.store
                .dispatch(
                  this.refreshToken({ username: user.email, token: refresh })
                )
                .then(unwrapResult)
                .then((d) => axios.request(originalReq));
              resolve(outcome);
            }
          }
          reject(error?.response?.data ? error?.response?.data : error);
        });
      }
    );
  }

  private applyAuth(conf) {
    const token = this.store.getState()?.auth?.token?.token;
    if (token) {
      conf.headers.Authorization = 'Bearer ' + token;
    }
    return conf;
  }
}
