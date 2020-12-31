import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AuthenticationState } from './auth.state';
import { AuthRequest, AuthResponse, RefreshRequest } from '@makeit/types';
import {
  SERVER_URL,
  ACTIVE_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  REFRESH_USER_KEY,
} from '../../app/config';
import { apiClient } from '../../app/api-client';
import { userSet, selectCurrentUser } from '../account/user.slice';

const initialState: AuthenticationState = {
  rememberMe: false,
  loading: false,
};

export const loginAttempt = createAsyncThunk(
  'auth/loginAttempt',
  async (userData: AuthRequest, thunkAPI): Promise<AuthResponse> => {
    const result = await apiClient().post(SERVER_URL + '/auth/login', userData);
    thunkAPI.dispatch(userSet(result.data.user))
    return result.data;
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (data: RefreshRequest, thunkAPI) => {
    const result = await apiClient().post(SERVER_URL + '/auth/refresh', data);
    thunkAPI.dispatch(userSet(result.data.user))
    return result.data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    doLogout: (state) => {
      localStorage.removeItem(ACTIVE_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_USER_KEY);
      state.token = undefined;
      state.refreshToken = undefined;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAttempt.pending, (state, action) => {
        state.loading = true;
        state.rememberMe = action.meta.arg.rememberMe;
      })
      .addCase(loginAttempt.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        if (state.rememberMe) {
          localStorage.setItem(
            REFRESH_TOKEN_KEY,
            JSON.stringify(state.refreshToken)
          );
          localStorage.setItem(REFRESH_USER_KEY, action.payload.user.email);
        }
        else {
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          localStorage.removeItem(REFRESH_USER_KEY)
        }
        state.loading = false;
      })
      .addCase(loginAttempt.rejected, (state, action) => {
        localStorage.removeItem(ACTIVE_TOKEN_KEY);
        state.token = undefined;
        state.refreshToken = undefined;
        state.loading = false;
      })
      .addCase(refreshToken.pending, (state, action) => {
        state.refreshActive = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.refreshActive = false;
      });
  },
});

export const { doLogout } = authSlice.actions;

export const selectAuthed = selectCurrentUser;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectRefreshActive = (state: RootState) => state.auth.refreshActive;

export default authSlice.reducer;
